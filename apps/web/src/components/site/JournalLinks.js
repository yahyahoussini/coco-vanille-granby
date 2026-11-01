import Link from 'next/link'
import { t } from '@/lib/i18n'
import { latestFor, postPath } from '@/lib/journal'

// « À lire dans le journal »: up to three served posts about this page (its key in their related pages), newest
// first, each linked by its own title. `posts`: the served posts of this language (lib/data.js getServedPosts).
export function JournalLinks({ pageKey, locale, posts = [] }) {
  const list = latestFor(posts, pageKey).filter((p) => postPath(p, locale))
  if (!pageKey || !list.length) return null
  return (
    <nav aria-labelledby="journal-links" className="wrap related journal-links">
      <h2 id="journal-links">{t(locale).journal.readAlso}</h2>
      <ul className="start-grid">
        {list.map((p) => (
          <li key={p.id}>
            <Link href={postPath(p, locale)}>{p.h1}</Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
