// Contract shared by the public checkout and Studio phone orders (10 §3–§4, 16 §3.2, §3.4).
//
// createOrder(payload, { source: 'web'|'phone', items: [{ productId, variantIndex, qty, message }],
//   pickup: { date: 'YYYY-MM-DD', windowStart: 'HH:MM' }, customer: { firstName, lastName, phone, email, language },
//   payment: { method: 'comptoir'|'en-ligne' (web, the customer's choice), provider: 'stripe'|'mock'|'counter'|'none' (phone) }, consent, attribution, allergyNote, req })
// → { order, totals, errors: [], paymentLink }   (validates capacity, slot, prices, tax classes; never invents a price)
//
// sendQuote(payload, { requestId, totalCents, depositPercent, validHours, taxClass, force, req }) → { request, paymentLink, errors, messages }
// availableWindows(payload, { date, items, now }) → [{ start: 'HH:MM', end: 'HH:MM', remaining }]
// availableDays(payload, { items, now, source }) → { days: [{ date, windows, toConfirm }], reason }
// confirmRequest(payload, { requestId, totalCents, taxClass, force, req }) → { request, order, errors }   (reservation: price agreed by phone)
import { localParts, addDays, dayOf } from '../studio/time.js'
import { hasRole } from '../access.js'
import { productLine, lineBlockers } from './lines.js'
import { onlineState, earliestReady, dayAvailability, bookableDays, productOfferState } from './availability.js'
import { closestWindows, isWithinHorizon } from './slots.js'
import { productionDay, HOLD_MINUTES, capacityLimit, usedUnits, capacitySummary } from './capacity.js'
import { orderTotals } from './totals.js'
import { taxBlocker } from './tax.js'
import { cleanCustomer } from './customer.js'
import { orderError } from './errors.js'
import { getShopSettings, getPools, getUsage, engineContext, withCapacityLock, newToken, newPickupCode, nextOrderNumber, storedDay, publicOrigin } from './context.js'
import { webProvider } from '../payments/provider.js'
import { paymentOptions } from '../payments/settings.js'
import { cancelIntent } from '../payments/stripe.js'
import { notifyOrderConfirmed, notifyQuoteSent, scheduleReminder } from '../messaging/notify.js'
import { pushToTeam } from '../studio/push.js'
import { longDayLabel, windowLabel } from './labels.js'

const SYS = { overrideAccess: true, depth: 0 }
const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/
const HHMM = /^\d{2}:\d{2}$/
const STAFF = ['proprietaire', 'gerant', 'comptoir']

const timelineEntry = (status, { by = null, source = null, note = null, at = new Date() } = {}) => ({ at: new Date(at).toISOString(), status, by, source, note })

async function loadProducts(payload, ids) {
  const map = new Map()
  for (const id of [...new Set(ids.map(String))]) {
    const doc = await payload.findByID({ collection: 'products', id, locale: 'fr', overrideAccess: true, depth: 1, disableErrors: true }).catch(() => null)
    if (doc) map.set(String(id), doc)
  }
  return map
}

// Items → engine lines, with every reason a line can't be booked.
async function buildLines(payload, items, { source, shop, now }) {
  const products = await loadProducts(payload, items.map((i) => i.productId))
  const errors = []
  const lines = items.map((it, index) => {
    const product = products.get(String(it.productId)) || null
    const line = productLine(product, Number(it.variantIndex) || 0, Number(it.qty), { message: String(it.message || '').trim(), now })
    for (const code of lineBlockers(product, line, { source, shop, now })) errors.push(orderError(code, { item: index, productId: it.productId }))
    return line
  })
  return { lines, errors, products }
}

const paymentLinkFor = (order) => `${publicOrigin()}${order.locale === 'en' ? '/en/order/checkout/' : order.locale === 'es' ? '/es/pedidos/pago/' : '/commander/paiement/'}?commande=${order.accessToken}`

