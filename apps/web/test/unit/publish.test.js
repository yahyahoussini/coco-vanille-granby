// lib/publish (which pages the site answers per language), lib/public-paths (what the proxy lets through)
// and lib/meta (product head copy).
import test, { describe } from 'node:test'
import assert from 'node:assert/strict'
import { PAGES, alternatesFor } from '../../src/lib/routes.js'
import { hasCopy, readyCopy, servedKeys, servedByLocale, servedAlternates, productReady, productServed } from '../../src/lib/publish.js'
import { isKnownPublicPath, notFoundPathFor, localeOfPath } from '../../src/lib/public-paths.js'
import { productTitle, productDescription, clip } from '../../src/lib/meta.js'

const docs = [
  { key: 'home', title: 'Pâtisserie Coco Vanille, Granby' },
  { key: 'carte', title: 'Carte' },
  { key: 'chef', title: null },
  { key: 'prix', title: 'Prix', sections: [{ body: '[[FACT NEEDED: grille de prix]]' }] },
]

describe('served pages (publish guard)', () => {
  test('copy needs a title; ready copy has no marker', () => {
    assert.equal(hasCopy({ title: '  ' }), false)
    assert.equal(readyCopy(docs[3]), false)
    assert.equal(readyCopy(docs[1]), true)
  })

  test('show answers every registry page of the language; strict only ready copy', () => {
    const show = servedKeys(docs, 'en', { strict: false })
    assert.equal(show.size, PAGES.filter((p) => p.paths.en).length)
    const strict = servedKeys(docs, 'fr', { strict: true })
    assert.deepEqual([...strict].sort(), ['carte', 'home'])
  })

  test('strict: a language goes live with its home page, or not at all', () => {
    const noHome = docs.map((d) => (d.key === 'home' ? { ...d, sections: [{ body: '[[FACT NEEDED: x]]' }] } : d))
    assert.equal(servedKeys(noHome, 'fr', { strict: true }).size, 0)
    assert.ok(servedKeys(noHome, 'fr', { strict: false }).has('carte'))
  })

  test('strict: a product page needs its description, priced and portioned sizes, lead time, checked allergens', () => {
    const ready = { summary: 'Pur beurre.', leadTimeHours: 24, allergensVerified: { at: '2026-10-20' }, variants: [{ label: 'Unité', priceCents: 375, portionsMin: 1 }] }
    assert.equal(productReady(ready), true)
    for (const gap of [{ summary: '' }, { leadTimeHours: 0 }, { allergensVerified: {} }, { variants: [] }, { variants: [{ label: 'Unité', portionsMin: 1 }] }, { variants: [{ label: 'Unité', priceCents: 375 }] }]) {
      assert.equal(productReady({ ...ready, ...gap }), false, JSON.stringify(gap))
    }
    const home = new Set(['home'])
    assert.equal(productServed({}, { strict: false }), true)
    assert.equal(productServed(ready, { strict: true, servedHere: home }), true)
    assert.equal(productServed(ready, { strict: true, servedHere: new Set() }), false)
  })

  test('strict, French first (Loi 96): no English or Spanish page goes live before its French page', () => {
    const marked = (d) => ({ ...d, sections: [{ body: '[[FACT NEEDED: heures]]' }] })
    const enDocs = [{ key: 'home', title: 'Coco Vanille Pastry Shop, Granby' }, { key: 'faq', title: 'FAQ' }]
    const frMissing = servedByLocale({ fr: [marked({ key: 'home', title: 'Accueil' }), { key: 'faq', title: 'FAQ' }], en: enDocs, es: enDocs }, { strict: true })
    assert.deepEqual([frMissing.fr.size, frMissing.en.size, frMissing.es.size], [0, 0, 0])
    const frHome = servedByLocale({ fr: [{ key: 'home', title: 'Accueil' }, marked({ key: 'faq', title: 'FAQ' })], en: enDocs }, { strict: true })
    assert.deepEqual([...frHome.en], ['home'], 'the English FAQ waits for the French FAQ')
    assert.deepEqual(servedAlternates('faq', frHome), {})
    const both = servedByLocale({ fr: [{ key: 'home', title: 'Accueil' }, { key: 'faq', title: 'FAQ' }], en: enDocs }, { strict: true })
    assert.deepEqual([...both.en].sort(), ['faq', 'home'])
    assert.ok(servedAlternates('faq', both)['x-default'])
    // show (CI, staging): every page, every language.
    assert.ok(servedByLocale({}, { strict: false }).en.has('faq'))
  })

  test('strict: an English product page needs its French version ready', () => {
    const ready = { summary: 'Pur beurre.', leadTimeHours: 24, allergensVerified: { at: '2026-10-20' }, variants: [{ label: 'Unité', priceCents: 375, portionsMin: 1 }] }
    const home = new Set(['home'])
    assert.equal(productServed(ready, { strict: true, servedHere: home, locale: 'en', frProduct: { ...ready, summary: '[[FACT NEEDED: description]]' } }), false)
    assert.equal(productServed(ready, { strict: true, servedHere: home, locale: 'en' }), false)
    assert.equal(productServed(ready, { strict: true, servedHere: home, locale: 'en', frProduct: ready }), true)
  })

  test('hreflang names only the languages that answer, x-default with French', () => {
    const served = { fr: new Set(['carte']), en: new Set(), es: new Set() }
    assert.deepEqual(servedAlternates('carte', served), { 'fr-CA': 'https://cocovanillegranby.com/carte/', 'x-default': 'https://cocovanillegranby.com/carte/' })
    const all = { fr: new Set(['carte']), en: new Set(['carte']), es: new Set(['carte']) }
    assert.deepEqual(servedAlternates('carte', all), alternatesFor('carte'))
    assert.deepEqual(servedAlternates('carte', { fr: new Set(), en: new Set(['carte']) }), { 'en-CA': 'https://cocovanillegranby.com/en/menu/' })
  })
})

