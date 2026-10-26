// Unit tests for scripts/gate-lib.mjs. Run: node --test 'scripts/test/*.test.js'
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { PAGES } from '../../src/lib/routes.js'
import { gatePages, siteConfig, normalizeHref, internalLinks, sitemapPaths, markersIn, classifyAudit, linkFails, ownerTodo, todoMarkdown } from '../gate-lib.mjs'

const GUARDED = '<meta name="robots" content="noindex, follow"/><h1>[[FACT NEEDED: titre de la page]]</h1>'
const BAKERY = '<script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"Bakery","name":"Pâtisserie Coco Vanille","address":{"@type":"PostalAddress"}}]}</script>'

test('gatePages: every indexable FR/EN registry page, no utility page, ES only when switched on', () => {
  const pages = gatePages(PAGES)
  const paths = pages.map((p) => p.path)
  assert.ok(paths.includes('/'))
  assert.ok(paths.includes('/en/'))
  assert.ok(paths.includes('/carte/'))
  assert.ok(paths.includes('/en/menu/'))
  for (const utility of ['/boite/', '/commander/paiement/', '/commander/merci/', '/en/box/']) assert.ok(!paths.includes(utility), utility)
  assert.ok(!paths.some((p) => p.startsWith('/es/')))
  const expected = PAGES.filter((p) => p.status !== 'utility').reduce((n, p) => n + (p.paths.fr ? 1 : 0) + (p.paths.en ? 1 : 0), 0)
  assert.equal(pages.length, expected)
  assert.ok(gatePages(PAGES, { es: true }).some((p) => p.path === '/es/'))
  assert.equal(pages.find((p) => p.path === '/').type, 'home')
  assert.equal(pages.find((p) => p.path === '/confidentialite/').type, 'legal')
})

test('siteConfig: what audit.mjs and links.mjs read', () => {
  const cfg = siteConfig(PAGES)
  assert.equal(cfg.site, 'https://cocovanillegranby.com')
  assert.deepEqual(cfg.languages, { default: 'fr', others: ['en'], hreflang: { fr: 'fr-CA', en: 'en-CA' } })
  const carte = cfg.pages.find((p) => p.path === '/carte/')
  assert.deepEqual(carte.alt, { en: '/en/menu/' })
  assert.equal(cfg.pages.find((p) => p.path === '/temoins/').type, 'legal')
  assert.ok(!cfg.pages.some((p) => p.path === '/boite/'))
  assert.deepEqual(siteConfig(PAGES, { es: true }).languages.others, ['en', 'es'])
})

test('normalizeHref matches links.mjs', () => {
  assert.equal(normalizeHref('/carte'), '/carte/')
  assert.equal(normalizeHref('/carte/?utm=x#top'), '/carte/')
  assert.equal(normalizeHref('https://cocovanillegranby.com/en/menu/'), '/en/menu/')
  assert.equal(normalizeHref('https://cocovanillegranby.com'), '/')
  assert.equal(normalizeHref('/media/photo.avif'), '/media/photo.avif')
  assert.equal(normalizeHref('tel:+14503727177'), null)
  assert.equal(normalizeHref('https://www.facebook.com/PatisserieCocoVanille/'), null)
  assert.equal(normalizeHref('//cdn.example/x.js'), null)
})

test('internalLinks and sitemapPaths', () => {
  const html = '<a href="/carte/">Carte</a> <a class="x" href="/faq">FAQ</a> <a href="tel:+1">t</a> <a href="/carte/#a">again</a>'
  assert.deepEqual(internalLinks(html), ['/carte/', '/faq/'])
  const xml = '<urlset><url><loc>https://cocovanillegranby.com/</loc></url><url><loc>https://cocovanillegranby.com/en/menu/</loc></url></urlset>'
  assert.deepEqual(sitemapPaths(xml), ['/', '/en/menu/'])
})

test('markersIn lists each distinct marker once', () => {
  assert.deepEqual(markersIn('<p>[[FACT NEEDED: prix]] et [[FACT NEEDED: prix]] puis [[FACT NEEDED: portions]]</p>'), ['[[FACT NEEDED: prix]]', '[[FACT NEEDED: portions]]'])
  assert.deepEqual(markersIn('<p>rien</p>'), [])
})

test('classifyAudit: only marker-explained FAILs pass', () => {
  const report = {
    pages: [
      { path: '/prix/', fails: ['placeholder left in page: "[[FACT NEEDED: prix]]"', 'content page is noindex', 'missing meta description', 'duplicate title, also on /faq/'] },
      { path: '/carte/', fails: ['content page is noindex', 'missing meta description', 'img without alt: /media/a.avif'] },
      { path: '/', fails: ['no Organization/LocalBusiness node in JSON-LD (embed the site graph on every page; an empty @graph is a placeholder)'] },
      { path: '/faq/', fails: ['no Organization/LocalBusiness node in JSON-LD (embed the site graph on every page; an empty @graph is a placeholder)'] },
    ],
    site: { fails: ['sitemap lists a URL that does not exist on disk: https://cocovanillegranby.com/x/'] },
  }
  const html = { '/prix/': GUARDED, '/carte/': '<meta name="robots" content="noindex"/><h1>Carte</h1>', '/': BAKERY, '/faq/': '<script type="application/ld+json">{"@type":"WebPage"}</script>' }
  const { marker, real } = classifyAudit(report, html)
  assert.equal(marker.length, 4)
  // No exception left for the business node: tools/audit.mjs recognises Bakery itself (test below).
  assert.deepEqual(real.map((f) => f.where), ['/carte/', '/carte/', '/carte/', '/', '/faq/', 'site'])
  assert.deepEqual(real.slice(0, 3).map((f) => f.message), ['content page is noindex', 'missing meta description', 'img without alt: /media/a.avif'])
})

