// lib/schema: JSON-LD only from real values (no markers, no empty fields) and no self-serving review stars.
import test, { describe } from 'node:test'
import assert from 'node:assert/strict'
import { BAKERY_ID, WEBSITE_ID, bakeryNode, websiteNode, webPageNode, breadcrumbNode, productNode, graph } from '../../src/lib/schema.js'
import { marker, MARKER_RE } from '../../src/lib/facts.js'
import { SITE_ORIGIN } from '../../src/lib/routes.js'

// Collects every problem a crawler would see: undefined/null/'' values, markers, empty arrays/objects.
function problems(value, path = '$') {
  if (value === undefined || value === null || value === '') return [`${path} is empty`]
  if (typeof value === 'string') return MARKER_RE.test(value) ? [`${path} holds a marker`] : []
  if (typeof value === 'number') return Number.isFinite(value) ? [] : [`${path} is not a finite number`]
  if (Array.isArray(value)) {
    if (!value.length) return [`${path} is an empty array`]
    return value.flatMap((v, i) => problems(v, `${path}[${i}]`))
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value)
    if (!entries.length) return [`${path} is an empty object`]
    return entries.flatMap(([k, v]) => problems(v, `${path}.${k}`))
  }
  return []
}

const keysDeep = (value) =>
  value && typeof value === 'object' ? Object.entries(value).flatMap(([k, v]) => [k, ...keysDeep(v)]) : []

// Seed-like data (research/01, src/seed/index.js) with the fields the owner has not supplied yet.
const business = {
  name: 'Pâtisserie Coco Vanille',
  alternateName: ['Pâtisserie Cocovanille'],
  categorySentence: 'Pâtisserie Coco Vanille est une pâtisserie-boulangerie du centre-ville de Granby.',
  phone: '+14503727177',
  email: '',
  priceRange: marker('gamme de prix'),
  address: { street: '3, rue Court', city: 'Granby', region: 'QC', postalCode: 'J2G 4Y6', country: 'CA' },
  geo: { lat: 45.3995807, lng: -72.7250821 },
  google: { cid: '10789122976114705165' },
  sameAs: [
    { url: 'https://www.facebook.com/PatisserieCocoVanille/', verified: true },
    { url: 'https://www.instagram.com/coco_vanillegranby/', verified: false },
  ],
  languagesServed: ['fr'],
}

describe('bakeryNode', () => {
  test('is a Bakery with the stable site-wide @id', () => {
    const node = bakeryNode(business, { hours: [] }, 'fr')
    assert.equal(node['@type'], 'Bakery')
    assert.equal(node['@id'], `${SITE_ORIGIN}/#bakery`)
    assert.equal(BAKERY_ID, 'https://cocovanillegranby.com/#bakery')
  })

  test('emits no missing value once cleaned by graph()', () => {
    const out = graph([bakeryNode(business, { hours: [] }, 'fr')])
    assert.deepEqual(problems(out), [])
    const bakery = out['@graph'][0]
    assert.equal(bakery.priceRange, undefined, 'marker dropped')
    assert.equal(bakery.email, undefined, 'empty email dropped')
    assert.equal(bakery.openingHoursSpecification, undefined, 'no hours → no hours node')
  })

  test('works with no data at all (fresh database)', () => {
    const out = graph([bakeryNode(undefined, undefined, 'en'), websiteNode()])
    assert.deepEqual(problems(out), [])
    const bakery = out['@graph'].find((n) => n['@type'] === 'Bakery')
    assert.equal(bakery['@id'], BAKERY_ID)
  })

  // Known gap in lib/schema.js clean(): a nested node left with only "@type" is kept.
  // Reported to the integrator; flip to a normal test once clean() drops type-only nodes.
  test('an address made only of @type is removed', { todo: 'lib/schema.js clean() keeps @type-only nodes' }, () => {
    const bakery = graph([bakeryNode(undefined, undefined, 'fr')])['@graph'][0]
    assert.equal(bakery.address, undefined)
  })

  test('only verified sameAs profiles are listed', () => {
    const node = graph([bakeryNode(business, {}, 'fr')])['@graph'][0]
    assert.deepEqual(node.sameAs, ['https://www.facebook.com/PatisserieCocoVanille/'])
  })

  test('hours become OpeningHoursSpecification only when present', () => {
    const shop = { hours: [{ day: 'Wednesday', opens: '08:00', closes: '17:00' }] }
    const node = graph([bakeryNode(business, shop, 'fr')])['@graph'][0]
    assert.deepEqual(node.openingHoursSpecification, [{ '@type': 'OpeningHoursSpecification', dayOfWeek: 'Wednesday', opens: '08:00', closes: '17:00' }])
  })

  test('never emits aggregateRating or review, even when the data holds ratings', () => {
    const rated = { ...business, aggregateRating: { ratingValue: 4.8, reviewCount: 120 }, review: [{ reviewBody: 'Super' }], rating: 4.8 }
    const out = graph([bakeryNode(rated, {}, 'fr'), websiteNode(), webPageNode({ url: `${SITE_ORIGIN}/`, name: 'Accueil', locale: 'fr' })])
    const keys = keysDeep(out)
    assert.ok(!keys.includes('aggregateRating'), 'aggregateRating emitted')
    assert.ok(!keys.includes('review'), 'review emitted')
    assert.ok(!keys.includes('reviewRating'), 'reviewRating emitted')
  })

  test('map link and geo only from real values', () => {
    const node = graph([bakeryNode({ ...business, google: {}, geo: {} }, {}, 'fr')])['@graph'][0]
    assert.equal(node.hasMap, undefined)
    assert.equal(node.geo, undefined)
  })
})

