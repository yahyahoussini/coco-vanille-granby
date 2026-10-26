// Fermeture exceptionnelle (16 §3.6, 16a P6/P22, F8): what closes, until when, and who gets a texto.
// « Reste de la journée » and « Jusqu'au… » switch the shop's closure on (banner, online orders off) until the
// next opening after the last closed day; « Demain » marks tomorrow closed as a special day, so today stays open.
// It reverts by itself: the closure ends at its `until`, the special day is just that day.
import { localParts, addDays, nextOpening, zonedTime, dayOf } from './time.js'

export const REASONS = [
  ['tempete', 'Tempête'],
  ['maladie', 'Maladie'],
  ['bris', 'Bris'],
  ['autre', 'Autre'],
]
export const DURATIONS = [
  ['jour', 'Reste de la journée'],
  ['demain', 'Demain'],
  ['jusqua', 'Jusqu’au…'],
]
export const CLOSURE_LABEL = 'Fermeture exceptionnelle'

// → { mode: 'closure'|'special', firstDay, lastDay, until (Date), error }
export function closurePlan(shop, duree, { now = new Date(), date = null } = {}) {
  const today = localParts(now).iso
  let firstDay = today
  let lastDay = today
  if (duree === 'demain') {
    firstDay = lastDay = addDays(today, 1)
  } else if (duree === 'jusqua') {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) return { error: 'date_required' }
    if (date < today) return { error: 'date_past' }
    if (date > addDays(today, 60)) return { error: 'date_far' }
    lastDay = date
  } else if (duree !== 'jour') return { error: 'duration_required' }
  const end = zonedTime(addDays(lastDay, 1), '00:00')
  const until = nextOpening({ ...shop, closure: null }, end) || end
  return { mode: duree === 'demain' ? 'special' : 'closure', firstDay, lastDay, until }
}

// Orders still to be picked up in the closed days (window not started yet for today).
export function affectedOrders(orders, plan, now = new Date()) {
  if (!plan || plan.error) return []
  const t = new Date(now).getTime()
  return orders.filter((o) => {
    if (!['paid', 'ready'].includes(o.status)) return false
    const d = dayOf(o.pickupDate)
    if (!d || d < plan.firstDay || d > plan.lastDay) return false
    if (o.pickupWindowEnd && zonedTime(d, o.pickupWindowEnd).getTime() < t) return false
    return true
  })
}

export const withPhone = (orders) => orders.filter((o) => o.customer?.phone)
