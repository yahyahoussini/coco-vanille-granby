import { SITE_ORIGIN, HTML_LANG } from './routes.js'
import { isMissing } from './facts.js'
import { localParts, addDays } from './studio/time.js'

// One @graph per page (v1 L2/L8): Bakery + WebSite on every page, plus the page node.
// Rules: only values visible on the page; no self-serving review stars; nothing for missing facts.
export const BAKERY_ID = `${SITE_ORIGIN}/#bakery`
export const WEBSITE_ID = `${SITE_ORIGIN}/#website`

const clean = (obj) => {
  if (Array.isArray(obj)) return obj.map(clean).filter((v) => v !== undefined)
  if (obj && typeof obj === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(obj)) {
      const c = clean(v)
      if (c === undefined) continue
      if (Array.isArray(c) && c.length === 0) continue
      if (c && typeof c === 'object' && !Array.isArray(c) && Object.keys(c).length === 0) continue
      out[k] = c
    }
    return out
  }
  return isMissing(obj) ? undefined : obj
}

// Days an active exceptional closure (« Reste de la journée », « Jusqu’au… ») keeps the shop closed, from
// today to the day before it reopens (60 days at most); with no reopening date, today only.
export function closureDays(shop = {}, now = new Date()) {
  const c = shop?.closure
  if (!c?.active) return []
  const today = localParts(now).iso
  if (!c.until) return [today]
  const until = new Date(c.until)
  if (until.getTime() <= new Date(now).getTime()) return []
  const reopens = localParts(until).iso
  const days = []
  for (let d = today; d < reopens && days.length < 60; d = addDays(d, 1)) days.push(d)
  return days.length ? days : [today]
}

export function bakeryNode(business = {}, shop = {}, locale = 'fr', specialDays = [], { now = new Date() } = {}) {
  const a = business.address || {}
  const hours = (shop.hours || []).map((h) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: h.day,
    opens: h.opens,
    closes: h.closes,
  }))
  // Special days shown in the hours table (holidays, exceptional closures): closed = 00:00–00:00 (schema.org).
  // An exceptional closure (the site's banner) closes each of its days too, over any special day.
  const closed = closureDays(shop, now)
  const special = [...closed.map((date) => ({ date, state: 'closed' })), ...(specialDays || []).filter((d) => !closed.includes(d.date))]
    .filter((d) => d.state === 'closed' || (d.opens && d.closes && ['open', 'special'].includes(d.state)))
    .sort((x, y) => String(x.date).localeCompare(String(y.date)))
    .map((d) => ({
      '@type': 'OpeningHoursSpecification',
      validFrom: d.date,
      validThrough: d.date,
      opens: d.state === 'closed' ? '00:00' : d.opens,
      closes: d.state === 'closed' ? '00:00' : d.closes,
    }))
  return {
    '@type': 'Bakery',
    '@id': BAKERY_ID,
    name: business.name,
    alternateName: business.alternateName,
    description: business.categorySentence,
    url: `${SITE_ORIGIN}/`,
    telephone: business.phone,
    email: business.email,
    priceRange: business.priceRange,
    address: {
      '@type': 'PostalAddress',
      streetAddress: a.street,
      addressLocality: a.city,
      addressRegion: a.region,
      postalCode: a.postalCode,
      addressCountry: a.country,
    },
    geo: business.geo && business.geo.lat ? { '@type': 'GeoCoordinates', latitude: business.geo.lat, longitude: business.geo.lng } : undefined,
    hasMap: business.google && business.google.cid ? `https://maps.google.com/?cid=${business.google.cid}` : undefined,
    openingHoursSpecification: hours,
    specialOpeningHoursSpecification: special,
    sameAs: (business.sameAs || []).filter((s) => s.verified).map((s) => s.url),
    knowsLanguage: (business.languagesServed || ['fr']).map((l) => HTML_LANG[l]),
    inLanguage: HTML_LANG[locale],
  }
}

export function websiteNode() {
  return { '@type': 'WebSite', '@id': WEBSITE_ID, url: `${SITE_ORIGIN}/`, name: 'Pâtisserie Coco Vanille', publisher: { '@id': BAKERY_ID } }
}

export function webPageNode({ url, name, description, locale, dateModified, type = 'WebPage' }) {
  return {
    '@type': type,
    '@id': `${url}#webpage`,
    url,
    name,
    description,
    inLanguage: HTML_LANG[locale],
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': BAKERY_ID },
    dateModified,
  }
}

export function breadcrumbNode(url, crumbs) {
  if (!crumbs || crumbs.length < 2) return undefined
  return {
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.url })),
  }
}

// Availability per 06 (k): BackOrder + date for returning seasonal items, PreOrder only for never-sold items.
const AVAILABILITY = {
  instock: 'https://schema.org/InStock',
  soldout: 'https://schema.org/SoldOut',
  backorder: 'https://schema.org/BackOrder',
  preorder: 'https://schema.org/PreOrder',
  discontinued: 'https://schema.org/Discontinued',
}

// `offer` is the ordering engine's state (productOfferState): the same answer as the badge on the page.
// Without it (tests, feeds built elsewhere) the catalogue field decides.
const DATED = ['https://schema.org/BackOrder', 'https://schema.org/PreOrder']

export function productNode({ product, url, imageUrls = [], offer = null }) {
  const availability = offer?.schemaAvailability || AVAILABILITY[product.availability] || AVAILABILITY.instock
  const starts = offer ? (DATED.includes(availability) && offer.availabilityDate) || undefined : ['backorder', 'preorder'].includes(product.availability) ? product.availabilityDate : undefined
  const offers = (product.variants || [])
    .filter((v) => !isMissing(v.priceCents))
    .map((v) => ({
      '@type': 'Offer',
      name: v.label,
      price: (v.priceCents / 100).toFixed(2),
      priceCurrency: 'CAD',
      availability,
      availabilityStarts: starts,
      url,
      seller: { '@id': BAKERY_ID },
    }))
  return {
    '@type': 'Product',
    '@id': `${url}#product`,
    name: product.title,
    description: product.summary,
    image: imageUrls,
    brand: { '@type': 'Brand', name: 'Coco Vanille' },
    offers,
  }
}

export function graph(nodes) {
  return clean({ '@context': 'https://schema.org', '@graph': nodes.filter(Boolean) })
}
