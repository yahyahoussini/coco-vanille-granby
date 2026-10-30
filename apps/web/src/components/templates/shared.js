import { t, longDate } from '@/lib/i18n'
import { PAGES, pathFor } from '@/lib/routes'
import { Fact } from '../site/Fact'
import { AnswerBlock, KeyFacts, Sections, Faq, ConversionBand, MetaLine, Unbroken } from '../site/Contract'
import { Ornament } from '../site/Ornament'

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

export function Missing({ text }) {
  if (!text) return null
  return <p className="notice fact-needed" data-nosnippet="">{text}</p>
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

// Generic page-contract template: h1 → answer → template content → sections → key facts → FAQ → action → meta.
// The answer stays the first paragraph of <main>; a page's missing condition (staging) is flagged right after it.
export function ContentTemplate({ doc, locale, conditionNotice, primary, secondary, children, keyFacts, keyFactsTitle, slot, boilerplate = false, className = '' }) {
  return (
    <article className={`wrap page ${className}`.trim()}>
      <header className="page-head">
        <Ornament name="vanilla" className="page-head-ornament" />
        <h1>{doc?.h1 || doc?.title ? <Unbroken text={doc?.h1 || doc?.title} /> : <Fact value={null} label="titre de la page" />}</h1>
        <AnswerBlock text={doc?.answer} />
        <Missing text={conditionNotice} />
      </header>
      {children}
      {boilerplate ? (
        <div data-nosnippet="">
          <Sections sections={doc?.sections} locale={locale} folds={false} />
          <Faq items={doc?.faq} locale={locale} />
        </div>
      ) : (
        <>
          <Sections sections={doc?.sections} slot={slot} locale={locale} />
          <KeyFacts items={keyFacts} locale={locale} title={keyFactsTitle} />
          <Faq items={doc?.faq} locale={locale} />
        </>
      )}
      <ConversionBand primary={primary} secondary={secondary} />
      <MetaLine doc={doc} locale={locale} />
    </article>
  )
}
