import { t } from '@/lib/i18n'
import { pathFor } from '@/lib/routes'
import { Icon } from './Icon'

// The menu's categories and products light up « Carte »; the box, payment and thanks pages light up « Commander »
// (aria-current="true": inside that section; "page": that very page).
const MENU_SECTION = ['viennoiseries', 'pains', 'gateaux', 'patisseries']
const ORDER_SECTION = ['boite', 'paiement', 'merci']

// Thumb-zone tab bar on phones (v0c §7): Appeler · Itinéraire · Commander (raised, in the middle) · Carte · Écrire.
// « Commander » and « Carte » only while those pages answer in this language (`served`, lib/publish.js).
// « Écrire » opens the chat panel (any [data-chat-open] element); without JavaScript it leads to the visit page.
// It never hides on scroll: body and html keep their bottom padding (--bar-space, site.css) so focus stays above it.
export function StickyBar({ business, locale, served = null, chat = true, pageKey = null, product = false }) {
  const s = t(locale)
  const answers = (key) => !served || served[locale]?.has(key)
  const maps = business?.google?.cid ? `https://maps.google.com/?cid=${business.google.cid}` : null
  const order = answers('commander') ? pathFor('commander', locale) || pathFor('commander', 'fr') : null
  const menu = answers('carte') ? pathFor('carte', locale) : null
  const visit = answers('nous-trouver') ? pathFor('nous-trouver', locale) : null
  const current = (key, inSection) => (pageKey === key ? 'page' : inSection ? 'true' : undefined)
  if (!order && !maps && !business?.phone) return null
  return (
    <nav className="sticky-bar" aria-label={s.shell.quickActions}>
      {business?.phone && (
        <a href={`tel:${business.phone}`} data-event="phone_click">
          <Icon name="phone" size={24} strokeWidth={1.6} />
          <span>{s.actions.call}</span>
        </a>
      )}
      {maps && (
        <a href={maps} data-event="directions_click">
          <Icon name="directions" size={24} strokeWidth={1.6} />
          <span>{s.actions.directions}</span>
        </a>
      )}
      {order && (
        <a href={order} data-event="order_click" className="primary" aria-current={current('commander', ORDER_SECTION.includes(pageKey))}>
          <span className="sticky-fab">
            <Icon name="box" size={26} strokeWidth={1.6} />
          </span>
          <span>{s.actions.order}</span>
        </a>
      )}
      {menu && (
        <a href={menu} aria-current={current('carte', product || MENU_SECTION.includes(pageKey))}>
          <Icon name="menu" size={24} strokeWidth={1.6} />
          <span>{s.shell.menu}</span>
        </a>
      )}
      {chat && visit && (
        <a href={visit} data-chat-open="">
          <Icon name="chat" size={24} strokeWidth={1.6} />
          <span>{s.shell.write}</span>
        </a>
      )}
    </nav>
  )
}
