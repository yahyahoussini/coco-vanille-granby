// The panel's status line, read in the browser against the shop's own schedule (chatFacts().schedule): open now,
// or closed with the next opening. Never a promised reply time. Pure (no server import), node --test.
import { openState } from '../../components/site/hours.js'
import { nextOpening, localParts, addDays } from '../studio/time.js'
import { clock } from '../i18n.js'
import { chatCopy } from './copy.js'

const TAG = { fr: 'fr-CA', en: 'en-CA', es: 'es' }

// → { state: 'open', closes } · { state: 'closed', reopen: Date|null } · { state: 'closure' } (no end known) · { state: 'unknown' }
export function chatStatus(schedule, now = new Date()) {
  const s = schedule || {}
  if (!(s.hours || []).length) return { state: 'unknown' }
  const c = s.closure
  if (c?.active && (!c.until || new Date(c.until).getTime() > new Date(now).getTime())) {
    if (!c.until) return { state: 'closure' }
    return { state: 'closed', reopen: nextOpening(s, new Date(c.until)) }
  }
  const o = openState(s, now)
  if (o === null) return { state: 'unknown' }
  if (o.open) return { state: 'open', closes: o.closes }
  return { state: 'closed', reopen: nextOpening(s, now) }
}

// « demain 8 h 30 » · « mercredi 8 h 30 » · « tomorrow at 8:30 a.m. » — in the shop's time zone.
export function reopenText(date, locale = 'fr', now = new Date()) {
  if (!date) return null
  const c = chatCopy(locale)
  const at = localParts(date)
  const today = localParts(now).iso
  const hhmm = `${String(at.hh).padStart(2, '0')}:${String(at.mm).padStart(2, '0')}`
  const time = locale === 'es' ? `${at.hh}:${String(at.mm).padStart(2, '0')}` : clock(hhmm, locale === 'en' ? 'en' : 'fr')
  let day
  if (at.iso === today) day = c.today
  else if (at.iso === addDays(today, 1)) day = c.tomorrow
  else {
    const within = at.iso <= addDays(today, 6)
    const opts = within ? { weekday: 'long', timeZone: 'UTC' } : { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }
    day = new Intl.DateTimeFormat(TAG[locale] || 'fr-CA', opts).format(new Date(`${at.iso}T12:00:00Z`))
    if (locale === 'fr') day = day.replace(/(^|\s)1(\s)/, '$11er$2')
  }
  return c.at(day, time)
}

export function statusLine(schedule, locale = 'fr', now = new Date()) {
  const c = chatCopy(locale)
  const st = chatStatus(schedule, now)
  if (st.state === 'open') return { open: true, text: c.statusOpen }
  if (st.state === 'closure') return { open: false, text: c.statusClosure }
  if (st.state === 'closed') {
    const when = reopenText(st.reopen, locale, now)
    return { open: false, text: when ? c.statusClosed(when) : c.statusClosure }
  }
  return { open: null, text: c.statusUnknown }
}
