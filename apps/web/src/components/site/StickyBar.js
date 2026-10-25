import { t } from '@/lib/i18n'
import { pathFor } from '@/lib/routes'

// Thumb-zone bar on phones: Commander · Itinéraire · Appeler (v0c §7).
export function StickyBar({ business, locale }) {
  const s = t(locale)
  const maps = business?.google?.cid ? `https://maps.google.com/?cid=${business.google.cid}` : null
  return (
    <nav className="sticky-bar" aria-label={s.actions.order}>
      <a href={pathFor('commander', locale) || pathFor('commander', 'fr')} data-event="order_click" className="primary">{s.actions.order}</a>
      {maps && <a href={maps} data-event="directions_click">{s.actions.directions}</a>}
      {business?.phone && <a href={`tel:${business.phone}`} data-event="phone_click">{s.actions.call}</a>}
    </nav>
  )
}
