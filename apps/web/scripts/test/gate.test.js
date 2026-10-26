// Unit tests for scripts/gate-lib.mjs. Run: node --test 'scripts/test/*.test.js'
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { PAGES } from '../../src/lib/routes.js'
import { gatePages, siteConfig, normalizeHref, internalLinks, sitemapPaths, markersIn, classifyAudit, hasBusinessNode, linkFails, ownerTodo, todoMarkdown } from '../gate-lib.mjs'

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
  const { marker, toolGap, real } = classifyAudit(report, html)
  assert.equal(marker.length, 4)
  assert.deepEqual(toolGap.map((f) => f.where), ['/'])
  assert.deepEqual(real.map((f) => f.where), ['/carte/', '/carte/', '/carte/', '/faq/', 'site'])
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

test('hasBusinessNode needs a business type with a name and an address', () => {
  assert.equal(hasBusinessNode(BAKERY), true)
  assert.equal(hasBusinessNode('<script type="application/ld+json">{"@graph":[{"@type":"Bakery","name":"x"}]}</script>'), false)
  assert.equal(hasBusinessNode('<script type="application/ld+json">{not json}</script>'), false)
  assert.equal(hasBusinessNode('<script type="application/ld+json">[{"@type":["Bakery"],"name":"x","address":"y"}]</script>'), true)
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
