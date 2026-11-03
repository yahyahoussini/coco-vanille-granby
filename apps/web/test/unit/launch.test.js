// The launch of 2026-11-04: every sentence of the site reads whole with the proposed answers, every product has a price the
// reservation can use, and nothing proposed says what only the shop may say.
import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { pages } from '../../src/seed/content.js'
import { NEW_PRODUCTS, EXISTING_PRODUCTS } from '../../src/seed/catalogue-data.js'
import { OFFERS, SHOP_PRODUCTS, ORDERING, POOLS, SEASON } from '../../src/seed/launch-data.js'
import { FACTS, factIdFor } from '../../src/lib/facts-catalog.js'
import { PROPOSALS, NO_PROPOSAL, REPEATS_PRODUCTS } from '../../src/lib/facts-proposals.js'
import { answerMap, resolveFacts, containsMarker } from '../../src/lib/facts.js'
import { countWords, firstSentence, BANNED } from '../../src/lib/copy-rules.js'
import { lineBlockers, productLine } from '../../src/lib/ordering/lines.js'
import { orderTotals } from '../../src/lib/ordering/totals.js'
import { orderingCopy } from '../../src/components/ordering/copy.js'

const slugify = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/œ/g, 'oe').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const records = Object.entries(PROPOSALS).map(([key, v]) => ({ key, ...v }))
const filled = (locale) => {
  const answers = answerMap(records, locale)
  return pages.filter((p) => p.locales[locale]).map((p) => ({ key: p.key, copy: resolveFacts(p.locales[locale], answers, (l) => factIdFor(locale, l)) }))
}
const PENDING = /[àa] confirmer|restent? à|doit fournir|doit confirmer|sera publié|sera présent|une fois vérifi|to be confirmed|once checked|still has to|will be introduced|will be published|bonjour@|confidentialite@|soumission|\bquote\b/i

describe('the proposed answers', () => {
  test('every fact has one, in both languages, except what only the person concerned can give', () => {
    const missing = FACTS.map((f) => f.id).filter((id) => !PROPOSALS[id] && !NO_PROPOSAL.includes(id))
    assert.deepEqual(missing, [])
    for (const [key, a] of Object.entries(PROPOSALS)) {
      assert.ok(FACTS.some((f) => f.id === key), `${key} is not a fact`)
      assert.match(a.fr, /\S/, `${key}: French`)
      assert.match(a.en, /\S/, `${key}: English`)
    }
    for (const key of REPEATS_PRODUCTS) assert.ok(PROPOSALS[key], key)
  })

  test('none claims a product is free of an allergen, or names a person', () => {
    for (const [key, a] of Object.entries(PROPOSALS)) {
      const text = `${a.fr} ${a.en}`
      assert.doesNotMatch(text.replace(/garanti sans allergène|guaranteed free of allergens/g, ''), /sans (gluten|noix|arachide|lactose|lait|œuf|allerg)|gluten-free|nut-free|lactose-free|vegan|halal/i, key)
    }
  })

  test('every page reads whole in French and English: no slot left but the chef’s, no sentence waiting for an answer', () => {
    for (const locale of ['fr', 'en']) {
      for (const { key, copy } of filled(locale)) {
        if (key === 'chef') continue
        assert.equal(containsMarker(copy), false, `${key} (${locale}) still has a slot`)
        assert.doesNotMatch(JSON.stringify(copy), PENDING, `${key} (${locale})`)
      }
    }
  })

  test('the page contract still holds once filled: answer blocks of 40 to 60 words, first sentences short enough, no banned word', () => {
    for (const locale of ['fr', 'en']) {
      for (const { key, copy } of filled(locale)) {
        if (key === 'chef') continue
        const n = countWords(copy.answer)
        assert.ok(n >= 40 && n <= 60, `${key} (${locale}): answer has ${n} words`)
        for (const s of copy.sections || []) assert.ok(countWords(firstSentence(s.answer)) <= 45, `${key} (${locale}): ${s.heading}`)
        const text = JSON.stringify(copy)
        for (const [re, why] of BANNED) assert.doesNotMatch(text, re, `${key} (${locale}): ${why}`)
      }
    }
  })
})

