// Québec statutory holidays (Labour Standards Act, 10 §3.4), offered to the owner as « à confirmer » special days.
// They are labour rules (holiday pay), not opening rules: nothing is closed until the owner taps « Fermé » (16 G18).
// Easter: the employer picks Good Friday OR Easter Monday, so both are suggested.

const iso = (y, m, d) => `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
const weekday = (y, m, d) => new Date(Date.UTC(y, m - 1, d)).getUTCDay()

// Anonymous Gregorian algorithm (Meeus/Jones/Butcher).
export function easterSunday(year) {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return iso(year, month, day)
}

const shift = (day, n) => {
  const d = new Date(`${day}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

// n-th Monday of a month (1-based).
const nthMonday = (year, month, n) => {
  const first = weekday(year, month, 1)
  return iso(year, month, 1 + ((8 - first) % 7) + (n - 1) * 7)
}

// Journée nationale des patriotes: the Monday before May 25.
const mondayBefore25May = (year) => {
  const w = weekday(year, 5, 24)
  return iso(year, 5, 24 - ((w + 6) % 7))
}

export function quebecHolidays(year) {
  const easter = easterSunday(year)
  return [
    { date: iso(year, 1, 1), key: 'jour-de-l-an', fr: 'Jour de l’An', en: 'New Year’s Day', es: 'Año Nuevo' },
    { date: shift(easter, -2), key: 'vendredi-saint', fr: 'Vendredi saint (ou lundi de Pâques)', en: 'Good Friday (or Easter Monday)', es: 'Viernes Santo (o lunes de Pascua)' },
    { date: shift(easter, 1), key: 'lundi-de-paques', fr: 'Lundi de Pâques (ou Vendredi saint)', en: 'Easter Monday (or Good Friday)', es: 'Lunes de Pascua (o Viernes Santo)' },
    { date: mondayBefore25May(year), key: 'patriotes', fr: 'Journée nationale des patriotes', en: 'National Patriots’ Day', es: 'Día Nacional de los Patriotas' },
    { date: iso(year, 6, 24), key: 'fete-nationale', fr: 'Fête nationale du Québec', en: 'Fête nationale du Québec', es: 'Fiesta nacional de Quebec' },
    { date: iso(year, 7, 1), key: 'fete-du-canada', fr: 'Fête du Canada', en: 'Canada Day', es: 'Día de Canadá' },
    { date: nthMonday(year, 9, 1), key: 'fete-du-travail', fr: 'Fête du Travail', en: 'Labour Day', es: 'Día del Trabajo' },
    { date: nthMonday(year, 10, 2), key: 'action-de-grace', fr: 'Action de grâce', en: 'Thanksgiving', es: 'Acción de Gracias' },
    { date: iso(year, 12, 25), key: 'noel', fr: 'Noël', en: 'Christmas Day', es: 'Navidad' },
  ]
}

export const HOLIDAY_YEARS = [2026, 2027, 2028]

// Special-day rows Studio can pre-load (state « à confirmer »), skipping dates already in the shop's list
// and dates before `fromISO`.
export function holidaySuggestions(shop = {}, { years = HOLIDAY_YEARS, fromISO = '' } = {}) {
  const taken = new Set((shop.specialDays || []).map((s) => String(s.date || '').slice(0, 10)))
  return years
    .flatMap(quebecHolidays)
    .filter((h) => h.date >= fromISO && !taken.has(h.date))
    .map((h) => ({ date: h.date, label: h.fr, labels: { fr: h.fr, en: h.en, es: h.es }, key: h.key, state: 'to_confirm' }))
}
