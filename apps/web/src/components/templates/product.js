import { t } from '@/lib/i18n'
import { productNode } from '@/lib/schema'
import { mediaUrl, mediaFile } from '@/lib/media'
import { Fact } from '../site/Fact'
import { Icon, CATEGORY_ICON } from '../site/Icon'
import { AnswerBlock, ConversionBand, MetaLine, Unbroken } from '../site/Contract'
import { SizesTable, AllergenBlock, LaCoupe, OfferBadge, PriceLine, familyOf, portionsLabel } from '../site/Products'
import { leadTimeText, offerBadge } from '../site/offer'
import { AddToBoxForm, AddLabel, pricedVariants } from '../catalogue/AddToBox'
import { LivePrice } from '../catalogue/LivePrice'
import { catalogueCopy } from '../catalogue/copy'
import { orderAction, phoneAction } from './shared'

// The picture: the owner's photos (« La coupe ») in an arch-topped frame, or the family's pastel surface with
// its line icon (decoration only, never a stand-in product image).
function ProductMedia({ product, locale }) {
  const family = familyOf(product)
  const photos = (product.photos || []).filter((p) => mediaFile(p))
  if (photos.length) {
    return (
      <div className={`product-media has-photo media-${family}`}>
        <LaCoupe photos={photos} caption={product.title} locale={locale} />
      </div>
    )
  }
  return (
    <div className={`product-media media-${family}`} aria-hidden="true">
      <span className="product-media-emblem icon-badge">
        <Icon name={CATEGORY_ICON[family] || 'sparkles'} size={72} strokeWidth={1.1} />
      </span>
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
  const order = orderAction(locale, served)
  const phone = phoneAction(business, locale)
  const formId = `pp-${product.id}-form`
  // The buy bar (phones) needs the form it submits: a product with no priced size has neither.
  const buyBar = canAdd && pricedVariants(product).length > 0
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
              (order || phone) && (
                <p className="product-actions">
                  {order && (
                    <a className="btn btn-primary" href={order.href} data-event={order.event} data-magnetic="">
                      {order.label}
                      <Icon name="arrow" size={20} />
                    </a>
                  )}
                  {phone && (
                    <a className="btn btn-quiet" href={phone.href} data-event={phone.event}>
                      <Icon name="phone" size={18} />
                      {phone.label}
                    </a>
                  )}
                </p>
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
        <SizesTable variants={product.variants} locale={locale} caption={`${product.title} · ${o.pricesCaption}`} />
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
          <p>{lead ? o.leadTime(lead) : <Fact value={null} label="délai de préparation" id="leadTimeHours" />}</p>
        </section>
        <AllergenBlock product={product} business={business} locale={locale} />
      </div>
      {/* A product that can be added keeps one action, its form: no second « Commander » that leaves the page. */}
      {!canAdd && <ConversionBand primary={order} secondary={phone} />}
      <MetaLine doc={product} locale={locale} />
    </article>
  )
}
ProductTemplate.schema = async ({ product, offer, url }) => [productNode({ product, offer, url, imageUrls: (product.photos || []).map((p) => mediaUrl(p, 'hero')).filter(Boolean) })]
