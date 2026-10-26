// Demandes actions (16 §3.4, F6): « Chiffrer et envoyer » through sendQuote, « Autre date », « Refuser ».
// The quote's email and texto leave after the undo window; « Annuler » restores the request as it was.
import { sendQuote } from '../../ordering/create-order.js'
import { enqueueMessage, cancelQueued } from '../../messaging/queue.js'
import { senderFacts } from '../../messaging/templates.js'
import { parseMoney, money, customerName } from '../format.js'
import { shortDay } from '../time.js'
import { sentence } from '../audit.js'
import { answerMessage } from '../requests.js'
import { refuse, load, str, bool, holdMessages, timelineEntry, pushTimeline } from './util.js'

const SYS = { overrideAccess: true, depth: 0 }
const snapshot = (r) => ({ status: r.status, quote: r.quote || {}, answerBy: r.answerBy || null, timeline: r.timeline || [], accessToken: r.accessToken || null })

async function restore(ctx, entry, note) {
  const r = await ctx.payload.findByID({ collection: 'requests', id: entry.entityId, ...SYS })
  await cancelQueued(ctx.payload, { requestId: r.id })
  const b = entry.before || {}
  await ctx.payload.update({ collection: 'requests', id: r.id, data: { status: b.status, quote: b.quote, answerBy: b.answerBy, timeline: pushTimeline(r, timelineEntry(ctx, b.status, note)) }, ...SYS })
  return r
}

async function send(ctx, request, text) {
  const f = senderFacts(await ctx.payload.findGlobal({ slug: 'business', locale: 'fr', ...SYS }))
  const m = answerMessage(request, text, { phone: f.phone })
  if (!m) refuse('no_contact', 'Ni courriel ni téléphone au dossier : appelez ou écrivez au client.', 422)
  const doc = await enqueueMessage(ctx.payload, { ...m, template: 'request_answer', language: request.customer?.language || 'fr', requestId: request.id })
  await holdMessages(ctx.payload, [doc], ctx.undoUntil)
  return m
}

export const requestActions = {
  'request.quote': {
    async run(ctx, input) {
      const request = await load(ctx, 'requests', input.requestId)
      const totalCents = parseMoney(input.price)
      if (!totalCents) refuse('total_invalid', 'Indiquez un prix total valide (ex. 120 ou 120,50).', 422)
      const taxClass = ['zero', 'taxable'].includes(input.taxClass) ? input.taxClass : request.quote?.taxClass
      if (!['zero', 'taxable'].includes(taxClass)) refuse('tax_class', 'Choisissez la taxe : détaxé ou taxable (selon le comptable).', 422)
      const r = await sendQuote(ctx.payload, { requestId: request.id, totalCents, taxClass, force: bool(input.force) && ctx.user.role === 'proprietaire', req: { user: ctx.user }, now: ctx.now })
      if (r.errors?.length) {
        const e = r.errors[0]
        refuse(e.code, e.code === 'day_full' ? `Le ${shortDay(e.date || request.eventDate)} est complet (${e.used}/${e.limit}). Proposez une autre date.` : e.message, 422)
      }
      await holdMessages(ctx.payload, r.messages, ctx.undoUntil)
      const q = r.request.quote || {}
      return {
        entity: 'requests',
        entityId: request.id,
        before: snapshot(request),
        after: { status: 'quoted', totalCents: q.totalCents, depositCents: q.depositCents, validUntil: q.validUntil },
        summary: sentence(ctx.user, ctx.device, `a envoyé une soumission de ${money(totalCents)} (avant taxes) pour la demande ${request.id}`, ctx.now),
        message: `Soumission envoyée · acompte ${money(q.depositCents)} · part dans 30 s · expire ${shortDay(String(q.validUntil).slice(0, 10))}`,
        data: { redirect: '/demandes/' },
      }
    },
    async undo(ctx, entry) {
      const r = await ctx.payload.findByID({ collection: 'requests', id: entry.entityId, ...SYS })
      if (r.status !== 'quoted' || r.payment?.status === 'paid') refuse('undo_state', 'La demande a changé depuis.')
      await restore(ctx, entry, 'Soumission annulée (« Annuler »)')
      return { message: 'Soumission annulée · rien n’est parti.' }
    },
  },

  'request.decline': {
    async run(ctx, input) {
      const request = await load(ctx, 'requests', input.requestId)
      if (!['new', 'quoted'].includes(request.status)) refuse('state', 'Cette demande est déjà traitée.')
      const text = str(input.message, 1000)
      if (text.length < 10) refuse('text_required', 'Écrivez la réponse au client.', 422)
      const m = await send(ctx, request, text)
      await ctx.payload.update({ collection: 'requests', id: request.id, data: { status: 'declined', timeline: pushTimeline(request, timelineEntry(ctx, 'declined', 'Refusée · réponse envoyée')) }, ...ctx.as, depth: 0 })
      return {
        entity: 'requests',
        entityId: request.id,
        before: snapshot(request),
        after: { status: 'declined', channel: m.channel },
        summary: sentence(ctx.user, ctx.device, `a refusé la demande ${request.id}`, ctx.now),
        message: `Réponse envoyée à ${customerName(request.customer)} (${m.channel === 'email' ? 'courriel' : 'texto'}) dans 30 s`,
      }
    },
    async undo(ctx, entry) {
      await restore(ctx, entry, 'Refus annulé (« Annuler »)')
      return { message: 'Refus annulé · rien n’est parti.' }
    },
  },

  'request.otherDate': {
    async run(ctx, input) {
      const request = await load(ctx, 'requests', input.requestId)
      if (request.status !== 'new') refuse('state', 'Cette demande est déjà traitée.')
      const alt = str(input.date, 10)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(alt)) refuse('date', 'Choisissez la date à proposer.', 422)
      const text = str(input.message, 1000)
      if (text.length < 10) refuse('text_required', 'Écrivez la réponse au client.', 422)
      const m = await send(ctx, request, text)
      await ctx.payload.update({ collection: 'requests', id: request.id, data: { answerBy: null, timeline: pushTimeline(request, timelineEntry(ctx, 'new', `Autre date proposée : ${alt}`)) }, ...ctx.as, depth: 0 })
      return {
        entity: 'requests',
        entityId: request.id,
        before: snapshot(request),
        after: { proposed: alt, channel: m.channel },
        summary: sentence(ctx.user, ctx.device, `a proposé le ${shortDay(alt)} pour la demande ${request.id}`, ctx.now),
        message: `Autre date proposée (${shortDay(alt)}) · ${m.channel === 'email' ? 'courriel' : 'texto'} dans 30 s`,
      }
    },
    async undo(ctx, entry) {
      await restore(ctx, entry, 'Proposition annulée (« Annuler »)')
      return { message: 'Annulé · rien n’est parti.' }
    },
  },
}
