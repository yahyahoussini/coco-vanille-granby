import { t, longDate } from '@/lib/i18n'
import { PAGES, pathFor } from '@/lib/routes'
import { Fact } from '../site/Fact'
import { AnswerBlock, KeyFacts, Sections, Faq, ConversionBand, MetaLine, Unbroken } from '../site/Contract'
import { Ornament } from '../site/Ornament'
import { Photo } from '../site/Products'
import { StockPhoto } from '../site/StockPhoto'
import { mediaFile } from '@/lib/media'
import { pagePhotoKey } from '@/lib/photos'

// Helpers shared by the page templates (index.js: home and content pages; menu.js; product.js).
// Every template receives { locale, business, shop, page, doc, conditionNotice } from SitePage (product pages: { product }).
// Facts come from the business/shop globals and the catalogue; a missing one renders as a marker (zero invention).

export const prefixFor = (locale) => (locale === 'fr' ? '' : `/${locale}`)
export const REGION = { QC: 'Québec' }

// `served` (lib/publish.js): a link only to a page the site answers in this language (show: every page).
export const answers = (served, locale, key) => !served || Boolean(served[locale]?.has(key))
export const pageHref = (served, locale, key) => (answers(served, locale, key) ? pathFor(key, locale) : null)
// A category's page is a registry page (template 'category'), found by its production category.
export function categoryHref(c, locale, served) {
  const page = PAGES.find((p) => p.template === 'category' && p.category === c.productionCategory)
  if (!c?.slug || (served && !(page && served[locale]?.has(page.key)))) return null
  return `${prefixFor(locale)}/${c.slug}/`
}

// `served` (lib/publish.js): no « Commander » button while the order page is not published in that language.
export function orderAction(locale, served) {
  const href = pathFor('commander', locale) || pathFor('commander', 'fr')
  if (served && !served[locale]?.has('commander')) return null
  return { href, label: t(locale).actions.order, event: 'order_click' }
}

export const googleMapsUrl = (business) => (business?.google?.cid ? `https://maps.google.com/?cid=${business.google.cid}` : null)

export function mapsAction(business, locale) {
  const href = googleMapsUrl(business)
  return href ? { href, label: t(locale).actions.directions, event: 'directions_click' } : null
}

export function phoneAction(business, locale) {
  if (!business?.phone) return null
  return { href: `tel:${business.phone}`, label: `${t(locale).actions.call} · ${business.phoneDisplay || business.phone}`, event: 'phone_click' }
}

// « 3, rue Court » in French, "3 rue Court" in English (the comma is French typography only).
export const streetFor = (a = {}, locale) => (a.street && locale !== 'fr' ? a.street.replace(/^(\d+),\s*/, '$1 ') : a.street)

export function addressLine(business, locale = 'fr') {
  const a = business?.address || {}
  if (!a.street || !a.city) return null
  const region = REGION[a.region] || a.region
  return locale === 'fr' ? `${a.street}, ${a.city} (${region}) ${a.postalCode || ''}`.trim() : `${streetFor(a, locale)}, ${a.city}, ${region} ${a.postalCode || ''}`.trim()
}

export const appleMapsUrl = (business) => {
  const a = business?.address
  if (!a?.street) return null
  const address = `${streetFor(a, 'en')}, ${a.city}, ${a.region} ${a.postalCode || ''}, Canada`.replace(/\s+,/g, ',')
  return `https://maps.apple.com/?address=${encodeURIComponent(address)}&q=${encodeURIComponent(business.name || 'Pâtisserie Coco Vanille')}`
}

const decimal = (n, locale) => new Intl.NumberFormat(locale === 'en' ? 'en-CA' : 'fr-CA', { maximumFractionDigits: 1 }).format(n)

// Google rating: only with a value AND its date, as text (never review markup on our own pages, v1 §10).
export function ratingOf(business, locale) {
  const g = business?.google || {}
  if (typeof g.rating !== 'number' || !g.ratingAsOf) return null
  return { rating: decimal(g.rating, locale), count: g.reviewCount, date: longDate(g.ratingAsOf, locale), iso: g.ratingAsOf }
}

// The picture after a page's h1 and answer (v1 Layer 10: a hero photo with a factual alt and a caption): the photo
// the owner gave the page (its « hero » field), else its illustration (src/lib/photos.js), credited. From 60rem it
// sits in the empty half of the page head (content.css), hence its `sizes`; a phone gets a low frame (site.css).
export function PageHero({ doc, locale }) {
  const own = doc?.hero && typeof doc.hero === 'object' && mediaFile(doc.hero, 'hero') ? doc.hero : null
  if (own) {
    return (
      <figure className="page-hero">
        <Photo media={own} size="hero" priority />
      </figure>
    )
  }
  const key = pagePhotoKey(doc?.key)
  return key ? <StockPhoto name={key} locale={locale} caption priority className="page-hero" sizes="(min-width: 60rem) 37rem, 92vw" /> : null
}

// Generic page-contract template: h1 → answer → hero picture → template content → sections → key facts → FAQ →
// action → meta. The answer stays the first paragraph of <main>. Legal and utility pages (boilerplate) have no picture.
// The picture is the last thing in the head, so a computer can lay it beside the h1 and the answer (content.css).
export function ContentTemplate({ doc, locale, primary, secondary, children, keyFacts, keyFactsTitle, slot, boilerplate = false, folds = true, className = '' }) {
  return (
    <article className={`wrap page ${className}`.trim()}>
      <header className="page-head">
        <Ornament name="vanilla" className="page-head-ornament" />
        <h1>{doc?.h1 || doc?.title ? <Unbroken text={doc?.h1 || doc?.title} /> : <Fact value={null} label="titre de la page" />}</h1>
        <AnswerBlock text={doc?.answer} />
        {!boilerplate && <PageHero doc={doc} locale={locale} />}
      </header>
      {children}
      {boilerplate ? (
        <div data-nosnippet="">
          <Sections sections={doc?.sections} locale={locale} folds={false} />
          <Faq items={doc?.faq} locale={locale} />
        </div>
      ) : (
        <>
          <Sections sections={doc?.sections} slot={slot} locale={locale} folds={folds} />
          <KeyFacts items={keyFacts} locale={locale} title={keyFactsTitle} fold />
          <Faq items={doc?.faq} locale={locale} />
        </>
      )}
      <ConversionBand primary={primary} secondary={secondary} />
      <MetaLine doc={doc} locale={locale} />
    </article>
  )
}
