import Link from 'next/link'
import { t, money, longDate } from '@/lib/i18n'
import { containsMarker, publishGuard } from '@/lib/facts'
import { productReady } from '@/lib/publish'
import { mediaFile } from '@/lib/media'
import { getOfferStates, getShop } from '@/lib/data'
import { Fact } from './Fact'
import { Icon } from './Icon'
import { StockPhoto } from './StockPhoto'
import { productPhotoKey } from '@/lib/photos'
import { sizeText, portionsText, priceText, perPortionText, fromPriceCents, leadTimeText, offerBadge, servings, firstSentence } from './offer'
import { catalogueCopy } from '../catalogue/copy'
import { AddPlus, pricedVariants } from '../catalogue/AddToBox'
import { Fold } from '../catalogue/Fold'
import { KeepPhone } from '../catalogue/KeepPhone'

const prefixFor = (locale) => (locale === 'fr' ? '' : `/${locale}`)
// « Contient : » (fr, non-breaking space) · "Contains:" (en, es)
export const colon = (locale) => (locale === 'fr' ? ' :' : ':')
// Under PUBLISH_GUARD=strict a product with missing facts has no page (lib/publish.js): no link to it either.
// In English or Spanish the French version must be ready too (frenchReady, lib/data.js getProducts).
const linkable = (p) => publishGuard() !== 'strict' || (productReady(p) && p.frenchReady !== false)
export const productPath = (p, locale) => (p?.category?.slug && p?.slug && linkable(p) ? `${prefixFor(locale)}/${p.category.slug}/${p.slug}/` : null)

// The production family (viennoiseries, pains, patisseries, gateaux): the card's pastel surface and line icon.
export const familyOf = (product) => product?.productionCategory || product?.category?.productionCategory || 'autre'

// « 8 à 10 portions », « 1 portion »: the first size's servings, as a phrase.
export function portionsLabel(variant, locale) {
  const n = portionsText(variant, locale)
  if (!n) return null
  return n === '1' ? catalogueCopy(locale).portionOne : `${n} ${t(locale).portions}`
}

// Real photos only (v1 L19): alt from the media record, intrinsic size always set (no layout shift).
// Served from /media/<file> on the public host (lib/media.js), never Payload's /api URL.
export function Photo({ media, size = 'card', priority = false, className, lang }) {
  const file = mediaFile(media, size)
  if (!file?.width || !file?.height) return null
  return (
    <img
      className={className}
      src={file.path}
      alt={media.alt || ''}
      lang={lang}
      width={file.width}
      height={file.height}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
    />
  )
}

// The picture area of a card: the owner's photo, or, until she adds one, an illustration photo of the kind of
// product (src/lib/photos.js productPhotoKey).
export function CardMedia({ product, className = '', size = 'card', priority = false, locale = 'fr', sizes = '(min-width: 60rem) 18rem, (min-width: 48rem) 33vw, 50vw' }) {
  const family = familyOf(product)
  const photo = (product?.photos || []).find((p) => mediaFile(p, size))
  if (photo) {
    return (
      <div className={`card-media has-photo media-${family} ${className}`.trim()}>
        <Photo media={photo} size={size} priority={priority} />
      </div>
    )
  }
  return (
    <div className={`card-media has-photo is-illustration media-${family} ${className}`.trim()}>
      <StockPhoto name={productPhotoKey(product)} locale={locale} priority={priority} sizes={sizes} />
    </div>
  )
}

// The engine's availability line (« Prête dès … », « Épuisé », « De retour le … »).
export function OfferBadge({ state, orderingEnabled = false, skip = [] }) {
  const badge = offerBadge(state, { orderingEnabled })
  if (!badge || skip.includes(badge.tone)) return null
  return (
    <p className={`badge badge-${badge.tone}`} data-fact="availability">
      {containsMarker(badge.text) ? (
        <span className="fact-needed" data-marker={badge.text} data-nosnippet="" />
      ) : (
        badge.text
      )}
    </p>
  )
}

// Price as text, before taxes: « 4,25 $ », « à partir de 38,00 $ » when there are several sizes.
// `fromLabel` swaps the « à partir de » for a shorter word where room is tight (cards: « dès »). `note` adds the words
// after the price, « taxes en sus », with « prix indicatif » for a price the owner has not checked yet (Studio ›
// Produits): for a price that stands alone, the product page's buy box. A list says them once, above it (PriceNote).
export function PriceLine({ product, locale, className = 'price', fromLabel, note = false, ...attributes }) {
  const s = t(locale)
  const from = fromPriceCents(product)
  const several = (product.variants || []).length > 1
  return (
    <p className={className} {...attributes}>
      {from !== null ? (
        <>
          {several && <span className="price-from">{fromLabel || s.priceFrom} </span>}
          <span className="price-amount">{money(from, locale)}</span>
          {note && (
            <>
              {' '}
              <span className="price-tax">({product.priceEstimated ? `${s.offer.indicative}, ${s.taxesExtra}` : s.taxesExtra})</span>
            </>
          )}
        </>
      ) : product.priceOnRequest ? (
        <span className="price-request">{s.offer.priceOnRequest}</span>
      ) : (
        <Fact value={null} label="prix" />
      )}
    </p>
  )
}

