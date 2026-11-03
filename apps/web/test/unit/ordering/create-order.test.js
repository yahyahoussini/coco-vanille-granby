// createOrder / availableWindows / availableDays / sendQuote against an in-memory Local API.
import { test, describe, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { createOrder, availableWindows, availableDays, sendQuote, confirmRequest } from '../../../src/lib/ordering/create-order.js'
import { fakePayload } from './fake-payload.js'
import { shop, pools, cake, croissant, local } from './fixtures.js'

process.env.PUBLIC_ORIGIN = 'http://localhost:3000'
delete process.env.STRIPE_SECRET_KEY
delete process.env.PAYMENT_PROVIDER

const NOW = local('2026-10-27', '10:00')
const customer = { firstName: 'Julie', lastName: 'T.', email: 'julie@example.test', phone: '450 555-0101' }
const web = (over = {}) => ({
  source: 'web',
  items: [{ productId: 11, variantIndex: 0, qty: 1, message: 'Bonne fête Léo' }],
  pickup: { date: '2026-10-29', windowStart: '10:15' },
  customer,
  consent: { terms: true, termsVersion: 'conditions-de-vente@2026-10-25' },
  now: NOW,
  ...over,
})

let payload
beforeEach(() => {
  payload = fakePayload({
    globals: { shop: shop() },
    collections: { products: [cake(), croissant(), cake({ id: 13, taxClass: 'pending' }), cake({ id: 14, variants: [{ label: '8 po' }] })], 'capacity-pools': pools(), orders: [], requests: [] },
  })
})

const codes = (r) => r.errors.map((e) => e.code)

describe('a reservation (PAYMENT_PROVIDER=counter)', () => {
  beforeEach(() => {
    process.env.PAYMENT_PROVIDER = 'counter'
  })
  const after = () => delete process.env.PAYMENT_PROVIDER

  test('confirmed at once with its code, the whole amount due at pickup, no hold and no payment link', async () => {
    const r = await createOrder(payload, web())
    after()
    assert.deepEqual(r.errors, [])
    assert.equal(r.order.status, 'paid')
    assert.match(r.order.pickupCode, /^\d{4}$/)
    assert.equal(r.order.holdExpiresAt, null)
    assert.equal(r.paymentLink, null)
    assert.deepEqual([r.order.payment.provider, r.order.payment.status], ['counter', 'pending'])
    assert.equal(r.order.totals.balanceCents, r.order.totals.totalCents)
    assert.match(r.order.timeline[0].note, /Commande en ligne/)
  })

  test('asks for a phone number, not an email, and still needs the terms', async () => {
    const noEmail = await createOrder(payload, web({ customer: { firstName: 'Julie', phone: '450 555-0101' } }))
    const noPhone = await createOrder(payload, web({ customer: { firstName: 'Julie', email: 'julie@example.test' } }))
    const noTerms = await createOrder(payload, web({ consent: {} }))
    after()
    assert.deepEqual(noEmail.errors, [])
    assert.ok(codes(noPhone).includes('phone_required'))
    assert.ok(codes(noTerms).includes('terms_required'))
  })

  test('takes a place on the day: the slot is gone for the next customer', async () => {
    const days = () => availableWindows(payload, { date: '2026-10-29', items: [{ productId: 11, qty: 1 }], now: NOW })
    const before = (await days()).find((w) => w.start === '10:15').remaining
    await createOrder(payload, web())
    const left = (await days()).find((w) => w.start === '10:15')
    after()
    assert.equal(left ? left.remaining : 0, before - 1)
  })
})

describe('createOrder', () => {
  test('a valid web order is held 10 minutes, numbered, coded, priced from the catalogue, with a timeline', async () => {
    const r = await createOrder(payload, web())
    assert.deepEqual(r.errors, [])
    const o = r.order
    assert.equal(o.number, 1001)
    assert.equal(o.status, 'pending_payment')
    assert.match(o.pickupCode, /^\d{4}$/)
    assert.equal(o.pickupDate, '2026-10-29T12:00:00.000Z')
    assert.deepEqual([o.pickupWindowStart, o.pickupWindowEnd], ['10:15', '10:30'])
    assert.equal(new Date(o.holdExpiresAt).getTime() - NOW.getTime(), 10 * 60 * 1000)
    assert.equal(o.items[0].unitPriceCents, 6000)
    assert.equal(o.items[0].productionDate, '2026-10-29')
    assert.equal(o.totals.totalCents, 6000)
    assert.equal(o.payment.provider, 'mock')
    assert.equal(o.customer.phone, '+14505550101')
    assert.equal(o.consent.termsVersion, 'conditions-de-vente@2026-10-25')
    assert.equal(o.timeline[0].status, 'pending_payment')
    assert.match(r.paymentLink, /\/commander\/paiement\/\?commande=[\w-]{24}$/)
    const second = await createOrder(payload, web({ pickup: { date: '2026-10-29', windowStart: '10:30' } }))
    assert.equal(second.order.number, 1002)
  })

  test('never invents a price or a tax class', async () => {
    assert.ok(codes(await createOrder(payload, web({ items: [{ productId: 14, qty: 1 }] }))).includes('price_missing'))
    assert.ok(codes(await createOrder(payload, web({ items: [{ productId: 13, qty: 1 }] }))).includes('tax_class_pending'))
  })

  test('web checkout needs the conditions accepted (unticked by default) and, in English, the French-first box', async () => {
    assert.ok(codes(await createOrder(payload, web({ consent: {} }))).includes('terms_required'))
    const en = await createOrder(payload, web({ locale: 'en' }))
    assert.ok(codes(en).includes('binding_language_required'))
    const ok = await createOrder(payload, web({ locale: 'en', consent: { terms: true, frenchFirst: true, termsVersion: 'v1' } }))
    assert.equal(ok.order.consent.bindingLanguage, 'en')
  })

  test('customer: first name, email and phone for the web', async () => {
    const r = await createOrder(payload, web({ customer: { firstName: '', email: 'pas-un-courriel', phone: '123' } }))
    assert.deepEqual(codes(r).sort(), ['email_invalid', 'first_name_required', 'phone_invalid'])
  })

  test('a full window is refused with the closest free ones', async () => {
    for (let i = 0; i < 4; i++) assert.deepEqual((await createOrder(payload, web({ items: [{ productId: 12, qty: 1 }] }))).errors, [])
    const r = await createOrder(payload, web({ items: [{ productId: 12, qty: 1 }] }))
    assert.equal(r.errors[0].code, 'slot_taken')
    assert.deepEqual(r.errors[0].alternatives.map((w) => w.start), ['10:00', '10:30'])
  })

  test('an expired hold frees its window and its capacity', async () => {
    for (let i = 0; i < 4; i++) await createOrder(payload, web({ items: [{ productId: 12, qty: 1 }] }))
    const later = new Date(NOW.getTime() + 11 * 60 * 1000)
    const r = await createOrder(payload, web({ items: [{ productId: 12, qty: 1 }], now: later }))
    assert.deepEqual(r.errors, [])
  })

  test('capacity per production category per day', async () => {
    const pool = payload.store['capacity-pools'].find((p) => p.productionCategory === 'gateaux')
    pool.defaultPerDay = 2
    assert.deepEqual((await createOrder(payload, web({ items: [{ productId: 11, qty: 2 }] }))).errors, [])
    const r = await createOrder(payload, web({ items: [{ productId: 11, qty: 1 }], pickup: { date: '2026-10-29', windowStart: '11:00' } }))
    assert.equal(r.errors[0].code, 'capacity_full')
    assert.equal(r.errors[0].nextDay, '2026-10-30')
  })

  test('ordering disabled or paused: the web is refused, Studio phone orders still go through', async () => {
    payload = fakePayload({ globals: { shop: shop({ ordering: { enabled: false } }) }, collections: { products: [cake()], 'capacity-pools': pools(), orders: [], requests: [] } })
    assert.deepEqual(codes(await createOrder(payload, web())), ['disabled'])
    const phone = await createOrder(payload, { ...web(), source: 'phone', customer: { firstName: 'Marc', phone: '4505550199' }, payment: { provider: 'counter' }, consent: {} })
    assert.deepEqual(phone.errors, [])
    assert.equal(phone.order.status, 'paid')
    assert.deepEqual([phone.order.payment.provider, phone.order.payment.status], ['counter', 'pending'])
    assert.equal(phone.order.totals.balanceCents, 6000)
    assert.equal(phone.order.holdExpiresAt, null)
    assert.equal(phone.paymentLink, null)
  })

  test('phone orders from a non-staff request are refused', async () => {
    const r = await createOrder(payload, { ...web(), source: 'phone', req: { user: { role: 'agence' } } })
    assert.deepEqual(codes(r), ['forbidden'])
  })

  test('cake message: only on products that take one, within the owner’s length', async () => {
    assert.ok(codes(await createOrder(payload, web({ items: [{ productId: 12, qty: 1, message: 'Allô' }] }))).includes('message_not_allowed'))
    assert.ok(codes(await createOrder(payload, web({ items: [{ productId: 11, qty: 1, message: 'x'.repeat(31) }] }))).includes('message_too_long'))
  })

  test('no payment adapter in production without keys → payment unavailable', async () => {
    process.env.PUBLIC_ORIGIN = 'https://cocovanillegranby.com'
    try {
      assert.ok(codes(await createOrder(payload, web())).includes('payment_unavailable'))
    } finally {
      process.env.PUBLIC_ORIGIN = 'http://localhost:3000'
    }
  })
})

describe('availableWindows / availableDays', () => {
  test('windows of a day with what remains', async () => {
    await createOrder(payload, web({ pickup: { date: '2026-10-29', windowStart: '09:00' } }))
    const w = await availableWindows(payload, { date: '2026-10-29', items: [{ productId: 11, qty: 1 }], now: NOW })
    assert.deepEqual(w[0], { start: '09:00', end: '09:15', remaining: 3 })
    assert.equal(w.at(-1).end, '16:30')
    assert.deepEqual(await availableWindows(payload, { date: '2026-10-28', items: [{ productId: 11, qty: 1 }], now: NOW }), [])
  })

  test('day chips for the box; a blocked product explains itself', async () => {
    const d = await availableDays(payload, { items: [{ productId: 11, qty: 1 }], now: NOW })
    assert.deepEqual(d.days.slice(0, 3).map((x) => x.date), ['2026-10-29', '2026-10-30', '2026-10-31'])
    const blocked = await availableDays(payload, { items: [{ productId: 13, qty: 1 }], now: NOW })
    assert.equal(blocked.reason, 'tax_class_pending')
  })
})

describe('sendQuote', () => {
  const request = (over = {}) => ({ id: 7, status: 'new', occasion: 'Anniversaire', eventDate: '2026-11-07T12:00:00.000Z', productionCategory: 'gateaux', capacityUnits: 1, customer: { firstName: 'Léa', phone: '+14505550123' }, ...over })

  test('prices with taxes, deposit from the shop setting, validity, payment link, tentative hold', async () => {
    payload.store.requests.push(request())
    const shopDoc = await payload.findGlobal({ slug: 'shop' })
    await payload.updateGlobal({ slug: 'shop', data: { ordering: { ...shopDoc.ordering, depositPercent: 30 } } })
    const r = await sendQuote(payload, { requestId: 7, totalCents: 18000, taxClass: 'zero', now: NOW })
    assert.deepEqual(r.errors, [])
    const q = r.request.quote
    assert.deepEqual([q.subtotalCents, q.gstCents, q.qstCents, q.totalCents, q.depositCents, q.balanceCents], [18000, 0, 0, 18000, 5400, 12600])
    assert.equal(new Date(q.validUntil).getTime() - NOW.getTime(), 72 * 3600 * 1000)
    assert.equal(r.request.status, 'quoted')
    assert.match(r.paymentLink, /^http:\/\/localhost:3000\/svc\/p\/[\w-]{12}\/$/)
  })

  test('no deposit percent anywhere → refused (no default, 10 §1.2); no tax class → refused', async () => {
    payload.store.requests.push(request())
    assert.equal((await sendQuote(payload, { requestId: 7, totalCents: 18000, taxClass: 'zero', now: NOW })).errors[0].code, 'deposit_percent_missing')
    assert.equal((await sendQuote(payload, { requestId: 7, totalCents: 18000, depositPercent: 30, now: NOW })).errors[0].code, 'tax_class_pending')
    assert.equal((await sendQuote(payload, { requestId: 7, totalCents: 0, depositPercent: 30, taxClass: 'zero', now: NOW })).errors[0].code, 'total_invalid')
  })

  test('a full day is refused unless forced', async () => {
    payload.store.requests.push(request())
    payload.store['capacity-pools'].find((p) => p.productionCategory === 'gateaux').defaultPerDay = 0
    assert.equal((await sendQuote(payload, { requestId: 7, totalCents: 18000, depositPercent: 30, taxClass: 'zero', now: NOW })).errors[0].code, 'day_full')
    assert.deepEqual((await sendQuote(payload, { requestId: 7, totalCents: 18000, depositPercent: 30, taxClass: 'zero', force: true, now: NOW })).errors, [])
  })
})

describe('a price agreed by phone (confirmRequest)', () => {
  const request = (over = {}) => ({ id: 7, status: 'new', occasion: 'Anniversaire', eventDate: '2026-10-31T12:00:00.000Z', cakeMessage: 'Bonne fête', customer: { firstName: 'Julie', phone: '+14505550101', language: 'fr' }, ...over })
  beforeEach(() => {
    payload = fakePayload({ globals: { shop: shop(), business: {} }, collections: { requests: [request()], 'capacity-pools': pools() } })
  })

  test('the request becomes a confirmed order for its day, the whole amount due at pickup', async () => {
    const r = await confirmRequest(payload, { requestId: 7, totalCents: 12000, taxClass: 'zero', now: NOW })
    assert.deepEqual(r.errors, [])
    assert.equal(r.order.status, 'paid')
    assert.equal(r.order.source, 'request')
    assert.equal(r.order.pickupDate, '2026-10-31T12:00:00.000Z')
    assert.equal(r.order.pickupWindowStart ?? null, null)
    assert.deepEqual([r.order.payment.provider, r.order.payment.status], ['counter', 'pending'])
    assert.deepEqual([r.order.totals.totalCents, r.order.totals.balanceCents], [12000, 12000])
    assert.equal(r.request.status, 'confirmed')
    assert.equal(r.request.order, r.order.id)
  })

  test('adds the taxes of a taxable cake; refuses a bad price, a used request, a full day', async () => {
    const r = await confirmRequest(payload, { requestId: 7, totalCents: 10000, taxClass: 'taxable', now: NOW })
    assert.equal(r.order.totals.totalCents, 11498)
    assert.equal((await confirmRequest(payload, { requestId: 7, totalCents: 10000, taxClass: 'zero', now: NOW })).errors[0].code, 'request_state')
    payload = fakePayload({ globals: { shop: shop(), business: {} }, collections: { requests: [request()], 'capacity-pools': [{ id: 1, productionCategory: 'gateaux', defaultPerDay: 0 }] } })
    assert.equal((await confirmRequest(payload, { requestId: 7, totalCents: 0, taxClass: 'zero', now: NOW })).errors[0].code, 'total_invalid')
    assert.equal((await confirmRequest(payload, { requestId: 7, totalCents: 10000, taxClass: 'zero', now: NOW })).errors[0].code, 'day_full')
    assert.equal((await confirmRequest(payload, { requestId: 7, totalCents: 10000, taxClass: 'zero', force: true, now: NOW })).errors.length, 0)
  })
})
