import Link from 'next/link'
import { getCategories } from '@/lib/data'
import { Icon, CATEGORY_ICON } from '../site/Icon'
import { categoryHref, pageHref } from '../templates/shared'
import { catalogueCopy } from './copy'
import { CurrentChip } from './CurrentChip'

// The menu's families as a row of chips (sticky under the header while the list scrolls; one swipeable line on a
// phone): plain links to the flat category URLs (/viennoiseries/, /gateaux/ …), never query filters. The current
// page is marked with aria-current and brought into view. `current`: 'carte' on the menu hub, or the production
// category of a category page.
export async function CategoryNav({ locale, served, current }) {
  const k = catalogueCopy(locale)
  const categories = await getCategories(locale)
  const all = pageHref(served, locale, 'carte')
  const chips = [
    all && { key: 'carte', href: all, label: k.wholeMenu, icon: 'menu' },
    ...categories.map((c) => ({ key: c.productionCategory, href: categoryHref(c, locale, served), label: c.title, icon: CATEGORY_ICON[c.productionCategory] || 'sparkles' })),
  ].filter((c) => c && c.href)
  if (chips.length < 2) return null
  return (
    <nav className="cat-nav" aria-label={k.families}>
      <ul className="cat-nav-list">
        {chips.map((c) => (
          <li key={c.key}>
            <Link className={`chip cat-chip family-${c.key}`} href={c.href} aria-current={c.key === current ? 'page' : undefined}>
              <span className="cat-chip-icon">
                <Icon name={c.icon} size={18} />
              </span>
              {c.label}
            </Link>
          </li>
        ))}
      </ul>
      <CurrentChip />
    </nav>
  )
}
