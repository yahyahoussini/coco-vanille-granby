import Link from 'next/link'
import { t } from '@/lib/i18n'
import { pathFor } from '@/lib/routes'
import { Fact } from './Fact'
import { HoursTable } from './HoursTable'

// Footer NAP identical to the Google profile (v1 L2). Legal boilerplate is data-nosnippet.
export function Footer({ business, shop, locale }) {
  const s = t(locale)
  const a = business?.address || {}
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <section aria-labelledby="footer-nap">
          <h2 id="footer-nap" className="footer-title">{business?.name || 'Pâtisserie Coco Vanille'}</h2>
          <address>
            <Fact value={a.street} label="adresse" id="address.street" />
            <br />
            {a.city} ({a.region}) <Fact value={a.postalCode} label="code postal" id="address.postalCode" />
            <br />
            <Fact value={business?.phone} label="téléphone" id="phone">
              <a href={`tel:${business?.phone}`}>{business?.phoneDisplay || business?.phone}</a>
            </Fact>
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
    </footer>
  )
}