describe('page nodes', () => {
  test('WebSite and WebPage link to the bakery', () => {
    const page = webPageNode({ url: `${SITE_ORIGIN}/carte/`, name: 'Carte', locale: 'fr', description: marker('description') })
    const out = graph([websiteNode(), page])
    assert.deepEqual(problems(out), [])
    const [site, web] = out['@graph']
    assert.equal(site['@id'], WEBSITE_ID)
    assert.deepEqual(site.publisher, { '@id': BAKERY_ID })
    assert.equal(web['@id'], `${SITE_ORIGIN}/carte/#webpage`)
    assert.equal(web.inLanguage, 'fr-CA')
    assert.equal(web.description, undefined, 'marker description dropped')
  })

  test('breadcrumb needs two crumbs', () => {
    assert.equal(breadcrumbNode(`${SITE_ORIGIN}/`, [{ name: 'Accueil', url: `${SITE_ORIGIN}/` }]), undefined)
    const crumb = breadcrumbNode(`${SITE_ORIGIN}/carte/`, [
      { name: 'Accueil', url: `${SITE_ORIGIN}/` },
      { name: 'Carte', url: `${SITE_ORIGIN}/carte/` },
    ])
    assert.equal(crumb.itemListElement.length, 2)
    assert.equal(crumb.itemListElement[1].position, 2)
  })

  test('graph drops falsy nodes', () => {
    const out = graph([websiteNode(), undefined, null, false])
    assert.equal(out['@graph'].length, 1)
    assert.equal(out['@context'], 'https://schema.org')
  })
})

describe('productNode', () => {
  const url = `${SITE_ORIGIN}/gateaux/gateau-aux-framboises/`

  test('no price → no offer (never an invented price)', () => {
    const product = { title: 'Gâteau aux framboises', variants: [{ label: 'Format standard' }], availability: 'instock' }
    const out = graph([productNode({ product, url })])
    assert.deepEqual(problems(out), [])
    assert.equal(out['@graph'][0].offers, undefined)
    assert.equal(out['@graph'][0].image, undefined)
  })

  test('real prices become CAD offers sold by the bakery', () => {
    const product = { title: 'Croissant', summary: 'Pur beurre.', availability: 'instock', variants: [{ label: 'Unité', priceCents: 375 }, { label: 'Boîte de 6' }] }
    const node = graph([productNode({ product, url })])['@graph'][0]
    assert.equal(node.offers.length, 1)
    assert.deepEqual(node.offers[0], {
      '@type': 'Offer',
      name: 'Unité',
      price: '3.75',
      priceCurrency: 'CAD',
      availability: 'https://schema.org/InStock',
      url,
      seller: { '@id': BAKERY_ID },
    })
  })

  test('availabilityStarts only for BackOrder / PreOrder', () => {
    const base = { title: 'Bûche', variants: [{ label: '6 portions', priceCents: 4200 }], availabilityDate: '2026-12-01' }
    const back = graph([productNode({ product: { ...base, availability: 'backorder' }, url })])['@graph'][0].offers[0]
    assert.equal(back.availability, 'https://schema.org/BackOrder')
    assert.equal(back.availabilityStarts, '2026-12-01')
    const sold = graph([productNode({ product: { ...base, availability: 'soldout' }, url })])['@graph'][0].offers[0]
    assert.equal(sold.availability, 'https://schema.org/SoldOut')
    assert.equal(sold.availabilityStarts, undefined)
  })

  test('product graph carries no review stars', () => {
    const product = { title: 'Paris-Brest', aggregateRating: { ratingValue: 5 }, variants: [{ label: 'Individuel', priceCents: 650 }] }
    const keys = keysDeep(graph([productNode({ product, url })]))
    assert.ok(!keys.includes('aggregateRating'))
    assert.ok(!keys.includes('review'))
  })
})
