// Which registry pages the public site serves, per language (zero-invention rule, src/lib/facts.js).
//   show (CI, staging): every registry page renders; markers show; noindex while copy or facts are missing.
//   strict (production): a page answers only with its copy in that language and no [[FACT NEEDED]] marker.
// SitePage, hreflang, the sitemap and every internal link (footer, home, related pages) use this one rule,
// so production never links to a page it hides. Pure module (relative imports) for node --test.
import { PAGES, LOCALES, pathFor, alternatesFor, HTML_LANG } from './routes.js'
import { containsMarker } from './facts.js'

export const hasCopy = (doc) => Boolean(doc && typeof doc.title === 'string' && doc.title.trim())

// Copy in this language, nothing missing: may be indexed.
export const readyCopy = (doc) => hasCopy(doc) && !containsMarker(doc)

export const served = (doc, { strict = false } = {}) => !strict || readyCopy(doc)

// docs: page docs read in `locale` (any order). → Set of registry keys the site answers in that language.
// Under strict a language goes live with its home page: without it, nothing in that language is served
// (every page links home from its header). French first (Loi 96): an English or Spanish page is served only
// when its French page is (`french`, the French set), so no other language goes live before the French site.
export function servedKeys(docs = [], locale = 'fr', { strict = false, french = null } = {}) {
  const byKey = new Map(docs.map((d) => [d.key, d]))
  const frenchToo = (key) => locale === 'fr' || !pathFor(key, 'fr') || Boolean(french?.has(key))
  if (strict && !(pathFor('home', locale) && served(byKey.get('home'), { strict }) && frenchToo('home'))) return new Set()
  return new Set(PAGES.filter((p) => pathFor(p.key, locale) && served(byKey.get(p.key), { strict }) && (!strict || frenchToo(p.key))).map((p) => p.key))
}

// docsByLocale: { fr: [...], en: [...], es: [...] } → { fr: Set, en: Set, es: Set }, French computed first.
export function servedByLocale(docsByLocale = {}, { strict = false } = {}) {
  const fr = servedKeys(docsByLocale.fr || [], 'fr', { strict })
  return Object.fromEntries(LOCALES.map((l) => [l, l === 'fr' ? fr : servedKeys(docsByLocale[l] || [], l, { strict, french: fr })]))
}

const positive = (n) => typeof n === 'number' && Number.isFinite(n) && n > 0

// A product page states only facts: under strict it needs its description, every size with its price and
// servings, the lead time and allergens checked by a person (the template shows a marker for each missing one).
export function productReady(product) {
  const variants = product?.variants || []
  return (
    Boolean(product?.summary && String(product.summary).trim()) &&
    variants.length > 0 &&
    variants.every((v) => v?.label && positive(v.priceCents) && (positive(v.portionsMin) || positive(v.portionsMax))) &&
    positive(product.leadTimeHours) &&
    Boolean(product.allergensVerified?.at) &&
    !containsMarker(product)
  )
}

// servedHere: the Set of registry keys served in the product's language (servedKeys). In English or Spanish
// the French product (frProduct, the same document read in French) must be ready too: French first.
export const productServed = (product, { strict = false, servedHere, locale = 'fr', frProduct = null } = {}) =>
  !strict || (Boolean(servedHere?.has('home')) && productReady(product) && (locale === 'fr' || productReady(frProduct)))

// The registry's hreflang set, minus the languages the site does not answer (servedBy: { fr: Set, en: Set, es: Set }).
export function servedAlternates(key, servedBy = {}) {
  const all = alternatesFor(key)
  const out = {}
  for (const locale of LOCALES) {
    const tag = HTML_LANG[locale]
    if (all[tag] && servedBy[locale]?.has(key)) out[tag] = all[tag]
  }
  if (out['fr-CA']) out['x-default'] = all['x-default']
  return out
}
