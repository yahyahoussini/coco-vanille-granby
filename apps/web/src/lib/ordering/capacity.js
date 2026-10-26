// Production capacity: units per production category per production day (10 §3.1).
// A category with no capacity set for a day is not orderable online that day (no default: [[FACT NEEDED]]).
// Phone orders, web orders, live payment holds and open quotes all draw from the same pools.
import { addDays, dayOf, weekdayOf } from '../studio/time.js'

// Order states that hold production and a pickup window. A pending payment holds them only until its hold expires.
export const COMMITTED_STATUSES = ['paid', 'ready', 'picked_up', 'not_picked_up']
export const HOLD_MINUTES = 10

const isNum = (n) => typeof n === 'number' && Number.isFinite(n) && n >= 0

// pools: capacity-pools docs → limit for (category, day), or null when the owner set none.
export function capacityLimit(pools = [], category, iso) {
  const pool = pools.find((p) => p.productionCategory === category)
  if (!pool) return null
  const override = (pool.overrides || []).find((o) => dayOf(o.date) === iso)
  if (override && isNum(override.capacity)) return override.capacity
  const weekly = (pool.perWeekday || []).find((w) => w.day === weekdayOf(iso))
  if (weekly && isNum(weekly.capacity)) return weekly.capacity
  return isNum(pool.defaultPerDay) ? pool.defaultPerDay : null
}

export const productionDay = (pickupISO, offsetDays = 0) => addDays(pickupISO, -(Number(offsetDays) || 0))

const poolKey = (iso, category) => `${iso}|${category}`
const windowKey = (iso, start) => `${iso}|${start}`

export function holdIsLive(order, now = new Date()) {
  return order.status === 'pending_payment' && Boolean(order.holdExpiresAt) && new Date(order.holdExpiresAt).getTime() > new Date(now).getTime()
}

export const orderCounts = (order, now) => COMMITTED_STATUSES.includes(order.status) || holdIsLive(order, now)

export function requestCounts(request, now = new Date()) {
  if (request.status === 'quoted') return Boolean(request.quote?.validUntil) && new Date(request.quote.validUntil).getTime() > new Date(now).getTime()
  return ['deposit_paid', 'confirmed'].includes(request.status) && !request.order
}

// What is already booked: units per pool and orders per pickup window.
export function usageFrom({ orders = [], requests = [], now = new Date(), excludeOrderId = null, excludeRequestId = null } = {}) {
  const pools = new Map()
  const windows = new Map()
  const bump = (map, key, n) => map.set(key, (map.get(key) || 0) + n)
  for (const o of orders) {
    if (excludeOrderId !== null && o.id === excludeOrderId) continue
    if (!orderCounts(o, now)) continue
    const day = dayOf(o.pickupDate)
    if (day && o.pickupWindowStart) bump(windows, windowKey(day, o.pickupWindowStart), 1)
    for (const item of o.items || []) {
      const prod = item.productionDate || day
      if (!prod || !item.productionCategory) continue
      bump(pools, poolKey(prod, item.productionCategory), isNum(item.units) ? item.units : item.qty || 0)
    }
  }
  for (const r of requests) {
    if (excludeRequestId !== null && r.id === excludeRequestId) continue
    if (!requestCounts(r, now)) continue
    const day = dayOf(r.eventDate)
    if (!day || !r.productionCategory) continue
    bump(pools, poolKey(day, r.productionCategory), isNum(r.capacityUnits) && r.capacityUnits > 0 ? r.capacityUnits : 1)
  }
  return { pools, windows }
}

export const usedUnits = (usage, iso, category) => usage?.pools?.get(poolKey(iso, category)) || 0
export const bookedInWindow = (usage, iso, start) => usage?.windows?.get(windowKey(iso, start)) || 0

// Units a box needs per (production day, category) for a pickup day.
// lines: [{ productionCategory, units, productionOffsetDays }]
export function needFor(lines = [], pickupISO) {
  const need = new Map()
  for (const l of lines) {
    const prod = productionDay(pickupISO, l.productionOffsetDays)
    const key = poolKey(prod, l.productionCategory)
    need.set(key, (need.get(key) || 0) + (l.units || 0))
  }
  return [...need].map(([key, units]) => {
    const [date, category] = key.split('|')
    return { date, category, units }
  })
}

// Can every pool take this box for this pickup day? → { ok, problems: [{ date, category, limit, used, need, reason }] }
export function poolsCheck(lines, pickupISO, { pools = [], usage, todayISO } = {}) {
  const problems = []
  for (const n of needFor(lines, pickupISO)) {
    const limit = capacityLimit(pools, n.category, n.date)
    const used = usedUnits(usage, n.date, n.category)
    if (todayISO && n.date < todayISO) problems.push({ ...n, limit, used, need: n.units, reason: 'production_past' })
    else if (limit === null) problems.push({ ...n, limit, used, need: n.units, reason: 'capacity_missing' })
    else if (used + n.units > limit) problems.push({ ...n, limit, used, need: n.units, reason: 'capacity_full' })
  }
  return { ok: problems.length === 0, problems }
}

// Studio card « Capacité du 8 nov. : 2/6 gâteaux ».
export function capacitySummary(pools = [], usage, iso, category) {
  return { date: iso, category, limit: capacityLimit(pools, category, iso), used: usedUnits(usage, iso, category) }
}
