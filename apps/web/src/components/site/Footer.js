import Link from 'next/link'
import { t } from '@/lib/i18n'
import { pathFor } from '@/lib/routes'
import { Fact } from './Fact'
import { HoursTable } from './HoursTable'

const OFFICER = {
  fr: 'Responsable de la protection des renseignements personnels',
  en: 'Person in charge of personal information',
  es: 'Responsable de los datos personales',
}

// Footer NAP identical to the Google profile (v1 L2); legal identity and the person in charge (07 S5).
// Legal boilerplate is data-nosnippet so it is never lifted as a snippet.
export function Footer({ business, shop, locale }) {
  const s = t(locale)
  const a = business?.address || {}
  const officer = business?.privacyOfficer || {}
  const street = a.street && locale !== 'fr' ? a.street.replace(/^(\d+),\s*/, '$1 ') : a.street
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <section aria-labelledby="footer-nap">
          <h2 id="footer-nap" className="footer-title">{business?.name || 'Pâtisserie Coco Vanille'}</h2>
          <address>
            <Fact value={street} label="adresse" id="address.street" />
            <br />
            {a.city} ({a.region}) <Fact value={a.postalCode} label="code postal" id="address.postalCode" />
            <br />
            <Fact value={business?.phone} label="téléphone" id="phone">
              <a href={`tel:${business?.phone}`} data-event="phone_click">{business?.phoneDisplay || business?.phone}</a>
            </Fact>
            {business?.email && (
              <>
                <br />
                <a href={`mailto:${business.email}`}>{business.email}</a>
              </>
            )}
          </address>
        </section>
        <section aria-label={s.hours}>
          <HoursTable shop={shop} locale={locale} />
        </section>
        <nav aria-label={s.legal} data-nosnippet="">
          <ul className="footer-links">
            {[
              ['confidentialite', s.privacy],
              ['conditions-de-vente', s.terms],
              ['temoins', s.cookies],
              ['accessibilite', s.accessibility],
              ['allergenes', s.allergens],
            ].map(([key, label]) => {
              const href = pathFor(key, locale) || pathFor(key, 'fr')
              return (
                <li key={key}>
                  <Link href={href}>{label}</Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
      <div className="wrap footer-legal small" data-nosnippet="">
        <p>
          {business?.legalName || 'Pâtisserie Coco Vanille inc.'}
          {business?.neq && <> · NEQ {business.neq}</>}
        </p>
        <p>
          {OFFICER[locale] || OFFICER.fr}
          {locale === 'fr' ? ' : ' : ': '}
          <Fact value={officer.title} label="titre de la personne responsable" id="privacyOfficer.title" />
          {' · '}
          <Fact value={officer.email} label="courriel de la personne responsable" id="privacyOfficer.email">
            <a href={`mailto:${officer.email}`}>{officer.email}</a>
          </Fact>
        </p>
      </div>
    </footer>
  )
}
