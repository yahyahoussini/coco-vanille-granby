// Worker jobs (APP_ROLE=worker, `npm run worker`): every tick sends the messages whose undo window is over,
// expires payment holds and quotes, marks orders not picked up after closing; once a night, the retention job
// deletes allergy notes 30 days after pickup (07 O9). Each job is idempotent, so a restart is harmless.
import { localParts, addDays, dayBounds, dayOf, closingOf, zonedTime } from '../lib/studio/time.js'
import { canTransition } from '../lib/ordering/state.js'
import { cancelIntent } from '../lib/payments/stripe.js'
import { notifyNotPickedUp } from '../lib/messaging/notify.js'
import { kindOf } from '../lib/messaging/queue.js'
import { withCapacityLock } from '../lib/ordering/context.js'
import { holdIsLive } from '../lib/ordering/capacity.js'
import { HOLD_EXPIRED } from '../lib/payments/settle.js'
import { closedForPickup } from '../lib/studio/closure.js'

const SYS = { overrideAccess: true, depth: 0 }
export const MAX_ATTEMPTS = 5
export const RETENTION_DAYS = 30
// Messages about an order that only make sense while it is still in that state: « vous attend au comptoir »
// once it is handed over, « pas été récupérée » once the customer came, a reminder once it is gone.
const ORDER_FOLLOWUPS = { order_reminder: ['paid', 'ready'], order_ready: ['ready'], order_not_picked_up: ['not_picked_up'] }

const entry = (status, note, now) => ({ at: new Date(now).toISOString(), status, by: 'worker', source: 'worker', note })
const push = (doc, e) => [...(Array.isArray(doc.timeline) ? doc.timeline : []), e]

export async function sendDueMessages(payload, { now = new Date(), senders, limit = 20 } = {}) {
  const due = await payload.find({
    collection: 'messages',
    where: { and: [{ status: { equals: 'queued' } }, { or: [{ sendAfter: { less_than_equal: new Date(now).toISOString() } }, { sendAfter: { exists: false } }] }] },
    sort: 'sendAfter',
    limit,
    ...SYS,
  })
  const out = { sent: 0, failed: 0, cancelled: 0, retried: 0 }
  for (const m of due.docs) {
    // Claim it: a second worker (or a restart) skips what is already being sent.
    const claimed = await payload.update({ collection: 'messages', where: { and: [{ id: { equals: m.id } }, { status: { equals: 'queued' } }] }, data: { status: 'sending' }, ...SYS })
    if (!claimed.docs?.length) continue
    const attempts = (m.attempts || 0) + 1
    try {
      if (m.order && ORDER_FOLLOWUPS[m.template]) {
        const order = await payload.findByID({ collection: 'orders', id: m.order, ...SYS, disableErrors: true }).catch(() => null)
        if (!order || !ORDER_FOLLOWUPS[m.template].includes(order.status)) {
          await payload.update({ collection: 'messages', id: m.id, data: { status: 'cancelled', error: 'commande annulée ou déjà traitée' }, ...SYS })
          out.cancelled += 1
          continue
        }
      }
      // The template decides, whatever the row says (a row queued before the collection was locked down).
      if (m.kind === 'commercial' || kindOf(m.template) === 'commercial') {
        // Commercial messages need a matching consent (07 A5); none is sent by this module yet.
        await payload.update({ collection: 'messages', id: m.id, data: { status: 'cancelled', error: 'message commercial sans consentement vérifié' }, ...SYS })
        out.cancelled += 1
        continue
      }
      const sender = senders[m.channel]
      if (!sender) throw new Error(`no sender for ${m.channel}`)
      const res = await sender.send({ to: m.to, body: m.body, subject: m.subject, text: m.body, html: m.html, attachments: m.attachments || [], template: m.template })
      await payload.update({ collection: 'messages', id: m.id, data: { status: 'sent', providerId: res?.providerId || null, sentAt: new Date(now).toISOString(), attempts, error: null }, ...SYS })
      if (m.template === 'order_confirmed' && m.order) await payload.update({ collection: 'orders', id: m.order, data: { contractSentAt: new Date(now).toISOString() }, ...SYS }).catch(() => null)
      out.sent += 1
    } catch (e) {
      const failed = attempts >= MAX_ATTEMPTS
      const retryAt = new Date(new Date(now).getTime() + attempts * attempts * 60 * 1000).toISOString()
      await payload.update({ collection: 'messages', id: m.id, data: { status: failed ? 'failed' : 'queued', attempts, error: String(e?.message || e).slice(0, 300), sendAfter: failed ? m.sendAfter : retryAt }, ...SYS })
      if (failed) out.failed += 1
      else out.retried += 1
    }
  }
  return out
}

