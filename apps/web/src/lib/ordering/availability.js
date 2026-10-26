// When can a box be picked up? Earliest pickup (« Prête dès … »), bookable days and windows, and the
// product availability state shared by the page, the JSON-LD and the feed (06 k, 10 §8.1).
// Pure functions: the caller passes the shop global, capacity pools and usage. America/Toronto throughout.
import { localParts, addDays, toMinutes, zonedTime, dayOf } from '../studio/time.js'
import { clock } from '../i18n.js'
import { poolsCheck } from './capacity.js'
import { windowSettings, hoursKnown, busyMinutes, onlinePaused, closureUntil, dayWindows, horizonDays, toConfirmDay } from './slots.js'
import { productLine, lineBlockers, effectiveAvailability } from './lines.js'
import { engineLabels, dayLabel } from './labels.js'

const HOUR = 3600 * 1000

// Online ordering as a whole: disabled (request form instead), paused, closed, or open.
// Studio phone orders ignore « disabled » and « paused » (source 'phone').
export function onlineState(shop = {}, now = new Date(), { source = 'web' } = {}) {
  if (source === 'web' && !shop.ordering?.enabled) return { open: false, reason: 'disabled' }
  if (source === 'web' && onlinePaused(shop, now)) return { open: false, reason: 'paused', until: shop.onlinePause?.until || null }
  const closed = closureUntil(shop, now)
  if (closed === Infinity) return { open: false, reason: 'closure', until: null }
  if (!hoursKnown(shop)) return { open: false, reason: 'hours' }
  const { windowMinutes, maxPerWindow } = windowSettings(shop)
  if (!windowMinutes || !maxPerWindow) return { open: false, reason: 'windows' }
  return { open: true, reason: null, closedUntil: closed }
}

// Earliest instant a box can be ready. The slowest item wins.
// Under 24 h: now + lead time (+ busy-mode minutes). From 24 h: whole days, counted from today before the
// next-day cut-off and from tomorrow after it. No cut-off set → counted from tomorrow (never over-promise).
export function earliestReady(lines = [], shop = {}, now = new Date()) {
  if (!lines.length || lines.some((l) => !(typeof l.leadTimeHours === 'number' && l.leadTimeHours > 0))) return { error: 'lead_time_missing' }
  const lead = Math.max(...lines.map((l) => l.leadTimeHours))
  const here = localParts(now)
  if (lead < 24) {
    const notBefore = new Date(new Date(now).getTime() + lead * HOUR + busyMinutes(shop, now) * 60 * 1000)
    return { notBefore, firstDay: localParts(notBefore).iso, leadDays: 0, cutoffMissing: false, afterCutoff: false }
  }
  const leadDays = Math.ceil(lead / 24)
  const cutoff = toMinutes(shop.ordering?.nextDayCutoff)
  const cutoffMissing = cutoff === null
  const afterCutoff = cutoffMissing || here.minutes >= cutoff
  const firstDay = addDays(here.iso, leadDays + (afterCutoff ? 1 : 0))
  return { notBefore: zonedTime(firstDay, '00:00'), firstDay, leadDays, cutoffMissing, afterCutoff }
}

// One pickup day for a box: free windows, or why it can't be booked.
// pools undefined = capacity not checked (labels without the pools); createOrder always passes them.
export function dayAvailability(lines, shop, iso, { now = new Date(), pools, usage, ready } = {}) {
  const r = ready || earliestReady(lines, shop, now)
  if (r.error) return { date: iso, windows: [], reason: r.error }
  if (iso < r.firstDay) return { date: iso, windows: [], reason: 'too_soon' }
  const seasonal = lines.map((l) => l.season?.days).filter(Boolean)
  if (seasonal.some((days) => !days.includes(iso))) return { date: iso, windows: [], reason: 'season_day' }
  if (pools) {
    const pc = poolsCheck(lines, iso, { pools, usage, todayISO: localParts(now).iso })
    if (!pc.ok) return { date: iso, windows: [], reason: pc.problems[0].reason, problems: pc.problems }
  }
  const { windows, source } = dayWindows(shop, iso, { now, notBefore: r.notBefore, usage })
  if (source === 'closed' || source === 'unknown') return { date: iso, windows: [], reason: source === 'closed' ? 'closed' : 'hours' }
  const free = windows.filter((w) => w.remaining > 0)
  if (!windows.length) return { date: iso, windows: [], reason: 'closed' }
  if (!free.length) return { date: iso, windows: [], reason: 'windows_full' }
  return { date: iso, windows: free, reason: null, toConfirm: toConfirmDay(shop, iso) }
}

// Bookable days for a box within maxDaysAhead (day chips). → { days: [{ date, windows, toConfirm }], reason }
export function bookableDays(lines, shop = {}, { now = new Date(), pools, usage, source = 'web', limit = 60 } = {}) {
  const state = onlineState(shop, now, { source })
  if (!state.open) return { days: [], reason: state.reason }
  const ready = earliestReady(lines, shop, now)
  if (ready.error) return { days: [], reason: ready.error }
  if (lines.some((l) => l.season && !l.season.open)) return { days: [], reason: 'season_closed' }
  const days = []
  const reasons = new Map()
  for (const iso of horizonDays(shop, now, ready.firstDay)) {
    const d = dayAvailability(lines, shop, iso, { now, pools, usage, ready })
    if (d.windows.length) days.push(d)
    else reasons.set(d.reason, (reasons.get(d.reason) || 0) + 1)
    if (days.length >= limit) break
  }
  // The most telling reason when nothing is bookable: a missing fact beats « full ».
  const order = ['capacity_missing', 'hours', 'capacity_full', 'windows_full', 'season_day', 'closed', 'too_soon']
  const reason = days.length ? null : order.find((r) => reasons.has(r)) || 'none'
  return { days, reason, ready }
}

