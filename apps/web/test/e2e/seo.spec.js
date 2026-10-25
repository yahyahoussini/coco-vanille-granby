// SEO contract on the public host, as a crawler sees it (raw HTML, no JavaScript): rank-first layers 2, 4, 5.
// The page list comes from src/lib/routes.js, so pages added by other modules are checked automatically.
import { test, expect } from '@playwright/test'
import {
  PUBLIC_URL,
  SITE_ORIGIN,
  HTML_LANG,
  BAKERY_ID,
  STRICT,
  ES_ENABLED,
  PAGES,
  raw,
  local,
  inspect,
  ldNodes,
  hasType,
  indexablePages,
  esPaths,
  sitemapLocs,
  alternatesFor,
} from './support/site.js'

let sitemapPromise
const sitemap = () => (sitemapPromise ??= raw(`${PUBLIC_URL}/sitemap.xml`).then((r) => ({ ...r, locs: sitemapLocs(r.body) })))

// Runs fn over items with a small concurrency limit (keeps the server's ISR renders sequential-ish).
async function each(items, fn, limit = 4) {
  const queue = [...items]
  await Promise.all(Array.from({ length: limit }, async () => { while (queue.length) await fn(queue.shift()) }))
}

const HASH_LINK = /^(#|#!.*|#\/.*|javascript:.*)$/i

test.describe('robots.txt', () => {
  test('allows the site, names the sitemap and keeps the private areas out', async () => {
    const res = await raw(`${PUBLIC_URL}/robots.txt`)
    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toMatch(/^text\/plain/)
    const lines = res.body.split('\n').map((l) => l.trim())
    expect(lines).toContain('User-agent: *')
    expect(lines, 'never "Disallow: /" for everyone').not.toContain('Disallow: /')
    expect(lines).toContain(`Sitemap: ${SITE_ORIGIN}/sitemap.xml`)
    expect(lines).toContain('Content-Signal: search=yes, ai-input=yes, ai-train=yes')
    expect(lines).toContain('Disallow: /svc/')
    const disallowed = lines.filter((l) => /^Disallow:\s*\S/.test(l)).map((l) => l.replace(/^Disallow:\s*/, ''))
    expect(disallowed.some((d) => d.startsWith('/_next')), 'CSS/JS must stay crawlable').toBe(false)
    for (const p of indexablePages()) {
      const blocked = disallowed.find((d) => p.path.startsWith(d))
      expect(blocked, `${p.path} is blocked by "Disallow: ${blocked}"`).toBeUndefined()
    }
  })
})

test.describe('sitemap.xml', () => {
  test('parses, lists canonical URLs with hreflang, no utility page', async ({ page }) => {
    const res = await sitemap()
    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toMatch(/xml/)
    const parsed = await page.evaluate((xml) => {
      const doc = new DOMParser().parseFromString(xml, 'application/xml')
      const err = doc.getElementsByTagName('parsererror')[0]
      const ns = 'http://www.sitemaps.org/schemas/sitemap/0.9'
      const urls = [...doc.getElementsByTagNameNS(ns, 'url')].map((u) => ({
        loc: u.getElementsByTagNameNS(ns, 'loc')[0]?.textContent.trim(),
        alternates: [...u.getElementsByTagNameNS('http://www.w3.org/1999/xhtml', 'link')].map((l) => ({ hreflang: l.getAttribute('hreflang'), href: l.getAttribute('href') })),
      }))
      return { error: err ? err.textContent : null, root: doc.documentElement.localName, rootNs: doc.documentElement.namespaceURI, urls }
    }, res.body)
    expect(parsed.error, 'XML parse error').toBeNull()
    expect(parsed.root).toBe('urlset')
    expect(parsed.rootNs).toBe('http://www.sitemaps.org/schemas/sitemap/0.9')
    expect(parsed.urls.length, 'sitemap has URLs').toBeGreaterThan(0)

    const locs = parsed.urls.map((u) => u.loc)
    expect(new Set(locs).size, 'no duplicate <loc>').toBe(locs.length)
    const utility = new Set(PAGES.filter((p) => p.status === 'utility').flatMap((p) => Object.values(p.paths)).map((p) => `${SITE_ORIGIN}${p}`))
    for (const u of parsed.urls) {
      expect(u.loc.startsWith(`${SITE_ORIGIN}/`), `${u.loc} on the canonical host`).toBe(true)
      expect(u.loc.endsWith('/'), `${u.loc} trailing slash`).toBe(true)
      expect(utility.has(u.loc), `${u.loc} is a utility (noindex) page`).toBe(false)
      if (!ES_ENABLED) expect(u.loc.startsWith(`${SITE_ORIGIN}/es/`), `${u.loc}: Spanish while ENABLE_ES=false`).toBe(false)
      if (u.alternates.length) {
        expect(u.alternates.map((a) => a.href), `${u.loc} alternates include itself`).toContain(u.loc)
        expect(u.alternates.some((a) => a.hreflang === 'x-default'), `${u.loc} x-default`).toBe(true)
      }
    }
  })

  test('every listed URL answers 200 on the public host', async ({ page }) => {
    test.setTimeout(240_000)
    const { locs } = await sitemap()
    const failures = []
    const noindexed = []
    await each(locs, async (loc) => {
      const res = await raw(local(loc)).catch((e) => ({ status: 0, body: String(e) }))
      if (res.status !== 200) return failures.push(`${res.status} ${loc}`)
      const robots = (await inspect(page, res.body)).robots.join(',')
      if (/noindex/i.test(robots)) noindexed.push(loc)
    })
    expect(failures, failures.join('\n')).toEqual([])
    if (STRICT) expect(noindexed, 'production sitemap lists noindex pages').toEqual([])
    else if (noindexed.length) test.info().annotations.push({ type: 'warning', description: `noindex pages listed (publish guard "show"): ${noindexed.join(' ')}` })
  })
})

test.describe('page contract', () => {
  for (const p of indexablePages()) {
    test(`${p.path} (${p.key}, ${p.locale})`, async ({ page }) => {
      const res = await raw(`${PUBLIC_URL}${p.path}`)
      if (res.status === 404 && STRICT) {
        const { locs } = await sitemap()
        test.skip(!locs.includes(p.canonical), `${p.path}: hidden by PUBLISH_GUARD=strict and absent from the sitemap`)
      }
      expect(res.status, `${p.path} status`).toBe(200)
      expect(res.headers['content-type']).toMatch(/^text\/html/)
      const d = await inspect(page, res.body)

      expect(d.h1, 'exactly one <h1>').toHaveLength(1)
      expect(d.lang, '<html lang>').toBe(HTML_LANG[p.locale])
      expect(d.canonical, 'one self-referencing canonical').toEqual([p.canonical])

      // hreflang: exactly the registry's set (only equivalents that exist + x-default → fr), self included.
      const got = Object.fromEntries(d.alternates.map((a) => [a.hreflang, a.href]))
      expect(Object.keys(got).length, 'no duplicate hreflang values').toBe(d.alternates.length)
      expect(got).toEqual(alternatesFor(p.key))
      expect(got['x-default'], 'x-default').toBe(`${SITE_ORIGIN}${PAGES.find((x) => x.key === p.key).paths.fr}`)
      expect(Object.values(got)).toContain(p.canonical)
      for (const href of new Set(Object.values(got))) {
        if (href === p.canonical) continue
        const other = await raw(local(href))
        expect(other.status, `hreflang target ${href}`).toBe(200)
        const back = (await inspect(page, other.body)).alternates.map((a) => a.href)
        expect(back, `${href} must link back to ${p.canonical}`).toContain(p.canonical)
      }

      expect(d.robots, 'one robots meta').toHaveLength(1)
      expect(d.robots[0]).toMatch(/index/)

      expect(d.jsonld, 'one JSON-LD block').toHaveLength(1)
      const blocks = d.jsonld.map((text, i) => {
        try {
          return JSON.parse(text)
        } catch (e) {
          throw new Error(`JSON-LD block ${i} does not parse: ${e.message}`)
        }
      })
      const nodes = ldNodes(blocks)
      expect(nodes.some((n) => hasType(n, 'Bakery') && n['@id'] === BAKERY_ID), `Bakery node ${BAKERY_ID}`).toBe(true)
      expect(JSON.stringify(blocks), 'no review stars on our own pages').not.toMatch(/"aggregateRating"|"reviewRating"/)
      expect(JSON.stringify(blocks), 'no marker in structured data').not.toMatch(/\[\[FACT NEEDED/)

      for (const img of d.images) {
        expect(img.alt, `img ${img.src}: alt`).not.toBeNull()
        expect(img.width, `img ${img.src}: width`).toBeTruthy()
        expect(img.height, `img ${img.src}: height`).toBeTruthy()
      }

      const hashLinks = d.links.filter((h) => HASH_LINK.test(h.trim()))
      expect(hashLinks, 'no "#", "#!", "#/" or javascript: links').toEqual([])
      for (const frag of d.links.filter((h) => /^#[\w-]+$/.test(h))) {
        expect(d.ids, `${frag} points to an element on the page`).toContain(frag.slice(1))
      }
    })
  }
})

test.describe('URL policy', () => {
  test('a URL without its trailing slash answers one 301 to the slash form', async () => {
    const paths = [...new Set(indexablePages().map((p) => p.path))].filter((p) => p !== '/')
    const problems = []
    await each(paths, async (path) => {
      const bare = path.replace(/\/$/, '')
      const res = await raw(`${PUBLIC_URL}${bare}`)
      const target = res.headers.location ? new URL(res.headers.location, PUBLIC_URL) : null
      if (res.status !== 301) problems.push(`${bare}: ${res.status}`)
      else if (!target || target.pathname !== path || target.host !== new URL(PUBLIC_URL).host) problems.push(`${bare} → ${res.headers.location}`)
    })
    expect(problems, problems.join('\n')).toEqual([])
  })

  test('the redirect keeps the query string', async () => {
    const res = await raw(`${PUBLIC_URL}/carte?utm_source=test`)
    expect(res.status).toBe(301)
    const target = new URL(res.headers.location, PUBLIC_URL)
    expect(target.pathname).toBe('/carte/')
    expect(target.search).toBe('?utm_source=test')
  })

  test('an unknown page is a real 404, not a soft 404', async () => {
    const res = await raw(`${PUBLIC_URL}/cette-page-nexiste-pas/`)
    expect(res.status).toBe(404)
  })

  test(`Spanish pages ${ES_ENABLED ? 'answer 200' : 'answer 404 while ENABLE_ES=false'}`, async () => {
    const wrong = []
    await each(esPaths(), async ({ path }) => {
      const res = await raw(`${PUBLIC_URL}${path}`)
      const expected = ES_ENABLED ? 200 : 404
      if (res.status !== expected) wrong.push(`${path}: ${res.status} (expected ${expected})`)
    })
    expect(wrong, wrong.join('\n')).toEqual([])
  })
})
