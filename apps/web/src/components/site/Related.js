import Link from 'next/link'
import { t } from '@/lib/i18n'
import { PAGES, pathFor } from '@/lib/routes'

// « À consulter aussi »: the registry pages under this one (00 §5.2 tree), when the site answers them.
export function RelatedPages({ pageKey, locale, served }) {
  const s = t(locale)
  const children = PAGES.filter((p) => p.parent === pageKey && p.status !== 'utility' && pathFor(p.key, locale) && (!served || served.has(p.key)))
  if (!pageKey || pageKey === 'home' || !children.length) return null
  return (
    <nav aria-labelledby="related-pages" className="wrap related">
      <h2 id="related-pages">{s.related}</h2>
      <ul className="start-grid">
        {children.map((p) => (
          <li key={p.key}>
            <Link href={pathFor(p.key, locale)}>{s.pageNames[p.key] || s.nav[p.key]}</Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
