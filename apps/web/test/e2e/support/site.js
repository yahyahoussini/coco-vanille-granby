// Shared helpers for the e2e specs: raw HTTP as a crawler sees it, and the page list from the registry.
import http from 'node:http'
import https from 'node:https'
import { PAGES, HTML_LANG, SITE_ORIGIN, isIndexable, alternatesFor } from '../../../src/lib/routes.js'

export const PUBLIC_URL = (process.env.E2E_PUBLIC_URL || process.env.PUBLIC_ORIGIN || 'http://localhost:3000').replace(/\/$/, '')
export const ADMIN_URL = (process.env.E2E_ADMIN_URL || process.env.ADMIN_ORIGIN || 'http://admin.localhost:3000').replace(/\/$/, '')
export const ES_ENABLED = process.env.ENABLE_ES === 'true'
export const STRICT = process.env.PUBLISH_GUARD === 'strict'
export const BAKERY_ID = `${SITE_ORIGIN}/#bakery`
export { SITE_ORIGIN, HTML_LANG, PAGES, alternatesFor }

const loopback = (hostname) => hostname === 'localhost' || hostname.endsWith('.localhost')

// One request, no redirect following. *.localhost goes to 127.0.0.1 with the Host header kept,
// so the app's host routing (src/proxy.js) sees the real host name.
export function raw(url, { method = 'GET', headers = {}, timeout = 30_000 } = {}) {
  const u = new URL(url)
  const lib = u.protocol === 'https:' ? https : http
  return new Promise((resolve, reject) => {
    const req = lib.request(
      {
        method,
        hostname: loopback(u.hostname) ? '127.0.0.1' : u.hostname,
        port: u.port || (u.protocol === 'https:' ? 443 : 80),
        path: `${u.pathname}${u.search}`,
        headers: { host: u.host, 'user-agent': 'coco-e2e/1 (+playwright)', accept: 'text/html,application/xhtml+xml,*/*', ...headers },
        timeout,
      },
      (res) => {
        let body = ''
        res.setEncoding('utf8')
        res.on('data', (chunk) => (body += chunk))
        res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }))
      },
    )
    req.on('timeout', () => req.destroy(new Error(`timeout ${url}`)))
    req.on('error', reject)
    req.end()
  })
}

// Canonical https://cocovanillegranby.com/x/ → the server under test.
export const local = (canonicalUrl, base = PUBLIC_URL) => `${base}${new URL(canonicalUrl).pathname}`

// Indexable registry pages in the enabled locales (fr, en; es only when ENABLE_ES=true).
// Derived from src/lib/routes.js so pages added later are tested automatically.
export function indexablePages() {
  const locales = ['fr', 'en', ...(ES_ENABLED ? ['es'] : [])]
  const out = []
  for (const page of PAGES) {
    if (!isIndexable(page)) continue
    for (const locale of locales) {
      const path = page.paths[locale]
      if (path) out.push({ key: page.key, status: page.status, locale, path, canonical: `${SITE_ORIGIN}${path}` })
    }
  }
  return out
}

export const esPaths = () => PAGES.filter((p) => p.paths.es).map((p) => ({ key: p.key, path: p.paths.es }))

export const sitemapLocs = (xml) => [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1].replace(/&amp;/g, '&'))

// Parses HTML without running scripts (DOMParser in the browser) and returns what the checks need.
export async function inspect(page, html) {
  return page.evaluate((source) => {
    const doc = new DOMParser().parseFromString(source, 'text/html')
    const all = (sel) => [...doc.querySelectorAll(sel)]
    return {
      lang: doc.documentElement.getAttribute('lang'),
      title: doc.title,
      h1: all('h1').map((h) => h.textContent.trim()),
      canonical: all('link[rel="canonical"]').map((l) => l.getAttribute('href')),
      alternates: all('link[rel="alternate"][hreflang]').map((l) => ({ hreflang: l.getAttribute('hreflang'), href: l.getAttribute('href') })),
      robots: all('meta[name="robots"]').map((m) => m.getAttribute('content')),
      jsonld: all('script[type="application/ld+json"]').map((s) => s.textContent),
      images: all('img').map((img) => ({
        src: img.getAttribute('src'),
        alt: img.getAttribute('alt'),
        width: img.getAttribute('width'),
        height: img.getAttribute('height'),
      })),
      links: all('a[href]').map((a) => a.getAttribute('href')),
      ids: all('[id]').map((el) => el.id),
    }
  }, html)
}

// Flattens JSON-LD (single node, array or @graph) into a list of nodes.
export function ldNodes(blocks) {
  const nodes = []
  const add = (v) => {
    if (Array.isArray(v)) v.forEach(add)
    else if (v && typeof v === 'object') {
      nodes.push(v)
      if (v['@graph']) add(v['@graph'])
    }
  }
  blocks.forEach(add)
  return nodes
}

export const hasType = (node, type) => [].concat(node['@type'] || []).includes(type)
