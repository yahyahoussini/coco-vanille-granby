// Settles a payment, whatever the adapter (mock button or Stripe webhook). Idempotent: a second call for the
// same payment changes nothing. Only this module turns « pending_payment » into « paid » (10 §4).
import { dayOf } from '../studio/time.js'
import { capacityLimit, usedUnits, bookedInWindow, holdIsLive, COMMITTED_STATUSES } from '../ordering/capacity.js'
import { windowSettings } from '../ordering/slots.js'
import { getShopSettings, getPools, getUsage, withCapacityLock, newToken, newPickupCode, nextOrderNumber } from '../ordering/context.js'
import { notifyOrderConfirmed, scheduleReminder } from '../messaging/notify.js'

const SYS = { overrideAccess: true, depth: 0 }
export const REFUND_DAYS = 15

const entry = (status, note, { at = new Date(), eventId = null, by = 'paiement' } = {}) => ({ at: new Date(at).toISOString(), status, by, source: 'payment', note, eventId })
const seen = (doc, eventId) => Boolean(eventId) && (doc.timeline || []).some((t) => t?.eventId === eventId)

// A payment that lands after its hold ran out keeps the order only if the window and the pools still have room.
function slotStillFree(order, shop, pools, usage) {
  const day = dayOf(order.pickupDate)
  const { maxPerWindow } = windowSettings(shop)
  if (order.pickupWindowStart && maxPerWindow && bookedInWindow(usage, day, order.pickupWindowStart) >= maxPerWindow) return false
  const need = new Map()
  for (const it of order.items || []) {
    const key = `${it.productionDate || day}|${it.productionCategory}`
    need.set(key, (need.get(key) || 0) + (it.units ?? it.qty))
  }
  for (const [key, units] of need) {
    const [date, category] = key.split('|')
    const limit = capacityLimit(pools, category, date)
    if (limit === null || usedUnits(usage, date, category) + units > limit) return false
  }
  return true
}

// Why an order is « cancelled »: the worker ends an unpaid hold (reason hold_expired); anything else is a
// decision (Studio, « Annuler » on a phone order). Older worker entries carry source 'worker'.
export const HOLD_EXPIRED = 'hold_expired'
export function cancelledByHoldExpiry(order) {
  const last = (Array.isArray(order?.timeline) ? order.timeline : []).filter((t) => t?.status === 'cancelled').at(-1)
  return Boolean(last && (last.reason === HOLD_EXPIRED || last.source === 'worker'))
}

const refundDate = (now) => new Date(new Date(now).getTime() + REFUND_DAYS * 86400 * 1000).toISOString()

// → { ok, already?, order, code? }
// A payment for a live hold confirms the order. A payment that lands after the hold ran out (swept by the
// worker or not yet) keeps the order only if its window and pools still have room; otherwise, and for an
// order the shop cancelled, the money is recorded with a full refund due within 15 days (07 A9), and no
// confirmation leaves.
export async function markOrderPaid(payload, { orderId, provider, reference = null, amountCents = null, eventId = null, now = new Date() }) {
  return withCapacityLock(payload, async () => {
    const order = await payload.findByID({ collection: 'orders', id: orderId, ...SYS, disableErrors: true }).catch(() => null)
    if (!order) return { ok: false, code: 'order_missing' }
    if (order.payment?.status === 'paid' || seen(order, eventId)) return { ok: true, already: true, order }
    const timeline = Array.isArray(order.timeline) ? [...order.timeline] : []
    if (amountCents !== null && amountCents !== order.totals?.totalCents) {
      timeline.push(entry(order.status, `Montant reçu ${amountCents} ¢ ≠ total ${order.totals?.totalCents} ¢ : à vérifier`, { at: now, eventId }))
      await payload.update({ collection: 'orders', id: order.id, data: { timeline }, ...SYS })
      return { ok: false, code: 'amount_mismatch', order }
    }

    let status = order.status
    let refundDueBy = null
    let note = 'Paiement reçu'
    const lateHold = order.status === 'pending_payment' && !holdIsLive(order, now)
    if (order.status === 'pending_payment' && !lateHold) status = 'paid'
    else if (lateHold || (order.status === 'cancelled' && cancelledByHoldExpiry(order))) {
      const shop = await getShopSettings(payload)
      const pools = await getPools(payload)
      const day = dayOf(order.pickupDate)
      const { usage } = await getUsage(payload, { now, fromISO: day, toISO: day, excludeOrderId: order.id })
      if (slotStillFree(order, shop, pools, usage)) {
        status = 'paid'
        note = 'Paiement reçu après la fin de la réservation; la plage était encore libre'
      } else {
        status = 'cancelled'
        refundDueBy = refundDate(now)
        note = 'Paiement reçu après la fin de la réservation; plage prise : remboursement complet dû (15 jours)'
      }
    } else if (order.status === 'cancelled') {
      refundDueBy = refundDate(now)
      note = 'Paiement reçu pour une commande annulée par la boutique : remboursement complet dû (15 jours)'
    } else {
      note = `Paiement reçu (commande déjà « ${order.status} »)`
    }
    timeline.push(entry(status, note, { at: now, eventId }))
    const updated = await payload.update({
      collection: 'orders',
      id: order.id,
      data: {
        status,
        holdExpiresAt: null,
        payment: { provider, kind: 'full', reference: reference || order.payment?.reference || null, status: 'paid', paidAt: new Date(now).toISOString(), amountCents: amountCents ?? order.totals?.totalCents, refundDueBy },
        timeline,
      },
      ...SYS,
    })
    if (status === 'paid' && COMMITTED_STATUSES.includes(updated.status)) {
      await notifyOrderConfirmed(payload, updated).catch((e) => payload.logger?.error?.({ err: e }, 'order_confirmed not queued'))
      await scheduleReminder(payload, updated, { now }).catch(() => null)
    }
    return { ok: true, order: updated, ...(refundDueBy ? { refundDue: true } : {}) }
  })
}

