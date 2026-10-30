import Link from 'next/link'
import { t } from '@/lib/i18n'
import { LOCALES, HTML_LANG, SITE_ORIGIN, pathFor, localeEnabled } from '@/lib/routes'
import { Icon } from './Icon'
import { OpenNow } from './OpenNow'
import { TodayHours } from './TodayHours'
import { MenuSheet } from './MenuSheet'
import { socialLinks } from './Footer'
import { pillSchedule } from './hours'

// « Commander » is also the header's button on large screens; the list keeps it for the row of chips that replaces
// the menu sheet in a browser without the popover API.
const NAV = ['carte', 'gateaux-personnalises', 'commander', 'nous-trouver', 'a-propos']
// The phone menu: the same pages as large rows (« Commander » is its button), then the two most asked guides.
const MENU = ['carte', 'gateaux-personnalises', 'nous-trouver', 'a-propos', 'prix', 'faq']
const MENU_ICON = { carte: 'menu', 'gateaux-personnalises': 'cake', 'nous-trouver': 'pin', 'a-propos': 'heart', prix: 'tag', faq: 'help' }
const MENU_ID = 'site-menu'

// Skip link → info bar (live « Ouvert », address, phone, languages) → brand, nav and the order button.
// Phones and tablets (< 60rem): a compact app bar (brand + « Menu ») whose button opens the menu sheet: the pages,
// today's status and hours, the address, both phones, the languages, the verified profiles and « Commander ».
// The inline nav and the sheet's nav are never exposed at the same time (each is display: none at the other size).
// `served` ({ fr: Set, en: Set, es: Set }, lib/publish.js): only pages the site answers get a link.
// `alternates`: the page's hreflang map (a product's own URL in each language); otherwise that language's
// home, and no entry at all for a language the site does not answer.
// The menu's families and products sit under « Carte »: that row is marked as the current section (as the tab
// bar's « Carte » is), the page itself only when it is the menu.
const MENU_SECTION = ['viennoiseries', 'pains', 'gateaux', 'patisseries']

