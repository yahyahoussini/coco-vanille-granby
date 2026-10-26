// Pure template logic: portions, price per serving, calculator matching, seasonal state, hours summary.
import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { servings, portionsText, inchesText, perPortionText, fromPriceCents, leadTimeText, parseGuests, matchSizes, seasonState, monthYear, availabilityLine } from '../../src/components/site/offer.js'
import { hoursSummary } from '../../src/components/site/hours.js'

const nb = (s) => s.replace(/ | /g, ' ')

describe('sizes and prices', () => {
  test('servings use the top of the range; nothing when the owner gave nothing', () => {
    assert.equal(servings({ portionsMin: 12, portionsMax: 16 }), 16)
    assert.equal(servings({ portionsMin: 8 }), 8)
    assert.equal(servings({}), null)
    assert.equal(servings({ portionsMin: 0 }), null)
  })

  test('portions and inches read the Québec way', () => {
    assert.equal(portionsText({ portionsMin: 12, portionsMax: 16 }, 'fr'), '12 à 16')
    assert.equal(portionsText({ portionsMin: 12, portionsMax: 16 }, 'en'), '12–16')
    assert.equal(portionsText({}, 'fr'), null)
    assert.equal(inchesText(8, 'fr'), '8 po (20 cm)')
    assert.equal(inchesText(8, 'en'), '8-inch (20 cm)')
  })

  test('price per serving only when both the price and the servings exist', () => {
    assert.equal(perPortionText({ priceCents: 4800 }, 'fr'), null)
    assert.equal(perPortionText({ portionsMin: 12 }, 'fr'), null)
    assert.equal(nb(perPortionText({ priceCents: 4800, portionsMin: 12 }, 'fr')), '4,00 $')
    assert.equal(nb(perPortionText({ priceCents: 4800, portionsMin: 12, portionsMax: 16 }, 'fr')), '3,00 $ à 4,00 $')
    assert.equal(perPortionText({ priceCents: 4800, portionsMin: 12, portionsMax: 16 }, 'en'), '$3.00–$4.00')
  })

  test('the "from" price is the lowest real price', () => {
    assert.equal(fromPriceCents({ variants: [{ priceCents: 5200 }, { priceCents: 4800 }, {}] }), 4800)
    assert.equal(fromPriceCents({ variants: [{ label: 'Format standard' }] }), null)
  })

  test('lead time: hours under two days, then days; 0 means not set', () => {
    assert.equal(leadTimeText(24, 'fr'), '24 h')
    assert.equal(leadTimeText(72, 'fr'), '3 jours')
    assert.equal(leadTimeText(72, 'en'), '3 days')
    assert.equal(leadTimeText(0, 'fr'), null)
  })
})

describe('calculator', () => {
  const cakes = [
    { id: 'a', title: 'Gâteau aux framboises', variants: [{ label: '6 po', portionsMin: 6, portionsMax: 8, priceCents: 3500 }, { label: '8 po', portionsMin: 12, portionsMax: 16, priceCents: 4800 }] },
    { id: 'b', title: 'Shortcake aux fraises', variants: [{ label: '10 po', portionsMin: 20, portionsMax: 24, priceCents: 6900 }, { label: 'sans portions' }] },
  ]

  test('?invites=N is parsed strictly', () => {
    assert.equal(parseGuests('20'), 20)
    assert.equal(parseGuests(['30']), 30)
    assert.equal(parseGuests(''), null)
    assert.equal(parseGuests('0'), null)
    assert.equal(parseGuests('2.5'), null)
    assert.equal(parseGuests('abc'), null)
    assert.equal(parseGuests('1001'), null)
  })

  test('sizes that feed the guests, smallest first', () => {
    const { known, matches, largest } = matchSizes(cakes, 14)
    assert.equal(known, 3)
    assert.equal(largest, 24)
    assert.deepEqual(matches.map((m) => m.variant.label), ['8 po', '10 po'])
  })

  test('no size is big enough → empty matches, largest known', () => {
    const { matches, largest } = matchSizes(cakes, 40)
    assert.equal(matches.length, 0)
    assert.equal(largest, 24)
  })

  test('no servings published → known is 0 (the template shows a marker)', () => {
    assert.equal(matchSizes([{ variants: [{ label: 'Format standard' }] }], 10).known, 0)
  })
})

