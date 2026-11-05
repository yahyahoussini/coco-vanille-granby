import Link from 'next/link'
import { t } from '@/lib/i18n'
import { PAGES, pathFor } from '@/lib/routes'

// « À consulter aussi »: the registry pages under this one (00 §5.2 tree), when the site answers them. One compact
// line of plain links, no cards (styles: journal.css .related-line): on /carte/ they are the page's own family
// names and chips again, so they stay for the crawl and the reader who reached the foot of the page, and take no room.
export function RelatedPages({ pageKey, locale, served }) {
  const s = t(locale)
  const children = PAGES.filter((p) => p.parent === pageKey && p.status !== 'utility' && pathFor(p.key, locale) && (!served || served.has(p.key)))
  if (!pageKey || pageKey === 'home' || !children.length) return null
  return (
    <nav aria-labelledby="related-pages" className="wrap related related-line">
      <h2 id="related-pages">{s.related}</h2>
      <ul>
        {children.map((p) => (
          <li key={p.key}>
            <Link href={pathFor(p.key, locale)}>{s.pageNames[p.key] || s.nav[p.key]}</Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
