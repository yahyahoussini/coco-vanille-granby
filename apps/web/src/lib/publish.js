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
export function servedKeys(docs = [], locale = 'fr', { strict = false } = {}) {
  const byKey = new Map(docs.map((d) => [d.key, d]))
  return new Set(PAGES.filter((p) => pathFor(p.key, locale) && served(byKey.get(p.key), { strict })).map((p) => p.key))
}

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
