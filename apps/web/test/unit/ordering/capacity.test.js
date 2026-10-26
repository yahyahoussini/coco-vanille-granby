// Capacity pools per production category per day, and the Québec statutory-holiday suggestions.
import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { capacityLimit, poolsCheck, usageFrom, needFor, capacitySummary } from '../../../src/lib/ordering/capacity.js'
import { quebecHolidays, easterSunday, holidaySuggestions } from '../../../src/lib/ordering/holidays.js'
import { productLine, lineBlockers } from '../../../src/lib/ordering/lines.js'
import { pools, cake, shop } from './fixtures.js'

describe('capacity pools', () => {
  test('date override > weekday > default; nothing set → null (not orderable online)', () => {
    const p = pools({ gateaux: { defaultPerDay: 6, perWeekday: [{ day: 'Saturday', capacity: 10 }], overrides: [{ date: '2026-12-24T12:00:00.000Z', capacity: 20 }] } })
    assert.equal(capacityLimit(p, 'gateaux', '2026-10-29'), 6)
    assert.equal(capacityLimit(p, 'gateaux', '2026-10-31'), 10)
    assert.equal(capacityLimit(p, 'gateaux', '2026-12-24'), 20)
    assert.equal(capacityLimit(p, 'traiteur', '2026-10-29'), null)
    assert.equal(capacityLimit([{ productionCategory: 'gateaux' }], 'gateaux', '2026-10-29'), null)
  })

  test('production day = pickup day − offset; units = qty × capacity units', () => {
    const line = productLine(cake({ productionOffsetDays: 1, capacityUnits: 2 }), 0, 3)
    assert.deepEqual(needFor([line], '2026-10-31'), [{ date: '2026-10-30', category: 'gateaux', units: 6 }])
  })

  test('a full pool and a missing pool are refused with their reason', () => {
    const usage = usageFrom({ orders: [{ status: 'paid', pickupDate: '2026-10-31T12:00:00.000Z', items: [{ qty: 5, units: 5, productionCategory: 'gateaux' }] }] })
    const line = productLine(cake(), 0, 2)
    assert.equal(poolsCheck([line], '2026-10-31', { pools: pools(), usage }).problems[0].reason, 'capacity_full')
    assert.equal(poolsCheck([productLine(cake(), 0, 1)], '2026-10-31', { pools: pools(), usage }).ok, true)
    assert.equal(poolsCheck([line], '2026-10-31', { pools: [], usage }).problems[0].reason, 'capacity_missing')
    assert.deepEqual(capacitySummary(pools(), usage, '2026-10-31', 'gateaux'), { date: '2026-10-31', category: 'gateaux', limit: 6, used: 5 })
  })

  test('open quotes hold their day until they expire; a confirmed request with an order counts through the order', () => {
    const now = new Date('2026-10-27T14:00:00Z')
    const usage = usageFrom({
      now,
      requests: [
        { status: 'quoted', eventDate: '2026-11-08T12:00:00.000Z', productionCategory: 'gateaux', quote: { validUntil: '2026-10-30T14:00:00Z' } },
        { status: 'quoted', eventDate: '2026-11-08T12:00:00.000Z', productionCategory: 'gateaux', quote: { validUntil: '2026-10-27T13:00:00Z' } },
        { status: 'deposit_paid', eventDate: '2026-11-08T12:00:00.000Z', productionCategory: 'gateaux', order: 5 },
        { status: 'new', eventDate: '2026-11-08T12:00:00.000Z', productionCategory: 'gateaux' },
      ],
    })
    assert.equal(usage.pools.get('2026-11-08|gateaux'), 1)
  })
})

describe('line blockers (zero invention)', () => {
  test('a complete product has none', () => {
    const p = cake()
    assert.deepEqual(lineBlockers(p, productLine(p, 0, 1)), [])
  })

  test('missing price, tax class, lead time, online flag; messages need the owner’s maximum', () => {
    const p = cake({ variants: [{ label: '8 po' }], taxClass: 'pending', leadTimeHours: 0, onlineOrderable: false, cakeMessageMax: null })
    const codes = lineBlockers(p, productLine(p, 0, 1, { message: 'Bonne fête' }))
    for (const c of ['price_missing', 'tax_class_pending', 'lead_time_missing', 'not_online', 'message_not_allowed']) assert.ok(codes.includes(c), c)
    assert.ok(!lineBlockers(p, productLine(p, 0, 1), { source: 'phone' }).includes('not_online'))
    const long = cake()
    assert.deepEqual(lineBlockers(long, productLine(long, 0, 1, { message: 'x'.repeat(31) })), ['message_too_long'])
  })

  test('sold out or discontinued products cannot be booked', () => {
    const p = cake({ availability: 'soldout', soldOutUntil: '2099-01-01T00:00:00Z' })
    assert.deepEqual(lineBlockers(p, productLine(p, 0, 1), { shop: shop() }), ['product_soldout'])
  })
})

describe('Québec statutory holidays (10 §3.4)', () => {
  test('Easter dates', () => {
    assert.equal(easterSunday(2026), '2026-04-05')
    assert.equal(easterSunday(2027), '2027-03-28')
    assert.equal(easterSunday(2028), '2028-04-16')
  })

  test('2026 and 2027 match the 10 §3.4 table', () => {
    const d = (y) => quebecHolidays(y).map((h) => h.date)
    assert.deepEqual(d(2026), ['2026-01-01', '2026-04-03', '2026-04-06', '2026-05-18', '2026-06-24', '2026-07-01', '2026-09-07', '2026-10-12', '2026-12-25'])
    assert.deepEqual(d(2027), ['2027-01-01', '2027-03-26', '2027-03-29', '2027-05-24', '2027-06-24', '2027-07-01', '2027-09-06', '2027-10-11', '2027-12-25'])
    assert.deepEqual(d(2028), ['2028-01-01', '2028-04-14', '2028-04-17', '2028-05-22', '2028-06-24', '2028-07-01', '2028-09-04', '2028-10-09', '2028-12-25'])
  })

  test('suggested as « à confirmer », skipping past dates and days already set', () => {
    const s = holidaySuggestions({ specialDays: [{ date: '2026-12-25T12:00:00.000Z', state: 'closed' }] }, { fromISO: '2026-10-26' })
    assert.equal(s[0].date, '2027-01-01')
    assert.ok(s.every((x) => x.state === 'to_confirm'))
    assert.equal(s.length, 18)
  })
})
