// Catalogue product + variant → the engine line used by capacity, slots, tax and totals.
// Every number comes from the product as the owner entered it; a missing one becomes a blocker, never a guess.
import { taxBlocker } from './tax.js'
import { dayOf, nextOpening } from '../studio/time.js'

const positive = (n) => typeof n === 'number' && Number.isFinite(n) && n > 0
export const MAX_QTY = 50

const seasonOf = (product) => (product?.season && typeof product.season === 'object' ? product.season : null)

// Seasonal (date-first) items are picked up only on the season's dates, and ordered only while it is open.
export function seasonRule(product, now = new Date()) {
  const s = seasonOf(product)
  if (!s) return null
  const days = (s.pickupDates || []).map((p) => dayOf(p.date)).filter(Boolean).sort()
  const t = new Date(now).getTime()
  const opens = s.preorderOpensAt ? new Date(s.preorderOpensAt).getTime() : null
  const closes = s.preorderClosesAt ? new Date(s.preorderClosesAt).getTime() : null
  const open = (opens === null || t >= opens) && (closes === null || t <= closes)
  return { key: s.key, days: days.length ? days : null, open, opensAt: s.preorderOpensAt || null, closesAt: s.preorderClosesAt || null }
}

export function productLine(product, variantIndex = 0, qty = 1, { message = '', now = new Date() } = {}) {
  const variant = product?.variants?.[variantIndex] || null
  const unitsEach = positive(product?.capacityUnits) ? product.capacityUnits : 1
  return {
    productId: product?.id ?? null,
    variantIndex,
    qty,
    title: product?.title || '',
    variantLabel: variant?.label || '',
    cents: variant?.priceCents ?? null,
    taxClass: product?.taxClass || 'pending',
    unitGrams: variant?.unitWeightGrams ?? null,
    packCount: variant?.packCount ?? null,
    productionCategory: product?.productionCategory || null,
    units: qty * unitsEach,
    productionOffsetDays: Number.isInteger(product?.productionOffsetDays) && product.productionOffsetDays > 0 ? product.productionOffsetDays : 0,
    leadTimeHours: product?.leadTimeHours ?? null,
    season: seasonRule(product, now),
    message: message || '',
    messageMax: positive(product?.cakeMessageMax) ? product.cakeMessageMax : 0,
  }
}

// « Épuisé » lasts until soldOutUntil, or by default until the next opening after it was set.
export function effectiveAvailability(product, shop = {}, now = new Date()) {
  const a = product?.availability || 'instock'
  if (a !== 'soldout') return a
  const t = new Date(now).getTime()
  if (product.soldOutUntil) return new Date(product.soldOutUntil).getTime() > t ? 'soldout' : 'instock'
  const reopen = product.updatedAt ? nextOpening(shop, new Date(product.updatedAt)) : null
  return reopen && reopen.getTime() <= t ? 'instock' : 'soldout'
}

// Reasons a line cannot be booked, as codes the UI and Studio translate.
// source 'web' also needs the product flagged « commandable en ligne » and in sale.
export function lineBlockers(product, line, { source = 'web', shop = {}, now = new Date() } = {}) {
  const out = []
  if (!product) return ['product_missing']
  if (product._status && product._status !== 'published') out.push('product_unpublished')
  const availability = effectiveAvailability(product, shop, now)
  if (['discontinued', 'soldout'].includes(availability)) out.push(`product_${availability}`)
  if (source === 'web' && !product.onlineOrderable) out.push('not_online')
  if (!product.variants?.[line.variantIndex]) out.push('variant_missing')
  if (!positive(line.cents) || !Number.isInteger(line.cents)) out.push('price_missing')
  const tax = taxBlocker(line)
  if (tax) out.push(tax)
  if (!positive(line.leadTimeHours)) out.push('lead_time_missing')
  if (!line.productionCategory) out.push('category_missing')
  if (!Number.isInteger(line.qty) || line.qty < 1 || line.qty > MAX_QTY) out.push('qty_invalid')
  if (line.message) {
    if (!line.messageMax) out.push('message_not_allowed')
    else if ([...line.message].length > line.messageMax) out.push('message_too_long')
  }
  if (line.season && !line.season.open) out.push('season_closed')
  return out
}
