// Studio time helpers. Everything is local to the shop: America/Toronto (16 §3.0 « Format »).
// Calendar days are 'YYYY-MM-DD' strings. Stored pickup dates keep the local calendar day in their
// UTC date part (midnight UTC, local midnight or noon all qualify), so a day query is [d 00:00Z, d+1 00:00Z).
export const TZ = 'America/Toronto'
export const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MINUTE = 60 * 1000
const DAY_MS = 24 * 60 * MINUTE

const partsFmt = new Intl.DateTimeFormat('en-CA', {
  timeZone: TZ,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
})

export function localParts(date = new Date()) {
  const p = Object.fromEntries(partsFmt.formatToParts(new Date(date)).map((x) => [x.type, x.value]))
  const iso = `${p.year}-${p.month}-${p.day}`
  return { iso, hh: Number(p.hour), mm: Number(p.minute), minutes: Number(p.hour) * 60 + Number(p.minute), weekday: weekdayOf(iso) }
}

export const todayISO = (now = new Date()) => localParts(now).iso

export function addDays(iso, n) {
  const d = new Date(`${iso}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

export const weekdayOf = (iso) => WEEKDAYS[new Date(`${iso}T12:00:00Z`).getUTCDay()]

export const dayBounds = (iso) => ({ from: `${iso}T00:00:00.000Z`, to: `${addDays(iso, 1)}T00:00:00.000Z` })

// Calendar day of a stored date value ('2026-10-31', '2026-10-31T00:00:00.000Z', Date…).
export function dayOf(value) {
  if (!value) return null
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10)
  return new Date(value).toISOString().slice(0, 10)
}

export const toMinutes = (hhmm) => {
  if (!hhmm || !/^\d{1,2}:\d{2}$/.test(hhmm)) return null
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

export const fromMinutes = (min) => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`

// Local wall time (iso day + 'HH:MM') → the real instant, DST-safe.
export function zonedTime(iso, hhmm = '00:00') {
  const [y, mo, d] = iso.split('-').map(Number)
  const [h, mi] = hhmm.split(':').map(Number)
  const guess = Date.UTC(y, mo - 1, d, h, mi)
  const offsetAt = (ms) => {
    const p = localParts(new Date(ms))
    const asUtc = Date.UTC(...p.iso.split('-').map((v, i) => (i === 1 ? Number(v) - 1 : Number(v))), p.hh, p.mm)
    return asUtc - ms
  }
  let ts = guess - offsetAt(guess)
  ts = guess - offsetAt(ts)
  return new Date(ts)
}

// « 9 h » · « 16 h 30 »
export function clockFr(hhmm) {
  const min = toMinutes(hhmm)
  if (min === null) return ''
  const h = Math.floor(min / 60)
  const m = min % 60
  return m ? `${h} h ${String(m).padStart(2, '0')}` : `${h} h`
}

export const clockOf = (date) => {
  const p = localParts(date)
  return clockFr(`${p.hh}:${String(p.mm).padStart(2, '0')}`)
}

const firstOfMonth = (s) => s.replace(/(^|\s)1(\s)/, '$11er$2')

// « sam. 31 oct. » · « dim. 1er nov. »
export function shortDay(iso) {
  if (!iso) return ''
  const s = new Intl.DateTimeFormat('fr-CA', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(`${dayOf(iso)}T12:00:00Z`))
  return firstOfMonth(s)
}

// « samedi 31 octobre »
export function longDay(iso) {
  if (!iso) return ''
  const s = new Intl.DateTimeFormat('fr-CA', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }).format(new Date(`${dayOf(iso)}T12:00:00Z`))
  return firstOfMonth(s)
}

// « dans 25 min » · « il y a 3 h » · « demain »
export function relative(target, now = new Date()) {
  const diff = new Date(target).getTime() - new Date(now).getTime()
  const abs = Math.abs(diff)
  const past = diff < 0
  if (abs < MINUTE) return 'maintenant'
  if (abs < 60 * MINUTE) {
    const n = Math.round(abs / MINUTE)
    return past ? `il y a ${n} min` : `dans ${n} min`
  }
  if (abs < DAY_MS) {
    const n = Math.round(abs / (60 * MINUTE))
    return past ? `il y a ${n} h` : `dans ${n} h`
  }
  const n = Math.round(abs / DAY_MS)
  if (n === 1) return past ? 'hier' : 'demain'
  return past ? `il y a ${n} jours` : `dans ${n} jours`
}

// Hours that apply on a day: a special day overrides the regular week (10 §3.4).
// Returns { intervals: [{ opens, closes }], source: 'regular'|'special'|'closed'|'to_confirm'|'unknown', label }
export function hoursFor(shop = {}, iso) {
  const special = (shop.specialDays || []).find((s) => dayOf(s.date) === iso)
  const regular = (shop.hours || []).filter((h) => h.day === weekdayOf(iso)).map(({ opens, closes }) => ({ opens, closes }))
  const known = (shop.hours || []).length > 0
  if (special) {
    if (special.state === 'closed') return { intervals: [], source: 'closed', label: special.label }
    if ((special.state === 'open' || special.state === 'special') && special.opens && special.closes) {
      return { intervals: [{ opens: special.opens, closes: special.closes }], source: 'special', label: special.label }
    }
    if (special.state === 'open') return { intervals: regular, source: known ? 'regular' : 'unknown', label: special.label }
    return { intervals: regular, source: 'to_confirm', label: special.label }
  }
  return { intervals: regular, source: known ? 'regular' : 'unknown' }
}

// Next opening instant after `now`, or null when the hours are not known ([[FACT NEEDED]]).
export function nextOpening(shop = {}, now = new Date()) {
  if (!(shop.hours || []).length && !(shop.specialDays || []).some((s) => s.opens)) return null
  const here = localParts(now)
  for (let i = 0; i < 21; i++) {
    const iso = addDays(here.iso, i)
    const { intervals } = hoursFor(shop, iso)
    for (const it of intervals.sort((a, b) => toMinutes(a.opens) - toMinutes(b.opens))) {
      const opens = zonedTime(iso, it.opens)
      if (opens.getTime() > new Date(now).getTime()) return opens
    }
  }
  return null
}

// Status line for Aujourd'hui / Boutique (16 §3.1): open · before · after · closed · unknown.
export function shopStatus(shop = {}, now = new Date()) {
  const here = localParts(now)
  const { intervals, source } = hoursFor(shop, here.iso)
  const closure = shop.closure?.active && (!shop.closure.until || new Date(shop.closure.until) > new Date(now)) ? shop.closure : null
  const next = nextOpening(shop, now)
  if (closure) return { state: 'closure', until: closure.until || null, next }
  if (source === 'unknown') return { state: 'unknown', next: null }
  if (!intervals.length) return { state: 'closed', next }
  const sorted = [...intervals].sort((a, b) => toMinutes(a.opens) - toMinutes(b.opens))
  const current = sorted.find((it) => here.minutes >= toMinutes(it.opens) && here.minutes < toMinutes(it.closes))
  if (current) return { state: 'open', closes: current.closes, next, toConfirm: source === 'to_confirm' }
  if (here.minutes < toMinutes(sorted[0].opens)) return { state: 'before', opens: sorted[0].opens, next }
  return { state: 'after', next }
}

// Opening time of a given day ('HH:MM') or null.
export function openingOf(shop, iso) {
  const { intervals } = hoursFor(shop, iso)
  if (!intervals.length) return null
  return [...intervals].sort((a, b) => toMinutes(a.opens) - toMinutes(b.opens))[0].opens
}

export function closingOf(shop, iso) {
  const { intervals } = hoursFor(shop, iso)
  if (!intervals.length) return null
  return [...intervals].sort((a, b) => toMinutes(b.closes) - toMinutes(a.closes))[0].closes
}

// Monday of the local week containing `iso`.
export function weekStart(iso) {
  const idx = new Date(`${iso}T12:00:00Z`).getUTCDay()
  return addDays(iso, idx === 0 ? -6 : 1 - idx)
}
