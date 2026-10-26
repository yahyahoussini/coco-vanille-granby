// Pure helpers for scripts/gate.mjs (unit-tested in scripts/test/gate.test.js).
import { MARKER_RE } from '../src/lib/facts.js'

export const SITE = 'https://cocovanillegranby.com'
const MARKERS_G = new RegExp(MARKER_RE.source, 'g')

// rank-first page types (tools/audit.mjs kind()): only the ones whose rules differ from "content".
const AUDIT_TYPE = { home: 'home', legal: 'legal', visit: 'contact', about: 'about' }

// Every indexable FR/EN page of the registry (src/lib/routes.js), plus ES when it is switched on.
export function gatePages(pages, { es = false } = {}) {
  const locales = es ? ['fr', 'en', 'es'] : ['fr', 'en']
  const out = []
  for (const page of pages) {
    if (page.status === 'utility') continue
    for (const locale of locales) {
      const path = page.paths[locale]
      if (path) out.push({ key: page.key, locale, path, status: page.status, type: AUDIT_TYPE[page.template] })
    }
  }
  return out
}

// site.config.json for the rank-first tools (audit, links, serp, ai-runs, weekly…): site, languages and
// pages from the registry; brand, NAP and sameAs from the canonical entity in data/facts.json, and only
// the fields that hold a real value (a [[FACT NEEDED]] entity field is left out, never guessed).
export function siteConfig(pages, { es = false, entity = null } = {}) {
  const others = es ? ['en', 'es'] : ['en']
  const hreflang = { fr: 'fr-CA', en: 'en-CA', ...(es ? { es: 'es' } : {}) }
  const known = (v) => (typeof v === 'string' && v && !MARKER_RE.test(v) ? v : undefined)
  const cfg = {
    site: SITE,
    languages: { default: 'fr', others, hreflang },
    urlPolicy: { trailingSlash: true, www: false },
    brand: { name: known(entity?.name) || 'Coco Vanille' },
    pages: pages
      .filter((p) => p.status !== 'utility' && p.paths.fr)
      .map((p) => {
        const alt = {}
        for (const l of others) if (p.paths[l]) alt[l] = p.paths[l]
        return { path: p.paths.fr, alt, ...(AUDIT_TYPE[p.template] ? { type: AUDIT_TYPE[p.template] } : {}) }
      }),
  }
  if (entity) {
    const city = known(entity.address?.addressLocality)
    const phone = known(entity.telephone)
    if (city || phone) cfg.nap = { ...(city ? { city } : {}), ...(phone ? { phone } : {}) }
    if (city) cfg.category = { city: { fr: city } }
    if (typeof entity.geo?.latitude === 'number' && typeof entity.geo?.longitude === 'number') cfg.geo = { lat: entity.geo.latitude, lng: entity.geo.longitude }
    const sameAs = (entity.sameAs || []).filter(known)
    if (sameAs.length) cfg.sameAs = sameAs
  }
  return cfg
}