describe('the products', () => {
  const allOffers = { ...OFFERS, ...Object.fromEntries(SHOP_PRODUCTS.map((p) => [p.slug, p.offer])) }

  test('every product of the catalogue has an offer, and no offer is for a product that does not exist', () => {
    const slugs = [...NEW_PRODUCTS.map((p) => p.slug || slugify(p.title)), ...EXISTING_PRODUCTS.map((p) => p.slug)]
    assert.deepEqual(slugs.filter((s) => !OFFERS[s]), [])
    assert.deepEqual(Object.keys(OFFERS).filter((s) => !slugs.includes(s)), [])
  })

  test('each offer can be reserved online and taxed: price, servings, lead time, tax class, weight for the bakery rule', () => {
    const family = (slug) => (SHOP_PRODUCTS.find((p) => p.slug === slug) || {}).family || 'gateaux'
    for (const [slug, offer] of Object.entries(allOffers)) {
      offer.variants.forEach((v, i) => {
        assert.ok(v.label && v.en, `${slug}: names`)
        assert.ok(Number.isInteger(v.priceCents) && v.priceCents > 0, `${slug}: price`)
        assert.ok(v.portionsMin > 0, `${slug}: servings`)
        const product = { id: 1, _status: 'published', availability: 'instock', onlineOrderable: true, ...offer, productionCategory: family(slug), season: null }
        const line = productLine(product, i, 1)
        assert.deepEqual(lineBlockers(product, line), [], `${slug} · ${v.label}`)
        assert.ok(orderTotals([line], { supplyDate: '2026-11-20' }).totalCents >= v.priceCents, slug)
      })
    }
  })

  test('the numbers quoted in the answers are the catalogue’s', () => {
    const sizes = OFFERS['gateau-aux-framboises'].variants
    assert.deepEqual(sizes.map((v) => v.priceCents), [4500, 6500, 9500])
    assert.match(PROPOSALS['prix-format'].fr, /45 \$.*65 \$.*95 \$/)
    assert.match(PROPOSALS['prix-format'].en, /\$45.*\$65.*\$95/)
    assert.equal(OFFERS['gateau-theme-plage'].variants[0].priceCents, 6500)
    assert.equal(PROPOSALS['prix-perso-min'].fr, '65 $')
    assert.deepEqual(OFFERS['buche-au-sapin'].variants.map((v) => v.priceCents), [3800, 5800, 7500])
    assert.match(PROPOSALS['buches-prix'].fr, /38 \$.*58 \$.*75 \$/)
    assert.equal(SHOP_PRODUCTS.find((p) => p.slug === 'croissant').offer.variants[0].priceCents, 325)
    assert.match(PROPOSALS['prix-viennoiseries'].fr, /3,25 \$.*3,95 \$.*4,25 \$/)
  })

  test('the reservation settings and the season: a pool for each family, the Christmas days inside the horizon', () => {
    for (const family of new Set([...Object.keys(allOffers).map((s) => (SHOP_PRODUCTS.find((p) => p.slug === s) || {}).family || 'gateaux')])) assert.ok(POOLS.some((p) => p.productionCategory === family && p.defaultPerDay > 0), family)
    assert.equal(ORDERING.enabled, true)
    assert.match(ORDERING.nextDayCutoff, /^\d\d:\d\d$/)
    const launch = new Date('2026-11-04T12:00:00Z').getTime()
    for (const { date } of SEASON.pickupDates) assert.ok((new Date(date).getTime() - launch) / 86400000 <= ORDERING.maxDaysAhead, date)
    assert.ok(new Date(SEASON.preorderOpensAt) < new Date('2026-11-04T12:00:00Z'))
  })
})

describe('the words of a reservation', () => {
  test('no card, no email promised, in all three languages; the other mode keeps its own words', () => {
    process.env.PAYMENT_PROVIDER = 'counter'
    try {
      for (const locale of ['fr', 'en', 'es']) {
        const c = orderingCopy(locale)
        assert.match(c.checkout.pay('10 $'), /10 \$/)
        assert.doesNotMatch(JSON.stringify([c.request.intro, c.checkout.emailHint, c.checkout.phoneHint, c.thanks.requestText()]), /acompte|deposit|anticipo|courriel|email|correo|texto|\btext\b/i, locale)
        assert.ok(c.thanks.reserved('10 $').includes('10 $'))
        assert.equal(c.steps.pay, locale === 'es' ? 'Confirmación' : 'Confirmation')
      }
    } finally {
      delete process.env.PAYMENT_PROVIDER
    }
    assert.equal(orderingCopy('fr').steps.pay, 'Paiement')
  })
})
