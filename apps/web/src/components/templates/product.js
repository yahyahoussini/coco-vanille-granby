import { t } from '@/lib/i18n'
import { productNode } from '@/lib/schema'
import { mediaUrl, mediaFile } from '@/lib/media'
import { Fact } from '../site/Fact'
import { Icon } from '../site/Icon'
import { StockPhoto } from '../site/StockPhoto'
import { productPhotoKey } from '@/lib/photos'
import { AnswerBlock, ConversionBand, MetaLine, Unbroken } from '../site/Contract'
import { SizesTable, AllergenBlock, Photo, OfferBadge, PriceLine, familyOf, portionsLabel } from '../site/Products'
import { leadTimeText, offerBadge, fromPriceCents } from '../site/offer'
import { AddToBoxForm, AddLabel, pricedVariants } from '../catalogue/AddToBox'
import { LivePrice } from '../catalogue/LivePrice'
import { catalogueCopy } from '../catalogue/copy'
import { phoneAction, mapsAction, addressLine } from './shared'

// The picture: the owner's first photo in an arch-topped frame, her other angles below, or, until she adds them, an illustration
// photo of the kind of product, labelled « Photo d'illustration » with its credit (src/lib/photos.js). The
// illustration never reaches the Product JSON-LD below (images: the shop's photos only).
function ProductMedia({ product, locale }) {
  const family = familyOf(product)
  const photos = (product.photos || []).filter((p) => mediaFile(p))
  if (photos.length) {
    const [first, ...others] = photos
    return (
      <div className="product-gallery">
        <div className={`product-media has-photo media-${family}`}>
          <figure className="product-figure">
            <Photo media={first} size="hero" priority />
            <figcaption>{product.title}</figcaption>
          </figure>
        </div>
        {others.length > 0 && (
          <ul className="product-angles">
            {others.slice(0, 3).map((p) => (
              <li key={p.id}>
                <Photo media={p} size="card" />
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }
  return (
    <div className={`product-media has-photo is-illustration media-${family}`}>
      <StockPhoto name={productPhotoKey(product)} locale={locale} priority sizes="(min-width: 60rem) 30rem, (min-width: 48rem) 45vw, 92vw" />
    </div>
  )
}

// ---------- Product: sizes table, verified allergens, lead time, the engine's availability (« Prête dès … ») ----------
export function ProductTemplate({ product, offer, shop, locale, business, served }) {
  const s = t(locale)
  const o = s.offer
  const lead = leadTimeText(product.leadTimeHours, locale)
  const portions = portionsLabel((product.variants || [])[0] || {}, locale)
  const orderingEnabled = Boolean(shop?.ordering?.enabled)
  const ready = offerBadge(offer, { orderingEnabled })?.tone === 'ready'
  const canAdd = Boolean(orderingEnabled && offer?.orderable)
  // Not orderable online (online ordering off, or this product not offered online): the actions are about THIS
  // product, by phone or at the shop, never the generic order page, which is about cakes and the online box.
  const phone = phoneAction(business, locale)
  const callToOrder = phone && { ...phone, label: `${s.actions.callToOrder} · ${business.phoneDisplay || business.phone}` }
  const maps = mapsAction(business, locale)
  const formId = `pp-${product.id}-form`
  // The buy bar (phones) needs the form it submits: a product with no priced size has neither.
  const buyBar = canAdd && pricedVariants(product).length > 0
  // Quoted cake by cake: no sizes table full of blanks, one sentence.
  const onRequest = Boolean(product.priceOnRequest) && fromPriceCents(product) === null
  return (
    <article className={`wrap page product family-${familyOf(product)}`}>
      <div className="product-head">
        <div className="product-intro">
          <h1>
            <Unbroken text={product.title} />
          </h1>
          {product.summary ? (
            <AnswerBlock text={product.summary} />
          ) : (
            <p className="answer">
              <Fact value={null} label="description du produit, 40 à 60 mots" id="summary" />
            </p>
          )}
          <div className="product-buy">
            <div className="product-price-row">
              <PriceLine product={product} locale={locale} className="price product-price" data-live-price={canAdd ? formId : undefined} />
              {portions && (
                <p className="product-portions" data-live-portions={canAdd ? formId : undefined}>
                  <Icon name="users" size={18} />
                  <span className="portions-text">{portions}</span>
                </p>
              )}
            </div>
            <div className="product-badges">
              <OfferBadge state={offer} orderingEnabled={orderingEnabled} />
            </div>
            {canAdd ? (
              <>
                <AddToBoxForm product={product} locale={locale} idPrefix={`pp-${product.id}`} className="product-add" id={formId} portions={(v) => portionsLabel(v, locale)} />
                <LivePrice formId={formId} locale={locale} />
              </>
            ) : (
              (callToOrder || maps) && (
                <>
                  <p className="product-actions">
                    {callToOrder && (
                      <a className="btn btn-primary" href={callToOrder.href} data-event={callToOrder.event} data-magnetic="">
                        <Icon name="phone" size={20} />
                        {callToOrder.label}
                      </a>
                    )}
                    {maps && (
                      <a className="btn btn-quiet" href={maps.href} data-event={maps.event} rel="noopener">
                        <Icon name="pin" size={18} />
                        {maps.label}
                      </a>
                    )}
                  </p>
                  <p className="product-offline-note">{o.notOnline(addressLine(business, locale))}</p>
                </>
              )
            )}
            {/* Phones: the price and « Ajouter » stay at hand, in place of the tab bar. Next to the form in the reading
                and tab order; the button submits that form (form attribute), so it works without JavaScript. */}
            {buyBar && (
              <div className="product-buybar">
                <PriceLine product={product} locale={locale} className="price buybar-price" fromLabel={catalogueCopy(locale).from} data-live-total={formId} />
                <button type="submit" form={formId} className="btn buybar-add">
                  <Icon name="box" size={20} />
                  <AddLabel locale={locale} />
                </button>
              </div>
            )}
          </div>
        </div>
        <ProductMedia product={product} locale={locale} />
      </div>
      <section aria-labelledby="product-sizes" className="product-sizes">
        <h2 id="product-sizes">{o.sizesTitle}</h2>
        {onRequest ? <p className="product-on-request">{o.onRequestLine}</p> : <SizesTable variants={product.variants} locale={locale} caption={`${product.title} · ${o.pricesCaption}`} />}
      </section>
      <div className="product-info">
        <section aria-labelledby="product-ready" className="info-card ready-card">
          <div className="info-card-head">
            <span className="info-card-icon icon-badge" aria-hidden="true">
              <Icon name="clock" size={24} />
            </span>
            <h2 id="product-ready">{o.readyTitle}</h2>
          </div>
          {ready && <OfferBadge state={offer} orderingEnabled={orderingEnabled} />}
          <p>{lead ? o.leadTime(lead) : onRequest ? o.leadOnRequest : <Fact value={null} label="délai de préparation" id="leadTimeHours" />}</p>
        </section>
        <AllergenBlock product={product} business={business} locale={locale} />
      </div>
      {/* A product that can be added keeps one action, its form: no second « Commander » that leaves the page. */}
      {!canAdd && <ConversionBand primary={callToOrder} secondary={maps} />}
      <MetaLine doc={product} locale={locale} />
    </article>
  )
}
ProductTemplate.schema = async ({ product, offer, url }) => [productNode({ product, offer, url, imageUrls: (product.photos || []).map((p) => mediaUrl(p, 'hero')).filter(Boolean) })]