export const firstBookable = (lines, shop, opts) => {
  const { days, reason, ready } = bookableDays(lines, shop, { ...opts, limit: 1 })
  return days[0] ? { date: days[0].date, start: days[0].windows[0].start, end: days[0].windows[0].end, ready } : { reason }
}

// « Prête dès jeudi 29 oct. » · « Prête dès aujourd'hui, 14 h 30 » · « Prête dès demain »
export function readyLabel(first, now = new Date(), locale = 'fr') {
  const L = engineLabels(locale)
  const today = localParts(now).iso
  if (first.date === today) return L.readyToday(clock(first.start, locale))
  if (first.date === addDays(today, 1)) return L.readyTomorrow
  return L.readyOn(dayLabel(first.date, locale))
}

// « Commandez avant 14 h pour demain » (only meaningful for one-day items); marker when the hour is missing.
export function cutoffLine(shop = {}, locale = 'fr') {
  const L = engineLabels(locale)
  const cutoff = shop.ordering?.nextDayCutoff
  return toMinutes(cutoff) === null ? L.cutoffMissing : L.cutoff(clock(cutoff, locale))
}

const SCHEMA = {
  disponible: 'https://schema.org/InStock',
  epuise_du_jour: 'https://schema.org/SoldOut',
  retour_saison: 'https://schema.org/BackOrder',
  nouveaute: 'https://schema.org/PreOrder',
  retire: 'https://schema.org/Discontinued',
}

const firstSeasonDay = (product, now) => {
  const days = (product?.season?.pickupDates || []).map((p) => dayOf(p.date)).filter(Boolean).sort()
  const today = localParts(now).iso
  return days.find((d) => d >= today) || null
}

// The one availability state per product (06 k): page badge, Offer JSON-LD and feed read the same answer.
// → { state, label, schemaAvailability, availabilityDate, orderable, earliest, reason, missing }
// BackOrder + date for a returning seasonal item, PreOrder only for a never-sold item, SoldOut for « Épuisé ».
export function productOfferState(product, shop = {}, now = new Date(), { locale = 'fr', pools, usage, source = 'web' } = {}) {
  const L = engineLabels(locale)
  const availability = effectiveAvailability(product, shop, now)
  const out = (state, extra = {}) => ({ state, schemaAvailability: SCHEMA[state], label: null, availabilityDate: null, orderable: false, earliest: null, reason: null, missing: [], ...extra })

  if (availability === 'discontinued') return out('retire', { label: L.discontinued })
  if (availability === 'soldout') {
    const until = product.soldOutUntil ? dayOf(product.soldOutUntil) : null
    return out('epuise_du_jour', { label: until ? `${L.soldOut} · ${L.backOn(dayLabel(until, locale))}` : L.soldOut })
  }

  // Dated states: a never-sold product is PreOrder; anything sold before (everSold) is BackOrder (06 corrects v0a).
  const seasonDay = firstSeasonDay(product, now)
  const dated = availability === 'backorder' || availability === 'preorder' || (availability === 'instock' && seasonDay && seasonDay > addDays(localParts(now).iso, 1))
  if (dated) {
    const state = availability === 'preorder' && !product.everSold ? 'nouveaute' : availability === 'instock' && !product.everSold ? 'nouveaute' : 'retour_saison'
    const date = product.availabilityDate ? dayOf(product.availabilityDate) : seasonDay
    const orderable = availability === 'instock' ? orderableNow(product, shop, now, { pools, usage, source }) : { orderable: false }
    if (!date) return out(state, { label: L.missing.date, missing: ['availabilityDate'], ...orderable })
    const label = state === 'nouveaute' ? L.preorderFrom(dayLabel(date, locale)) : L.backOn(dayLabel(date, locale))
    return out(state, { label, availabilityDate: date, ...orderable })
  }

  // In sale: the « Prête dès … » line when it can be booked online, the missing fact otherwise.
  if (!product.onlineOrderable) return out('disponible', { label: L.inStoreOnly, reason: 'not_online' })
  const o = orderableNow(product, shop, now, { pools, usage, source })
  if (o.orderable) return out('disponible', { ...o, label: readyLabel(o.earliest, now, locale) })
  const missing = { hours: 'hours', windows: 'windows', lead_time_missing: 'lead_time', capacity_missing: 'capacity' }[o.reason]
  return out('disponible', { ...o, label: missing ? L.missing[missing] : null, missing: missing ? [missing] : [] })
}

function orderableNow(product, shop, now, { pools, usage, source }) {
  const variantIndex = Math.max(0, (product.variants || []).findIndex((v) => typeof v.priceCents === 'number' && v.priceCents > 0))
  const line = productLine(product, variantIndex, 1, { now })
  const blockers = lineBlockers(product, line, { source, shop, now })
  if (blockers.length) return { orderable: false, reason: blockers[0], blockers }
  // Without pools the label is computed from hours and lead time only (capacityChecked: false);
  // checkout always checks capacity again under the lock.
  const first = firstBookable([line], shop, { now, pools, usage, source })
  if (first.date) return { orderable: true, earliest: first, reason: null, capacityChecked: Boolean(pools) }
  return { orderable: false, reason: first.reason, capacityChecked: Boolean(pools) }
}
