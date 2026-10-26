// Aujourd'hui and Commandes logic (16 §3.1–§3.2): late first, due-soon chips, the forward button, the summary
// line, the production list and what changed since it was printed. Placeholder data only.
import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { pickupState, sortPickups, pickupSummary, forwardAction, productionList, productionChanges, itemsLine } from '../../../src/lib/studio/orders.js'

const day = '2026-10-31'
const at = (hhmm) => new Date(`${day}T${hhmm}:00-04:00`)
const order = (n, start, status = 'paid', extra = {}) => ({ id: n, number: n, status, pickupDate: `${day}T12:00:00.000Z`, pickupWindowStart: start, pickupWindowEnd: start ? `${start.slice(0, 3)}${String(Number(start.slice(3)) + 15).padStart(2, '0')}` : null, items: [{ title: 'Paris-Brest', qty: 1, productionCategory: 'patisseries', productionDate: day }], ...extra })

describe('pickup clock', () => {
  test('late once the window is over and the order is still here', () => {
    assert.equal(pickupState(order(1, '10:00'), at('10:20')).late, true)
    assert.equal(pickupState(order(1, '10:00', 'ready'), at('10:20')).late, true)
    assert.equal(pickupState(order(1, '10:00', 'picked_up'), at('10:20')).late, false)
  })
  test('« Dans 15 min · pas prête » only for paid orders', () => {
    const s = pickupState(order(1, '10:15'), at('10:02'))
    assert.equal(s.dueSoon, true)
    assert.equal(s.minutesTo, 13)
    assert.equal(pickupState(order(1, '10:15', 'ready'), at('10:02')).dueSoon, false)
    assert.equal(pickupState(order(1, '10:45'), at('10:02')).dueSoon, false)
  })
  test('late orders move to the top, then by time, no-window last, picked up at the end', () => {
    const list = [order(4, null), order(2, '11:00'), order(5, '09:00', 'picked_up'), order(3, '10:30'), order(1, '09:15')]
    assert.deepEqual(sortPickups(list, at('10:00')).map((o) => o.number), [1, 3, 2, 4, 5])
  })
})

describe('summary and forward button', () => {
  test('« 4 cueillettes · 1 prête · 1 en retard · 1 récupérée »', () => {
    const list = [order(1, '09:00'), order(2, '10:30', 'ready'), order(3, '11:00'), order(4, '09:00', 'picked_up'), order(5, '09:00', 'cancelled')]
    assert.equal(pickupSummary(list, at('10:00')).text, '4 cueillettes · 1 prête · 1 en retard · 1 récupérée')
  })
  test('one forward action per status', () => {
    assert.equal(forwardAction({ status: 'paid' }), 'ready')
    assert.equal(forwardAction({ status: 'ready' }), 'pickup')
    assert.equal(forwardAction({ status: 'not_picked_up' }), 'pickup')
    for (const s of ['pending_payment', 'picked_up', 'cancelled', 'refunded']) assert.equal(forwardAction({ status: s }), null)
  })
  test('items line', () => assert.equal(itemsLine({ items: [{ qty: 2, title: 'Croissant', variantLabel: 'À l’unité' }, { qty: 1, title: 'Paris-Brest' }] }), '2 × Croissant (À l’unité), 1 × Paris-Brest'))
})

describe('production list (10 §7)', () => {
  const orders = [
    order(1042, '10:00', 'paid', { items: [{ title: 'Paris-Brest', qty: 2, productionCategory: 'patisseries', productionDate: day }] }),
    order(1047, '11:00', 'ready', { items: [{ title: 'Paris-Brest', qty: 1, productionCategory: 'patisseries', productionDate: day }] }),
    order(1051, '11:00', 'paid', { allergyNote: 'noix', items: [{ title: 'Gâteau aux framboises', variantLabel: '8 po', qty: 1, message: 'Joyeux 40e Marie', productionCategory: 'gateaux', productionDate: day }] }),
    order(1060, '11:00', 'cancelled', { items: [{ title: 'Paris-Brest', qty: 5, productionCategory: 'patisseries', productionDate: day }] }),
    order(1061, '11:00', 'paid', { items: [{ title: 'Paris-Brest', qty: 9, productionCategory: 'patisseries', productionDate: '2026-11-01' }] }),
  ]
  const list = productionList(orders, day, { categoryLabels: { gateaux: 'Gâteaux', patisseries: 'Pâtisseries' } })
  test('grouped by category and product, cancelled and other days left out', () => {
    assert.deepEqual(list.map((g) => [g.label, g.total]), [['Gâteaux', 1], ['Pâtisseries', 3]])
    assert.deepEqual(list[1].rows[0].orders, [1042, 1047])
  })
  test('cake messages and an allergy flag, never the note itself', () => {
    const cake = list[0].rows[0]
    assert.equal(cake.allergy, true)
    assert.deepEqual(cake.messages, [{ number: 1051, text: 'Joyeux 40e Marie' }])
    assert.ok(!JSON.stringify(list).includes('noix'))
  })
  test('« Modifié après impression : +1 Paris-Brest (1052) »', () => {
    const after = productionList([...orders, order(1052, '12:00', 'paid', { items: [{ title: 'Paris-Brest', qty: 1, productionCategory: 'patisseries', productionDate: day }] })], day)
    assert.deepEqual(productionChanges(list, after), [{ title: 'Paris-Brest', variantLabel: '', diff: 1, orders: [1052] }])
    assert.deepEqual(productionChanges(list, list), [])
  })
})
