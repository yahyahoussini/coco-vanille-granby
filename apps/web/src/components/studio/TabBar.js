'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const ICONS = { aujourdhui: '◉', commandes: '☰', vitrine: '▦', demandes: '✎', avis: '★', semaine: '▤', agence: '◇', plus: '⋯' }

// Bottom tab bar per role, 5 slots max, 64 px targets (16 §2.1, §3.0).
export function TabBar({ tabs, badges = {} }) {
  const path = usePathname() || '/'
  const clean = path.replace(/^\/studio/, '') || '/'
  const current = (href) => (href === '/' ? clean === '/' : clean.startsWith(href))
  return (
    <nav className="st-tabs" aria-label="Écrans">
      <ul>
        {tabs.map((t) => (
          <li key={t.key}>
            <Link href={t.href} aria-current={current(t.href) ? 'page' : undefined}>
              <span aria-hidden="true">{ICONS[t.key] || '•'}</span>
              <span>
                {t.label}
                {badges[t.key] ? (
                  <span className="badge">
                    {badges[t.key]}
                    <span className="sr-only"> en attente</span>
                  </span>
                ) : null}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
