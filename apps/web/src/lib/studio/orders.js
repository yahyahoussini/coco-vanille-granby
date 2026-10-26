// Orders as Studio shows them: today's pickups by time, late ones first, one forward button each
// (16 §3.1–§3.2, 16a P1–P2). Pure helpers plus the reads, which use the person's own access rules.
import { dayBounds, dayOf, localParts, toMinutes, zonedTime, addDays } from './time.js'
import { redactOrder } from './roles.js'

export const OPEN_STATUSES = ['paid', 'ready', 'not_picked_up']
export const LIST_STATUSES = ['pending_payment', 'paid', 'ready', 'not_picked_up', 'picked_up']
const MINUTE = 60 * 1000

// Where an order stands against the clock: late (window over, not picked up), due in ≤ 15 min and not ready.
export function pickupState(order, now = new Date()) {
  const day = dayOf(order.pickupDate)
  const out = { late: false, dueSoon: false, minutesTo: null }
  if (!day || !order.pickupWindowStart) return out
  const start = zonedTime(day, order.pickupWindowStart).getTime()
  const end = zonedTime(day, order.pickupWindowEnd || order.pickupWindowStart).getTime()
  const t = new Date(now).getTime()
  out.minutesTo = Math.round((start - t) / MINUTE)
  if (['paid', 'ready', 'not_picked_up'].includes(order.status) && t > end) out.late = true
  if (order.status === 'paid' && start - t <= 15 * MINUTE && t <= end) out.dueSoon = true
  return out
}

// Late first, then by window; orders with no window (custom cakes, time agreed by phone) last; done at the end.
export function sortPickups(orders, now = new Date()) {
  const rank = (o) => (o.status === 'picked_up' ? 3 : pickupState(o, now).late ? 0 : o.pickupWindowStart ? 1 : 2)
  return [...orders].sort((a, b) => rank(a) - rank(b) || (toMinutes(a.pickupWindowStart) ?? 9999) - (toMinutes(b.pickupWindowStart) ?? 9999) || (a.number || 0) - (b.number || 0))
}

// « 14 cueillettes · 3 prêtes · 1 en retard »
export function pickupSummary(orders, now = new Date()) {
  const live = orders.filter((o) => ['paid', 'ready', 'not_picked_up', 'picked_up'].includes(o.status))
  const ready = live.filter((o) => o.status === 'ready').length
  const late = live.filter((o) => pickupState(o, now).late).length
  const done = live.filter((o) => o.status === 'picked_up').length
  const parts = [`${live.length} ${live.length > 1 ? 'cueillettes' : 'cueillette'}`]
  if (ready) parts.push(`${ready} ${ready > 1 ? 'prêtes' : 'prête'}`)
  if (late) parts.push(`${late} en retard`)
  if (done) parts.push(`${done} ${done > 1 ? 'récupérées' : 'récupérée'}`)
  return { total: live.length, ready, late, done, text: parts.join(' · ') }
}

// The one forward action of an order card.
export function forwardAction(order) {
  if (order.status === 'paid') return 'ready'
  if (order.status === 'ready' || order.status === 'not_picked_up') return 'pickup'
  return null
}

// « 1 × Paris-Brest, 6 × Croissant aux amandes »
export const itemsLine = (order) => (order.items || []).map((i) => `${i.qty} × ${i.title}${i.variantLabel ? ` (${i.variantLabel})` : ''}`).join(', ')

export const hasMessage = (order) => (order.items || []).some((i) => i.message)

// ---------- reads ----------
export async function ordersOn(ctx, iso, { statuses = LIST_STATUSES } = {}) {
  const { from, to } = dayBounds(iso)
  const res = await ctx.payload.find({
    collection: 'orders',
    where: { and: [{ pickupDate: { greater_than_equal: from } }, { pickupDate: { less_than: to } }, { status: { in: statuses } }] },
    limit: 300,
    depth: 0,
    sort: 'pickupWindowStart',
    ...ctx.as,
  })
  return res.docs.map((o) => redactOrder(o, ctx.user))
}

