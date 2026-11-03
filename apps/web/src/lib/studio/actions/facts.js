// « Faits du site » (Studio › Plus): the owner checks or answers a fact the site asks for (lib/facts-catalog.js), in French
// and in English. The public pages fill their slots from the answer at once (collection site-facts, refreshed through its
// revalidation hooks). A fact starts with a proposal from the agency (lib/facts-proposals.js): « C'est bon » keeps it, a new
// answer replaces it, and an emptied answer brings it back to check again.
import { sentence } from '../audit.js'
import { factById } from '../../facts-catalog.js'
import { proposalFor } from '../../facts-proposals.js'
import { refuse, str } from './util.js'

const SYS = { overrideAccess: true, depth: 0 }
const KEY = /^(?:[a-z0-9-]{2,60}|autre:(?:fr|en|es):.{2,240})$/
const MAX = 1500

const idOf = (x) => (x && typeof x === 'object' ? x.id : x ?? null)
const snapshot = (doc) => (doc ? { fr: doc.fr || '', en: doc.en || '', proposed: Boolean(doc.proposed), verifiedAt: doc.verifiedAt || null, verifiedBy: idOf(doc.verifiedBy), enReview: Boolean(doc.enReview) } : null)
const nameOf = (key) => factById(key)?.q || key.replace(/^autre:[a-z]{2}:/, '')
const findFact = async (ctx, key) => (await ctx.payload.find({ collection: 'site-facts', where: { key: { equals: key } }, limit: 1, ...SYS })).docs[0] || null

const restore = async (ctx, entry) => {
  const prev = entry.before
  if (prev) await ctx.payload.update({ collection: 'site-facts', id: entry.entityId, data: { fr: prev.fr || null, en: prev.en || null, proposed: prev.proposed, verifiedAt: prev.verifiedAt, verifiedBy: prev.verifiedBy, enReview: prev.enReview }, ...SYS, context: { studioAudited: true } })
  else await ctx.payload.delete({ collection: 'site-facts', id: entry.entityId, ...SYS, context: { studioAudited: true } }).catch(() => null)
  return { message: 'Réponse remise comme avant.' }
}

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
      const prev = await findFact(ctx, key)
      const proposal = proposalFor(key)
      // The French changed and the English did not: the old English stays on the page, flagged, so an English page never
      // loses its sentence over one answer.
      const keptEn = en || prev?.en || proposal?.en || null
      const enReview = Boolean(fr && prev && prev.fr !== fr && keptEn && prev.en === keptEn)
      const data = fr
        ? { key, fr, en: keptEn, proposed: false, verifiedAt: ctx.now.toISOString(), verifiedBy: ctx.user.id, enReview }
        : { key, fr: proposal?.fr || null, en: proposal?.en || null, proposed: Boolean(proposal), verifiedAt: null, verifiedBy: null, enReview: false }
      const doc = prev
        ? await ctx.payload.update({ collection: 'site-facts', id: prev.id, data, ...ctx.write, depth: 0 })
        : await ctx.payload.create({ collection: 'site-facts', data, ...ctx.write, depth: 0 })
      return {
        entity: 'site-facts',
        entityId: doc.id,
        before: snapshot(prev),
        after: { fr: data.fr || '', en: data.en || '', proposed: data.proposed },
        summary: sentence(ctx.user, ctx.device, `a répondu au fait « ${nameOf(key)} »`, ctx.now),
        message: !fr ? (proposal ? 'Réponse retirée · le site reprend la proposition, à vérifier.' : 'Réponse retirée · le site redemande ce fait.') : enReview ? 'Réponse enregistrée · changez aussi la version anglaise.' : 'Réponse enregistrée · le site l’affiche maintenant.',
        data: { id: doc.id },
      }
    },
    undo: restore,
  },

  // « C'est bon »: the proposal is right, it stays as it is and counts as checked by this person.
  'fact.confirm': {
    undoSeconds: 30,
    async run(ctx, input) {
      const key = str(input.key, 260)
      if (!KEY.test(key)) refuse('fact_key', 'Fait inconnu.', 422)
      const prev = await findFact(ctx, key)
      if (!prev?.fr) refuse('fact_empty', 'Il n’y a pas encore de réponse à vérifier.', 409)
      const data = { proposed: false, verifiedAt: ctx.now.toISOString(), verifiedBy: ctx.user.id, enReview: false }
      const doc = await ctx.payload.update({ collection: 'site-facts', id: prev.id, data, ...ctx.write, depth: 0 })
      return {
        entity: 'site-facts',
        entityId: doc.id,
        before: snapshot(prev),
        after: { fr: prev.fr, en: prev.en || '', proposed: false },
        summary: sentence(ctx.user, ctx.device, `a vérifié le fait « ${nameOf(key)} »`, ctx.now),
        message: 'Vérifié · la réponse reste affichée sur le site.',
        data: { id: doc.id },
      }
    },
    undo: restore,
  },
}
