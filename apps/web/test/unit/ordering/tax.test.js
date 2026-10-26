// GST/QST per research/07 §6 and the totals shown before payment (07 O1). Prices are test placeholders.
import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { computeTaxes, taxBlocker } from '../../../src/lib/ordering/tax.js'
import { orderTotals, totalsRows, splitPayments } from '../../../src/lib/ordering/totals.js'

const nb = (s) => s.replace(/[  ]/g, ' ')
const pastry = (qty, extra = {}) => ({ cents: 450, qty, taxClass: 'rule', unitGrams: 120, ...extra })
const wholeCake = { cents: 6000, qty: 1, taxClass: 'rule', unitGrams: 1400 }

describe('tax decision table (07 §6)', () => {
  test('row 2: fewer than six single servings → GST; QST zero-rated from 2026-07-15', () => {
    assert.deepEqual(pick(computeTaxes([pastry(4)], '2026-11-07')), { gst: 90, qst: 0 })
    assert.deepEqual(pick(computeTaxes([pastry(4)], '2026-07-01')), { gst: 90, qst: 180 })
  })

  test('row 3: six or more single servings, mixed, are zero-rated', () => {
    assert.deepEqual(pick(computeTaxes([pastry(4), pastry(2, { cents: 375, unitGrams: 90 })], '2026-11-07')), { gst: 0, qst: 0 })
  })

  test('rows 4–5: a prepackaged pack is judged by its own count', () => {
    assert.equal(computeTaxes([pastry(1, { cents: 1600, packCount: 4 })], '2026-11-07').gst, 80)
    assert.equal(computeTaxes([pastry(1, { cents: 2400, packCount: 6 })], '2026-11-07').gst, 0)
  })

  test('row 6: over the single-serving line (whole cake) → zero-rated', () => {
    assert.deepEqual(pick(computeTaxes([wholeCake], '2026-11-07')), { gst: 0, qst: 0 })
  })

  test('row 1 and taxable items', () => {
    assert.deepEqual(pick(computeTaxes([{ cents: 425, qty: 2, taxClass: 'zero' }], '2026-11-07')), { gst: 0, qst: 0 })
    assert.deepEqual(pick(computeTaxes([{ cents: 1000, qty: 1, taxClass: 'taxable' }], '2026-11-07')), { gst: 50, qst: 100 })
  })

  test('the 10 §9 cart: TPS 0,90 $ · TVQ 0,00 $ · total 78,90 $', () => {
    const t = orderTotals([pastry(4), wholeCake], { supplyDate: '2026-11-07' })
    assert.deepEqual([t.subtotalCents, t.gstCents, t.qstCents, t.totalCents], [7800, 90, 0, 7890])
  })

  test('a product with no approved class cannot be taxed, so cannot be sold online (07 O13)', () => {
    assert.equal(taxBlocker({ taxClass: 'pending' }), 'tax_class_pending')
    assert.equal(taxBlocker({}), 'tax_class_pending')
    assert.equal(taxBlocker({ taxClass: 'rule' }), 'tax_weight_missing')
    assert.equal(taxBlocker({ taxClass: 'rule', unitGrams: 120 }), null)
    assert.throws(() => computeTaxes([{ cents: 100, qty: 1, taxClass: 'pending' }], '2026-11-07'), { code: 'tax_class_pending' })
  })
})

describe('totals', () => {
  test('never invents a price', () => {
    assert.throws(() => orderTotals([{ cents: null, qty: 1, taxClass: 'zero' }], { supplyDate: '2026-11-07' }), { code: 'price_missing' })
    assert.throws(() => orderTotals([], { supplyDate: '2026-11-07' }), { code: 'empty' })
  })

  test('TPS and TVQ lines are always shown, even at 0,00 $; no fee line', () => {
    const rows = totalsRows(orderTotals([wholeCake], { supplyDate: '2026-11-07' }))
    assert.deepEqual(rows.map((r) => r.key), ['subtotal', 'gst', 'qst', 'total'])
    assert.deepEqual(rows.map((r) => nb(r.text)), ['60,00 $', '0,00 $', '0,00 $', '60,00 $'])
    assert.equal(rows[1].label, 'TPS (5 %)')
    assert.equal(totalsRows(orderTotals([wholeCake], { supplyDate: '2026-11-07' }), 'en')[2].label, 'QST (9.975%)')
  })

  test('deposit and balance, tax split pro rata (placeholder until 07 §6 row 13 is answered)', () => {
    const t = orderTotals([{ cents: 18000, qty: 1, taxClass: 'taxable' }], { supplyDate: '2026-11-08', depositPercent: 30 })
    assert.equal(t.totalCents, 20696)
    assert.equal(t.depositCents, 6209)
    assert.equal(t.balanceCents, 14487)
    const [dep, bal] = t.split
    assert.equal(dep.gstCents + bal.gstCents, t.gstCents)
    assert.equal(dep.qstCents + bal.qstCents, t.qstCents)
    assert.deepEqual(totalsRows(t).map((r) => r.key).slice(-2), ['deposit', 'balance'])
  })

  test('no deposit percent → paid in full', () => {
    assert.equal(splitPayments({ totalCents: 1000, gstCents: 0, qstCents: 0 }, null).deposit, null)
    assert.equal(orderTotals([wholeCake], { supplyDate: '2026-11-07' }).depositCents, null)
  })
})

function pick({ gst, qst }) {
  return { gst, qst }
}