export async function createOrder(payload, args = {}) {
  const { source = 'web', items = [], pickup = {}, customer: rawCustomer = {}, payment = {}, consent = {}, attribution = null, allergyNote = '', boxToken = null, req = null, now = new Date(), holdMinutes = HOLD_MINUTES } = args
  const locale = ['fr', 'en', 'es'].includes(args.locale) ? args.locale : ['fr', 'en', 'es'].includes(rawCustomer.language) ? rawCustomer.language : 'fr'
  const errors = []
  const fail = (list) => ({ order: null, totals: null, errors: list, paymentLink: null })

  if (!['web', 'phone'].includes(source)) return fail([orderError('forbidden')])
  if (source === 'phone' && req && !hasRole(req.user, ...STAFF)) return fail([orderError('forbidden')])

  const shop = await getShopSettings(payload)
  const state = onlineState(shop, now, { source })
  if (!state.open) errors.push(orderError(state.reason))
  if (!items.length) errors.push(orderError('empty'))

  const built = await buildLines(payload, items, { source, shop, now })
  errors.push(...built.errors)
  const { lines } = built

  const options = await paymentOptions(payload)
  const provider = source === 'web' ? webProvider(options, payment.method) : payment.provider === 'stripe' || payment.provider === 'mock' ? options.online || (options.counter ? 'counter' : 'none') : 'counter'
  if (provider === 'none') errors.push(orderError('payment_unavailable'))
  if (provider === null) errors.push(orderError('payment_method_unavailable', { field: 'paiement' }))

  // A reservation asks for a phone number only: the confirmation is its page, and the shop calls if a detail is missing.
  const { customer, errors: customerErrors } = cleanCustomer(rawCustomer, { requireEmail: source === 'web' && provider !== 'counter', requirePhone: true, locale })
  errors.push(...customerErrors.map((e) => orderError(e.code, { field: e.field })))

  // Express acceptance of the conditions, French first (07 O2, O3). Phone orders: counsel question (16 §3.2).
  const termsVersion = consent.termsVersion || shop.ordering?.termsVersion || null
  if (source === 'web') {
    if (consent.terms !== true) errors.push(orderError('terms_required', { field: 'terms' }))
    else if (!termsVersion) errors.push(orderError('terms_version_missing'))
    if (locale !== 'fr' && consent.frenchFirst !== true) errors.push(orderError('binding_language_required', { field: 'frenchFirst' }))
  }
  const note = String(allergyNote || '').trim()
  if (note.length > 500) errors.push(orderError('allergy_note_too_long', { field: 'allergyNote' }))

  if (!ISO_DAY.test(pickup.date || '') || !HHMM.test(pickup.windowStart || '')) errors.push(orderError('pickup_required', { field: 'pickup' }))

  let totals = null
  if (!built.errors.length && lines.length) {
    try {
      totals = orderTotals(lines, { supplyDate: ISO_DAY.test(pickup.date || '') ? pickup.date : localParts(now).iso })
    } catch (e) {
      errors.push(orderError(e.code || 'price_missing'))
    }
  }
  if (errors.length) return fail(errors)

  // Slot and capacity: checked again under the lock, against everything booked so far.
  return withCapacityLock(payload, async () => {
    const pools = await getPools(payload)
    const { usage, orders } = await getUsage(payload, { now, fromISO: pickup.date, toISO: pickup.date })
    if (!isWithinHorizon(shop, pickup.date, now)) return fail([orderError(pickup.date < localParts(now).iso ? 'too_soon' : 'too_far', { field: 'pickup' })])
    const ready = earliestReady(lines, shop, now)
    const day = dayAvailability(lines, shop, pickup.date, { now, pools, usage, ready })
    const window = day.windows.find((w) => w.start === pickup.windowStart)
    if (!window) {
      const code = day.reason || 'slot_taken'
      const alternatives = closestWindows(day.windows, pickup.windowStart).map(({ start, end, remaining }) => ({ start, end, remaining }))
      const nextDay = alternatives.length ? null : bookableDays(lines, shop, { now, pools, usage, source, limit: 1 }).days[0]?.date || null
      return fail([orderError(code, { field: 'pickup', alternatives, nextDay })])
    }

    const taken = new Set(orders.filter((o) => dayOf(o.pickupDate) === pickup.date).map((o) => o.pickupCode))
    let pickupCode = newPickupCode()
    for (let i = 0; i < 20 && taken.has(pickupCode); i++) pickupCode = newPickupCode()

    const by = req?.user?.id ?? null
    const counter = provider === 'counter'
    const status = counter ? 'paid' : 'pending_payment'
    const data = {
      number: await nextOrderNumber(payload),
      status,
      source,
      locale,
      customer,
      items: lines.map((l) => ({
        product: l.productId,
        variantIndex: l.variantIndex,
        title: l.title,
        variantLabel: l.variantLabel,
        qty: l.qty,
        unitPriceCents: l.cents,
        taxClass: l.taxClass,
        message: l.message || null,
        productionCategory: l.productionCategory,
        units: l.units,
        productionDate: productionDay(pickup.date, l.productionOffsetDays),
      })),
      pickupDate: storedDay(pickup.date),
      pickupWindowStart: window.start,
      pickupWindowEnd: window.end,
      pickupCode,
      holdExpiresAt: counter ? null : new Date(new Date(now).getTime() + holdMinutes * 60 * 1000).toISOString(),
      accessToken: newToken(),
      totals: {
        subtotalCents: totals.subtotalCents,
        gstCents: totals.gstCents,
        qstCents: totals.qstCents,
        totalCents: totals.totalCents,
        depositCents: null,
        balanceCents: counter ? totals.totalCents : 0,
      },
      // Paid at the counter (phone order, or a reservation on the site): booked (status « paid » = confirmed in the flow), money still due.
      payment: { provider, kind: 'full', status: 'pending', amountCents: totals.totalCents },
      allergyNote: note || null,
      consent: {
        termsAcceptedAt: source === 'web' ? new Date(now).toISOString() : null,
        termsVersion: source === 'web' ? termsVersion : null,
        bindingLanguage: source === 'web' ? (locale === 'en' ? 'en' : 'fr') : null,
        reviewRequest: consent.reviewRequest === true,
        marketing: consent.marketing === true,
        birthdayReminder: consent.birthdayReminder === true,
        analytics: consent.analytics === true,
        textVersion: consent.textVersion || null,
      },
      attribution: attribution || null,
      boxToken: boxToken || null,
      timeline: [timelineEntry(status, { by, source, at: now, note: counter ? (source === 'web' ? 'Commande en ligne · paiement à la cueillette' : 'Commande téléphone · paiement au comptoir') : 'Plage réservée pendant le paiement' })],
    }
    const order = await payload.create({ collection: 'orders', data, ...SYS })
    // Booked at once: same confirmation as a paid web order (16 §3.2), after the undo window on a phone order.
    if (counter) {
      await notifyOrderConfirmed(payload, order).catch(() => null)
      await scheduleReminder(payload, order, { now }).catch(() => null)
      // An order on the site to pay at pickup: the only thing that tells the team while Studio is closed. No customer's name in it.
      if (source === 'web') await pushToTeam(payload, { title: `Nouvelle commande · ${order.number}`, body: `${longDayLabel(pickup.date, 'fr')}, ${windowLabel(window.start, window.end, 'fr')} · ${lines.length > 1 ? `${lines.length} produits` : lines[0].title}`, url: `/commandes/${order.id}/`, tag: `commande-${order.id}` })
    }
    return { order, totals, errors: [], paymentLink: counter ? null : paymentLinkFor(order) }
  })
}

