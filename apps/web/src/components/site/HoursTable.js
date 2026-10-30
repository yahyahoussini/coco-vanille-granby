import { t, clock } from '@/lib/i18n'
import { longDayLabel } from '@/lib/ordering/labels'
import { Fact } from './Fact'
import { upcomingSpecialDays } from './hours'

const ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

function specialText(day, s, locale) {
  if (day.state === 'closed') return s.closed
  if (day.opens && day.closes && (day.state === 'special' || day.state === 'open')) return `${clock(day.opens, locale)} – ${clock(day.closes, locale)}`
  if (day.state === 'open') return s.regularHours
  return s.hoursToConfirm
}

// One row per day; `compact` (the footer) joins consecutive days that keep the same hours: « mercredi – samedi ».
function weekRows(rows, s, locale, compact) {
  const groups = []
  for (const day of ORDER) {
    const r = rows.filter((h) => h.day === day)
    const text = r.length ? r.map((h) => `${clock(h.opens, locale)} – ${clock(h.closes, locale)}`).join(', ') : s.closed
    const last = groups.at(-1)
    if (compact && last && last.text === text) last.days.push(day)
    else groups.push({ days: [day], text })
  }
  return groups
}

// Hours in the server HTML (v1 L4), then the special days Studio set for the coming weeks (holidays,
// exceptional closures, special hours). Missing hours → one visible marker, never a guess.
// Each row lists its days (data-days): TodayHours sets <html data-today>, and site.css highlights today's row,
// with « Aujourd’hui » from data-today-label.
export function HoursTable({ shop, locale, compact = false }) {
  const s = t(locale)
  const rows = shop?.hours || []
  const special = upcomingSpecialDays(shop)
  return (
    <>
      {rows.length ? (
        <table className={compact ? 'hours hours-compact' : 'hours'}>
          <caption>{s.hours}</caption>
          <tbody>
            {weekRows(rows, s, locale, compact).map(({ days, text }) => (
              <tr key={days[0]} data-days={days.join(' ')}>
                <th scope="row" data-today-label={s.shell.today}>
                  {days.length > 1 ? `${s.weekdays[days[0]]} – ${s.weekdays[days.at(-1)]}` : s.weekdays[days[0]]}
                </th>
                <td>{text}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p><Fact value={null} label="heures d’ouverture confirmées par le propriétaire" id="hours" /></p>
      )}
      {special.length > 0 && (
        <table className="hours hours-special">
          <caption>{s.specialHours}</caption>
          <tbody>
            {special.map((day) => (
              <tr key={day.date} className={`special-${day.state}`}>
                <th scope="row">
                  <time dateTime={day.date}>{longDayLabel(day.date, locale)}</time>
                  {day.label && <span className="small"> · {day.label}</span>}
                </th>
                <td>{specialText(day, s, locale)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}
