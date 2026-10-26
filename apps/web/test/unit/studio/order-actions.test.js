// Order actions through the engine: « Marquer prête » texts after the undo window and « Annuler » stops it;
// hand-over by code or « Client reconnu »; bulk; the state machine and the role matrix still apply.
import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { fakePayload } from '../ordering/fake-payload.js'
import { perform, undo, UNDO_SECONDS } from '../../../src/lib/studio/actions/index.js'

const lea = { id: 2, role: 'comptoir', name: 'Léa', active: true }
const owner = { id: 1, role: 'proprietaire', name: 'Proprio', active: true }
const device = { id: 't', kind: 'tablette', shared: true }
const business = { name: 'Pâtisserie Coco Vanille', phoneDisplay: '450-372-7177', address: { street: '3, rue Court', city: 'Granby' } }
const shopG = { hours: [{ day: 'Saturday', opens: '09:00', closes: '15:00' }] }
const order = (id, status, extra = {}) => ({ id, number: 1000 + id, status, locale: 'fr', customer: { firstName: 'Julie', lastName: 'T.', phone: '+15145550101' }, pickupDate: '2026-10-31T12:00:00.000Z', pickupWindowStart: '10:15', pickupWindowEnd: '10:30', pickupCode: '4821', items: [{ title: 'Paris-Brest', qty: 1 }], totals: { totalCents: 4800, balanceCents: 0 }, payment: { provider: 'mock', status: 'paid' }, timeline: [], ...extra })
const setup = (orders) => fakePayload({ globals: { business, shop: shopG }, collections: { orders } })

describe('« Marquer prête »', () => {
  test('status Prête, texto queued after the undo window', async () => {
    const payload = setup([order(42, 'paid')])
    const now = new Date()
    const r = await perform(payload, { user: lea, device, type: 'order.ready', input: { orderId: 42 }, now })
    assert.ok(r.ok, r.message)
    assert.equal(payload.store.orders[0].status, 'ready')
    const [sms] = payload.store.messages
    assert.equal(sms.template, 'order_ready')
    assert.equal(sms.status, 'queued')
    assert.ok(new Date(sms.sendAfter).getTime() >= now.getTime() + UNDO_SECONDS * 1000, 'the texto waits for the undo window')
    assert.match(r.message, /texto à Julie T\./)
  })

  test('« Annuler » inside the window: back to Payée, nothing leaves', async () => {
    const payload = setup([order(42, 'paid')])
    const r = await perform(payload, { user: lea, device, type: 'order.ready', input: { orderId: 42 } })
    const u = await undo(payload, { user: lea, device, id: r.undo.id })
    assert.ok(u.ok, u.message)
    assert.equal(payload.store.orders[0].status, 'paid')
    assert.equal(payload.store.messages[0].status, 'cancelled')
  })

  test('a cancelled order is refused with the reason', async () => {
    const payload = setup([order(42, 'cancelled')])
    const r = await perform(payload, { user: lea, device, type: 'order.ready', input: { orderId: 42 } })
    assert.equal(r.ok, false)
    assert.match(r.message, /la commande 1042 a été annulée/)
    assert.equal((payload.store.messages || []).length, 0)
  })

  test('bulk: the ready ones, the others skipped', async () => {
    const payload = setup([order(1, 'paid'), order(2, 'paid'), order(3, 'picked_up')])
    const r = await perform(payload, { user: lea, device, type: 'order.bulkReady', input: { orderIds: ['1', '2', '3'] } })
    assert.ok(r.ok)
    assert.deepEqual(payload.store.orders.map((o) => o.status), ['ready', 'ready', 'picked_up'])
    assert.equal(payload.store.messages.length, 2)
    await undo(payload, { user: lea, id: r.undo.id })
    assert.deepEqual(payload.store.orders.map((o) => o.status), ['paid', 'paid', 'picked_up'])
  })
})

