import { t } from '@/lib/i18n'
import { pathFor } from '@/lib/routes'

// Thumb-zone bar on phones: Commander · Itinéraire · Appeler (v0c §7). « Commander » only while the order
// page answers in this language (`served`, lib/publish.js).
export function StickyBar({ business, locale, served = null }) {
  const s = t(locale)
  const maps = business?.google?.cid ? `https://maps.google.com/?cid=${business.google.cid}` : null
  const order = !served || served[locale]?.has('commander') ? pathFor('commander', locale) || pathFor('commander', 'fr') : null
  if (!order && !maps && !business?.phone) return null
  return (
    <nav className="sticky-bar" aria-label={s.actions.order}>
      {order && <a href={order} data-event="order_click" className="primary">{s.actions.order}</a>}
      {maps && <a href={maps} data-event="directions_click">{s.actions.directions}</a>}
      {business?.phone && <a href={`tel:${business.phone}`} data-event="phone_click">{s.actions.call}</a>}
    </nav>
  )
}
