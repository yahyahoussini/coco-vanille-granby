// Pickup windows (10 §3.1): windowMinutes-long slots from opening to closing, at most maxPerWindow
// orders each, all in America/Toronto. No hours → no online slots (zero invention).
import { hoursFor, localParts, addDays, toMinutes, fromMinutes, zonedTime, dayOf } from '../studio/time.js'
import { bookedInWindow } from './capacity.js'

const positiveInt = (n) => Number.isInteger(n) && n > 0
export const DEFAULT_MAX_DAYS_AHEAD = 30

export function windowSettings(shop = {}) {
  const o = shop.ordering || {}
  return {
    windowMinutes: positiveInt(o.windowMinutes) ? o.windowMinutes : null,
    maxPerWindow: positiveInt(o.maxPerWindow) ? o.maxPerWindow : null,
    maxDaysAhead: positiveInt(o.maxDaysAhead) ? o.maxDaysAhead : DEFAULT_MAX_DAYS_AHEAD,
  }
}

export const hoursKnown = (shop = {}) => (shop.hours || []).length > 0 || (shop.specialDays || []).some((s) => s.opens && s.closes)

const active = (group, now) => Boolean(group?.active) && (!group.until || new Date(group.until).getTime() > new Date(now).getTime())

// Closure (« Fermeture ») blocks every window that starts before its end; no end = closed until reopened.
export const closureUntil = (shop = {}, now = new Date()) => (active(shop.closure, now) ? (shop.closure.until ? new Date(shop.closure.until) : Infinity) : null)

export const busyMinutes = (shop = {}, now = new Date()) => {
  const b = shop.busy || {}
  if (!(b.extraMinutes > 0)) return 0
  return !b.until || new Date(b.until).getTime() > new Date(now).getTime() ? b.extraMinutes : 0
}

export const onlinePaused = (shop = {}, now = new Date()) => active(shop.onlinePause, now)

// Every window of a day with its bookings. notBefore: earliest instant the box can be ready.
export function dayWindows(shop, iso, { now = new Date(), notBefore = null, usage } = {}) {
  const { windowMinutes, maxPerWindow } = windowSettings(shop)
  const { intervals, source } = hoursFor(shop, iso)
  if (!windowMinutes || !maxPerWindow || !intervals.length) return { windows: [], source }
  const closedUntil = closureUntil(shop, now)
  const floor = Math.max(new Date(now).getTime(), notBefore ? new Date(notBefore).getTime() : 0)
  const out = []
  for (const it of [...intervals].sort((a, b) => toMinutes(a.opens) - toMinutes(b.opens))) {
    const open = toMinutes(it.opens)
    const close = toMinutes(it.closes)
    if (open === null || close === null) continue
    for (let t = open; t + windowMinutes <= close; t += windowMinutes) {
      const start = fromMinutes(t)
      const at = zonedTime(iso, start).getTime()
      if (at < floor) continue
      if (closedUntil !== null && (closedUntil === Infinity || at < closedUntil.getTime())) continue
      const booked = bookedInWindow(usage, iso, start)
      out.push({ start, end: fromMinutes(t + windowMinutes), booked, remaining: Math.max(0, maxPerWindow - booked) })
    }
  }
  return { windows: out, source }
}

// Bookable windows only (remaining > 0).
export const openWindows = (shop, iso, opts) => dayWindows(shop, iso, opts).windows.filter((w) => w.remaining > 0)

// The closest free windows to a wanted start (« Les plus proches : 10 h 15 · 10 h 30 »).
export function closestWindows(windows, wanted, n = 2) {
  const at = toMinutes(wanted) ?? 0
  return [...windows]
    .filter((w) => w.remaining > 0 && w.start !== wanted)
    .sort((a, b) => Math.abs(toMinutes(a.start) - at) - Math.abs(toMinutes(b.start) - at) || toMinutes(a.start) - toMinutes(b.start))
    .slice(0, n)
    .sort((a, b) => toMinutes(a.start) - toMinutes(b.start))
}

// Calendar days from `fromISO` to the horizon (today + maxDaysAhead), inclusive.
export function horizonDays(shop, now = new Date(), fromISO = null) {
  const today = localParts(now).iso
  const last = addDays(today, windowSettings(shop).maxDaysAhead)
  const days = []
  for (let d = fromISO && fromISO > today ? fromISO : today; d <= last; d = addDays(d, 1)) days.push(d)
  return days
}

export const isWithinHorizon = (shop, iso, now = new Date()) => {
  const today = localParts(now).iso
  return iso >= today && iso <= addDays(today, windowSettings(shop).maxDaysAhead)
}

export const toConfirmDay = (shop, iso) => (shop.specialDays || []).some((s) => dayOf(s.date) === iso && s.state === 'to_confirm')
