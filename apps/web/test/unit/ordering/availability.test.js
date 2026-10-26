// Earliest pickup, bookable days and windows, closures and the product availability state (10 §3, 06 k).
import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { onlineState, earliestReady, bookableDays, dayAvailability, firstBookable, readyLabel, cutoffLine, productOfferState } from '../../../src/lib/ordering/availability.js'
import { productLine } from '../../../src/lib/ordering/lines.js'
import { usageFrom } from '../../../src/lib/ordering/capacity.js'
import { openWindows, closestWindows } from '../../../src/lib/ordering/slots.js'
import { shop, pools, cake, croissant, local } from './fixtures.js'

const line = (p, qty = 1) => productLine(p, 0, qty)
const nb = (s) => s.replace(/[  ]/g, ' ')

describe('online state', () => {
  test('no hours → no online slots, and the reason says why', () => {
    const s = shop({ hours: [] })
    assert.equal(onlineState(s, local('2026-10-27', '10:00')).reason, 'hours')
    const r = bookableDays([line(cake())], s, { now: local('2026-10-27', '10:00'), pools: pools() })
    assert.deepEqual(r.days, [])
    assert.equal(r.reason, 'hours')
  })

  test('ordering disabled → request form for the public; Studio phone orders still work', () => {
    const s = shop({ ordering: { enabled: false } })
    assert.equal(onlineState(s).reason, 'disabled')
    assert.equal(onlineState(s, new Date(), { source: 'phone' }).open, true)
  })

  test('online pause blocks the web until its end, never Studio', () => {
    const now = local('2026-10-27', '10:00')
    const s = shop({ onlinePause: { active: true, until: '2026-10-28T12:00:00.000Z' } })
    assert.equal(onlineState(s, now).reason, 'paused')
    assert.equal(onlineState(s, now, { source: 'phone' }).open, true)
    assert.equal(onlineState(s, local('2026-10-29', '10:00')).open, true)
  })

  test('a closure with no end closes everything; with an end, windows resume after it', () => {
    const now = local('2026-10-27', '10:00')
    assert.equal(onlineState(shop({ closure: { active: true } }), now).reason, 'closure')
    const s = shop({ closure: { active: true, until: local('2026-10-30', '12:00').toISOString() } })
    const d = dayAvailability([line(cake())], s, '2026-10-30', { now, pools: pools() })
    assert.equal(d.windows[0].start, '12:00')
    assert.equal(dayAvailability([line(cake())], s, '2026-10-29', { now, pools: pools() }).reason, 'closed')
  })
})

describe('earliest pickup', () => {
  test('2-day cake ordered Tue 27 Oct at 15:30 (after the 14 h cut-off) → Fri 30 Oct (10 §3.3)', () => {
    const r = earliestReady([line(cake())], shop(), local('2026-10-27', '15:30'))
    assert.equal(r.firstDay, '2026-10-30')
    assert.equal(r.afterCutoff, true)
  })

  test('before the cut-off the count starts today', () => {
    assert.equal(earliestReady([line(cake())], shop(), local('2026-10-27', '13:59')).firstDay, '2026-10-29')
  })

  test('no cut-off set → counted from tomorrow (never over-promise) and the cut-off line is a marker', () => {
    const s = shop({ ordering: { nextDayCutoff: '' } })
    const r = earliestReady([line(cake())], s, local('2026-10-27', '08:00'))
    assert.equal(r.cutoffMissing, true)
    assert.equal(r.firstDay, '2026-10-30')
    assert.match(cutoffLine(s), /\[\[FACT NEEDED: heure limite pour le lendemain\]\]/)
    assert.equal(cutoffLine(shop()), 'Commandez avant 14 h pour demain')
    assert.equal(cutoffLine(shop(), 'en'), 'Order by 2 p.m. for tomorrow')
  })

  test('the slowest item wins', () => {
    const r = earliestReady([line(croissant()), line(cake())], shop(), local('2026-10-27', '10:00'))
    assert.equal(r.firstDay, '2026-10-29')
  })

  test('no lead time set → not orderable (the owner sets it)', () => {
    assert.equal(earliestReady([line(cake({ leadTimeHours: 0 }))], shop(), new Date()).error, 'lead_time_missing')
    assert.equal(earliestReady([line(cake({ leadTimeHours: null }))], shop(), new Date()).error, 'lead_time_missing')
  })

  test('same day: now + lead time + busy-mode minutes, first window after that', () => {
    const now = local('2026-10-29', '10:07')
    const first = firstBookable([line(croissant())], shop(), { now, pools: pools() })
    assert.deepEqual([first.date, first.start, first.end], ['2026-10-29', '14:15', '14:30'])
    const busy = shop({ busy: { extraMinutes: 30, until: local('2026-10-29', '18:00').toISOString() } })
    assert.equal(firstBookable([line(croissant())], busy, { now, pools: pools() }).start, '14:45')
  })

  test('after DST ends (1 Nov 2026) windows still follow Granby wall time', () => {
    const now = local('2026-11-05', '07:50', '-05:00')
    const first = firstBookable([line(croissant({ leadTimeHours: 1 }))], shop(), { now, pools: pools() })
    assert.deepEqual([first.date, first.start], ['2026-11-05', '09:00'])
  })
})

