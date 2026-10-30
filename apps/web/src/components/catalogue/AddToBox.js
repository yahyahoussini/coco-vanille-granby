// « Ajouter à ma boîte »: the plain POST to /svc/boite/ the order page has always used (works without JavaScript;
// the route reads the box from the form or the cookie, then opens « Ma boîte »). Shown only when the ordering
// engine says the product can be booked online; the caller decides that (state.orderable, ordering on).
import { money } from '@/lib/i18n'
import { Icon } from '../site/Icon'
import { catalogueCopy } from './copy'
import { QtyStepper } from './QtyStepper'

// Sizes with a real price, with their index in the product (the box stores the index).
export const pricedVariants = (product) => (product?.variants || []).map((v, i) => ({ ...v, index: i })).filter((v) => Number.isInteger(v.priceCents) && v.priceCents > 0)

function Base({ product, locale, boxToken }) {
  return (
    <>
      <input type="hidden" name="action" value="add" />
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="productId" value={product.id} />
      {boxToken && <input type="hidden" name="token" value={boxToken} />}
    </>
  )
}

// Round « + » on a product card. Only for a product sold in one size: a size is never picked for the customer
// (a choice of sizes goes through the product page or the order page).
export function AddPlus({ product, locale }) {
  const variants = pricedVariants(product)
  if (variants.length !== 1) return null
  const c = catalogueCopy(locale)
  return (
    <form method="post" action="/svc/boite/" className="card-add">
      <Base product={product} locale={locale} />
      <input type="hidden" name="variantIndex" value={variants[0].index} />
      <input type="hidden" name="qty" value="1" />
      <button type="submit" className="card-add-btn" aria-label={c.addNamed(product.title)}>
        <Icon name="plus" size={22} strokeWidth={2.25} />
      </button>
    </form>
  )
}

// The button's words: « Ajouter » shown, « à ma boîte » kept for screen readers where room is short (.add-btn-rest
// hidden by the stylesheet); the accessible name is always the whole « Ajouter à ma boîte ». One inline box, so the
// button's icon gap never lands between the two words.
export function AddLabel({ locale }) {
  const c = catalogueCopy(locale)
  return (
    <span className="add-btn-label">
      <span className="add-btn-short">{c.addShort}</span>
      <span className="add-btn-rest">{c.addRest}</span>
    </span>
  )
}

// The full form (order page: class « order-add »; product page): size when there is a choice, quantity (« − 1 + »
// once the script runs), button. `labels` lets the order page keep its own words ({ size, qty }); `id` names the
// form so a button elsewhere (the product page's buy bar) can submit it with the form attribute. Each size carries
// its price (and, given `portions`, its servings) for the product page's LivePrice.
export function AddToBoxForm({ product, locale, idPrefix, className = 'order-add', boxToken, labels = {}, id, portions }) {
  const variants = pricedVariants(product)
  if (!variants.length) return null
  const c = { ...catalogueCopy(locale), ...labels }
  return (
    <form method="post" action="/svc/boite/" className={className} id={id}>
      <Base product={product} locale={locale} boxToken={boxToken} />
      {variants.length > 1 ? (
        <div className="field field-size">
          <label htmlFor={`${idPrefix}-variant`}>{c.size}</label>
          <select id={`${idPrefix}-variant`} name="variantIndex" defaultValue={variants[0].index}>
            {variants.map((v) => (
              <option key={v.index} value={v.index} data-price-cents={v.priceCents} data-portions={portions?.(v) || undefined}>
                {v.label} · {money(v.priceCents, locale)}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <input type="hidden" name="variantIndex" value={variants[0].index} data-price-cents={variants[0].priceCents} />
      )}
      <div className="field field-qty">
        <label htmlFor={`${idPrefix}-qty`}>{c.qty}</label>
        <QtyStepper id={`${idPrefix}-qty`} labels={{ less: c.less, more: c.more }} />
      </div>
      <button type="submit" className="btn btn-primary add-btn">
        <Icon name="box" size={20} />
        <AddLabel locale={locale} />
      </button>
    </form>
  )
}
