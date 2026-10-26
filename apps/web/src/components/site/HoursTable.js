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

// Hours in the server HTML (v1 L4), then the special days Studio set for the coming weeks (holidays,
// exceptional closures, special hours). Missing hours → one visible marker, never a guess.
export function HoursTable({ shop, locale }) {
  const s = t(locale)
  const rows = shop?.hours || []
  const special = upcomingSpecialDays(shop)
  return (
    <>
      {rows.length ? (
        <table className="hours">
          <caption>{s.hours}</caption>
          <tbody>
            {ORDER.map((day) => {
              const r = rows.filter((h) => h.day === day)
              return (
                <tr key={day}>
                  <th scope="row">{s.weekdays[day]}</th>
                  <td>{r.length ? r.map((h) => `${clock(h.opens, locale)} – ${clock(h.closes, locale)}`).join(', ') : s.closed}</td>
                </tr>
              )
            })}
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
