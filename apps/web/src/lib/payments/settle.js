// Settles a payment, whatever the adapter (mock button or Stripe webhook). Idempotent: a second call for the
// same payment changes nothing. Only this module turns « pending_payment » into « paid » (10 §4).
import { dayOf } from '../studio/time.js'
import { capacityLimit, usedUnits, bookedInWindow, COMMITTED_STATUSES } from '../ordering/capacity.js'
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

// → { ok, already?, order, code? }
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
    if (order.status === 'pending_payment') status = 'paid'
    else if (order.status === 'cancelled') {
      const shop = await getShopSettings(payload)
      const pools = await getPools(payload)
      const day = dayOf(order.pickupDate)
      const { usage } = await getUsage(payload, { now, fromISO: day, toISO: day, excludeOrderId: order.id })
      if (slotStillFree(order, shop, pools, usage)) {
        status = 'paid'
        note = 'Paiement reçu après la fin de la réservation; la plage était encore libre'
      } else {
        refundDueBy = new Date(new Date(now).getTime() + REFUND_DAYS * 86400 * 1000).toISOString()
        note = 'Paiement reçu après la fin de la réservation; plage prise : remboursement complet dû (15 jours)'
      }
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
    return { ok: true, order: updated }
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
export async function markDepositPaid(payload, { requestId, provider, reference = null, amountCents = null, eventId = null, consent = {}, now = new Date() }) {
  return withCapacityLock(payload, async () => {
    const request = await payload.findByID({ collection: 'requests', id: requestId, ...SYS, disableErrors: true }).catch(() => null)
    if (!request) return { ok: false, code: 'request_missing' }
    if (request.payment?.status === 'paid' || seen(request, eventId)) return { ok: true, already: true, request }
    const q = request.quote || {}
    if (!Number.isInteger(q.depositCents) || !Number.isInteger(q.totalCents)) return { ok: false, code: 'request_state' }
    if (amountCents !== null && amountCents !== q.depositCents) return { ok: false, code: 'amount_mismatch' }
    const day = dayOf(request.eventDate)
    const late = q.validUntil && new Date(q.validUntil).getTime() < new Date(now).getTime()
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
    const timeline = [...(request.timeline || []), entry('deposit_paid', late ? 'Acompte reçu après l’expiration de la soumission : à confirmer' : 'Acompte reçu · commande confirmée', { at: now, eventId })]
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