export async function ordersBetween(ctx, fromISO, toISO, { statuses = LIST_STATUSES, limit = 300 } = {}) {
  const res = await ctx.payload.find({
    collection: 'orders',
    where: { and: [{ pickupDate: { greater_than_equal: dayBounds(fromISO).from } }, { pickupDate: { less_than: dayBounds(toISO).to } }, { status: { in: statuses } }] },
    limit,
    depth: 0,
    sort: 'pickupDate',
    ...ctx.as,
  })
  return res.docs.map((o) => redactOrder(o, ctx.user))
}

// Search by number, first or last name, or phone digits (16 §3.2).
export async function searchOrders(ctx, text, { now = new Date() } = {}) {
  const q = String(text || '').trim()
  if (!q) return []
  const today = localParts(now).iso
  const digits = q.replace(/\D/g, '')
  const or = [{ 'customer.firstName': { like: q } }, { 'customer.lastName': { like: q } }]
  if (/^\d{3,6}$/.test(q)) or.push({ number: { equals: Number(q) } })
  if (digits.length >= 4) or.push({ 'customer.phone': { like: digits.slice(-7) } })
  const res = await ctx.payload.find({
    collection: 'orders',
    where: { and: [{ or }, { pickupDate: { greater_than_equal: dayBounds(addDays(today, -14)).from } }] },
    limit: 30,
    depth: 0,
    sort: 'pickupDate',
    ...ctx.as,
  })
  return res.docs.map((o) => redactOrder(o, ctx.user))
}

// Production list for one production day (10 §7, 16a P9): quantities per category × product × size,
// with the order numbers, the cake messages and an allergy flag (never the note itself, G16).
export function productionList(orders, iso, { categoryLabels = {} } = {}) {
  const groups = new Map()
  for (const o of orders) {
    if (!['paid', 'ready'].includes(o.status)) continue
    for (const it of o.items || []) {
      const day = it.productionDate || dayOf(o.pickupDate)
      if (day !== iso) continue
      const cat = it.productionCategory || 'autres'
      if (!groups.has(cat)) groups.set(cat, new Map())
      const key = `${it.title}|${it.variantLabel || ''}`
      const g = groups.get(cat)
      const row = g.get(key) || { title: it.title, variantLabel: it.variantLabel || '', qty: 0, orders: [], messages: [], allergy: false }
      row.qty += it.qty
      if (!row.orders.includes(o.number)) row.orders.push(o.number)
      if (it.message) row.messages.push({ number: o.number, text: it.message })
      if (o.allergyNote || o.hasAllergy) row.allergy = true
      g.set(key, row)
    }
  }
  return [...groups.entries()]
    .map(([category, rows]) => ({ category, label: categoryLabels[category] || category, total: [...rows.values()].reduce((s, r) => s + r.qty, 0), rows: [...rows.values()].sort((a, b) => a.title.localeCompare(b.title, 'fr')) }))
    .sort((a, b) => a.label.localeCompare(b.label, 'fr'))
}

// What changed since the printed snapshot: « +1 Paris-Brest (1052) ».
export function productionChanges(before = [], after = []) {
  const flat = (list) => {
    const m = new Map()
    for (const g of list || []) for (const r of g.rows || []) m.set(`${r.title}|${r.variantLabel}`, r)
    return m
  }
  const a = flat(before)
  const b = flat(after)
  const out = []
  for (const [key, row] of b) {
    const old = a.get(key)
    const diff = row.qty - (old?.qty || 0)
    if (diff) out.push({ title: row.title, variantLabel: row.variantLabel, diff, orders: row.orders.filter((n) => !(old?.orders || []).includes(n)) })
  }
  for (const [key, row] of a) if (!b.has(key)) out.push({ title: row.title, variantLabel: row.variantLabel, diff: -row.qty, orders: [] })
  return out
}
