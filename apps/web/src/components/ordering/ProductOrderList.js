// Products that can be ordered online, each with its « Prête dès … » line from the engine (08 P1) and a plain
// form that adds it to « Ma boîte » (works without JavaScript). Prices as text, taxes extra (07 C-9).
// Grouped by family in the menu's order, so a long list stays scannable; on a phone each product is a compact row
// (photo, name, price, readiness) with its size, quantity and « Ajouter » on one line below (ordering.css).
import { money } from '@/lib/i18n'
import { productPath, CardMedia, familyOf } from '@/components/site/Products'
import { AddToBoxForm, pricedVariants } from '@/components/catalogue/AddToBox'
import { Icon } from '@/components/site/Icon'
import { cutoffLine } from '@/lib/ordering/availability'
import { errorText } from '@/lib/ordering/errors'
import { boxPath } from '@/lib/ordering/paths'
import { boxCount } from '@/lib/ordering/box'
import { orderingCopy } from './copy'

// Families in the menu's order (the owner's category order), titled by the product's own category (populated with
// the product, no extra query); a product without a category comes last, untitled.
function byFamily(products) {
  const groups = new Map()
  for (const p of products) {
    const cat = typeof p.category === 'object' ? p.category : null
    const key = cat ? familyOf(p) : 'autre'
    if (!groups.has(key)) groups.set(key, { key, title: cat?.title || null, order: cat ? (cat.order ?? 999) : Infinity, products: [] })
    groups.get(key).products.push(p)
  }
  return [...groups.values()].sort((a, b) => a.order - b.order)
}

function OrderRow({ product: p, state: st = {}, locale, boxToken, level }) {
  const c = orderingCopy(locale).products
  const Heading = `h${level}`
  const variants = pricedVariants(p)
  const href = productPath(p, locale)
  const id = `p-${p.id}`
  return (
    <li className={`order-card family-${familyOf(p)}`} aria-labelledby={`${id}-title`}>
      <CardMedia product={p} className="order-card-media" iconSize={34} />
      <div className="order-card-body">
        <Heading id={`${id}-title`} className="order-card-title">
          {href ? <a href={href}>{p.title}</a> : p.title}
        </Heading>
        {variants.length > 0 && (
          <p className="price">
            {variants.length > 1 && <span className="price-from">{c.from} </span>}
            <span className="price-amount">{money(Math.min(...variants.map((v) => v.priceCents)), locale)}</span> <span className="price-tax">({c.taxes})</span>
          </p>
        )}
        {st.label && <p className={`order-ready ${st.orderable ? 'is-ready' : 'is-blocked'}`}>{st.label}</p>}
        {st.orderable ? (
          <AddToBoxForm product={p} locale={locale} idPrefix={id} className="order-add" boxToken={boxToken} labels={{ size: c.size, qty: c.qty }} />
        ) : (
          !st.label && st.reason && <p className="small order-reason">{errorText(st.reason, locale)}</p>
        )}
      </div>
    </li>
  )
}

export function ProductOrderList({ locale = 'fr', products = [], states, shop, boxToken, boxItems = [] }) {
  const c = orderingCopy(locale).products
  const count = boxCount(boxItems)
  const nextDay = products.some((p) => states.get(p.id)?.orderable && p.leadTimeHours === 24)
  const groups = byFamily(products)
  // One family (or none known): no family headings, the products keep their h3.
  const grouped = groups.length > 1
  return (
    <section className="order-products" aria-labelledby="commande-en-ligne">
      <div className="order-products-head">
        <div>
          <h2 id="commande-en-ligne">{c.title}</h2>
          <p>{c.intro}</p>
        </div>
        {count > 0 && (
          <p className="order-products-box">
            <a className="btn btn-quiet" href={boxPath(locale, boxToken)}>
              <Icon name="box" size={20} />
              {c.viewBox(count)}
            </a>
          </p>
        )}
      </div>
      {nextDay && <p className="badge badge-later order-cutoff">{cutoffLine(shop, locale)}</p>}
      {products.length === 0 ? (
        <p className="order-none">{c.none}</p>
      ) : (
        groups.map((g) => {
          const titled = grouped && Boolean(g.title)
          const Group = titled ? 'section' : 'div'
          return (
            <Group key={g.key} className={`order-group family-${g.key}`} aria-labelledby={titled ? `commande-${g.key}` : undefined}>
              {titled && (
                <h3 id={`commande-${g.key}`} className="order-group-title">
                  {g.title}
                </h3>
              )}
              <ul className="order-grid">
                {g.products.map((p) => (
                  <OrderRow key={p.id} product={p} state={states.get(p.id)} locale={locale} boxToken={boxToken} level={titled ? 4 : 3} />
                ))}
              </ul>
            </Group>
          )
        })
      )}
    </section>
  )
}