// Free windows of one day for these items (Studio phone sheet, checkout chips). [] when it can't be booked.
export async function availableWindows(payload, { date, items = [], now = new Date(), source = 'web' } = {}) {
  if (!ISO_DAY.test(date || '') || !items.length) return []
  const shop = await getShopSettings(payload)
  if (!onlineState(shop, now, { source }).open || !isWithinHorizon(shop, date, now)) return []
  const { lines, errors } = await buildLines(payload, items, { source, shop, now })
  if (errors.length) return []
  const pools = await getPools(payload)
  const { usage } = await getUsage(payload, { now, fromISO: date, toISO: date })
  return dayAvailability(lines, shop, date, { now, pools, usage }).windows.map(({ start, end, remaining }) => ({ start, end, remaining }))
}

// Bookable days (day chips) for these items, with the reason when there are none.
export async function availableDays(payload, { items = [], now = new Date(), source = 'web', limit = 60 } = {}) {
  const ctx = await engineContext(payload, { now })
  if (!items.length) return { days: [], reason: 'empty', errors: [] }
  const { lines, errors } = await buildLines(payload, items, { source, shop: ctx.shop, now })
  if (errors.length) return { days: [], reason: errors[0].code, errors }
  const r = bookableDays(lines, ctx.shop, { now, pools: ctx.pools, usage: ctx.usage, source, limit })
  return { days: r.days.map((d) => ({ date: d.date, toConfirm: Boolean(d.toConfirm), windows: d.windows.map(({ start, end, remaining }) => ({ start, end, remaining })) })), reason: r.reason, errors: [] }
}