// Same normalisation as tools/links.mjs: internal path with a trailing slash, or null (external, mailto, tel…).
export function normalizeHref(href, site = SITE) {
  let h = String(href || '').trim().replace(/&amp;/g, '&')
  if (h.startsWith(site)) h = h.slice(site.length) || '/'
  if (!h.startsWith('/') || h.startsWith('//')) return null
  h = h.replace(/[#?].*$/, '')
  if (!h.endsWith('/') && !/\.[a-z0-9]+$/i.test(h)) h += '/'
  return h
}

export function internalLinks(html, site = SITE) {
  const out = new Set()
  for (const m of html.matchAll(/<a\b[^>]*\bhref\s*=\s*["']([^"']+)["']/gi)) {
    const path = normalizeHref(m[1], site)
    if (path) out.add(path)
  }
  return [...out]
}

export const sitemapPaths = (xml, site = SITE) =>
  [...String(xml).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => normalizeHref(m[1].trim(), site)).filter(Boolean)

export const markersIn = (html) => [...new Set(String(html).match(MARKERS_G) || [])]

const isMarkerFail = (message) => /^placeholder left in page: "\[\[FACT NEEDED/.test(message)
const robotsNoindex = (html) => /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html)
// The publish guard keeps a page with a marker out of the index on purpose (src/lib/facts.js), and
// such a page has no public title or description yet: those FAILs come from the missing copy.
const GUARDED = [/^content page is noindex$/, /^missing <title>$/, /^missing meta description$/, /^duplicate title, also on /]
const isGuarded = (message, html) => markersIn(html).length > 0 && robotsNoindex(html) && GUARDED.some((re) => re.test(message))

// tools/audit.mjs only recognises Organization, LocalBusiness and a list of type names as the
// business node; schema.org's FoodEstablishment subtypes (Bakery…) are missing from that list.
// Accepted only when the page really carries such a node with a name and an address.
const FOOD_TYPES = new Set(['Bakery', 'FoodEstablishment', 'CafeOrCoffeeShop', 'Restaurant', 'LocalBusiness', 'Organization'])
export function hasBusinessNode(html) {
  for (const m of String(html).matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    let data
    try {
      data = JSON.parse(m[1])
    } catch {
      continue
    }
    const nodes = (Array.isArray(data) ? data : [data]).flatMap((d) => (d && d['@graph'] ? d['@graph'] : [d]))
    for (const n of nodes) {
      const types = [].concat(n?.['@type'] || [])
      if (types.some((t) => FOOD_TYPES.has(t)) && n.name && n.address) return true
    }
  }
  return false
}
const isToolGap = (message, html) => message.startsWith('no Organization/LocalBusiness node in JSON-LD') && hasBusinessNode(html)

// Splits audit.mjs FAILs into: explained by a [[FACT NEEDED]] marker, known audit.mjs false
// positives (checked on the page itself), and real defects.
export function classifyAudit(report, htmlByPath) {
  const marker = []
  const toolGap = []
  const real = []
  for (const page of report.pages || []) {
    const html = htmlByPath[page.path] || ''
    for (const message of page.fails || []) {
      const item = { where: page.path, message }
      if (isMarkerFail(message) || isGuarded(message, html)) marker.push(item)
      else if (isToolGap(message, html)) toolGap.push(item)
      else real.push(item)
    }
  }
  for (const message of report.site?.fails || []) real.push({ where: 'site', message })
  return { marker, toolGap, real }
}

// links.mjs prints each FAIL as "✗ <path>: <reason>".
export function linkFails(output) {
  return String(output)
    .replace(/\x1b\[[0-9;]*m/g, '')
    .split('\n')
    .filter((l) => l.trimStart().startsWith('✗'))
    .map((l) => {
      const text = l.trim().slice(1).trim()
      const i = text.indexOf(': ')
      return i > 0 ? { where: text.slice(0, i), message: text.slice(i + 2) } : { where: 'links', message: text }
    })
}

// The owner's to-do list: each distinct marker with the pages that show it, most pages first.
export function ownerTodo(htmlByPath) {
  const byMarker = new Map()
  for (const [path, html] of Object.entries(htmlByPath)) {
    for (const m of markersIn(html)) {
      if (!byMarker.has(m)) byMarker.set(m, new Set())
      byMarker.get(m).add(path)
    }
  }
  return [...byMarker.entries()]
    .map(([marker, paths]) => ({ fact: marker.replace(/^\[\[FACT NEEDED:?\s*/, '').replace(/\]\]$/, '').trim(), marker, pages: [...paths].sort() }))
    .sort((a, b) => b.pages.length - a.pages.length || a.fact.localeCompare(b.fact, 'fr'))
}

export function todoMarkdown(todo, { base, generated }) {
  const lines = [
    '# Faits à fournir (propriétaire) · Owner to-do',
    '',
    `Généré par scripts/gate.mjs le ${generated} sur ${base}. Chaque ligne est un fait manquant ([[FACT NEEDED]]) : la page ne se publie pas tant qu'il manque (PUBLISH_GUARD=strict).`,
    '',
    '| # | Fait à fournir | Pages |',
    '|---|---|---|',
    ...todo.map((t, i) => `| ${i + 1} | ${t.fact.replace(/\|/g, '\\|')} | ${t.pages.join(', ')} |`),
    '',
  ]
  return lines.join('\n')
}