// A web order whose 10-minute hold ran out without payment frees its window and capacity. Each order is read
// again under the booking lock (the payment webhook takes the same lock), so a payment that lands meanwhile is
// never overwritten; the Stripe intent is cancelled after, outside the lock.
export async function expireHolds(payload, { now = new Date() } = {}) {
  const res = await payload.find({ collection: 'orders', where: { and: [{ status: { equals: 'pending_payment' } }, { holdExpiresAt: { less_than: new Date(now).toISOString() } }] }, limit: 100, ...SYS })
  let expired = 0
  for (const o of res.docs) {
    const done = await withCapacityLock(payload, async () => {
      const fresh = await payload.findByID({ collection: 'orders', id: o.id, ...SYS, disableErrors: true }).catch(() => null)
      if (!fresh || fresh.status !== 'pending_payment' || fresh.payment?.status === 'paid' || holdIsLive(fresh, now)) return null
      await payload.update({ collection: 'orders', id: fresh.id, data: { status: 'cancelled', timeline: push(fresh, { ...entry('cancelled', 'Réservation de la plage expirée sans paiement', now), reason: HOLD_EXPIRED }) }, ...SYS })
      return fresh
    })
    if (!done) continue
    expired += 1
    if (done.payment?.provider === 'stripe' && done.payment?.reference) await cancelIntent(done.payment.reference)
  }
  return { holdsExpired: expired }
}

// A quote past its validity frees its tentative hold (« Expirée · place libérée », 16 §3.4); same lock and
// fresh read as the deposit webhook, so a deposit paid meanwhile keeps its request « Acompte reçu ».
export async function expireQuotes(payload, { now = new Date() } = {}) {
  const res = await payload.find({ collection: 'requests', where: { and: [{ status: { equals: 'quoted' } }, { 'quote.validUntil': { less_than: new Date(now).toISOString() } }] }, limit: 100, ...SYS })
  let expired = 0
  for (const r of res.docs) {
    const done = await withCapacityLock(payload, async () => {
      const fresh = await payload.findByID({ collection: 'requests', id: r.id, ...SYS, disableErrors: true }).catch(() => null)
      if (!fresh || fresh.status !== 'quoted' || fresh.payment?.status === 'paid') return null
      if (!fresh.quote?.validUntil || new Date(fresh.quote.validUntil).getTime() >= new Date(now).getTime()) return null
      await payload.update({ collection: 'requests', id: fresh.id, data: { status: 'expired', timeline: push(fresh, entry('expired', 'Soumission expirée · place libérée', now)) }, ...SYS })
      return fresh
    })
    if (!done) continue
    expired += 1
    if (done.payment?.reference) await cancelIntent(done.payment.reference)
  }
  return { quotesExpired: expired }
}

// Paid or ready orders still there after closing time on their pickup day → « Non récupérée » + text (10 §6).
// Not when the shop itself was closed for that pickup (closure or a day set to « Fermé »).
export async function markNotPickedUp(payload, { now = new Date(), shop } = {}) {
  const s = shop || (await payload.findGlobal({ slug: 'shop', ...SYS }))
  const today = localParts(now).iso
  const res = await payload.find({ collection: 'orders', where: { and: [{ status: { in: ['paid', 'ready'] } }, { pickupDate: { less_than: dayBounds(today).to } }] }, limit: 200, ...SYS })
  let marked = 0
  for (const o of res.docs) {
    const day = dayOf(o.pickupDate)
    const closes = closingOf(s, day)
    const over = day < today || (closes && new Date(now).getTime() >= zonedTime(day, closes).getTime())
    if (!over || !canTransition(o.status, 'not_picked_up', 'integration')) continue
    if (closedForPickup(s, o)) continue
    const updated = await payload.update({ collection: 'orders', id: o.id, data: { status: 'not_picked_up', timeline: push(o, entry('not_picked_up', 'Non récupérée à la fermeture', now)) }, ...SYS })
    await notifyNotPickedUp(payload, updated).catch(() => null)
    marked += 1
  }
  return { notPickedUp: marked }
}

// Nightly: allergy notes are deleted 30 days after pickup (07 O9, est. retention).
export async function retention(payload, { now = new Date() } = {}) {
  const cutoff = dayBounds(addDays(localParts(now).iso, -(RETENTION_DAYS - 1))).from
  const res = await payload.find({ collection: 'orders', where: { and: [{ allergyNote: { exists: true } }, { pickupDate: { less_than: cutoff } }] }, limit: 500, ...SYS })
  let cleared = 0
  for (const o of res.docs) {
    if (!o.allergyNote) continue
    await payload.update({ collection: 'orders', id: o.id, data: { allergyNote: null, timeline: push(o, entry(o.status, `Note d’allergie effacée (${RETENTION_DAYS} jours après la cueillette)`, now)) }, ...SYS })
    cleared += 1
  }
  return { allergyNotesDeleted: cleared }
}

export async function tick(payload, { now = new Date(), senders, nightly = false } = {}) {
  const summary = {}
  Object.assign(summary, await expireHolds(payload, { now }))
  Object.assign(summary, await expireQuotes(payload, { now }))
  Object.assign(summary, await markNotPickedUp(payload, { now }))
  Object.assign(summary, await sendDueMessages(payload, { now, senders }))
  if (nightly) Object.assign(summary, await retention(payload, { now }))
  return summary
}
