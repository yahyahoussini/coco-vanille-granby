import Link from 'next/link'
import { t } from '@/lib/i18n'
import { LOCALES, HTML_LANG, SITE_ORIGIN, pathFor, localeEnabled } from '@/lib/routes'

const NAV = ['carte', 'commander', 'nous-trouver', 'a-propos']

// Skip link → header → language switcher to the equivalent page (no flags; names in their own language).
// `served` ({ fr: Set, en: Set, es: Set }, lib/publish.js): only pages the site answers get a link.
// `alternates`: the page's hreflang map (a product's own URL in each language); otherwise that language's
// home, and no entry at all for a language the site does not answer.
export function Header({ locale, pageKey, served, alternates = null }) {
  const s = t(locale)
  const answers = (key, l) => !served || served[l]?.has(key)
  const toPath = (url) => (url && url.startsWith(SITE_ORIGIN) ? url.slice(SITE_ORIGIN.length) || '/' : null)
  const switchTo = (l) => toPath(alternates?.[HTML_LANG[l]]) || (pageKey && answers(pageKey, l) && pathFor(pageKey, l)) || (answers('home', l) && pathFor('home', l)) || null
  const others = LOCALES.filter((l) => l !== locale && localeEnabled(l)).map((l) => ({ l, href: switchTo(l) })).filter((o) => o.href)
  return (
    <header className="site-header">
      <a className="skip" href="#contenu">{s.skip}</a>
      <div className="wrap header-row">
        <Link href={pathFor('home', locale)} className="wordmark">
          <span className="wordmark-small">Pâtisserie</span> <span className="wordmark-big">Coco Vanille</span>
        </Link>
        <nav aria-label={locale === 'fr' ? 'Navigation principale' : locale === 'en' ? 'Main navigation' : 'Navegación principal'}>
          <ul className="nav">
            {NAV.map((key) => {
              const href = pathFor(key, locale)
              if (!href || !answers(key, locale)) return null
              return (
                <li key={key}>
                  <Link href={href} aria-current={pageKey === key ? 'page' : undefined}>{s.nav[key]}</Link>
                </li>
              )
            })}
          </ul>
        </nav>
        {others.length > 0 && (
          <ul className="lang" aria-label="Langue · Language">
            {others.map(({ l, href }) => (
              <li key={l}>
                <a href={href} hrefLang={l} lang={l}>{t(l).languageName}</a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </header>
  )
}
