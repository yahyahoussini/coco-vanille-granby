import Link from 'next/link'
import { t, money, longDate } from '@/lib/i18n'
import { containsMarker } from '@/lib/facts'
import { mediaFile } from '@/lib/media'
import { getOfferStates, getShop } from '@/lib/data'
import { Fact } from './Fact'
import { sizeText, portionsText, priceText, perPortionText, fromPriceCents, leadTimeText, offerBadge } from './offer'

const prefixFor = (locale) => (locale === 'fr' ? '' : `/${locale}`)
// « Contient : » (fr, non-breaking space) · "Contains:" (en, es)
export const colon = (locale) => (locale === 'fr' ? '\u00a0:' : ':')
export const productPath = (p, locale) => (p?.category?.slug && p?.slug ? `${prefixFor(locale)}/${p.category.slug}/${p.slug}/` : null)

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

// « La coupe »: the whole cake, then the cross-section on hover or keyboard focus. Pure CSS, ready for
// the owner's photos (first = outside, second = the cut). One photo → a plain figure.
export function LaCoupe({ photos = [], caption, locale }) {
  const [outside, inside] = photos.filter((p) => mediaFile(p))
  if (!outside) return null
  if (!inside) {
    return (
      <figure className="product-figure">
        <Photo media={outside} size="hero" priority />
        {caption && <figcaption>{caption}</figcaption>}
      </figure>
    )
  }
  const hint = locale === 'en' ? 'Hover or focus to see the cut' : locale === 'es' ? 'Pase el cursor o enfoque para ver el corte' : 'Survolez ou sélectionnez pour voir la coupe'
  return (
    <figure className="product-figure la-coupe" tabIndex={0} aria-describedby="la-coupe-hint">
      <span className="la-coupe-stack">
        <Photo media={outside} size="hero" priority className="la-coupe-outside" />
        <Photo media={inside} size="hero" className="la-coupe-inside" />
      </span>
      <figcaption>
        {caption} <span id="la-coupe-hint" className="small">{hint}</span>
      </figcaption>
    </figure>
  )
}

// The engine's availability line (« Prête dès … », « Épuisé », « De retour le … »); a missing fact stays a marker.
export function OfferBadge({ state, orderingEnabled = false, skip = [] }) {
  const badge = offerBadge(state, { orderingEnabled })
  if (!badge || skip.includes(badge.tone)) return null
  return (
    <p className={`badge badge-${badge.tone}`} data-fact="availability">
      {containsMarker(badge.text) ? (
        <span className="fact-needed" data-nosnippet="">
          {badge.text}
        </span>
      ) : (
        badge.text
      )}
    </p>
  )
}

// Card for category, menu and vitrine lists: title link (whole card clickable), price as text, servings, lead time.
export function ProductCard({ product, locale, state, orderingEnabled, showPlanned = false, level = 3 }) {
  const Heading = `h${level}`
  const s = t(locale)
  const href = productPath(product, locale)
  const from = fromPriceCents(product)
  const firstVariant = (product.variants || [])[0] || {}
  const portions = portionsText(firstVariant, locale)
  const lead = leadTimeText(product.leadTimeHours, locale)
  const photo = (product.photos || [])[0]
  return (
    <li className="product-card">
      <Photo media={photo} />
      <Heading className="product-card-title">{href ? <Link href={href}>{product.title}</Link> : product.title}</Heading>
      {product.summary && <p className="product-card-summary">{product.summary}</p>}
      <p className="price">
        {from !== null ? `${s.priceFrom} ${money(from, locale)} (${s.taxesExtra})` : <Fact value={null} label={`prix — ${product.title}`} />}
      </p>
      {(portions || lead) && (
        <p className="small">
          {portions && `${portions} ${s.portions}`}
          {portions && lead && ' · '}
          {lead && s.offer.leadTime(lead)}
        </p>
      )}
      {showPlanned && typeof product.vitrinePlanned === 'number' && product.vitrinePlanned > 0 && (
        <p className="small">
          {product.vitrinePlanned} {s.home.planned}
        </p>
      )}
      <OfferBadge state={state} orderingEnabled={orderingEnabled} />
    </li>
  )
}

export async function ProductGrid({ products, locale, showPlanned, level }) {
  const [states, shop] = await Promise.all([getOfferStates(products, locale), getShop(locale)])
  const orderingEnabled = Boolean(shop?.ordering?.enabled)
  return (
    <ul className="product-grid">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} locale={locale} state={states.get(p.id)} orderingEnabled={orderingEnabled} showPlanned={showPlanned} level={level} />
      ))}
    </ul>
  )
}

// Sizes table (08 P2): the quotable fact. Price per serving only when both numbers exist.
export function SizesTable({ variants = [], locale, caption, showProduct, rows }) {
  const s = t(locale)
  const o = s.offer
  const list = rows || variants.map((variant) => ({ variant }))
  if (!list.length) return null
  const anyPerPortion = list.some(({ variant }) => perPortionText(variant, locale))
  // Focusable scroll region: a keyboard user can scroll a wide table on a phone (WCAG 2.1.1).
  return (
    <div className="table-scroll" role="region" aria-label={caption || o.pricesCaption} tabIndex={0}>
      <table className="sizes">
        <caption>{caption || o.pricesCaption}</caption>
        <thead>
          <tr>
            {showProduct && <th scope="col">{o.product}</th>}
            <th scope="col">{o.size}</th>
            <th scope="col">{o.portions}</th>
            <th scope="col">{o.price}</th>
            {anyPerPortion && <th scope="col">{o.perPortion}</th>}
          </tr>
        </thead>
        <tbody>
          {list.map(({ variant, product }, i) => {
            const price = priceText(variant, locale)
            return (
              <tr key={`${product?.id || ''}-${variant.id || i}`}>
                {showProduct && <td>{productPath(product, locale) ? <Link href={productPath(product, locale)}>{product.title}</Link> : product.title}</td>}
                <th scope="row">{sizeText(variant, locale) || <Fact value={null} label="nom du format" />}</th>
                <td>{portionsText(variant, locale) || <Fact value={null} label="portions" />}</td>
                <td>{price ? `${price} (${s.taxesExtra})` : <Fact value={null} label="prix" />}</td>
                {anyPerPortion && <td>{perPortionText(variant, locale) || '—'}</td>}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// Verified allergens only (G3: checked by a person, never by AI). Unverified → one marker, no list.
export function AllergenBlock({ product, business, locale, headingId = 'product-allergens' }) {
  const s = t(locale)
  const o = s.offer
  const verified = Boolean(product.allergensVerified?.at)
  const contains = (product.allergens || []).map((a) => a?.label).filter(Boolean)
  const may = (product.mayContain || []).map((a) => a?.label).filter(Boolean)
  return (
    <section aria-labelledby={headingId} className="allergen-block">
      <h2 id={headingId}>{o.allergensTitle}</h2>
      {verified ? (
        <>
          <p>
            <strong>{o.contains}{colon(locale)}</strong> {contains.length ? contains.join(', ') : '—'}
          </p>
          {may.length > 0 && (
            <p>
              <strong>{s.mayContain}{colon(locale)}</strong> {may.join(', ')}
            </p>
          )}
          <p className="small">
            {o.verifiedOn} <time dateTime={product.allergensVerified.at}>{longDate(product.allergensVerified.at, locale)}</time>
          </p>
        </>
      ) : (
        <p>
          <Fact value={null} label="allergènes vérifiés par une personne" />
        </p>
      )}
      {business?.phoneDisplay && <p>{o.allergyCall(business.phoneDisplay)}</p>}
    </section>
  )
}
