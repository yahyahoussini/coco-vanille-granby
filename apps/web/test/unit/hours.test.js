// Special days and the « Ouvert » pill (components/site/hours.js), and the special hours in the Bakery node.
import test, { describe } from 'node:test'
import assert from 'node:assert/strict'
import { upcomingSpecialDays, openState, pillSchedule } from '../../src/components/site/hours.js'
import { bakeryNode, graph } from '../../src/lib/schema.js'

// Placeholder hours for tests only, never owner facts.
const at = (iso, hhmm) => new Date(`${iso}T${hhmm}:00-04:00`)
const shop = (over = {}) => ({
  hours: [
    { day: 'Thursday', opens: '09:00', closes: '16:30' },
    { day: 'Friday', opens: '09:00', closes: '16:30' },
  ],
  specialDays: [],
  closure: { active: false },
  ...over,
})

describe('upcoming special days', () => {
  test('from today, sorted, within the window; past and far days left out', () => {
    const s = shop({
      specialDays: [
        { date: '2026-12-24T12:00:00.000Z', state: 'special', opens: '09:00', closes: '14:00', label: 'Veille de Noël' },
        { date: '2026-10-29T12:00:00.000Z', state: 'closed', label: 'Fermeture exceptionnelle' },
        { date: '2026-10-20T12:00:00.000Z', state: 'closed' },
        { date: '2027-03-01T12:00:00.000Z', state: 'closed' },
      ],
    })
    const days = upcomingSpecialDays(s, { now: at('2026-10-27', '10:00'), days: 60 })
    assert.deepEqual(days.map((d) => [d.date, d.state]), [['2026-10-29', 'closed'], ['2026-12-24', 'special']])
    assert.equal(days[1].label, 'Veille de Noël')
  })
})

describe('open now (pill)', () => {
  test('regular week: open until closing, closed after', () => {
    assert.deepEqual(openState(shop(), at('2026-10-29', '10:00')), { open: true, closes: '16:30' })
    assert.deepEqual(openState(shop(), at('2026-10-29', '17:00')), { open: false })
  })

  test('a closed special day wins over the week; special hours replace it', () => {
    const closed = shop({ specialDays: [{ date: '2026-10-29T12:00:00.000Z', state: 'closed' }] })
    assert.deepEqual(openState(closed, at('2026-10-29', '10:00')), { open: false })
    const short = shop({ specialDays: [{ date: '2026-10-29T12:00:00.000Z', state: 'special', opens: '09:00', closes: '12:00' }] })
    assert.deepEqual(openState(short, at('2026-10-29', '11:00')), { open: true, closes: '12:00' })
    assert.deepEqual(openState(short, at('2026-10-29', '13:00')), { open: false })
  })

  test('an exceptional closure says closed until it ends', () => {
    const s = shop({ closure: { active: true, until: at('2026-10-30', '09:00').toISOString() } })
    assert.deepEqual(openState(s, at('2026-10-29', '10:00')), { open: false })
    assert.deepEqual(openState(s, at('2026-10-30', '10:00')), { open: true, closes: '16:30' })
  })

  test('unknown hours or a day « à confirmer » → no pill', () => {
    assert.equal(openState({ hours: [] }, at('2026-10-29', '10:00')), null)
    assert.equal(openState(shop({ specialDays: [{ date: '2026-10-29T12:00:00.000Z', state: 'to_confirm' }] }), at('2026-10-29', '10:00')), null)
  })

  test('the browser gets only what the pill needs', () => {
    const s = shop({ closure: { active: true, until: '2026-10-30T13:00:00.000Z', reason: 'tempete', message: 'x' }, specialDays: [{ date: '2026-10-28T12:00:00.000Z', state: 'closed', label: 'x' }] })
    const p = pillSchedule(s, at('2026-10-27', '10:00'))
    assert.deepEqual(Object.keys(p).sort(), ['closure', 'hours', 'specialDays'])
    assert.deepEqual(p.closure, { active: true, until: '2026-10-30T13:00:00.000Z' })
    assert.equal(p.specialDays.length, 1)
  })
})

describe('special hours in the Bakery node', () => {
  test('closed days are 00:00–00:00, special hours carry theirs, « à confirmer » is left out', () => {
    const days = [
      { date: '2026-10-29', state: 'closed' },
      { date: '2026-12-24', state: 'special', opens: '09:00', closes: '14:00' },
      { date: '2026-12-26', state: 'to_confirm' },
    ]
    const node = graph([bakeryNode({ name: 'Pâtisserie Coco Vanille' }, shop(), 'fr', days)])['@graph'][0]
    assert.deepEqual(node.specialOpeningHoursSpecification, [
      { '@type': 'OpeningHoursSpecification', validFrom: '2026-10-29', validThrough: '2026-10-29', opens: '00:00', closes: '00:00' },
      { '@type': 'OpeningHoursSpecification', validFrom: '2026-12-24', validThrough: '2026-12-24', opens: '09:00', closes: '14:00' },
    ])
    assert.equal(graph([bakeryNode({ name: 'x' }, shop(), 'fr')])['@graph'][0].specialOpeningHoursSpecification, undefined)
  })
})