describe('« Remettre la commande »', () => {
  test('wrong code refused; right code or « Client reconnu » → Récupérée', async () => {
    const payload = setup([order(42, 'ready'), order(43, 'ready')])
    const wrong = await perform(payload, { user: lea, device, type: 'order.pickup', input: { orderId: 42, code: '1111' } })
    assert.equal(wrong.code, 'code')
    assert.equal(payload.store.orders[0].status, 'ready')
    const ok = await perform(payload, { user: lea, device, type: 'order.pickup', input: { orderId: 42, code: '4821' } })
    assert.ok(ok.ok)
    assert.equal(payload.store.orders[0].status, 'picked_up')
    const known = await perform(payload, { user: lea, device, type: 'order.pickup', input: { orderId: 43, recognized: 'true' } })
    assert.ok(known.ok)
    assert.equal(payload.store.orders[1].status, 'picked_up')
  })

  test('a balance due is recorded as paid at the counter, and undone with the hand-over', async () => {
    const payload = setup([order(42, 'ready', { totals: { totalCents: 4800, balanceCents: 4800 }, payment: { provider: 'counter', status: 'pending' } })])
    const r = await perform(payload, { user: lea, device, type: 'order.pickup', input: { orderId: 42, recognized: 'true' } })
    assert.match(r.message, /solde 48,00\s\$ encaissé/)
    assert.equal(payload.store.orders[0].totals.balanceCents, 0)
    assert.equal(payload.store.orders[0].payment.status, 'paid')
    await undo(payload, { user: lea, id: r.undo.id })
    assert.equal(payload.store.orders[0].status, 'ready')
    assert.equal(payload.store.orders[0].totals.balanceCents, 4800)
  })
})

describe('the customer is already at the counter', () => {
  test('a paid order is handed over directly; undo puts it back to Payée', async () => {
    const payload = setup([order(42, 'paid')])
    const r = await perform(payload, { user: lea, device, type: 'order.pickup', input: { orderId: 42, code: '4821' } })
    assert.ok(r.ok, r.message)
    assert.equal(payload.store.orders[0].status, 'picked_up')
    const u = await undo(payload, { user: lea, id: r.undo.id })
    assert.match(u.message, /Payée/)
    assert.equal(payload.store.orders[0].status, 'paid')
  })

  test('« Prête » then « Remettre »: the queued « vous attend au comptoir » is cancelled', async () => {
    const payload = setup([order(42, 'paid')])
    await perform(payload, { user: lea, device, type: 'order.ready', input: { orderId: 42 } })
    assert.equal(payload.store.messages[0].status, 'queued')
    const r = await perform(payload, { user: lea, device, type: 'order.pickup', input: { orderId: 42, recognized: 'true' } })
    assert.ok(r.ok)
    assert.equal(payload.store.messages[0].status, 'cancelled')
  })
})

describe('money actions', () => {
  test('Comptoir cannot cancel; the owner needs a reason and gets a 15-day refund timer', async () => {
    const payload = setup([order(42, 'paid')])
    assert.equal((await perform(payload, { user: lea, type: 'order.cancel', input: { orderId: 42, reason: 'x' } })).status, 403)
    assert.equal((await perform(payload, { user: owner, type: 'order.cancel', input: { orderId: 42 } })).code, 'reason_required')
    const r = await perform(payload, { user: owner, type: 'order.cancel', input: { orderId: 42, reason: 'Tempête' } })
    assert.ok(r.ok)
    assert.equal(payload.store.orders[0].status, 'cancelled')
    assert.ok(payload.store.orders[0].payment.refundDueBy)
    assert.equal(r.undo, null)
  })

  test('refund: owner only, step-up, then refunded (mock provider)', async () => {
    const payload = setup([order(42, 'cancelled', { payment: { provider: 'mock', status: 'paid', amountCents: 4800 } })])
    assert.equal((await perform(payload, { user: owner, type: 'order.refund', input: { orderId: 42, reason: 'Fermeture' } })).code, 'step_up')
    const r = await perform(payload, { user: owner, stepUp: true, type: 'order.refund', input: { orderId: 42, reason: 'Fermeture' } })
    assert.ok(r.ok, r.message)
    assert.equal(payload.store.orders[0].status, 'refunded')
    assert.equal(payload.store.orders[0].payment.status, 'refunded')
  })
})
