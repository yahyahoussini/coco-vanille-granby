// Products that can be ordered online, each with its « Prête dès … » line from the engine (08 P1) and a plain
// form that adds it to « Ma boîte » (works without JavaScript). Prices as text, taxes extra (07 C-9).
import { money } from '@/lib/i18n'
import { productPath, Photo } from '@/components/site/Products'
import { cutoffLine } from '@/lib/ordering/availability'
import { errorText } from '@/lib/ordering/errors'
import { boxPath } from '@/lib/ordering/paths'
import { boxCount } from '@/lib/ordering/box'
import { orderingCopy } from './copy'

const priced = (p) => (p.variants || []).map((v, i) => ({ ...v, index: i })).filter((v) => Number.isInteger(v.priceCents) && v.priceCents > 0)

export function ProductOrderList({ locale = 'fr', products = [], states, shop, boxToken, boxItems = [] }) {
  const c = orderingCopy(locale).products
  const count = boxCount(boxItems)
  const nextDay = products.some((p) => states.get(p.id)?.orderable && p.leadTimeHours === 24)
  return (
    <section className="order-products" aria-labelledby="commande-en-ligne">
      <h2 id="commande-en-ligne">{c.title}</h2>
      <p>{c.intro}</p>
      {nextDay && <p className="badge badge-later order-cutoff">{cutoffLine(shop, locale)}</p>}
      {count > 0 && (
        <p>
          <a className="btn btn-quiet" href={boxPath(locale, boxToken)}>
            {c.viewBox(count)}
          </a>
        </p>
      )}
      {products.length === 0 ? (
        <p>{c.none}</p>
      ) : (
        <ul className="order-grid">
          {products.map((p) => {
            const st = states.get(p.id) || {}
            const variants = priced(p)
            const href = productPath(p, locale)
            const id = `p-${p.id}`
            return (
              <li key={p.id} className="order-card" aria-labelledby={`${id}-title`}>
                <Photo media={(p.photos || [])[0]} />
                <h3 id={`${id}-title`} className="order-card-title">
                  {href ? <a href={href}>{p.title}</a> : p.title}
                </h3>
                {variants.length > 0 && (
                  <p className="price">
                    {money(Math.min(...variants.map((v) => v.priceCents)), locale)} <span className="small">({c.taxes})</span>
                  </p>
                )}
                {st.label && <p className={`order-ready ${st.orderable ? 'is-ready' : 'is-blocked'}`}>{st.label}</p>}
                {st.orderable ? (
                  <form method="post" action="/svc/boite/" className="order-add">
                    <input type="hidden" name="action" value="add" />
                    <input type="hidden" name="locale" value={locale} />
                    <input type="hidden" name="productId" value={p.id} />
                    {boxToken && <input type="hidden" name="token" value={boxToken} />}
                    {variants.length > 1 ? (
                      <div className="field">
                        <label htmlFor={`${id}-variant`}>{c.size}</label>
                        <select id={`${id}-variant`} name="variantIndex" defaultValue={variants[0].index}>
                          {variants.map((v) => (
                            <option key={v.index} value={v.index}>
                              {v.label} · {money(v.priceCents, locale)}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <input type="hidden" name="variantIndex" value={variants[0]?.index ?? 0} />
                    )}
                    <div className="field field-qty">
                      <label htmlFor={`${id}-qty`}>{c.qty}</label>
                      <input id={`${id}-qty`} name="qty" type="number" inputMode="numeric" min={1} max={50} step={1} defaultValue={1} />
                    </div>
                    <button type="submit" className="btn btn-primary">
                      {c.add}
                    </button>
                  </form>
                ) : (
                  !st.label && st.reason && <p className="small">{errorText(st.reason, locale)}</p>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