describe('bookable days and windows', () => {
  test('a full pool skips the day: first date Sat 31 Oct with 24 windows', () => {
    const now = local('2026-10-27', '15:30')
    const full = pools({ gateaux: { overrides: [{ date: '2026-10-30T12:00:00.000Z', capacity: 0 }] } })
    const { days } = bookableDays([line(cake())], shop(), { now, pools: full })
    assert.equal(days[0].date, '2026-10-31')
    assert.equal(days[0].windows.length, 24)
    assert.deepEqual(days[0].windows[0], { start: '09:00', end: '09:15', booked: 0, remaining: 4 })
    assert.equal(days[0].windows.at(-1).end, '15:00')
  })

  test('no capacity set for the category → not orderable online', () => {
    const r = bookableDays([line(cake())], shop(), { now: local('2026-10-27', '10:00'), pools: [] })
    assert.deepEqual(r.days, [])
    assert.equal(r.reason, 'capacity_missing')
  })

  test('closed and « à confirmer » special days: closed is skipped, to-confirm is not auto-closed', () => {
    const now = local('2026-10-27', '10:00')
    const s = shop({
      specialDays: [
        { date: '2026-10-29T12:00:00.000Z', state: 'closed', label: 'Inventaire' },
        { date: '2026-10-30T12:00:00.000Z', state: 'to_confirm', label: 'À confirmer' },
      ],
    })
    const { days } = bookableDays([line(cake())], s, { now, pools: pools() })
    assert.equal(days[0].date, '2026-10-30')
    assert.equal(days[0].toConfirm, true)
    assert.ok(!days.some((d) => d.date === '2026-10-29'))
  })

  test('special opening hours replace the week', () => {
    const s = shop({ specialDays: [{ date: '2026-12-24T12:00:00.000Z', state: 'special', opens: '08:00', closes: '12:00' }] })
    const w = openWindows(s, '2026-12-24', { now: local('2026-12-01', '10:00', '-05:00') })
    assert.deepEqual([w[0].start, w.at(-1).end, w.length], ['08:00', '12:00', 16])
  })

  test('maxDaysAhead caps the horizon', () => {
    const { days } = bookableDays([line(cake())], shop({ ordering: { maxDaysAhead: 5 } }), { now: local('2026-10-27', '10:00'), pools: pools() })
    assert.deepEqual(days.map((d) => d.date), ['2026-10-29', '2026-10-30', '2026-10-31'])
  })

  test('paid/ready orders and live 10-min holds fill windows; expired holds and cancelled orders do not', () => {
    const now = local('2026-10-27', '10:00')
    const at = (status, extra = {}) => ({ status, pickupDate: '2026-10-31T12:00:00.000Z', pickupWindowStart: '09:00', items: [{ qty: 1, units: 1, productionCategory: 'gateaux' }], ...extra })
    const usage = usageFrom({
      now,
      orders: [
        at('paid'),
        at('ready'),
        at('pending_payment', { holdExpiresAt: new Date(now.getTime() + 5 * 60e3).toISOString() }),
        at('pending_payment', { holdExpiresAt: new Date(now.getTime() - 60e3).toISOString() }),
        at('cancelled'),
      ],
    })
    const d = dayAvailability([line(cake())], shop(), '2026-10-31', { now, pools: pools(), usage })
    assert.deepEqual(d.windows[0], { start: '09:00', end: '09:15', booked: 3, remaining: 1 })
    const usage4 = usageFrom({ now, orders: [at('paid'), at('paid'), at('ready'), at('picked_up')] })
    assert.equal(dayAvailability([line(cake())], shop(), '2026-10-31', { now, pools: pools(), usage: usage4 }).windows[0].start, '09:15')
  })

  test('closest windows to a taken one', () => {
    const w = [{ start: '10:00', remaining: 1 }, { start: '10:15', remaining: 0 }, { start: '10:30', remaining: 2 }, { start: '10:45', remaining: 1 }]
    assert.deepEqual(closestWindows(w, '10:15').map((x) => x.start), ['10:00', '10:30'])
  })

  test('seasonal items only on the season pickup dates, only while pre-orders are open', () => {
    const season = { key: 'noel', preorderOpensAt: '2026-11-01T04:00:00.000Z', preorderClosesAt: '2026-12-20T04:00:00.000Z', pickupDates: [{ date: '2026-12-19T12:00:00.000Z' }, { date: '2026-12-24T12:00:00.000Z' }] }
    const buche = cake({ season })
    const s = shop({ ordering: { maxDaysAhead: 60 } })
    const before = bookableDays([line(buche)], s, { now: local('2026-10-27', '10:00'), pools: pools() })
    assert.equal(before.reason, 'season_closed')
    const open = bookableDays([productLine(buche, 0, 1, { now: local('2026-11-02', '10:00', '-05:00') })], s, { now: local('2026-11-02', '10:00', '-05:00'), pools: pools() })
    assert.deepEqual(open.days.map((d) => d.date), ['2026-12-19', '2026-12-24'])
  })
})