// The one line above a list of prices, in place of a note on every row: « Prix indicatifs, taxes en sus. » as soon as
// one listed product has a price the owner has not checked yet, else « Taxes en sus. ».
export function PriceNote({ products = [], locale }) {
  const k = catalogueCopy(locale)
  if (!products.some((p) => fromPriceCents(p) !== null)) return null
  return <p className="price-note">{products.some((p) => p.priceEstimated) ? k.pricesIndicative : k.pricesTaxes}</p>
}

// Card for category, menu and vitrine lists: the title link is the card's name and its whole hit area; price as
// text, servings, lead time, the engine's badge, and a « + » when the product can be booked online in one size.
// The grid's layout (catalogue.css) decides the shape: a row (list), a tall card (rail) or a tile (grid).
export function ProductCard({ product, locale, state, orderingEnabled, showPlanned = false, level = 3 }) {
  const Heading = `h${level}`
  const s = t(locale)
  const k = catalogueCopy(locale)
  const href = productPath(product, locale)
  const portions = portionsLabel((product.variants || [])[0] || {}, locale)
  const lead = leadTimeText(product.leadTimeHours, locale)
  const planned = showPlanned && typeof product.vitrinePlanned === 'number' && product.vitrinePlanned > 0 ? product.vitrinePlanned : null
  const tone = offerBadge(state, { orderingEnabled })?.tone
  const canAdd = Boolean(orderingEnabled && state?.orderable)
  return (
    <li className={`product-card family-${familyOf(product)}${tone === 'soldout' ? ' is-soldout' : ''}`} data-spotlight="" data-reveal="">
      <CardMedia product={product} locale={locale} className="product-card-media" />
      <Heading className="product-card-title">{href ? <Link href={href}>{product.title}</Link> : product.title}</Heading>
      {product.summary && <p className="product-card-summary">{firstSentence(product.summary)}</p>}
      <OfferBadge state={state} orderingEnabled={orderingEnabled} />
      {(portions || lead || planned) && (
        <p className="product-card-meta">
          {portions && (
            <span>
              <Icon name="users" size={16} />
              {portions}
            </span>
          )}
          {lead && (
            <span>
              <Icon name="clock" size={16} />
              {/* « 24 h », « 2 jours »: the number never ends a line without its unit. */}
              {k.ahead(lead.replace(/ /g, ' '))}
            </span>
          )}
          {planned && (
            <span>
              <Icon name="store" size={16} />
              {planned} {s.home.planned}
            </span>
          )}
        </p>
      )}
      <div className="product-card-foot">
        <PriceLine product={product} locale={locale} fromLabel={k.from} />
        {canAdd && <AddPlus product={product} locale={locale} />}
        {/* A row with no « + » (several sizes, or not sold online) ends the same way, with a chevron: the whole card
            is its title link already, so the chevron is decoration only. */}
        {href && !(canAdd && pricedVariants(product).length === 1) && (
          <span className="card-go" aria-hidden="true">
            <Icon name="chevron" size={20} />
          </span>
        )}
      </div>
    </li>
  )
}

// layout (phones only; from 48rem every layout is the same grid of cards):
//   'grid' two tiles a row · 'list' compact rows, photo on the left (menu, categories) · 'rail' one swipeable row
//   of tall cards (home vitrine, with the shared .rail of site.css).
const LAYOUTS = ['grid', 'list', 'rail']

// A long list keeps its first `after` items in view and folds the rest; a fold is worth a tap from 4 items on.
const splitForFold = (items, after) => (after && items.length - after >= 4 ? [items.slice(0, after), items.slice(after)] : [items, []])

// `foldAfter`: the first products in view, the others in a <details> « Voir les N autres »: their links stay in the HTML.
export async function ProductGrid({ products: all, locale, showPlanned, level, layout = 'grid', foldAfter, priceNote = true }) {
  // Production (strict) lists only products whose facts are complete: a card never shows a marker there.
  const products = publishGuard() === 'strict' ? all.filter(linkable) : all
  const [states, shop] = await Promise.all([getOfferStates(products, locale), getShop(locale)])
  const orderingEnabled = Boolean(shop?.ordering?.enabled)
  const shape = LAYOUTS.includes(layout) ? layout : 'grid'
  const [shown, folded] = splitForFold(products, foldAfter)
  const grid = (items) => (
    <ul className={`product-grid product-grid--${shape}${shape === 'rail' ? ' rail' : ''}`} data-reveal-stagger="">
      {items.map((p) => (
        <ProductCard key={p.id} product={p} locale={locale} state={states.get(p.id)} orderingEnabled={orderingEnabled} showPlanned={showPlanned} level={level} />
      ))}
    </ul>
  )
  return (
    <>
      {priceNote && <PriceNote products={products} locale={locale} />}
      {grid(shown)}
      {folded.length > 0 && <Fold summary={catalogueCopy(locale).seeOthers(folded.length)}>{grid(folded)}</Fold>}
    </>
  )
}

