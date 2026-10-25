import { t, clock } from '@/lib/i18n'
import { Fact } from './Fact'

const ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

// Hours in the server HTML (v1 L4). Missing hours → one visible marker, never a guess.
export function HoursTable({ shop, locale }) {
  const s = t(locale)
  const rows = shop?.hours || []
  if (!rows.length) {
    return <p><Fact value={null} label="heures d’ouverture confirmées par le propriétaire" id="hours" /></p>
  }
  return (
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
  )
}
