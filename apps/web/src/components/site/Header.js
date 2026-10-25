import Link from 'next/link'
import { t } from '@/lib/i18n'
import { LOCALES, pathFor, localeEnabled } from '@/lib/routes'

const NAV = ['carte', 'commander', 'nous-trouver', 'a-propos']

// Skip link → header → language switcher to the equivalent page (no flags; names in their own language).
export function Header({ locale, pageKey }) {
  const s = t(locale)
  const others = LOCALES.filter((l) => l !== locale && localeEnabled(l))
  return (
    <header className="site-header">
      <a className="skip" href="#contenu">{s.skip}</a>
      <div className="wrap header-row">
        <Link href={pathFor('home', locale)} className="wordmark" aria-label="Pâtisserie Coco Vanille">
          <span className="wordmark-small">Pâtisserie</span>
          <span className="wordmark-big">Coco Vanille</span>
        </Link>
        <nav aria-label={locale === 'fr' ? 'Navigation principale' : locale === 'en' ? 'Main navigation' : 'Navegación principal'}>
          <ul className="nav">
            {NAV.map((key) => {
              const href = pathFor(key, locale)
              if (!href) return null
              return (
                <li key={key}>
                  <Link href={href} aria-current={pageKey === key ? 'page' : undefined}>{s.nav[key]}</Link>
                </li>
              )
            })}
          </ul>
        </nav>
        <ul className="lang" aria-label="Langue · Language">
          {others.map((l) => {
            const href = (pageKey && pathFor(pageKey, l)) || pathFor('home', l)
            return (
              <li key={l}>
                <a href={href} hrefLang={l} lang={l}>{t(l).languageName}</a>
              </li>
            )
          })}
        </ul>
      </div>
    </header>
  )
}