export async function markOrderPaymentFailed(payload, { orderId, reference = null, eventId = null, reason = '', now = new Date() }) {
  const order = await payload.findByID({ collection: 'orders', id: orderId, ...SYS, disableErrors: true }).catch(() => null)
  if (!order || order.payment?.status === 'paid' || seen(order, eventId)) return { ok: false }
  const timeline = [...(order.timeline || []), entry(order.status, `Paiement refusé${reason ? ` : ${reason}` : ''}`, { at: now, eventId })]
  await payload.update({ collection: 'orders', id: order.id, data: { payment: { reference: reference || order.payment?.reference || null, status: 'failed' }, timeline }, ...SYS })
  return { ok: true }
}

// Quote deposit paid (16 §3.4): the request becomes a confirmed order on the pools, deposit and balance on it.
// consent: { termsAcceptedAt, termsVersion, bindingLanguage } recorded on the payment page.
// A deposit that can't be honoured is never dropped: an older quote's amount, a quote taken back (« Annuler »),
// a declined request, or a late payment for a day that has filled since. The money is recorded on a
// cancelled order with a full refund due (Studio shows it), the request's history says why, and no
// confirmation leaves. → { ok, already?, request, order, code?, refundDue? }
export async function markDepositPaid(payload, { requestId, provider, reference = null, amountCents = null, eventId = null, consent = {}, now = new Date() }) {
  return withCapacityLock(payload, async () => {
    const request = await payload.findByID({ collection: 'requests', id: requestId, ...SYS, disableErrors: true }).catch(() => null)
    if (!request) return { ok: false, code: 'request_missing' }
    if (request.payment?.status === 'paid' || seen(request, eventId)) return { ok: true, already: true, request }
    const q = request.quote || {}
    const day = dayOf(request.eventDate)
    const late = Boolean(q.validUntil) && new Date(q.validUntil).getTime() < new Date(now).getTime()
    const refund = (code, why) => depositRefundDue(payload, { request, provider, reference, amountCents: amountCents ?? q.depositCents ?? null, eventId, now, code, why })

    if (!Number.isInteger(q.depositCents) || !Number.isInteger(q.totalCents)) return refund('request_state', 'aucune soumission en cours')
    if (amountCents !== null && amountCents !== q.depositCents) return refund('amount_mismatch', `montant ${amountCents} ¢ d’une soumission précédente (acompte demandé : ${q.depositCents} ¢)`)
    if (request.status === 'declined') return refund('request_state', 'demande refusée par la boutique')
    if (!['quoted', 'expired'].includes(request.status)) return refund('request_state', `demande « ${request.status} »`)
    if (late || request.status === 'expired') {
      // Its tentative hold ended: the day must still have room for this cake (no daily limit set: nothing to check).
      const pools = await getPools(payload)
      const { usage } = await getUsage(payload, { now, fromISO: day, toISO: day, excludeRequestId: request.id })
      const category = request.productionCategory || 'gateaux'
      const limit = capacityLimit(pools, category, day)
      const units = request.capacityUnits > 0 ? request.capacityUnits : 1
      if (limit !== null && usedUnits(usage, day, category) + units > limit) return refund('day_full', 'soumission expirée et journée complète depuis')
    }
    const language = request.customer?.language || 'fr'
    const order = await payload.create({
      collection: 'orders',
      data: {
        number: await nextOrderNumber(payload),
        status: 'paid',
        source: 'request',
        locale: language,
        customer: request.customer,
        items: [
          {
            title: `Gâteau personnalisé · ${request.occasion}`,
            qty: 1,
            unitPriceCents: q.subtotalCents,
            taxClass: q.taxClass,
            message: request.cakeMessage || null,
            productionCategory: request.productionCategory || 'gateaux',
            units: request.capacityUnits > 0 ? request.capacityUnits : 1,
            productionDate: day,
          },
        ],
        pickupDate: `${day}T12:00:00.000Z`,
        pickupCode: newPickupCode(),
        accessToken: newToken(),
        totals: { subtotalCents: q.subtotalCents, gstCents: q.gstCents, qstCents: q.qstCents, totalCents: q.totalCents, depositCents: q.depositCents, balanceCents: q.balanceCents },
        payment: { provider, kind: 'deposit', reference, status: 'paid', paidAt: new Date(now).toISOString(), amountCents: amountCents ?? q.depositCents },
        consent: { termsAcceptedAt: consent.termsAcceptedAt || null, termsVersion: consent.termsVersion || null, bindingLanguage: consent.bindingLanguage || null },
        request: request.id,
        timeline: [entry('paid', `Acompte reçu (demande ${request.id}); plage de cueillette à convenir`, { at: now, eventId })],
      },
      ...SYS,
    })
    const timeline = [...(request.timeline || []), entry('deposit_paid', late || request.status === 'expired' ? 'Acompte reçu après l’expiration de la soumission; la journée avait encore de la place · commande confirmée' : 'Acompte reçu · commande confirmée', { at: now, eventId })]
    const updated = await payload.update({
      collection: 'requests',
      id: request.id,
      data: { status: 'deposit_paid', order: order.id, payment: { provider, reference, status: 'paid', paidAt: new Date(now).toISOString() }, timeline },
      ...SYS,
    })
    await notifyOrderConfirmed(payload, order).catch((e) => payload.logger?.error?.({ err: e }, 'deposit confirmation not queued'))
    return { ok: true, request: updated, order }
  })
}