export function Header({ locale, pageKey, served, alternates = null, business = null, shop = null, product = false }) {
  const current = (key) => (pageKey === key ? 'page' : key === 'carte' && (product || MENU_SECTION.includes(pageKey)) ? 'true' : undefined)
  const s = t(locale)
  const answers = (key, l) => !served || served[l]?.has(key)
  const toPath = (url) => (url && url.startsWith(SITE_ORIGIN) ? url.slice(SITE_ORIGIN.length) || '/' : null)
  const switchTo = (l) => toPath(alternates?.[HTML_LANG[l]]) || (pageKey && answers(pageKey, l) && pathFor(pageKey, l)) || (answers('home', l) && pathFor('home', l)) || null
  const others = LOCALES.filter((l) => l !== locale && localeEnabled(l)).map((l) => ({ l, href: switchTo(l) })).filter((o) => o.href)
  const order = answers('commander', locale) ? pathFor('commander', locale) : null
  const visit = answers('nous-trouver', locale) ? pathFor('nous-trouver', locale) : null
  const home = pathFor('home', locale)
  const a = business?.address || {}
  const street = a.street && locale !== 'fr' ? a.street.replace(/^(\d+),\s*/, '$1 ') : a.street
  const label = (key) => (key === 'gateaux-personnalises' ? s.shell.cakes : s.nav[key] || s.pageNames[key])
  const schedule = pillSchedule(shop || {})
  const hasHours = schedule.hours.length > 0
  const pill = <OpenNow schedule={schedule} locale={locale} labels={{ open: s.openNow, closed: s.closedNow, until: s.until }} />
  const social = socialLinks(business)
  const languages = (className) =>
    others.length > 0 && (
      <ul className={className} aria-label="Langue · Language">
        {others.map(({ l, href }) => (
          <li key={l}>
            <a href={href} hrefLang={l} lang={l}>
              {className !== 'lang' && <Icon name="globe" size={18} />}
              {t(l).languageName}
            </a>
          </li>
        ))}
      </ul>
    )
  const brand = (
    <Link href={home} className="brand">
      <img className="brand-badge" src="/brand/logo-badge-96.webp" srcSet="/brand/logo-badge-96.webp 96w, /brand/logo-badge-192.webp 192w" sizes="56px" width="56" height="56" alt="" />
      <span className="brand-text">
        <span className="brand-name">Coco Vanille</span>
        <span className="brand-sub">{s.shell.brandSub}</span>
      </span>
    </Link>
  )
  const menuLinks = MENU.filter((key) => pathFor(key, locale) && answers(key, locale))
  return (
    <header className="site-header">
      <a className="skip" href="#contenu">{s.skip}</a>
      <div className="topbar">
        <div className="wrap topbar-row">
          {pill}
          {street && (
            <span className="topbar-item">
              <Icon name="pin" size={16} />
              {visit ? <Link href={visit}>{`${street}, ${a.city}`}</Link> : `${street}, ${a.city}`}
            </span>
          )}
          {business?.phone && (
            <a className="topbar-item" href={`tel:${business.phone}`} data-event="phone_click">
              <Icon name="phone" size={16} />
              {business.phoneDisplay || business.phone}
            </a>
          )}
          {languages('lang')}
        </div>
      </div>
      <div className="wrap header-row">
        {brand}
        <nav aria-label={s.shell.mainNav} className="main-nav">
          <ul className="nav">
            {NAV.map((key) => {
              const href = pathFor(key, locale)
              if (!href || !answers(key, locale)) return null
              return (
                <li key={key} className={key === 'commander' ? 'nav-order' : undefined}>
                  <Link href={href} aria-current={current(key)}>{label(key)}</Link>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="header-actions">
          {order && (
            <a className="btn btn-primary btn-small" href={order} data-event="order_click" data-magnetic="">
              <Icon name="box" size={18} />
              {s.actions.order}
            </a>
          )}
          <button type="button" className="menu-button" popoverTarget={MENU_ID}>
            <Icon name="lines" size={20} />
            <span>{s.shell.openMenu}</span>
          </button>
        </div>
      </div>
      <MenuSheet id={MENU_ID} label={s.shell.openMenu} className="nav-sheet">
        <div className="nav-sheet-head">
          {brand}
          <button type="button" className="nav-close" popoverTarget={MENU_ID} popoverTargetAction="hide" autoFocus>
            <Icon name="close" size={22} label={s.shell.closeMenu} />
          </button>
        </div>
        <div className="nav-sheet-body">
          {menuLinks.length > 0 && (
            <nav aria-label={s.shell.mainNav} className="nav-sheet-links">
              <ul>
                {menuLinks.map((key) => (
                  <li key={key}>
                    <Link href={pathFor(key, locale)} className="nav-row" aria-current={current(key)}>
                      <span className="nav-row-icon">
                        <Icon name={MENU_ICON[key]} size={20} />
                      </span>
                      <span className="nav-row-label">{label(key)}</span>
                      <Icon name="chevron-right" size={18} className="nav-row-chevron" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
          {(hasHours || street || business?.phone) && (
            <div className="nav-sheet-reach">
              {hasHours && (
                <div className="nav-place nav-today">
                  <Icon name="clock" size={20} />
                  <div className="nav-place-text">
                    {pill}
                    <TodayHours schedule={schedule} locale={locale} labels={{ today: s.shell.today, closed: s.closed }} />
                  </div>
                </div>
              )}
              {street &&
                (visit ? (
                  <Link href={visit} className="nav-place">
                    <Icon name="pin" size={20} />
                    <span className="nav-place-text">
                      <span className="nav-kicker">{s.about.address}</span>
                      <span>{street}</span>
                      <span>{[`${a.city || ''}${a.region ? ` (${a.region})` : ''}`, a.postalCode].filter(Boolean).join(' ')}</span>
                    </span>
                    <Icon name="chevron-right" size={18} className="nav-row-chevron" />
                  </Link>
                ) : (
                  <p className="nav-place">
                    <Icon name="pin" size={20} />
                    <span className="nav-place-text">
                      <span>{street}</span>
                      <span>{[`${a.city || ''}${a.region ? ` (${a.region})` : ''}`, a.postalCode].filter(Boolean).join(' ')}</span>
                    </span>
                  </p>
                ))}
              {business?.phone && (
                <div className="nav-phones">
                  <a className="nav-phone" href={`tel:${business.phone}`} data-event="phone_click">
                    <Icon name="phone" size={20} />
                    <span>
                      <span className="nav-kicker">{s.shell.phone}</span>
                      <span className="nav-phone-number">{business.phoneDisplay || business.phone}</span>
                    </span>
                  </a>
                  {business.mobile && business.mobileDisplay && (
                    <a className="nav-phone" href={`tel:${business.mobile}`} data-event="phone_click">
                      <Icon name="smartphone" size={20} />
                      <span>
                        <span className="nav-kicker">{s.shell.mobile}</span>
                        <span className="nav-phone-number">{business.mobileDisplay}</span>
                      </span>
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
          {(others.length > 0 || social.length > 0) && (
            <div className="nav-sheet-meta">
              {languages('lang nav-lang')}
              {social.length > 0 && (
                <ul className="nav-social" aria-label={s.shell.followUs}>
                  {social.map((x) => (
                    <li key={x.url}>
                      <a href={x.url} rel="me noopener" aria-label={x.kind === 'facebook' ? 'Facebook' : 'Instagram'}>
                        <Icon name={x.kind} size={20} />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
        {order && (
          <div className="nav-sheet-foot">
            <Link href={order} className="btn btn-primary nav-sheet-order" data-event="order_click" aria-current={pageKey === 'commander' ? 'page' : undefined}>
              <Icon name="box" size={20} />
              {s.actions.order}
              <Icon name="arrow" size={18} className="icon-arrow" />
            </Link>
          </div>
        )}
      </MenuSheet>
    </header>
  )
}
