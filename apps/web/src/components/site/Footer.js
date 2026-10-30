import Link from 'next/link'
import { officerTitle, t } from '@/lib/i18n'
import { pathFor } from '@/lib/routes'
import { Fact } from './Fact'
import { HoursTable } from './HoursTable'
import { Icon } from './Icon'
import { HeartRule } from './Ornament'

const OFFICER = {
  fr: 'Responsable de la protection des renseignements personnels',
  en: 'Person in charge of personal information',
  es: 'Responsable de los datos personales',
}

// Guides and services under the menu: one click from every page (rank-first L9: ≤ 3 clicks, ≥ 3 inbound links).
const EXPLORE = ['gateaux-personnalises', 'gateau-pour-demain', 'buches', 'calculateur', 'prix', 'faq', 'allergenes', 'chef', 'zoo-de-granby']

// Verified profiles only (business.sameAs[].verified): the footer and the phone menu.
export const socialLinks = (business) =>
  (business?.sameAs || [])
    .filter((x) => x.verified && x.url)
    .map((x) => ({ url: x.url, kind: /facebook\.com/.test(x.url) ? 'facebook' : /instagram\.com/.test(x.url) ? 'instagram' : null }))
    .filter((x) => x.kind)

// Footer NAP identical to the Google profile (v1 L2); legal identity and the person in charge (07 S5).
// Legal boilerplate is data-nosnippet so it is never lifted as a snippet.
// `served` (lib/publish.js): links only to pages the site answers; a legal page missing in this language
// links to the French one. Phones (< 60rem): brand and address, three big actions (Appeler, Itinéraire, Écrire:
// any [data-chat-open] opens the chat, `chat` false on payment pages), compact hours, guides in two columns,
// legal links small and quiet. The desktop keeps its four columns.
export function Footer({ business, shop, locale, served, chat = false }) {
  const s = t(locale)
  const answers = (key, l) => Boolean(pathFor(key, l)) && (!served || served[l]?.has(key))
  const hrefOf = (key) => (answers(key, locale) ? pathFor(key, locale) : answers(key, 'fr') ? pathFor(key, 'fr') : null)
  const explore = EXPLORE.filter((key) => answers(key, locale))
  const a = business?.address || {}
  const officer = business?.privacyOfficer || {}
  const street = a.street && locale !== 'fr' ? a.street.replace(/^(\d+),\s*/, '$1 ') : a.street
  const social = socialLinks(business)
  const maps = business?.google?.cid ? `https://maps.google.com/?cid=${business.google.cid}` : null
  const visit = answers('nous-trouver', locale) ? pathFor('nous-trouver', locale) : null
  const colon = locale === 'fr' ? ' : ' : ': '
  return (
    <footer className="site-footer">
      <svg className="footer-edge" viewBox="0 0 1440 48" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path d="M0 48V22C160 4 320 0 480 10s320 30 480 26 320-28 480-30v70z" />
      </svg>
      <div className="wrap footer-grid">
        <section className="footer-brand" aria-labelledby="footer-nap">
          <img className="footer-badge" src="/brand/logo-badge-192.webp" srcSet="/brand/logo-badge-192.webp 192w, /brand/logo-badge-384.webp 384w" sizes="(min-width: 60rem) 104px, 56px" width="104" height="104" alt="" loading="lazy" decoding="async" />
          <h2 id="footer-nap" className="footer-title">{business?.name || 'Pâtisserie Coco Vanille'}</h2>
          <address>
            <span className="footer-line">
              <Icon name="pin" size={18} />
              <span>
                <Fact value={street} label="adresse" id="address.street" />
                <span className="footer-comma">, </span>
                <br />
                {a.city} ({a.region}) <Fact value={a.postalCode} label="code postal" id="address.postalCode" />
              </span>
            </span>
            <span className="footer-line">
              <Icon name="phone" size={18} />
              <Fact value={business?.phone} label="téléphone" id="phone">
                <a href={`tel:${business?.phone}`} data-event="phone_click">{business?.phoneDisplay || business?.phone}</a>
              </Fact>
            </span>
            {business?.mobile && business?.mobileDisplay && (
              <span className="footer-line">
                <Icon name="smartphone" size={18} />
                <span>
                  {s.shell.mobile}
                  {colon}
                  <a href={`tel:${business.mobile}`} data-event="phone_click">{business.mobileDisplay}</a>
                </span>
              </span>
            )}
            {business?.email && (
              <span className="footer-line">
                <Icon name="mail" size={18} />
                <a href={`mailto:${business.email}`}>{business.email}</a>
              </span>
            )}
          </address>
          {(business?.phone || maps || (chat && visit)) && (
            <ul className="footer-actions" aria-label={s.shell.reachUs}>
              {business?.phone && (
                <li>
                  <a href={`tel:${business.phone}`} data-event="phone_click">
                    <Icon name="phone" size={22} />
                    <span>{s.actions.call}</span>
                  </a>
                </li>
              )}
              {maps && (
                <li>
                  <a href={maps} data-event="directions_click">
                    <Icon name="directions" size={22} />
                    <span>{s.actions.directions}</span>
                  </a>
                </li>
              )}
              {chat && visit && (
                <li>
                  <a href={visit} data-chat-open="">
                    <Icon name="chat" size={22} />
                    <span>{s.shell.write}</span>
                  </a>
                </li>
              )}
            </ul>
          )}
          {social.length > 0 && (
            <ul className="footer-social" aria-label={s.shell.followUs}>
              {social.map((x) => (
                <li key={x.url}>
                  <a href={x.url} rel="me noopener" aria-label={x.kind === 'facebook' ? 'Facebook' : 'Instagram'}>
                    <Icon name={x.kind} size={20} />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="footer-hours" aria-label={s.hours}>
          <HoursTable shop={shop} locale={locale} compact />
          <p className="footer-pickup small">
            <Icon name="box" size={16} /> {s.shell.pickupOnly}
          </p>
        </section>
        {explore.length > 0 && (
          <nav className="footer-explore" aria-labelledby="footer-explore">
            <h2 id="footer-explore" className="footer-title">{s.explore}</h2>
            <ul className="footer-links">
              {explore.map((key) => (
                <li key={key}>
                  <Link href={pathFor(key, locale)}>{s.pageNames[key]}</Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
        <nav className="footer-legal-nav" aria-labelledby="footer-legal-title" data-nosnippet="">
          <h2 id="footer-legal-title" className="footer-title">{s.legal}</h2>
          <ul className="footer-links">
            {[
              ['confidentialite', s.privacy],
              ['conditions-de-vente', s.terms],
              ['temoins', s.cookies],
              ['accessibilite', s.accessibility],
            ].map(([key, label]) => {
              const href = hrefOf(key)
              if (!href) return null
              return (
                <li key={key}>
                  <Link href={href} hrefLang={href === pathFor(key, locale) ? undefined : 'fr'}>{label}</Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
      <div className="wrap footer-legal small" data-nosnippet="">
        <HeartRule className="footer-heart" />
        <p>
          {business?.legalName || 'Pâtisserie Coco Vanille inc.'}
          {business?.neq && <> · NEQ {business.neq}</>}
        </p>
        <p>
          {OFFICER[locale] || OFFICER.fr}
          {colon}
          <Fact value={officerTitle(officer.title, locale)} label="titre de la personne responsable" id="privacyOfficer.title" />
          {' · '}
          <Fact value={officer.email} label="courriel de la personne responsable" id="privacyOfficer.email">
            <a href={`mailto:${officer.email}`}>{officer.email}</a>
          </Fact>
        </p>
      </div>
    </footer>
  )
}