// productOfferState for a list of products with live pools and bookings (cards, the order page).
export async function offerStates(payload, products, { locale = 'fr', now = new Date(), source = 'web' } = {}) {
  const ctx = await engineContext(payload, { now })
  return new Map(products.map((p) => [p.id, productOfferState(p, ctx.shop, now, { locale, pools: ctx.pools, usage: ctx.usage, source })]))
}

// Studio « Capacité du 8 nov. : 2/6 gâteaux » (16 §3.4): { date, category, limit (null = not set), used }.
export async function capacityOn(payload, { date, category = 'gateaux', now = new Date() } = {}) {
  if (!ISO_DAY.test(date || '')) return { date, category, limit: null, used: 0 }
  const pools = await getPools(payload)
  const { usage } = await getUsage(payload, { now, fromISO: date, toISO: date })
  return capacitySummary(pools, usage, date, category)
}

// Studio « Chiffrer et envoyer » (16 §3.4). Prices are before taxes; taxes come from the tax engine (07 §6).
// depositPercent and validHours default to the shop settings; the deposit % has no default of its own (10 §1.2).
export async function sendQuote(payload, { requestId, totalCents, depositPercent, validHours, taxClass, force = false, req = null, now = new Date() } = {}) {
  const fail = (code, extra) => ({ request: null, paymentLink: null, errors: [orderError(code, extra)] })
  if (req && !hasRole(req.user, 'proprietaire', 'gerant')) return fail('forbidden')
  const request = await payload.findByID({ collection: 'requests', id: requestId, ...SYS, disableErrors: true }).catch(() => null)
  if (!request) return fail('request_missing')
  if (!['new', 'quoted'].includes(request.status)) return fail('request_state')
  if (!Number.isInteger(totalCents) || totalCents <= 0) return fail('total_invalid', { field: 'totalCents' })

  const shop = await getShopSettings(payload)
  const pct = depositPercent ?? shop.ordering?.depositPercent
  if (pct === undefined || pct === null || pct === '') return fail('deposit_percent_missing', { field: 'depositPercent' })
  if (typeof pct !== 'number' || !(pct > 0 && pct <= 100)) return fail('deposit_percent_invalid', { field: 'depositPercent' })
  const hours = validHours ?? shop.ordering?.quoteValidHours
  if (!(typeof hours === 'number' && hours > 0)) return fail('valid_hours_missing', { field: 'validHours' })
  const cls = taxClass || request.quote?.taxClass
  const blocker = taxBlocker({ taxClass: cls === 'rule' ? 'pending' : cls })
  if (blocker) return fail('tax_class_pending', { field: 'taxClass' })

  return withCapacityLock(payload, async () => {
    const day = dayOf(request.eventDate)
    const category = request.productionCategory || 'gateaux'
    if (!force) {
      const pools = await getPools(payload)
      const { usage } = await getUsage(payload, { now, fromISO: day, toISO: day, excludeRequestId: request.id })
      const limit = capacityLimit(pools, category, day)
      const used = usedUnits(usage, day, category)
      const units = request.capacityUnits > 0 ? request.capacityUnits : 1
      if (limit === null) return fail('capacity_missing', { date: day, category })
      if (used + units > limit) return fail('day_full', { date: day, category, limit, used })
    }
    const totals = orderTotals([{ cents: totalCents, qty: 1, taxClass: cls }], { supplyDate: day, depositPercent: pct >= 100 ? null : pct })
    const accessToken = request.accessToken || newToken(9)
    const paymentLink = `${publicOrigin()}/svc/p/${accessToken}/`
    const validUntil = new Date(new Date(now).getTime() + hours * 3600 * 1000).toISOString()
    const timeline = [...(Array.isArray(request.timeline) ? request.timeline : []), timelineEntry('quoted', { by: req?.user?.id ?? null, at: now, note: `Soumission ${totalCents} ¢ avant taxes, acompte ${pct} %` })]
    // A new quote replaces the old one: its deposit intent (if any) is cancelled, the page makes a new one.
    const previous = request.payment?.status !== 'paid' && request.payment?.provider === 'stripe' ? request.payment?.reference : null
    if (previous) await cancelIntent(payload, previous)
    const updated = await payload.update({
      collection: 'requests',
      id: request.id,
      data: {
        status: 'quoted',
        accessToken,
        ...(previous ? { payment: { provider: 'stripe', reference: null, status: 'none' } } : {}),
        quote: {
          subtotalCents: totals.subtotalCents,
          taxClass: cls,
          gstCents: totals.gstCents,
          qstCents: totals.qstCents,
          totalCents: totals.totalCents,
          depositPercent: pct,
          depositCents: totals.depositCents ?? totals.totalCents,
          balanceCents: totals.balanceCents,
          validUntil,
          paymentLink,
          sentAt: new Date(now).toISOString(),
        },
        timeline,
      },
      ...SYS,
    })
    // Email (recap) + SMS (link), sent after the undo window (16 §3.0).
    const messages = await notifyQuoteSent(payload, updated).catch(() => [])
    return { request: updated, paymentLink, errors: [], messages }
  })
}