describe('product offer state (06 k)', () => {
  const now = local('2026-10-27', '10:00')

  test('instock and orderable online → InStock + « Prête dès … »', () => {
    const st = productOfferState(cake(), shop(), now, { pools: pools() })
    assert.equal(st.state, 'disponible')
    assert.equal(st.schemaAvailability, 'https://schema.org/InStock')
    assert.equal(st.label, 'Prête dès jeudi 29 oct.')
    assert.equal(st.orderable, true)
    assert.equal(productOfferState(cake(), shop(), now, { pools: pools(), locale: 'en' }).label, 'Ready Thursday, Oct 29')
  })

  test('ready labels: today, tomorrow, a day', () => {
    assert.equal(nb(readyLabel({ date: '2026-10-29', start: '14:15' }, local('2026-10-29', '10:07'))), 'Prête dès aujourd’hui, 14 h 15')
    assert.equal(readyLabel({ date: '2026-10-30', start: '09:00' }, local('2026-10-29', '10:07')), 'Prête dès demain')
    assert.equal(readyLabel({ date: '2026-11-01', start: '09:00' }, local('2026-10-29', '10:07')), 'Prête dès dimanche 1er nov.')
  })

  test('missing hours → InStock with a visible marker, never a date', () => {
    const st = productOfferState(cake(), shop({ hours: [] }), now, { pools: pools() })
    assert.equal(st.schemaAvailability, 'https://schema.org/InStock')
    assert.equal(st.orderable, false)
    assert.match(st.label, /\[\[FACT NEEDED: heures/)
  })

  test('not flagged for online orders → in store only', () => {
    assert.equal(productOfferState(cake({ onlineOrderable: false }), shop(), now).label, 'En boutique seulement')
  })

  test('« Épuisé » → SoldOut, with its return date when set; it ends on its own', () => {
    const st = productOfferState(cake({ availability: 'soldout', soldOutUntil: '2026-10-29T12:00:00.000Z' }), shop(), now)
    assert.equal(st.schemaAvailability, 'https://schema.org/SoldOut')
    assert.equal(st.label, 'Épuisé · De retour le jeudi 29 oct.')
    const later = productOfferState(cake({ availability: 'soldout', soldOutUntil: '2026-10-29T12:00:00.000Z' }), shop(), local('2026-10-30', '10:00'), { pools: pools() })
    assert.equal(later.state, 'disponible')
    // No end date: sold out until the next opening after it was marked.
    const marked = cake({ availability: 'soldout', updatedAt: local('2026-10-29', '15:00').toISOString() })
    assert.equal(productOfferState(marked, shop(), local('2026-10-29', '16:00')).state, 'epuise_du_jour')
    assert.equal(productOfferState(marked, shop(), local('2026-10-30', '09:30'), { pools: pools() }).state, 'disponible')
  })

  test('returning seasonal item → BackOrder + date; never-sold item → PreOrder + date', () => {
    const back = productOfferState(cake({ availability: 'backorder', availabilityDate: '2026-12-19T12:00:00.000Z', everSold: true }), shop(), now)
    assert.deepEqual([back.state, back.schemaAvailability, back.availabilityDate, back.label], ['retour_saison', 'https://schema.org/BackOrder', '2026-12-19', 'De retour le samedi 19 déc.'])
    const fresh = productOfferState(cake({ availability: 'preorder', availabilityDate: '2026-12-19T12:00:00.000Z', everSold: false }), shop(), now)
    assert.deepEqual([fresh.state, fresh.schemaAvailability, fresh.label], ['nouveaute', 'https://schema.org/PreOrder', 'Précommande · prête dès le samedi 19 déc.'])
  })

  test('a « preorder » product sold before is a BackOrder (06 corrects v0a)', () => {
    const st = productOfferState(cake({ availability: 'preorder', availabilityDate: '2026-12-19T12:00:00.000Z', everSold: true }), shop(), now)
    assert.equal(st.schemaAvailability, 'https://schema.org/BackOrder')
  })

  test('a dated state with no date shows a marker and no date', () => {
    const st = productOfferState(cake({ availability: 'backorder', everSold: true }), shop(), now)
    assert.equal(st.availabilityDate, null)
    assert.match(st.label, /FACT NEEDED/)
  })

  test('an in-sale seasonal item whose pickups are later takes the dated state from the season', () => {
    const season = { key: 'noel', preorderOpensAt: '2026-10-01T04:00:00.000Z', preorderClosesAt: '2026-12-20T04:00:00.000Z', pickupDates: [{ date: '2026-12-19T12:00:00.000Z' }] }
    const st = productOfferState(cake({ season, everSold: true }), shop({ ordering: { maxDaysAhead: 60 } }), now, { pools: pools() })
    assert.deepEqual([st.state, st.availabilityDate, st.orderable], ['retour_saison', '2026-12-19', true])
  })

  test('discontinued → Discontinued', () => {
    assert.equal(productOfferState(cake({ availability: 'discontinued' }), shop(), now).schemaAvailability, 'https://schema.org/Discontinued')
  })
})