describe('seasonal state machine', () => {
  const season = {
    preorderOpensAt: '2026-11-01T13:00:00.000Z',
    preorderClosesAt: '2026-12-20T05:00:00.000Z',
    pickupDates: [{ date: '2026-12-23T05:00:00.000Z' }, { date: '2026-12-24T05:00:00.000Z' }],
  }
  const at = (iso) => ({ now: new Date(iso) })

  test('no season or no dates → unknown (marker)', () => {
    assert.equal(seasonState(null).state, 'unknown')
    assert.equal(seasonState({ pickupDates: [] }).state, 'unknown')
  })

  test('Bientôt → Précommandes ouvertes → Complet → De retour en …', () => {
    assert.equal(seasonState(season, at('2026-10-26T12:00:00Z')).state, 'soon')
    assert.equal(seasonState(season, at('2026-11-15T12:00:00Z')).state, 'open')
    assert.equal(seasonState(season, at('2026-12-21T12:00:00Z')).state, 'full')
    const over = seasonState(season, at('2026-12-26T12:00:00Z'))
    assert.equal(over.state, 'over')
    assert.equal(monthYear(over.back, 'fr'), 'novembre 2027')
  })

  test('every season product sold out while open → Complet', () => {
    const products = [{ availability: 'soldout' }, { availability: 'soldout' }]
    assert.equal(seasonState(season, { ...at('2026-11-15T12:00:00Z'), products }).state, 'full')
  })
})

describe('availability date line (06 k)', () => {
  const labels = { soldOut: 'Épuisé aujourd’hui', backOn: 'De retour le', preorderFrom: 'Précommande · prêt dès le', inStock: 'En vente' }

  test('BackOrder and PreOrder carry their date, or ask for it', () => {
    assert.match(availabilityLine({ availability: 'backorder', availabilityDate: '2026-11-20T12:00:00Z' }, labels, 'fr').text, /^De retour le 20 novembre 2026$/)
    assert.match(availabilityLine({ availability: 'preorder', availabilityDate: '2026-11-20T12:00:00Z' }, labels, 'fr').text, /^Précommande · prêt dès le 20 novembre 2026$/)
    assert.equal(availabilityLine({ availability: 'backorder' }, labels, 'fr').missing, true)
    assert.equal(availabilityLine({ availability: 'soldout' }, labels, 'fr').text, 'Épuisé aujourd’hui')
  })
})

describe('hours summary', () => {
  const hours = [
    ['Wednesday', '08:30', '17:30'],
    ['Thursday', '08:30', '17:30'],
    ['Friday', '08:30', '17:30'],
    ['Saturday', '08:30', '17:30'],
    ['Sunday', '09:00', '17:00'],
  ].map(([day, opens, closes]) => ({ day, opens, closes }))

  test('groups consecutive days with the same hours', () => {
    assert.equal(hoursSummary(hours, 'fr'), 'du mercredi au samedi de 8 h 30 à 17 h 30, et le dimanche de 9 h à 17 h')
    assert.equal(hoursSummary(hours, 'en'), 'Wednesday to Saturday from 8:30 a.m. to 5:30 p.m., and Sunday from 9 a.m. to 5 p.m.')
  })

  test('a closed day breaks a group; empty hours → null', () => {
    const gap = hours.filter((h) => h.day !== 'Friday')
    assert.equal(hoursSummary(gap, 'fr'), 'du mercredi au jeudi de 8 h 30 à 17 h 30, le samedi de 8 h 30 à 17 h 30, et le dimanche de 9 h à 17 h')
    assert.equal(hoursSummary([], 'fr'), null)
  })
})