// Money received for a quote that can't be honoured: kept on a cancelled order (nothing booked on the pools)
// with a 15-day refund due, so Studio's refund flow (Stripe or counter) applies; the request keeps its status.
async function depositRefundDue(payload, { request, provider, reference, amountCents, eventId, now, code, why }) {
  const q = request.quote || {}
  const day = dayOf(request.eventDate)
  const refundDueBy = refundDate(now)
  const note = `Acompte reçu, ${why} : remboursement complet dû (15 jours)`
  const order = await payload.create({
    collection: 'orders',
    data: {
      number: await nextOrderNumber(payload),
      status: 'cancelled',
      source: 'request',
      locale: request.customer?.language || 'fr',
      customer: request.customer,
      items: [{ title: `Gâteau personnalisé · ${request.occasion} (acompte à rembourser)`, qty: 1, unitPriceCents: q.subtotalCents ?? amountCents ?? 0, taxClass: q.taxClass || null, productionCategory: request.productionCategory || 'gateaux', units: 0, productionDate: day }],
      pickupDate: `${day}T12:00:00.000Z`,
      accessToken: newToken(),
      totals: { subtotalCents: q.subtotalCents ?? null, gstCents: q.gstCents ?? null, qstCents: q.qstCents ?? null, totalCents: amountCents, depositCents: amountCents, balanceCents: 0 },
      payment: { provider, kind: 'deposit', reference, status: 'paid', paidAt: new Date(now).toISOString(), amountCents, refundDueBy },
      request: request.id,
      timeline: [entry('cancelled', note, { at: now, eventId })],
    },
    ...SYS,
  })
  const timeline = [...(request.timeline || []), entry(request.status, `${note} · commande ${order.number}`, { at: now, eventId })]
  const updated = await payload.update({ collection: 'requests', id: request.id, data: { timeline }, ...SYS })
  payload.logger?.warn?.({ requestId: request.id, order: order.number, code }, 'deposit received for a quote that can’t be honoured: refund due')
  return { ok: false, code, refundDue: true, request: updated, order }
}

// Studio, at hand-over: the balance (or the whole amount of a phone order) was paid at the counter (POS).
// Money only: the order's flow status (ready → picked_up) stays Studio's transition.
export async function recordCounterPayment(payload, { orderId, by = null, now = new Date() }) {
  const order = await payload.findByID({ collection: 'orders', id: orderId, ...SYS, disableErrors: true }).catch(() => null)
  if (!order) return { ok: false, code: 'order_missing' }
  if (!(order.totals?.balanceCents > 0)) return { ok: true, already: true, order }
  const timeline = [...(order.timeline || []), { ...entry(order.status, `Solde de ${order.totals.balanceCents} ¢ payé au comptoir`, { at: now }), by }]
  const full = order.payment?.provider === 'counter'
  const updated = await payload.update({
    collection: 'orders',
    id: order.id,
    data: {
      totals: { balanceCents: 0 },
      payment: full ? { status: 'paid', paidAt: new Date(now).toISOString(), amountCents: order.totals.totalCents } : {},
      timeline,
    },
    ...SYS,
  })
  return { ok: true, order: updated }
}
