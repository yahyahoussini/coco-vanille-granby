import Link from 'next/link'
import { getProducts, getCategories } from '@/lib/data'
import { Fact } from '../site/Fact'
import { Icon, CATEGORY_ICON } from '../site/Icon'
import { ProductGrid } from '../site/Products'
import { CategoryNav } from '../catalogue/CategoryNav'
import { catalogueCopy } from '../catalogue/copy'
import { ContentTemplate, categoryHref, orderAction } from './shared'

// ---------- Menu hub and category pages ----------
// Page contract kept: h1 → answer → family chips → sections (the product list sits in the first section's slot).
// Phones read the list as compact rows (photo, name, price, « + »); from 48rem it is the grid of cards.
async function CategoryList({ locale, productionCategory, level, products }) {
  const list = products || (await getProducts({ locale, productionCategory }))
  if (!list.length) return <p><Fact value={null} label="liste des produits confirmée par le propriétaire" id="products" /></p>
  return <ProductGrid products={list} locale={locale} level={level} layout="list" />
}

export async function MenuTemplate(props) {
  const { locale, served } = props
  const k = catalogueCopy(locale)
  const [categories, products] = await Promise.all([getCategories(locale), getProducts({ locale })])
  const list = (
    <div className="menu-families catalogue-slot">
      {categories.map((c) => {
        const href = categoryHref(c, locale, served)
        const items = products.filter((p) => p.productionCategory === c.productionCategory)
        return (
          <section key={c.id} aria-labelledby={`cat-${c.id}`} className={`menu-family family-${c.productionCategory}`}>
            <div className="menu-family-head">
              <span className="menu-family-emblem icon-badge" aria-hidden="true">
                <Icon name={CATEGORY_ICON[c.productionCategory] || 'sparkles'} size={28} strokeWidth={1.5} />
              </span>
              <div className="menu-family-titles">
                <h3 id={`cat-${c.id}`}>
                  {href ? (
                    <Link href={href}>
                      {c.title}
                      <Icon name="arrow" size={20} className="menu-family-arrow" />
                    </Link>
                  ) : (
                    c.title
                  )}
                </h3>
                {items.length > 0 && <span className="menu-family-count">{k.products(items.length)}</span>}
              </div>
              {c.intro && <p className="menu-family-intro">{c.intro}</p>}
            </div>
            <CategoryList locale={locale} products={items} level={4} />
          </section>
        )
      })}
    </div>
  )
  return (
    <ContentTemplate {...props} className="menu-page" primary={orderAction(locale, props.served)} slot={{ after: 0, node: list }}>
      <CategoryNav locale={locale} served={served} current="carte" />
    </ContentTemplate>
  )
}

export function CategoryTemplate(props) {
  const { page, locale, served } = props
  const list = (
    <div className="catalogue-slot">
      <CategoryList locale={locale} productionCategory={page.category} level={3} />
    </div>
  )
  return (
    <ContentTemplate {...props} className={`category category-${page.category} family-${page.category}`} primary={orderAction(locale, served)} slot={{ after: 0, node: list }}>
      <CategoryNav locale={locale} served={served} current={page.category} />
    </ContentTemplate>
  )
}
