// « Cette semaine » (16 §4.2): 5 numbers from orders, requests and reviews; ≤ 3 owner cards, missing facts first.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { fiveNumbers, weekCards, percentChange, weekBounds } from '../../../src/lib/studio/week.js'

test('5 numbers: online orders with the week-over-week change, requests, reviews replied in 24 h', () => {
  const orders = [
    { source: 'web', status: 'paid', totals: { totalCents: 4800 } },
    { source: 'web', status: 'picked_up', totals: { totalCents: 1200 } },
    { source: 'phone', status: 'paid', totals: { totalCents: 9900 } },
    { source: 'web', status: 'cancelled', totals: { totalCents: 5000 } },
  ]
  const n = fiveNumbers({
    orders,
    prevOrders: [{ source: 'web', status: 'paid', totals: { totalCents: 100 } }],
    requests: [{ status: 'new' }, { status: 'quoted' }, { status: 'deposit_paid' }],
    reviews: [
      { rating: 5, receivedAt: '2026-10-27T10:00:00Z', repliedAt: '2026-10-27T15:00:00Z' },
      { rating: 4, receivedAt: '2026-10-27T10:00:00Z', repliedAt: '2026-10-29T15:00:00Z' },
    ],
  })
  assert.equal(n.length, 5)
  assert.match(n[0].value, /^2 · 60,00\s\$ \+100 %$/)
  assert.equal(n[1].value, '3 reçues · 2 chiffrées')
  assert.equal(n[2].value, '2 nouveaux · 4,5 · 1/2 répondus en 24 h')
  assert.equal(n[3].muted, true)
})

test('cards: hours, deposit and prices missing come first, never more than 3', () => {
  const cards = weekCards({ shop: { hours: [], ordering: {} }, products: [{ id: 1, title: 'Paris-Brest', _status: 'published', variants: [{ label: 'x' }] }], pools: [], now: new Date('2026-10-28T12:00:00Z') })
  assert.equal(cards.length, 3)
  assert.deepEqual(cards.map((c) => c.key), ['hours', 'deposit', 'price'])
  assert.equal(cards[2].title, 'Valider le prix du Paris-Brest')
})

test('helpers', () => {
  assert.equal(percentChange(23, 20), 15)
  assert.equal(percentChange(3, 0), null)
  assert.equal(weekBounds(new Date('2026-10-28T12:00:00Z')).monday, '2026-10-26')
})
