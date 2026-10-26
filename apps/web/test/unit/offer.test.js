// Pure template logic: portions, price per serving, calculator matching, seasonal state, hours summary.
import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { servings, portionsText, inchesText, perPortionText, fromPriceCents, leadTimeText, parseGuests, matchSizes, seasonState, monthYear, offerBadge } from '../../src/components/site/offer.js'
import { productOfferState } from '../../src/lib/ordering/availability.js'
import { productNode } from '../../src/lib/schema.js'
import { shop, pools, cake, local } from './ordering/fixtures.js'
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

describe('availability badge and Offer from the ordering engine (06 k)', () => {
  const now = local('2026-10-27', '10:00')
  const url = 'https://cocovanillegranby.com/gateaux/gateau-aux-framboises/'
  const both = (product, sh = shop(), opts = { pools: pools() }) => {
    const state = productOfferState(product, sh, now, opts)
    return { badge: offerBadge(state, { orderingEnabled: Boolean(sh.ordering?.enabled) }), offer: productNode({ product, url, offer: state }).offers[0] }
  }

  test('bookable online → « Prête dès … » and InStock', () => {
    const { badge, offer } = both(cake())
    assert.deepEqual(badge, { tone: 'ready', text: 'Prête dès jeudi 29 oct.' })
    assert.equal(offer.availability, 'https://schema.org/InStock')
    assert.equal(offer.availabilityStarts, undefined)
  })

  test('BackOrder and PreOrder carry their date on the badge and in availabilityStarts', () => {
    const back = both(cake({ availability: 'backorder', availabilityDate: '2026-12-19T12:00:00.000Z', everSold: true }))
    assert.deepEqual(back.badge, { tone: 'later', text: 'De retour le samedi 19 déc.' })
    assert.deepEqual([back.offer.availability, back.offer.availabilityStarts], ['https://schema.org/BackOrder', '2026-12-19'])
    const fresh = both(cake({ availability: 'preorder', availabilityDate: '2026-12-19T12:00:00.000Z' }))
    assert.equal(fresh.badge.text, 'Précommande · prête dès le samedi 19 déc.')
    assert.deepEqual([fresh.offer.availability, fresh.offer.availabilityStarts], ['https://schema.org/PreOrder', '2026-12-19'])
  })

  test('a dated state without its date asks for it and never dates the Offer', () => {
    const { badge, offer } = both(cake({ availability: 'backorder', everSold: true }))
    assert.equal(badge.tone, 'later')
    assert.match(badge.text, /^\[\[FACT NEEDED: date de retour/)
    assert.equal(offer.availabilityStarts, undefined)
  })

  test('« Épuisé » → SoldOut, the badge says until when', () => {
    const { badge, offer } = both(cake({ availability: 'soldout', soldOutUntil: '2026-10-29T12:00:00.000Z' }))
    assert.deepEqual(badge, { tone: 'soldout', text: 'Épuisé · De retour le jeudi 29 oct.' })
    assert.equal(offer.availability, 'https://schema.org/SoldOut')
  })

  test('the capacity pools decide: a full pool gives no « Prête dès », a missing pool asks for it', () => {
    assert.equal(offerBadge(productOfferState(cake(), shop(), now, { pools: pools({ gateaux: { defaultPerDay: 0 } }) })), null)
    assert.match(offerBadge(productOfferState(cake(), shop(), now, { pools: [] })).text, /^\[\[FACT NEEDED: capacité de production/)
  })

  test('« En boutique seulement » only while online ordering is on; nothing when it is off', () => {
    const state = productOfferState(cake({ onlineOrderable: false }), shop(), now)
    assert.deepEqual(offerBadge(state, { orderingEnabled: true }), { tone: 'instore', text: 'En boutique seulement' })
    assert.equal(offerBadge(state, { orderingEnabled: false }), null)
    assert.equal(offerBadge(productOfferState(cake(), shop({ ordering: { enabled: false } }), now, { pools: pools() })), null)
  })

  test('missing hours with ordering on → the marker shows (owner to-do), the Offer stays InStock', () => {
    const { badge, offer } = both(cake(), shop({ hours: [] }))
    assert.match(badge.text, /\[\[FACT NEEDED: heures/)
    assert.equal(offer.availability, 'https://schema.org/InStock')
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
