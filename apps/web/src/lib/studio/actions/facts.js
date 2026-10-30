// « Faits du site » (Studio › Plus): the owner answers a fact the site asks for (lib/facts-catalog.js), in French
// and, when someone serves in English, in English. The public pages fill their slots from the answer at once
// (collection site-facts, refreshed through its revalidation hooks). An empty answer puts the marker back.
import { sentence } from '../audit.js'
import { factById } from '../../facts-catalog.js'
import { refuse, str } from './util.js'

const SYS = { overrideAccess: true, depth: 0 }
const KEY = /^(?:[a-z0-9-]{2,60}|autre:(?:fr|en|es):.{2,240})$/
const MAX = 1500

export const factActions = {
  'fact.answer': {
    undoSeconds: 30,
    async run(ctx, input) {
      const key = str(input.key, 260)
      if (!KEY.test(key)) refuse('fact_key', 'Fait inconnu.', 422)
      const fr = str(input.fr, MAX).replace(/\s+/g, ' ')
      const en = str(input.en, MAX).replace(/\s+/g, ' ')
      // The English answer never says more than the French one (Loi 96): English alone is refused.
      if (en && !fr) refuse('french_first', 'Écrivez d’abord la réponse en français.', 422)
      const found = await ctx.payload.find({ collection: 'site-facts', where: { key: { equals: key } }, limit: 1, ...SYS })
      const prev = found.docs[0] || null
      const before = prev ? { fr: prev.fr || '', en: prev.en || '' } : null
      const data = { key, fr: fr || null, en: en || null }
      const doc = prev
        ? await ctx.payload.update({ collection: 'site-facts', id: prev.id, data, ...ctx.write, depth: 0 })
        : await ctx.payload.create({ collection: 'site-facts', data, ...ctx.write, depth: 0 })
      const label = factById(key)?.q || key.replace(/^autre:[a-z]{2}:/, '')
      return {
        entity: 'site-facts',
        entityId: doc.id,
        before,
        after: { fr, en },
        summary: sentence(ctx.user, ctx.device, `a répondu au fait « ${label} »`, ctx.now),
        message: fr ? 'Réponse enregistrée · le site l’affiche maintenant.' : 'Réponse retirée · le site redemande ce fait.',
        data: { id: doc.id },
      }
    },
    async undo(ctx, entry) {
      const prev = entry.before
      if (prev) await ctx.payload.update({ collection: 'site-facts', id: entry.entityId, data: { fr: prev.fr || null, en: prev.en || null }, ...SYS, context: { studioAudited: true } })
      else await ctx.payload.delete({ collection: 'site-facts', id: entry.entityId, ...SYS, context: { studioAudited: true } }).catch(() => null)
      return { message: 'Réponse remise comme avant.' }
    },
  },
}