// Sizes table (08 P2): the quotable fact. Price per serving only when both numbers exist.
// On a phone (catalogue.css) one product's sizes become small cards: the first cell is the title, the price sits
// beside it and the other cells show their column name (data-label). Several products (showProduct: calculator)
// become one compact row per size, the numbers followed by their unit (data-unit, shown for the eye only).
// The explicit table roles keep it a table for screen readers once the stylesheet changes how the rows are displayed.
// The caption is the one line about the prices (PriceNote's words), never a note on each row, and never the heading
// again: the section's h2 already asks « Quels formats et à quel prix? ».
export function SizesTable({ variants = [], locale, showProduct, rows, estimated = false }) {
  const s = t(locale)
  const o = s.offer
  const k = catalogueCopy(locale)
  const list = rows || variants.map((variant) => ({ variant }))
  if (!list.length) return null
  const anyPerPortion = list.some(({ variant }) => perPortionText(variant, locale))
  const portionsUnit = (n) => (showProduct && n ? (n === '1' ? k.portionUnit : s.portions) : undefined)
  // Focusable scroll region: a keyboard user can scroll a wide table on a phone (WCAG 2.1.1).
  return (
    <div className="table-scroll sizes-scroll" role="region" aria-label={o.pricesCaption} tabIndex={0}>
      <table className={showProduct ? 'sizes sizes-products' : 'sizes'} role="table">
        <caption>{estimated || list.some(({ product }) => product?.priceEstimated) ? k.pricesIndicative : k.pricesTaxes}</caption>
        <thead role="rowgroup">
          <tr role="row">
            {showProduct && (
              <th scope="col" role="columnheader">
                {o.product}
              </th>
            )}
            <th scope="col" role="columnheader">
              {o.size}
            </th>
            <th scope="col" role="columnheader">
              {o.portions}
            </th>
            <th scope="col" role="columnheader" className="sizes-num">
              {o.price}
            </th>
            {anyPerPortion && (
              <th scope="col" role="columnheader" className="sizes-num">
                {o.perPortion}
              </th>
            )}
          </tr>
        </thead>
        <tbody role="rowgroup">
          {list.map(({ variant, product }, i) => {
            const price = priceText(variant, locale)
            const portions = portionsText(variant, locale)
            const perPortion = perPortionText(variant, locale)
            return (
              <tr key={`${product?.id || ''}-${variant.id || i}`} role="row">
                {showProduct && (
                  <td role="cell" className="sizes-head">
                    {productPath(product, locale) ? <Link href={productPath(product, locale)}>{product.title}</Link> : product.title}
                  </td>
                )}
                <th scope="row" role="rowheader" className={showProduct ? 'sizes-detail' : 'sizes-head'} data-label={o.size}>
                  {sizeText(variant, locale) || <Fact value={null} label="nom du format" />}
                </th>
                <td role="cell" className="sizes-detail" data-label={o.portions} data-unit={portionsUnit(portions)}>
                  {portions || (product?.priceOnRequest ? '—' : <Fact value={null} label="portions" />)}
                </td>
                <td role="cell" className="sizes-num sizes-price-cell" data-label={o.price}>
                  {price ? (
                    <strong className="sizes-price">{price}</strong>
                  ) : product?.priceOnRequest ? (
                    <span className="sizes-on-request">{o.onRequest}</span>
                  ) : (
                    <Fact value={null} label="prix" />
                  )}
                </td>
                {anyPerPortion && (
                  <td role="cell" className={perPortion ? 'sizes-num sizes-detail' : 'sizes-num sizes-detail sizes-none'} data-label={o.perPortion} data-unit={showProduct && perPortion ? o.each.replace(/ /g, ' ') : undefined}>
                    {perPortion || '—'}
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// The price list of one family (/prix/): one <tbody> per product, so a name prints once beside its sizes: a row
// header for one size, a row-group header (rowspan) for several, each size then its own row header. The price per
// serving says nothing new when the size is one serving, so it stays out. The first products stay in view, the others
// go in a second table with the same columns, inside a <details> « Voir les N autres ». On a phone (catalogue.css) a
// product is one block: its name, then per size a line « size, price » and a small line « servings · per serving »;
// the units are for the eye only (data-unit), and the explicit roles keep it a table for screen readers.
export function PriceTable({ products = [], locale, caption, foldAfter }) {
  const s = t(locale)
  const o = s.offer
  const k = catalogueCopy(locale)
  const perServing = (variant) => (servings(variant) === 1 ? null : perPortionText(variant, locale))
  const anyPerServing = products.some((p) => (p.variants || []).some(perServing))
  const [shown, folded] = splitForFold(products, foldAfter)
  const table = (items) => (
    <div className="table-scroll sizes-scroll" role="region" aria-label={caption} tabIndex={0}>
      <table className="sizes price-table" role="table">
        <caption>{caption}</caption>
        <thead role="rowgroup">
          <tr role="row">
            <th scope="col" role="columnheader">
              {o.product}
            </th>
            <th scope="col" role="columnheader">
              {o.size}
            </th>
            <th scope="col" role="columnheader">
              {o.portions}
            </th>
            <th scope="col" role="columnheader" className="sizes-num">
              {o.price}
            </th>
            {anyPerServing && (
              <th scope="col" role="columnheader" className="sizes-num">
                {o.perPortion}
              </th>
            )}
          </tr>
        </thead>
        {items.map((product) => {
          const sizes = product.variants || []
          const several = sizes.length > 1
          const href = productPath(product, locale)
          return (
            <tbody key={product.id} role="rowgroup" className={several ? 'price-group price-group-sizes' : 'price-group'}>
              {sizes.map((variant, i) => {
                const price = priceText(variant, locale)
                const portions = portionsText(variant, locale)
                const each = perServing(variant)
                const Size = several ? 'th' : 'td'
                return (
                  <tr key={variant.id || i} role="row">
                    {i === 0 && (
                      <th scope={several ? 'rowgroup' : 'row'} rowSpan={several ? sizes.length : undefined} role="rowheader" className="price-name">
                        {href ? <Link href={href}>{product.title}</Link> : product.title}
                      </th>
                    )}
                    <Size scope={several ? 'row' : undefined} role={several ? 'rowheader' : 'cell'} className="price-size">
                      {sizeText(variant, locale) || <Fact value={null} label="nom du format" />}
                    </Size>
                    <td role="cell" className="price-portions" data-unit={portions ? (portions === '1' ? k.portionUnit : s.portions) : undefined}>
                      {portions || (product.priceOnRequest ? '—' : <Fact value={null} label="portions" />)}
                    </td>
                    <td role="cell" className="sizes-num sizes-price-cell">
                      {price ? (
                        <strong className="sizes-price">{price}</strong>
                      ) : product.priceOnRequest ? (
                        <span className="sizes-on-request">{o.onRequest}</span>
                      ) : (
                        <Fact value={null} label="prix" />
                      )}
                    </td>
                    {anyPerServing && (
                      <td role="cell" className={each ? 'sizes-num price-each' : 'sizes-num price-each sizes-none'} data-unit={each ? o.each.replace(/ /g, ' ') : undefined}>
                        {each || '—'}
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          )
        })}
      </table>
    </div>
  )
  return (
    <>
      {table(shown)}
      {folded.length > 0 && <Fold summary={k.seeOthers(folded.length)}>{table(folded)}</Fold>}
    </>
  )
}

// Verified allergens only (G3: checked by a person, never by AI). Unverified: no list, the customer asks the shop.
export function AllergenBlock({ product, business, locale, headingId = 'product-allergens' }) {
  const s = t(locale)
  const o = s.offer
  const verified = Boolean(product.allergensVerified?.at)
  const contains = (product.allergens || []).map((a) => a?.label).filter(Boolean)
  const may = (product.mayContain || []).map((a) => a?.label).filter(Boolean)
  return (
    <section aria-labelledby={headingId} className="allergen-block info-card">
      <div className="info-card-head">
        <span className="info-card-icon icon-badge" aria-hidden="true">
          <Icon name="leaf" size={24} />
        </span>
        <h2 id={headingId}>{o.allergensTitle}</h2>
      </div>
      {verified ? (
        <>
          <p className="allergen-line">
            <strong>{o.contains}{colon(locale)}</strong> {contains.length ? contains.join(', ') : '—'}
          </p>
          {may.length > 0 && (
            <p className="allergen-line">
              <strong>{s.mayContain}{colon(locale)}</strong> {may.join(', ')}
            </p>
          )}
          <p className="small">
            {o.verifiedOn} <time dateTime={product.allergensVerified.at}>{longDate(product.allergensVerified.at, locale)}</time>
          </p>
        </>
      ) : (
        <p>{o.allergensAsk}</p>
      )}
      {business?.phoneDisplay && (
        <p className="info-card-note">
          <KeepPhone text={o.allergyCall(business.phoneDisplay)} phone={business.phoneDisplay} />
        </p>
      )}
    </section>
  )
}
