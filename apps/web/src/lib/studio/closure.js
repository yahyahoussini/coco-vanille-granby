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

// Banner text for the public site (FR/EN/ES), from the same shop global Studio writes (integration helper for
// the site templates): an active closure, or an exceptional closed day within the next 7 days.
const dayLong = (iso, l) => {
  const s = new Intl.DateTimeFormat(l === 'en' ? 'en-CA' : l === 'es' ? 'es' : 'fr-CA', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }).format(new Date(`${iso}T12:00:00Z`))
  return l === 'fr' ? s.replace(/(^|\s)1(\s)/, '$11er$2') : s
}
const hourOf = (date, l) => {
  const p = localParts(date)
  if (l === 'en') return new Intl.DateTimeFormat('en-CA', { hour: 'numeric', minute: p.mm ? '2-digit' : undefined, timeZone: 'America/Toronto' }).format(new Date(date))
  if (l === 'es') return `${String(p.hh).padStart(2, '0')}:${String(p.mm).padStart(2, '0')}`
  return p.mm ? `${p.hh} h ${String(p.mm).padStart(2, '0')}` : `${p.hh} h`
}

export function closureNotice(shop = {}, locale = 'fr', now = new Date()) {
  const l = ['fr', 'en', 'es'].includes(locale) ? locale : 'fr'
  const c = shop.closure
  if (c?.active && (!c.until || new Date(c.until).getTime() > new Date(now).getTime())) {
    if (!c.until) return { tone: 'closure', text: { fr: 'Fermeture exceptionnelle : la boutique est fermée pour le moment.', en: 'Temporarily closed: the shop is closed for now.', es: 'Cierre excepcional: la tienda está cerrada por ahora.' }[l] }
    const d = localParts(c.until).iso
    return {
      tone: 'closure',
      text: {
        fr: `Fermeture exceptionnelle : la boutique rouvre le ${dayLong(d, l)} à ${hourOf(c.until, l)}.`,
        en: `Temporarily closed: the shop reopens on ${dayLong(d, l)} at ${hourOf(c.until, l)}.`,
        es: `Cierre excepcional: la tienda reabre el ${dayLong(d, l)} a las ${hourOf(c.until, l)}.`,
      }[l],
    }
  }
  const today = localParts(now).iso
  const soon = (shop.specialDays || []).filter((s) => s.state === 'closed' && s.label === CLOSURE_LABEL && dayOf(s.date) >= today && dayOf(s.date) <= addDays(today, 7)).sort((a, b) => String(a.date).localeCompare(String(b.date)))[0]
  if (!soon) return null
  const d = dayOf(soon.date)
  return { tone: 'notice', text: { fr: `Fermeture exceptionnelle le ${dayLong(d, l)}.`, en: `Closed on ${dayLong(d, l)} (exceptional closure).`, es: `Cierre excepcional el ${dayLong(d, l)}.` }[l] }
}