// Reservation mode (PAYMENT_PROVIDER=counter, no deposit link): the shop called the customer and they agreed on a price. The
// request becomes a confirmed order on the pools, for its day, with the time to agree; the whole amount is due at pickup.
export async function confirmRequest(payload, { requestId, totalCents, taxClass, force = false, req = null, now = new Date() } = {}) {
  const fail = (code, extra) => ({ request: null, order: null, errors: [orderError(code, extra)] })
  if (req && !hasRole(req.user, 'proprietaire', 'gerant')) return fail('forbidden')
  const request = await payload.findByID({ collection: 'requests', id: requestId, ...SYS, disableErrors: true }).catch(() => null)
  if (!request) return fail('request_missing')
  if (!['new', 'quoted'].includes(request.status)) return fail('request_state')
  if (!Number.isInteger(totalCents) || totalCents <= 0) return fail('total_invalid', { field: 'totalCents' })
  if (taxBlocker({ taxClass: taxClass === 'rule' ? 'pending' : taxClass })) return fail('tax_class_pending', { field: 'taxClass' })
  return withCapacityLock(payload, async () => {
    const day = dayOf(request.eventDate)
    const category = request.productionCategory || 'gateaux'
    const units = request.capacityUnits > 0 ? request.capacityUnits : 1
    if (!force) {
      const pools = await getPools(payload)
      const { usage } = await getUsage(payload, { now, fromISO: day, toISO: day, excludeRequestId: request.id })
      const limit = capacityLimit(pools, category, day)
      const used = usedUnits(usage, day, category)
      if (limit !== null && used + units > limit) return fail('day_full', { date: day, category, limit, used })
    }
    const totals = orderTotals([{ cents: totalCents, qty: 1, taxClass }], { supplyDate: day })
    const note = `Prix convenu avec le client : ${totalCents} ¢ avant taxes · paiement à la cueillette`
    const order = await payload.create({
      collection: 'orders',
      data: {
        number: await nextOrderNumber(payload),
        status: 'paid',
        source: 'request',
        locale: request.customer?.language || 'fr',
        customer: request.customer,
        items: [{ title: `Gâteau personnalisé · ${request.occasion}`, qty: 1, unitPriceCents: totals.subtotalCents, taxClass, message: request.cakeMessage || null, productionCategory: category, units, productionDate: day }],
        pickupDate: storedDay(day),
        pickupCode: newPickupCode(),
        accessToken: newToken(),
        totals: { subtotalCents: totals.subtotalCents, gstCents: totals.gstCents, qstCents: totals.qstCents, totalCents: totals.totalCents, depositCents: null, balanceCents: totals.totalCents },
        payment: { provider: 'counter', kind: 'full', status: 'pending', amountCents: totals.totalCents },
        request: request.id,
        timeline: [timelineEntry('paid', { by: req?.user?.id ?? null, at: now, note })],
      },
      ...SYS,
    })
    const updated = await payload.update({
      collection: 'requests',
      id: request.id,
      data: {
        status: 'confirmed',
        order: order.id,
        answerBy: null,
        quote: { subtotalCents: totals.subtotalCents, taxClass, gstCents: totals.gstCents, qstCents: totals.qstCents, totalCents: totals.totalCents, balanceCents: totals.totalCents, sentAt: new Date(now).toISOString() },
        timeline: [...(Array.isArray(request.timeline) ? request.timeline : []), timelineEntry('confirmed', { by: req?.user?.id ?? null, at: now, note: `${note} · commande ${order.number}` })],
      },
      ...SYS,
    })
    const messages = await notifyOrderConfirmed(payload, order).catch(() => [])
    return { request: updated, order, errors: [], messages }
  })
}

export { HOLD_MINUTES }