test('classifyAudit: a marker does not excuse a real defect on the same page', () => {
  const report = { pages: [{ path: '/prix/', fails: ['img without width/height (layout shift): /media/a.avif', '2 <h1> (need exactly 1)'] }] }
  const { marker, real } = classifyAudit(report, { '/prix/': GUARDED })
  assert.equal(marker.length, 0)
  assert.equal(real.length, 2)
})

test('classifyAudit: head-copy FAILs count as marker-explained only while the page is noindex', () => {
  const indexable = '<meta name="robots" content="index, follow"/><p>[[FACT NEEDED: prix]]</p>'
  const { real } = classifyAudit({ pages: [{ path: '/gateaux/x/', fails: ['missing meta description'] }] }, { '/gateaux/x/': indexable })
  assert.equal(real.length, 1)
})

test('tools/audit.mjs takes a schema.org Bakery (FoodEstablishment) node as the business node', () => {
  const root = mkdtempSync(join(tmpdir(), 'coco-audit-'))
  const page = (ld) => `<!doctype html><html lang="fr-CA"><head><meta charset="utf-8"><title>Carte · Pâtisserie Coco Vanille</title><meta name="description" content="La carte."><link rel="canonical" href="https://cocovanillegranby.com/carte/"></head><body><main><h1>Carte</h1><p>Pâtisserie Coco Vanille à Granby.</p></main><script type="application/ld+json">${ld}</script></body></html>`
  const write = (path, html) => {
    mkdirSync(join(root, 'site', path), { recursive: true })
    writeFileSync(join(root, 'site', path, 'index.html'), html)
  }
  write('carte', page(BAKERY.replace(/^<script[^>]*>|<\/script>$/g, '')))
  write('faq', page('{"@context":"https://schema.org","@graph":[{"@type":"WebPage","name":"FAQ"}]}'))
  write('array-type', page('{"@context":"https://schema.org","@graph":[{"@type":["Bakery","FoodEstablishment"],"name":"x","address":{"@type":"PostalAddress"}}]}'))
  writeFileSync(join(root, 'site.config.json'), JSON.stringify({ site: 'https://cocovanillegranby.com', languages: { default: 'fr', others: [] }, pages: [] }))
  const audit = resolve(dirname(fileURLToPath(import.meta.url)), '../../../../tools/audit.mjs')
  spawnSync(process.execPath, [audit, join(root, 'site'), '--config', join(root, 'site.config.json'), '--json', join(root, 'audit.json'), '--quiet'], { encoding: 'utf8' })
  const report = JSON.parse(readFileSync(join(root, 'audit.json'), 'utf8'))
  const orgFail = (path) => (report.pages.find((p) => p.path === path)?.fails || []).some((f) => f.startsWith('no Organization/LocalBusiness node'))
  assert.equal(orgFail('/carte/'), false)
  assert.equal(orgFail('/array-type/'), false)
  assert.equal(orgFail('/faq/'), true)
})

test('linkFails reads the ✗ lines of links.mjs (with colours)', () => {
  const out = '\x1b[31m✗\x1b[0m /faq/: not reachable from home\n\x1b[33m!\x1b[0m /carte/: 2 inbound internal link(s) (min 3)\n\x1b[31m✗\x1b[0m /prix/: 1 broken internal link(s): /nope/\n'
  assert.deepEqual(linkFails(out), [
    { where: '/faq/', message: 'not reachable from home' },
    { where: '/prix/', message: '1 broken internal link(s): /nope/' },
  ])
})

test('ownerTodo groups markers by fact, most pages first; the markdown escapes pipes', () => {
  const todo = ownerTodo({ '/': '[[FACT NEEDED: heures]]', '/carte/': '[[FACT NEEDED: heures]] [[FACT NEEDED: prix | taille]]', '/en/': '[[FACT NEEDED: heures]]' })
  assert.deepEqual(todo.map((t) => [t.fact, t.pages.length]), [['heures', 3], ['prix | taille', 1]])
  assert.deepEqual(todo[0].pages, ['/', '/carte/', '/en/'])
  const md = todoMarkdown(todo, { base: 'http://localhost:3000', generated: '2026-10-26T00:00:00.000Z' })
  assert.match(md, /\| 2 \| prix \\\| taille \| \/carte\/ \|/)
})

test('siteConfig takes brand, NAP and sameAs from the entity, never a [[FACT NEEDED]] field', () => {
  const entity = {
    name: 'Pâtisserie Coco Vanille',
    telephone: '[[FACT NEEDED: phone]]',
    address: { addressLocality: 'Granby' },
    geo: { latitude: 45.39, longitude: -72.72 },
    sameAs: ['https://www.facebook.com/PatisserieCocoVanille/', '[[FACT NEEDED: instagram]]'],
  }
  const cfg = siteConfig(PAGES, { entity })
  assert.equal(cfg.brand.name, 'Pâtisserie Coco Vanille')
  assert.deepEqual(cfg.nap, { city: 'Granby' })
  assert.deepEqual(cfg.geo, { lat: 45.39, lng: -72.72 })
  assert.deepEqual(cfg.sameAs, ['https://www.facebook.com/PatisserieCocoVanille/'])
  assert.equal(siteConfig(PAGES).nap, undefined)
})