describe('public paths the proxy lets through', () => {
  test('registry pages, products under a category, box tokens, route handlers', () => {
    for (const p of PAGES) for (const [locale, path] of Object.entries(p.paths)) if (locale !== 'es') assert.ok(isKnownPublicPath(path), path)
    for (const path of ['/gateaux/gateau-aux-framboises/', '/en/bread/baguette/', '/boite/Zx9_-a/', '/en/box/abc/', '/avis/']) assert.ok(isKnownPublicPath(path), path)
  })

  test('anything else is unknown; Spanish while it is off', () => {
    for (const path of ['/nope/', '/gateaux/a/b/', '/carte/x/', '/boite/a/b/', '/en/', '/en/nope/', '/es/', '/page-introuvable/', '/gateaux/Majuscule/']) {
      if (path === '/en/') continue
      assert.equal(isKnownPublicPath(path), false, path)
    }
    assert.ok(isKnownPublicPath('/en/'))
  })

  test('the 404 page answers in the language of the URL (French when it is off)', () => {
    assert.equal(localeOfPath('/en/x/'), 'en')
    assert.equal(notFoundPathFor('/x/'), '/page-introuvable/')
    assert.equal(notFoundPathFor('/en/x/'), '/en/page-not-found/')
    assert.equal(notFoundPathFor('/es/x/'), '/page-introuvable/')
  })
})

describe('product head copy', () => {
  const business = { address: { street: '3, rue Court', city: 'Granby' } }

  test('titles differ per language, even for a name kept in French', () => {
    const p = { title: 'Baguette' }
    assert.equal(productTitle(p, 'fr'), 'Baguette à Granby · Pâtisserie Coco Vanille')
    assert.equal(productTitle(p, 'en'), 'Baguette in Granby · Pâtisserie Coco Vanille')
    assert.notEqual(productTitle(p, 'fr'), productTitle(p, 'en'))
  })

  test('the summary when written, else what the page holds, with the verified address', () => {
    assert.equal(productDescription({ title: 'Baguette', summary: 'Baguette au levain.' }, business, 'fr'), 'Baguette au levain.')
    assert.equal(productDescription({ title: 'Baguette' }, business, 'fr'), 'Baguette de Pâtisserie Coco Vanille, 3, rue Court à Granby : formats, portions, allergènes et délai pour commander.')
    assert.equal(productDescription({ title: 'Baguette' }, business, 'en'), 'Baguette from Pâtisserie Coco Vanille, 3 rue Court in Granby: sizes, servings, allergens and how far ahead to order.')
    assert.match(productDescription({ title: 'Baguette' }, {}, 'fr'), / à Granby : /)
  })

  test('clip cuts at a word, at most 160 characters', () => {
    const long = 'mot '.repeat(80)
    const out = clip(long)
    assert.ok(out.length <= 160)
    assert.match(out, /mot…$/)
  })
})
