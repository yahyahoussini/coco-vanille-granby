// URLs the public site can answer, known without the database: the registry (src/lib/routes.js), the box
// token routes, product URLs under a category page, and a few route handlers. src/proxy.js sends anything else
// to the 404 page of its language, rendered on the server with header and footer: under several root layouts,
// Next's own not-found ships an empty HTML shell that crawlers (and the gate) cannot read.
// Pure module (relative imports only): the proxy and node --test load it.
import { PAGES, localeEnabled } from './routes.js'

export const NOT_FOUND_PATHS = { fr: '/page-introuvable/', en: '/en/page-not-found/', es: '/es/pagina-no-encontrada/' }

const SLUG = /^[a-z0-9][a-z0-9-]*$/
const TOKEN = /^[A-Za-z0-9_-]{1,64}$/
const ROUTES = ['/avis/']
const pathsOf = (filter) => PAGES.filter(filter).flatMap((p) => Object.entries(p.paths).map(([locale, path]) => ({ locale, path })))

export const localeOfPath = (pathname = '/') => (pathname === '/en/' || pathname.startsWith('/en/') ? 'en' : pathname === '/es/' || pathname.startsWith('/es/') ? 'es' : 'fr')

// The 404 page that answers for this path: its language, or French when that language is off.
export const notFoundPathFor = (pathname) => {
  const locale = localeOfPath(pathname)
  return NOT_FOUND_PATHS[localeEnabled(locale) ? locale : 'fr']
}

export function isKnownPublicPath(pathname = '/') {
  const locale = localeOfPath(pathname)
  if (!localeEnabled(locale)) return false
  if (ROUTES.includes(pathname)) return true
  if (PAGES.some((p) => p.paths[locale] === pathname)) return true
  const rest = (prefix) => (pathname.startsWith(prefix) ? pathname.slice(prefix.length).split('/').filter(Boolean) : null)
  // « Ma boîte » keeps its token in the path: /boite/<token>/
  for (const { path } of pathsOf((p) => p.template === 'box').filter((x) => x.locale === locale)) {
    const r = rest(path)
    if (r && r.length === 1 && TOKEN.test(r[0])) return true
  }
  // Products: /<category page>/<product slug>/ (SitePage checks the product itself).
  for (const { path } of pathsOf((p) => p.template === 'category').filter((x) => x.locale === locale)) {
    const r = rest(path)
    if (r && r.length === 1 && SLUG.test(r[0])) return true
  }
  return false
}
