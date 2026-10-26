// Plain-language hours for key facts and llms.txt: « du mercredi au samedi de 8 h 30 à 17 h 30, et le dimanche de 9 h à 17 h ».
// Pure (node --test). Built from the single hours record (shop global); empty → null, the caller shows a marker.
import { t, clock } from '../../lib/i18n.js'
import { localParts, addDays, dayOf, hoursFor, toMinutes } from '../../lib/studio/time.js'

export const WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const JOIN = {
  fr: { range: (a, b) => `du ${a} au ${b}`, one: (a) => `le ${a}`, span: (o, c) => `de ${o} à ${c}`, and: ', et ', sep: ', ' },
  en: { range: (a, b) => `${a} to ${b}`, one: (a) => a, span: (o, c) => `from ${o} to ${c}`, and: ', and ', sep: ', ' },
  es: { range: (a, b) => `de ${a} a ${b}`, one: (a) => `el ${a}`, span: (o, c) => `de ${o} a ${c}`, and: ' y ', sep: ', ' },
}

export function hoursSummary(hours = [], locale = 'fr') {
  if (!hours?.length) return null
  const j = JOIN[locale] || JOIN.fr
  const days = t(locale).weekdays
  const spanOf = (day) =>
    hours
      .filter((h) => h.day === day)
      .map((h) => j.span(clock(h.opens, locale), clock(h.closes, locale)))
      .join(locale === 'en' ? ' and ' : ' et ')
  // Group consecutive days that share the same hours; closed days break a group.
  const groups = []
  for (const day of WEEK) {
    const span = spanOf(day)
    const last = groups.at(-1)
    if (span && last && last.span === span && WEEK.indexOf(last.to) === WEEK.indexOf(day) - 1) last.to = day
    else if (span) groups.push({ from: day, to: day, span })
  }
  const parts = groups.map((g) => `${g.from === g.to ? j.one(days[g.from]) : j.range(days[g.from], days[g.to])} ${g.span}`)
  if (parts.length === 1) return parts[0]
  return parts.slice(0, -1).join(j.sep) + j.and + parts.at(-1)
}

// Special days (holidays, exceptional closures, special hours) from today to `days` ahead, for the hours
// table and the JSON-LD. Same record Studio « Boutique & heures » writes; stored dates keep the local day.
export function upcomingSpecialDays(shop = {}, { now = new Date(), days = 45 } = {}) {
  const today = localParts(now).iso
  const last = addDays(today, days)
  return (shop.specialDays || [])
    .map((s) => ({ date: dayOf(s.date), label: s.label || null, state: s.state || 'to_confirm', opens: s.opens || null, closes: s.closes || null }))
    .filter((s) => s.date && s.date >= today && s.date <= last)
    .sort((a, b) => a.date.localeCompare(b.date))
}

// The minimal schedule the « Ouvert » pill needs in the browser: regular week, upcoming special days, closure.
export const pillSchedule = (shop = {}, now = new Date()) => ({
  hours: (shop.hours || []).map(({ day, opens, closes }) => ({ day, opens, closes })),
  specialDays: upcomingSpecialDays(shop, { now, days: 2 }),
  closure: shop.closure?.active ? { active: true, until: shop.closure.until || null } : null,
})

// Open right now in Granby? Exceptional closure first, then a special day, then the regular week (10 §3.4).
// → { open: true, closes } · { open: false } · null when the day is unknown or « à confirmer » (no pill).
export function openState(shop = {}, now = new Date()) {
  const c = shop.closure
  if (c?.active && (!c.until || new Date(c.until).getTime() > new Date(now).getTime())) return { open: false }
  const here = localParts(now)
  const { intervals, source } = hoursFor(shop, here.iso)
  if (source === 'unknown' || source === 'to_confirm') return null
  const open = intervals.find((h) => here.minutes >= toMinutes(h.opens) && here.minutes < toMinutes(h.closes))
  return open ? { open: true, closes: open.closes } : { open: false }
}
