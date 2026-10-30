'use client'
import { useEffect, useState } from 'react'
import { clock } from '@/lib/i18n'
import { localParts, hoursFor } from '@/lib/studio/time'

// « Aujourd’hui : 8 h 30 – 17 h 30 », read in the browser's clock against the shop's own schedule (the page may
// have been built on another day): exceptional closure, then a special day, then the regular week. Unknown or
// « à confirmer » → nothing, never a guess. It also sets <html data-today="Wednesday">, so every hours table on the
// page highlights today's row (site.css). Enhancement only: the hours table is the content.
export function TodayHours({ schedule = {}, locale = 'fr', labels }) {
  const [text, setText] = useState(null)
  const { today, closed } = labels
  useEffect(() => {
    const read = () => {
      const now = new Date()
      const here = localParts(now)
      document.documentElement.dataset.today = here.weekday
      const c = schedule.closure
      if (c?.active && (!c.until || new Date(c.until).getTime() > now.getTime())) return setText(closed)
      const { intervals, source } = hoursFor(schedule, here.iso)
      if (source === 'unknown' || source === 'to_confirm') return setText(null)
      setText(intervals.length ? intervals.map((h) => `${clock(h.opens, locale)} – ${clock(h.closes, locale)}`).join(', ') : closed)
    }
    read()
    const timer = setInterval(read, 60_000)
    return () => clearInterval(timer)
  }, [schedule, locale, closed])
  if (!text) return null
  return (
    <p className="today-hours">
      <span className="today-hours-label">{today}</span>
      {locale === 'fr' ? ' : ' : ': '}
      <span className="today-hours-time">{text}</span>
    </p>
  )
}
