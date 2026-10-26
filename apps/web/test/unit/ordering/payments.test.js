// « Ma boîte » token, payment adapter choice, settlement (idempotent, late payments), Stripe signatures.
import { test, describe, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { encodeBox, decodeBox, applyBoxAction, boxCount, MAX_LINES } from '../../../src/lib/ordering/box.js'
import { paymentProvider, mockAllowed } from '../../../src/lib/payments/provider.js'
import { markOrderPaid, markDepositPaid, markOrderPaymentFailed } from '../../../src/lib/payments/settle.js'
import { verifyWebhook, testSignature } from '../../../src/lib/payments/stripe.js'
import { inAppBrowser, openInBrowserHref } from '../../../src/lib/ordering/iab.js'
import { createOrder, sendQuote } from '../../../src/lib/ordering/create-order.js'
import { fakePayload } from './fake-payload.js'
import { shop, pools, cake, croissant, local } from './fixtures.js'

process.env.PUBLIC_ORIGIN = 'http://localhost:3000'
delete process.env.STRIPE_SECRET_KEY
delete process.env.PAYMENT_PROVIDER

describe('« Ma boîte » token', () => {
  test('round trip; same product, size and message merge; quantities capped', () => {
    const items = applyBoxAction(applyBoxAction([], { type: 'add', productId: '5', variantIndex: '1', qty: '2', message: 'Bonne fête' }), { type: 'add', productId: 5, variantIndex: 1, qty: 1, message: 'Bonne fête' })
    assert.deepEqual(items, [{ productId: 5, variantIndex: 1, qty: 3, message: 'Bonne fête' }])
    const token = encodeBox(items)
    assert.match(token, /^[\w-]+$/)
    assert.deepEqual(decodeBox(token), items)
    assert.equal(applyBoxAction(items, { type: 'set', line: '0', qty: '99' })[0].qty, 50)
    assert.deepEqual(applyBoxAction(items, { type: 'remove', line: '0' }), [])
    assert.equal(boxCount(items), 3)
  })

  test('garbage tokens give an empty box; at most 20 lines; no personal data fields', () => {
    assert.deepEqual(decodeBox('pas-un-jeton'), [])
    assert.deepEqual(decodeBox('<script>'), [])
    assert.deepEqual(decodeBox(Buffer.from(JSON.stringify({ v: 1, i: [[1, 0, 2, 'x'], ['DROP TABLE', 0, 1]] })).toString('base64url')), [{ productId: 1, variantIndex: 0, qty: 2, message: 'x' }])
    const many = Array.from({ length: 30 }, (_, i) => ({ productId: i + 1, qty: 1 }))
    assert.equal(decodeBox(encodeBox(many)).length, MAX_LINES)
    assert.equal(encodeBox([]), null)
    assert.deepEqual(Object.keys(JSON.parse(Buffer.from(encodeBox([{ productId: 1, qty: 1 }]), 'base64url').toString())), ['v', 'i'])
  })
})

describe('payment adapter choice', () => {
  test('stripe with keys, mock without keys outside production, none in production without keys', () => {
    assert.equal(paymentProvider({ STRIPE_SECRET_KEY: 'sk_test_x', PUBLIC_ORIGIN: 'https://cocovanillegranby.com' }), 'stripe')
    assert.equal(paymentProvider({ PUBLIC_ORIGIN: 'http://localhost:3000' }), 'mock')
    assert.equal(paymentProvider({ PUBLIC_ORIGIN: 'https://staging.cocovanillegranby.com' }), 'mock')
    assert.equal(paymentProvider({ PUBLIC_ORIGIN: 'https://cocovanillegranby.com' }), 'none')
    assert.equal(paymentProvider({ PUBLIC_ORIGIN: 'https://cocovanillegranby.com', PAYMENT_PROVIDER: 'mock' }), 'none')
    assert.equal(mockAllowed({ PUBLIC_ORIGIN: 'http://localhost:3000', PAYMENT_MOCK: 'off' }), false)
  })

  test('Instagram / Facebook in-app browsers and the Safari hand-off link', () => {
    assert.equal(inAppBrowser('Mozilla/5.0 (iPhone) Instagram 300.0'), 'instagram')
    assert.equal(inAppBrowser('Mozilla/5.0 [FBAN/FBIOS;FBAV/400.0]'), 'facebook')
    assert.equal(inAppBrowser('Mozilla/5.0 (iPhone) Safari/604.1'), null)
    assert.equal(openInBrowserHref('https://cocovanillegranby.com/boite/x/', 'iPhone Instagram'), 'x-safari-https://cocovanillegranby.com/boite/x/')
    assert.equal(openInBrowserHref('https://cocovanillegranby.com/boite/x/', 'Android Instagram'), 'https://cocovanillegranby.com/boite/x/')
  })
})

describe('settlement', () => {
  const NOW = local('2026-10-27', '10:00')
  let payload
  beforeEach(() => {
    payload = fakePayload({
      globals: { shop: shop({ ordering: { depositPercent: 30 } }), business: { phoneDisplay: '450-372-7177', address: { street: '3, rue Court', city: 'Granby', postalCode: 'J2G 4Y6' } } },
      collections: { products: [cake(), croissant()], 'capacity-pools': pools(), orders: [], requests: [], messages: [] },
    })
  })
  const order = (over = {}) =>
    createOrder(payload, {
      source: 'web',
      items: [{ productId: 11, qty: 1 }],
      pickup: { date: '2026-10-31', windowStart: '10:00' },
      customer: { firstName: 'Julie', email: 'julie@example.test', phone: '4505550101' },
      consent: { terms: true, termsVersion: 'v1' },
      now: NOW,
      ...over,
    })

  test('pending → paid once; the contract copy and the reminder are queued once', async () => {
    const { order: o } = await order()
    const first = await markOrderPaid(payload, { orderId: o.id, provider: 'mock', reference: 'mock_1', amountCents: 6000, eventId: 'evt_1', now: NOW })
    assert.equal(first.order.status, 'paid')
    assert.equal(first.order.payment.status, 'paid')
    assert.equal(first.order.holdExpiresAt, null)
    const again = await markOrderPaid(payload, { orderId: o.id, provider: 'mock', reference: 'mock_1', amountCents: 6000, eventId: 'evt_1', now: NOW })
    assert.equal(again.already, true)
    const templates = payload.store.messages.map((m) => m.template).sort()
    assert.deepEqual(templates, ['order_confirmed', 'order_reminder'])
    const mail = payload.store.messages.find((m) => m.template === 'order_confirmed')
    assert.equal(mail.attachments[0].contentType.startsWith('text/calendar'), true)
  })

  test('a wrong amount is never marked paid', async () => {
    const { order: o } = await order()
    const r = await markOrderPaid(payload, { orderId: o.id, provider: 'stripe', amountCents: 100, now: NOW })
    assert.equal(r.code, 'amount_mismatch')
    assert.equal(payload.store.orders[0].status, 'pending_payment')
  })

  test('paid after the hold ran out: kept if the window is still free, refund due otherwise', async () => {
    const { order: o } = await order()
    payload.store.orders[0].status = 'cancelled'
    const kept = await markOrderPaid(payload, { orderId: o.id, provider: 'stripe', amountCents: 6000, now: NOW })
    assert.equal(kept.order.status, 'paid')

    const { order: late } = await order({ pickup: { date: '2026-10-31', windowStart: '10:15' } })
    payload.store.orders.find((x) => x.id === late.id).status = 'cancelled'
    for (let i = 0; i < 4; i++) payload.store.orders.push({ id: 100 + i, status: 'paid', pickupDate: '2026-10-31T12:00:00.000Z', pickupWindowStart: '10:15', items: [{ qty: 1, units: 1, productionCategory: 'gateaux', productionDate: '2026-10-31' }] })
    const refund = await markOrderPaid(payload, { orderId: late.id, provider: 'stripe', amountCents: 6000, now: NOW })
    assert.equal(refund.order.status, 'cancelled')
    assert.equal(refund.order.payment.status, 'paid')
    assert.equal(new Date(refund.order.payment.refundDueBy).getTime() - NOW.getTime(), 15 * 86400 * 1000)
  })

  test('a failed card keeps the hold so the customer can retry', async () => {
    const { order: o } = await order()
    await markOrderPaymentFailed(payload, { orderId: o.id, reference: 'pi_1', reason: 'card_declined', now: NOW })
    assert.equal(payload.store.orders[0].status, 'pending_payment')
    assert.equal(payload.store.orders[0].payment.status, 'failed')
  })

  test('quote deposit paid → a confirmed order with deposit and balance, linked both ways', async () => {
    payload.store.requests.push({ id: 7, status: 'new', occasion: 'Anniversaire', eventDate: '2026-11-07T12:00:00.000Z', productionCategory: 'gateaux', capacityUnits: 1, cakeMessage: 'Bonne fête', customer: { firstName: 'Léa', email: 'lea@example.test', phone: '+14505550123', language: 'fr' } })
    await sendQuote(payload, { requestId: 7, totalCents: 18000, taxClass: 'zero', now: NOW })
    const r = await markDepositPaid(payload, { requestId: 7, provider: 'mock', reference: 'mock_2', amountCents: 5400, consent: { termsAcceptedAt: NOW.toISOString(), termsVersion: 'v1', bindingLanguage: 'fr' }, now: NOW })
    assert.equal(r.ok, true)
    assert.equal(r.request.status, 'deposit_paid')
    assert.equal(r.request.order, r.order.id)
    assert.deepEqual([r.order.source, r.order.status, r.order.totals.depositCents, r.order.totals.balanceCents, r.order.payment.kind], ['request', 'paid', 5400, 12600, 'deposit'])
    assert.equal(r.order.pickupWindowStart, undefined)
    assert.equal((await markDepositPaid(payload, { requestId: 7, provider: 'mock', amountCents: 5400, now: NOW })).already, true)
    assert.ok(payload.store.messages.some((m) => m.template === 'order_confirmed' && /heure à convenir/.test(m.body)))
  })
})

describe('Stripe webhook signature', () => {
  test('a signed payload verifies; a tampered one does not', () => {
    const secret = 'whsec_test_secret'
    const body = JSON.stringify({ id: 'evt_1', type: 'payment_intent.succeeded', data: { object: { id: 'pi_1', amount: 6000, metadata: { orderId: '1' } } } })
    const header = testSignature(body, secret)
    assert.equal(verifyWebhook(body, header, secret).id, 'evt_1')
    assert.throws(() => verifyWebhook(body.replace('6000', '1'), header, secret))
    assert.throws(() => verifyWebhook(body, 't=1,v1=00', secret))
    assert.throws(() => verifyWebhook(body, header, ''), { code: 'not_configured' })
  })
})

describe('Studio helpers', () => {
  test('capacityOn and recordCounterPayment for a phone order', async () => {
    const { capacityOn } = await import('../../../src/lib/ordering/create-order.js')
    const { recordCounterPayment } = await import('../../../src/lib/payments/settle.js')
    const NOW = local('2026-10-27', '10:00')
    const payload = fakePayload({ globals: { shop: shop({ ordering: { enabled: false } }), business: {} }, collections: { products: [cake()], 'capacity-pools': pools(), orders: [], requests: [], messages: [] } })
    const { order } = await createOrder(payload, { source: 'phone', items: [{ productId: 11, qty: 2 }], pickup: { date: '2026-10-31', windowStart: '11:00' }, customer: { firstName: 'Marc', phone: '4505550199' }, payment: { provider: 'counter' }, now: NOW })
    assert.deepEqual(await capacityOn(payload, { date: '2026-10-31', category: 'gateaux', now: NOW }), { date: '2026-10-31', category: 'gateaux', limit: 6, used: 2 })
    assert.ok(payload.store.messages.some((m) => m.template === 'order_confirmed' && m.channel === 'sms'))
    const r = await recordCounterPayment(payload, { orderId: order.id, now: NOW })
    assert.deepEqual([r.order.totals.balanceCents, r.order.payment.status, r.order.status], [0, 'paid', 'paid'])
    assert.equal((await recordCounterPayment(payload, { orderId: order.id, now: NOW })).already, true)
  })
})
