// The Journal on the public host, as a crawler sees it (raw HTML): the index, a post page (answer, illustration,
// byline, sources, FAQ, related pages, BlogPosting, breadcrumb, canonical, hreflang both-or-nothing), the home
// block, the sitemap. With no post served yet (before 2026-11-02 6 h), the post cases skip and the empty state is
// checked instead.
import { test, expect } from '@playwright/test'
import { PUBLIC_URL, SITE_ORIGIN, STRICT, raw, local, inspect, ldNodes, hasType, sitemapLocs } from './support/site.js'

const INDEX = '/journal/'

// The index's cards: [{ href, datetime }] in page order.
async function cards(page, html) {
  return page.evaluate((source) => {
    const doc = new DOMParser().parseFromString(source, 'text/html')
    return [...doc.querySelectorAll('.journal-list .post-card')].map((card) => ({ href: card.querySelector('h2 a')?.getAttribute('href'), datetime: card.querySelector('time')?.getAttribute('datetime') }))
  }, html)
}

let indexPromise
const index = () => (indexPromise ??= raw(`${PUBLIC_URL}${INDEX}`))

test.describe('Journal index', () => {
  test('one h1, the answer first in <main>, newest first, every card answers 200', async ({ page }) => {
    const res = await index()
    if (STRICT && res.status === 404) test.skip(true, 'no post served yet: strict hides the empty index')
    expect(res.status).toBe(200)
    const d = await inspect(page, res.body)
    expect(d.h1).toHaveLength(1)
    const first = await page.evaluate((source) => new DOMParser().parseFromString(source, 'text/html').querySelector('main p:not(.closure-banner)')?.className, res.body)
    expect(first, 'the answer block is the first paragraph of <main>').toBe('answer')
    const list = await cards(page, res.body)
    if (!list.length) {
      expect(res.body).toMatch(/Aucun billet publié pour l’instant\./)
      expect(d.robots.join(','), 'the empty index is noindex').toMatch(/noindex/)
      return
    }
    const times = list.map((c) => c.datetime)
    expect([...times].sort().reverse(), 'newest first').toEqual(times)
    for (const c of list) expect((await raw(`${PUBLIC_URL}${c.href}`)).status, c.href).toBe(200)
    if (list.length <= 12) expect((await raw(`${PUBLIC_URL}/journal/page/2/`)).status).toBe(404)
    expect((await raw(`${PUBLIC_URL}/journal/page/1/`)).status).toBe(404)
  })
})

test.describe('Journal post', () => {
  test('the newest post: contract blocks, JSON-LD from what shows, hreflang both or nothing', async ({ page }) => {
    const res = await index()
    const list = res.status === 200 ? await cards(page, res.body) : []
    test.skip(!list.length, 'no post served yet (first post: 2026-11-02, 6 h Granby)')
    const path = list[0].href
    const post = await raw(`${PUBLIC_URL}${path}`)
    expect(post.status).toBe(200)
    const d = await inspect(page, post.body)
    expect(d.h1).toHaveLength(1)
    expect(d.canonical).toEqual([`${SITE_ORIGIN}${path}`])
    const dom = await page.evaluate((source) => {
      const doc = new DOMParser().parseFromString(source, 'text/html')
      const main = doc.querySelector('main')
      return {
        firstP: main.querySelector('p:not(.closure-banner)')?.className,
        figure: main.querySelector('figure')?.textContent || '',
        ownPhoto: Boolean(main.querySelector('figure img[src^="/media/"]')),
        bylineTime: main.querySelector('.post-byline time')?.getAttribute('datetime'),
        author: Boolean(main.querySelector('a[rel="author"]')),
        sources: [...main.querySelectorAll('.post-sources a')].map((a) => a.getAttribute('href')),
        faq: main.querySelectorAll('.faq details').length,
        related: [...main.querySelectorAll('.post-related a')].map((a) => a.getAttribute('href')),
        h1: main.querySelector('h1')?.textContent.trim(),
      }
    }, post.body)
    expect(dom.firstP).toBe('answer')
    expect(dom.ownPhoto || dom.figure.includes('Photo d’illustration'), 'an illustration says so (or it is the shop’s own photo)').toBe(true)
    expect(dom.author, 'visible author link').toBe(true)
    expect(dom.sources.length).toBeGreaterThan(0)
    for (const s of dom.sources) expect(s).toMatch(/^https:\/\//)
    expect(dom.faq).toBeGreaterThanOrEqual(5)
    expect(dom.related.length).toBeGreaterThanOrEqual(1)
    expect(dom.related.length).toBeLessThanOrEqual(4)
    for (const href of dom.related) expect((await raw(`${PUBLIC_URL}${href}`)).status, href).toBe(200)

    const nodes = ldNodes(d.jsonld.map((s) => JSON.parse(s)))
    const article = nodes.find((n) => hasType(n, 'BlogPosting'))
    expect(article?.headline).toBe(dom.h1)
    expect(article.datePublished).toBe(dom.bylineTime)
    expect(article.author?.[0]?.['@type']).toBe('Organization')
    expect(nodes.find((n) => hasType(n, 'BreadcrumbList'))?.itemListElement).toHaveLength(3)

    const alternates = Object.fromEntries(d.alternates.map((a) => [a.hreflang, a.href]))
    if (Object.keys(alternates).length) {
      expect(Object.keys(alternates).sort()).toEqual(['en-CA', 'fr-CA', 'x-default'])
      const en = await raw(local(alternates['en-CA']))
      expect(en.status).toBe(200)
      expect((await inspect(page, en.body)).alternates.map((a) => a.href)).toContain(`${SITE_ORIGIN}${path}`)
    }

    const home = await raw(`${PUBLIC_URL}/`)
    expect((await inspect(page, home.body)).links, 'the home page links to the newest post').toContain(path)
    // The sitemap lists the post with its content date (the JSON-LD dateModified, same instant), and names its
    // other language only when the page does.
    const xml = (await raw(`${PUBLIC_URL}/sitemap.xml`)).body
    if (!d.robots.join(',').includes('noindex')) {
      expect(sitemapLocs(xml)).toContain(`${SITE_ORIGIN}${path}`)
      const entry = xml.split('<url>').find((u) => u.includes(`<loc>${SITE_ORIGIN}${path}</loc>`)) || ''
      const lastmod = entry.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1]
      expect(new Date(lastmod).getTime(), 'lastmod = dateModified').toBe(new Date(article.dateModified).getTime())
      expect(entry.includes('xhtml:link'), 'hreflang in the sitemap only with both languages').toBe(Object.keys(alternates).length > 0)
    }
  })
})
