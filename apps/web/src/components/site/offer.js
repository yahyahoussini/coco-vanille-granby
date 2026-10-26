// Pure offer logic shared by the product, prices, calculator and seasonal templates.
// No React and relative imports only, so node --test can load it. Missing facts return null:
// the caller renders a marker, never a guess.
import { money, longDate } from '../../lib/i18n.js'

const positive = (n) => typeof n === 'number' && Number.isFinite(n) && n > 0

// Guests a size can feed: the top of the owner's range (« 12 à 16 portions » feeds 16), or the single number given.
export const servings = (v = {}) => (positive(v.portionsMax) ? v.portionsMax : positive(v.portionsMin) ? v.portionsMin : null)

export function portionsText(v = {}, locale = 'fr') {
  const min = positive(v.portionsMin) ? v.portionsMin : null
  const max = positive(v.portionsMax) ? v.portionsMax : null
  if (!min && !max) return null
  if (min && max && max > min) return locale === 'en' ? `${min}–${max}` : `${min} à ${max}`
  return String(min || max)
}

// 8 po (20 cm) · 8-inch (20 cm): inches first (04 §3.1 rule), centimetres rounded.
export function inchesText(inches, locale = 'fr') {
  if (!positive(inches)) return null
  const cm = Math.round(inches * 2.54)
  if (locale === 'en') return `${inches}-inch (${cm} cm)`
  if (locale === 'es') return `${cm} cm (${inches} pulgadas)`
  return `${inches} po (${cm} cm)`
}

// « 8 po (20 cm) » when the label already names the inches, « Format familial · 8 po (20 cm) » otherwise.
export function sizeText(v = {}, locale = 'fr') {
  const inches = inchesText(v.sizeInches, locale)
  if (!inches) return v.label || ''
  if (!v.label) return inches
  if (new RegExp(`(^|\\D)${v.sizeInches}(\\D|$)`).test(v.label)) return `${v.label} (${Math.round(v.sizeInches * 2.54)} cm)`
  return `${v.label} · ${inches}`
}

export const priceText = (v = {}, locale = 'fr') => (positive(v.priceCents) ? money(v.priceCents, locale) : null)

// Shown only when both the price and the servings exist (prices template contract).
export function perPortionText(v = {}, locale = 'fr') {
  if (!positive(v.priceCents)) return null
  const min = positive(v.portionsMin) ? v.portionsMin : null
  const max = positive(v.portionsMax) ? v.portionsMax : null
  if (!min && !max) return null
  const high = Math.round(v.priceCents / (min || max))
  const low = Math.round(v.priceCents / (max || min))
  if (low === high) return money(high, locale)
  return locale === 'en' ? `${money(low, locale)}–${money(high, locale)}` : `${money(low, locale)} à ${money(high, locale)}`
}

export function fromPriceCents(product = {}) {
  const prices = (product.variants || []).map((v) => v.priceCents).filter(positive)
  return prices.length ? Math.min(...prices) : null
}

// « 48 h » under two days, then whole days (« 3 jours »). 0 or empty = not set by the owner.
export function leadTimeText(hours, locale = 'fr') {
  if (!positive(hours)) return null
  if (hours < 48) return locale === 'en' ? `${hours} hours` : locale === 'es' ? `${hours} horas` : `${hours} h`
  const days = Math.ceil(hours / 24)
  return locale === 'en' ? `${days} days` : locale === 'es' ? `${days} días` : `${days} jours`
}

// ?invites=N → an integer between 1 and 1000, or null.
export function parseGuests(value) {
  const raw = Array.isArray(value) ? value[0] : value
  if (raw === undefined || raw === null || raw === '') return null
  const n = Number(String(raw).trim())
  return Number.isInteger(n) && n >= 1 && n <= 1000 ? n : null
}

// Sizes that feed at least `guests`, smallest first, then cheapest. `known` counts sizes with servings,
// so the template can tell "no size is big enough" from "no servings published yet".
export function matchSizes(products = [], guests) {
  const all = []
  for (const product of products) {
    for (const variant of product.variants || []) {
      const feeds = servings(variant)
      if (feeds) all.push({ product, variant, feeds })
    }
  }
  const matches = guests
    ? all
        .filter((m) => m.feeds >= guests)
        .sort((a, b) => a.feeds - b.feeds || (a.variant.priceCents ?? Infinity) - (b.variant.priceCents ?? Infinity))
    : []
  return { known: all.length, matches, largest: all.reduce((n, m) => Math.max(n, m.feeds), 0) }
}

const toDate = (v) => (v ? new Date(v) : null)
const valid = (d) => d instanceof Date && !Number.isNaN(d.getTime())

// Seasonal page state machine (08 P3): soon → open → full → over (« De retour en … »). Never a 404.
export function seasonState(season, { now = new Date(), products = [] } = {}) {
  if (!season) return { state: 'unknown' }
  const opens = toDate(season.preorderOpensAt)
  const closes = toDate(season.preorderClosesAt)
  const pickups = (season.pickupDates || []).map((p) => toDate(p.date)).filter(valid).sort((a, b) => a - b)
  const lastPickup = pickups.at(-1) || null
  const base = { opens, closes, pickups, lastPickup }
  if (!valid(opens) || !valid(closes)) return { ...base, state: 'unknown' }
  const end = lastPickup && lastPickup > closes ? lastPickup : closes
  if (now > end) {
    const back = new Date(opens)
    back.setFullYear(back.getFullYear() + 1)
    return { ...base, state: 'over', back }
  }
  if (now < opens) return { ...base, state: 'soon' }
  const seasonal = products.filter((p) => p.availability !== 'discontinued')
  const soldOut = seasonal.length > 0 && seasonal.every((p) => p.availability === 'soldout')
  if (now > closes || soldOut) return { ...base, state: 'full' }
  return { ...base, state: 'open' }
}

// « novembre 2027 » / "November 2027"
export function monthYear(date, locale = 'fr') {
  if (!valid(date)) return ''
  const tag = locale === 'en' ? 'en-CA' : locale === 'es' ? 'es' : 'fr-CA'
  return new Intl.DateTimeFormat(tag, { month: 'long', year: 'numeric', timeZone: 'America/Toronto' }).format(date)
}

// Date line for returning (BackOrder) and new (PreOrder) products (06 k).
export function availabilityLine(product = {}, labels, locale = 'fr') {
  const date = product.availabilityDate ? longDate(product.availabilityDate, locale) : null
  switch (product.availability) {
    case 'soldout':
      return { tone: 'soldout', text: product.soldOutUntil ? `${labels.soldOut} · ${labels.backOn} ${longDate(product.soldOutUntil, locale)}` : labels.soldOut }
    case 'backorder':
      return { tone: 'later', text: date ? `${labels.backOn} ${date}` : null, missing: !date }
    case 'preorder':
      return { tone: 'later', text: date ? `${labels.preorderFrom} ${date}` : null, missing: !date }
    case 'instock':
      return { tone: 'instock', text: labels.inStock }
    default:
      return null
  }
}
