import Link from 'next/link'
import { t, longDate, officerTitle, keepTogether } from '@/lib/i18n'
import { pathFor, SITE_ORIGIN } from '@/lib/routes'
import { getProducts, getCategories, getAllergens, payloadClient } from '@/lib/data'
import { Fact } from '../site/Fact'
import { HoursTable } from '../site/HoursTable'
import { OpenNow } from '../site/OpenNow'
import { AnswerBlock, KeyFacts, Sections, Faq, ConversionBand, MetaLine, Unbroken } from '../site/Contract'
import { ProductGrid, SizesTable, Photo, productPath } from '../site/Products'
import { hoursSummary, pillSchedule } from '../site/hours'
import { vitrinePhotoOf } from '@/lib/studio/vitrine'
import { localParts } from '@/lib/studio/time'
import { longDayLabel } from '@/lib/ordering/labels'
import { parseGuests, matchSizes, seasonState, monthYear, fromPriceCents, sizeText, priceText, perPortionText } from '../site/offer'
import { orderingTemplates } from './ordering'
import { Icon, CATEGORY_ICON } from '../site/Icon'
import { Ornament } from '../site/Ornament'
import { StockPhoto } from '../site/StockPhoto'
import { PHOTOS } from '@/lib/photos'
import { MenuTemplate, CategoryTemplate } from './menu'
import { HomeTemplate } from './home'
import { ProductTemplate } from './product'
import { ContentTemplate, REGION, categoryHref, pageHref, orderAction, googleMapsUrl, mapsAction, phoneAction, streetFor, addressLine, appleMapsUrl, ratingOf } from './shared'

export { addressLine }

// ---------- Visit: address, link-out buttons (no map tiles), phone, parking, hours ----------

// The round icon that starts a visit row (pin, phone, mobile, parking); decorative, the row's own label says what it is.
function RowIcon({ name }) {
  return (
    <span className="visit-row-icon" aria-hidden="true">
      <Icon name={name} size={18} />
    </span>
  )
}

function VisitTemplate(props) {
  const { business, shop, locale } = props
  const s = t(locale)
  const v = s.visit
  const a = business?.address || {}
  const google = googleMapsUrl(business)
  const apple = appleMapsUrl(business)
  return (
    <ContentTemplate {...props} primary={mapsAction(business, locale)} secondary={phoneAction(business, locale)}>
      <section aria-labelledby="visit-address" className="visit-card" data-reveal="">
        <div className="visit-map" aria-hidden="true">
          <span className="visit-map-pin">
            <Icon name="pin" size={34} />
          </span>
          <Ornament name="palm" className="visit-map-palm" />
        </div>
        <div className="visit-body">
          <h2 id="visit-address">{v.address}</h2>
          <address className="visit-row">
            <RowIcon name="pin" />
            <strong>{business?.name}</strong>
            <br />
            <Fact value={streetFor(a, locale)} label="adresse" id="address.street" />
            <br />
            {a.city}
            {locale === 'fr' ? ` (${REGION[a.region] || a.region}) ` : `, ${REGION[a.region] || a.region} `}
            <Fact value={a.postalCode} label="code postal" id="address.postalCode" />
          </address>
          {(google || apple) && (
            <p className="map-links">
              <span>{v.openIn}</span>
              {google && (
                <a className="btn btn-primary" href={google} data-event="directions_click">
                  <Icon name="directions" size={18} />
                  {v.google}
                </a>
              )}
              {apple && (
                <a className="btn btn-quiet" href={apple} data-event="directions_click">
                  <Icon name="pin" size={18} />
                  {v.apple}
                </a>
              )}
            </p>
          )}
          <dl className="visit-facts">
            <div className="visit-row">
              <dt>
                <RowIcon name="phone" />
                {v.phone}
              </dt>
              <dd>
                <Fact value={business?.phone} label="téléphone" id="phone">
                  <a href={`tel:${business?.phone}`} data-event="phone_click">{business?.phoneDisplay || business?.phone}</a>
                </Fact>
              </dd>
            </div>
            {business?.mobile && business?.mobileDisplay && (
              <div className="visit-row">
                <dt>
                  <RowIcon name="mobile" />
                  {s.shell.mobile}
                </dt>
                <dd>
                  <a href={`tel:${business.mobile}`} data-event="phone_click">{business.mobileDisplay}</a>
                </dd>
              </div>
            )}
            <div className="visit-row">
              <dt>
                <RowIcon name="parking" />
                {v.parking}
              </dt>
              <dd><Fact value={business?.parking} label="stationnement (rues, terrains, tarifs)" id="parking" /></dd>
            </div>
          </dl>
        </div>
        {/* Today's row of the hours table is marked site-wide (TodayHours + site.css). */}
        <div className="visit-hours-panel">
          <OpenNow schedule={pillSchedule(shop)} locale={locale} labels={{ open: s.openNow, closed: s.closedNow, until: s.until }} />
          <HoursTable shop={shop} locale={locale} />
        </div>
      </section>
    </ContentTemplate>
  )
}

// ---------- About: facts box from the business global ----------
function FactList({ id, title, rows }) {
  return (
    <section className="fact-box" aria-labelledby={id}>
      <h2 id={id}>{title}</h2>
      <dl>
        {rows.map(([term, value, label, factId, render]) => (
          <div key={term}>
            <dt>{term}</dt>
            <dd>
              <Fact value={value} label={label} id={factId}>
                {render}
              </Fact>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

const LANGUAGE_NAMES = { fr: { fr: 'français', en: 'anglais', es: 'espagnol' }, en: { fr: 'French', en: 'English', es: 'Spanish' }, es: { fr: 'francés', en: 'inglés', es: 'español' } }

// A long address shown as link text breaks after a slash on a phone, not in the middle of a word.
const breakable = (text = '') => text.split('/').flatMap((part, i) => (i ? [<wbr key={i} />, `/${part}`] : [part]))

function AboutTemplate(props) {
  const { business, locale } = props
  const l = t(locale).about
  // Every verified profile (business.sameAs[].verified), as in the footer and the structured data.
  const profiles = (business?.sameAs || []).filter((x) => x.verified && x.url)
  const names = LANGUAGE_NAMES[locale] || LANGUAGE_NAMES.fr
  return (
    <ContentTemplate {...props} secondary={phoneAction(business, locale)}>
      <FactList
        id="about-identity"
        title={l.identity}
        rows={[
          [l.name, business?.name, 'nom', 'name'],
          [l.otherSpelling, (business?.alternateName || []).join(', '), 'autre graphie', 'alternateName'],
          [l.legalName, business?.legalName, 'raison sociale', 'legalName'],
          [l.neq, business?.neq, 'NEQ', 'neq'],
          [l.address, addressLine(business, locale), 'adresse', 'address', keepTogether(addressLine(business, locale))],
          [l.phone, business?.phone, 'téléphone', 'phone', <a key="tel" href={`tel:${business?.phone}`}>{business?.phoneDisplay}</a>],
          [l.email, business?.email, 'courriel de la boutique', 'email', <a key="mail" href={`mailto:${business?.email}`}>{business?.email}</a>],
          [l.languages, (business?.languagesServed || []).map((x) => names[x] || x).join(', '), 'langues de service', 'languagesServed'],
          [l.social, profiles.map((x) => x.url).join(' '), 'page officielle vérifiée', 'sameAs', profiles.map((x, i) => (
            <span key={x.url}>
              {i > 0 && ' · '}
              <a href={x.url}>{breakable(x.url.replace(/^https:\/\/(www\.)?/, '').replace(/\/$/, ''))}</a>
            </span>
          ))],
        ]}
      />
    </ContentTemplate>
  )
}

// ---------- Allergens: per-product table, verified lists only ----------
async function AllergensTemplate(props) {
  const { locale, business } = props
  const s = t(locale)
  const [allergens, products] = await Promise.all([getAllergens(locale), getProducts({ locale })])
  // On phones each product becomes one row of a list (content.css): explicit roles keep the table semantics when
  // CSS changes the display, and data-label repeats the column header in front of each value.
  const table = products.length ? (
    <div className="table-scroll allergen-scroll" role="region" aria-label={s.allergens} tabIndex={0}>
      <table className="allergen-table" role="table">
        <caption>{s.allergens}</caption>
        <thead role="rowgroup">
          <tr role="row">
            <th scope="col" role="columnheader">{s.offer.product}</th>
            <th scope="col" role="columnheader">{s.offer.contains}</th>
            <th scope="col" role="columnheader">{s.mayContain}</th>
          </tr>
        </thead>
        <tbody role="rowgroup">
          {products.map((p) => {
            const verified = Boolean(p.allergensVerified?.at)
            const href = productPath(p, locale)
            return (
              <tr key={p.id} role="row">
                <th scope="row" role="rowheader">{href ? <Link href={href}>{p.title}</Link> : p.title}</th>
                <td role="cell" data-label={s.offer.contains}>{verified ? (p.allergens || []).map((a) => a.label).join(', ') || '—' : <Fact value={null} label="allergènes vérifiés par une personne" />}</td>
                <td role="cell" data-label={s.mayContain}>{verified ? (p.mayContain || []).map((a) => a.label).join(', ') || '—' : '—'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  ) : (
    <p><Fact value={null} label="liste des allergènes par produit" /></p>
  )
  return (
    <ContentTemplate {...props} secondary={phoneAction(business, locale)} slot={{ after: 0, node: table }}>
      {allergens.length > 0 && <p className="small allergen-legend">{allergens.map((a) => a.label).join(' · ')}</p>}
    </ContentTemplate>
  )
}

// ---------- Prices: one dated table per category; price per serving only when both numbers exist ----------
async function PricesTemplate(props) {
  const { locale } = props
  const s = t(locale)
  const o = s.offer
  const [products, categories] = await Promise.all([getProducts({ locale }), getCategories(locale)])
  const priced = products.filter((p) => fromPriceCents(p) !== null)
  const asOf = priced.map((p) => p.updatedAt).filter(Boolean).sort().at(-1)
  const groups = categories
    .map((c) => ({ category: c, rows: products.filter((p) => p.productionCategory === c.productionCategory).flatMap((p) => (p.variants || []).map((variant) => ({ product: p, variant }))) }))
    .filter((g) => g.rows.length)
  return (
    <ContentTemplate {...props} primary={orderAction(locale, props.served)}>
      <section aria-labelledby="prices-table" className="prices">
        <h2 id="prices-table">{o.sizesTitle}</h2>
        {groups.length ? (
          groups.map((g) => <SizesTable key={g.category.id} rows={g.rows} locale={locale} caption={g.category.title} showProduct />)
        ) : (
          <p><Fact value={null} label="grille de prix par format" /></p>
        )}
        <p className="small prices-as-of">
          {o.pricesAsOf} {asOf ? <time dateTime={asOf}>{longDate(asOf, locale)}</time> : <Fact value={null} label="date de la grille de prix" />} · {s.taxesExtra}
        </p>
      </section>
    </ContentTemplate>
  )
}

// ---------- Calculator: GET form, the server computes the sizes (works with JavaScript off) ----------
async function CalculatorTemplate(props) {
  const { locale, page, query, business } = props
  const s = t(locale)
  const c = s.calc
  const asked = query?.invites !== undefined && query?.invites !== ''
  const guests = parseGuests(query?.invites)
  const cakes = await getProducts({ locale, productionCategory: 'gateaux' })
  const { known, matches, largest } = matchSizes(cakes, guests)
  const action = pathFor(page.key, locale)
  const best = matches[0]
  return (
    <ContentTemplate {...props} className="calculator" primary={orderAction(locale, props.served)} secondary={phoneAction(business, locale)}>
      <form method="get" action={action} className="calc-form">
        <fieldset>
          <legend>{c.legend}</legend>
          <label htmlFor="invites">{c.guests}</label>
          <div className="calc-row">
            <input
              id="invites"
              name="invites"
              type="number"
              inputMode="numeric"
              min="1"
              max="1000"
              step="1"
              required
              defaultValue={guests ?? ''}
              aria-describedby={asked && !guests ? 'invites-hint invites-error' : 'invites-hint'}
              aria-invalid={asked && !guests ? 'true' : undefined}
            />
            <button type="submit" className="btn btn-primary">{c.submit}</button>
          </div>
          <p id="invites-hint" className="small">{c.hint}</p>
          {asked && !guests && (
            <p id="invites-error" className="form-error" role="alert">
              <Icon name="alert" size={18} />
              {c.invalid}
            </p>
          )}
        </fieldset>
      </form>
      {!known && (
        <p><Fact value={null} label="portions par format de gâteau" id="portions" /></p>
      )}
      {guests && known > 0 && (
        <section aria-labelledby="calc-results" className="calc-results">
          <h2 id="calc-results">{c.results(guests)}</h2>
          {best ? (
            <>
              {/* The answer first, as a card: the badge, the cake, then its size, servings and price. */}
              <p className="calc-best">
                <span className="badge badge-best">{c.bestFit}</span>{' '}
                <span className="calc-best-name">{productPath(best.product, locale) ? <Link href={productPath(best.product, locale)}>{best.product.title}</Link> : best.product.title}</span>{' '}
                <span className="calc-best-detail">
                  {sizeText(best.variant, locale)} · {c.feeds(best.feeds)}
                  {priceText(best.variant, locale) && ` · ${priceText(best.variant, locale)}`}
                  {perPortionText(best.variant, locale) && ` (${perPortionText(best.variant, locale)} ${s.offer.each})`}
                </span>
              </p>
              <SizesTable rows={matches} locale={locale} showProduct />
            </>
          ) : (
            <p>{c.noneFits(guests, largest)}</p>
          )}
        </section>
      )}
    </ContentTemplate>
  )
}

// ---------- Seasonal: permanent URL, state from the seasons collection (08 P3) ----------
async function SeasonalTemplate(props) {
  const { page, locale } = props
  const se = t(locale).season
  const payload = await payloadClient()
  const season = (await payload.find({ collection: 'seasons', where: { key: { equals: page.season } }, locale, limit: 1, depth: 0 })).docs[0] || null
  const products = season
    ? (await payload.find({ collection: 'products', where: { season: { equals: season.id }, _status: { equals: 'published' } }, locale, limit: 50, depth: 1, sort: 'title' })).docs
    : []
  const st = seasonState(season, { products })
  const label = st.state === 'over' ? se.over(monthYear(st.back, locale)) : se[st.state]
  const date = (d) => <time dateTime={d.toISOString()}>{longDate(d.toISOString(), locale)}</time>
  return (
    <ContentTemplate {...props} className="seasonal" primary={st.state === 'open' && orderAction(locale, props.served) ? { ...orderAction(locale, props.served), label: t(locale).actions.preorder } : orderAction(locale, props.served)}>
      <section aria-labelledby="season-state" className={`season-card season-${st.state}`}>
        <h2 id="season-state">{se.title}</h2>
        <p className="season-badge">{label}</p>
        {!season || st.state === 'unknown' ? (
          <p><Fact value={null} label={`saison « ${page.season} » : dates d’ouverture et de fermeture des précommandes`} id="season" /></p>
        ) : (
          <p>
            {st.state === 'soon' && <>{se.opensOn} {date(st.opens)}.</>}
            {st.state === 'open' && <>{se.closesOn} {date(st.closes)}.</>}
            {(st.state === 'full' || st.state === 'over') && <>{se.closedOn} {date(st.closes)}.</>}
          </p>
        )}
        {st.pickups?.length > 0 && st.state !== 'over' && (
          <>
            <h3>{se.pickups}</h3>
            <ul className="pickup-dates">
              {st.pickups.map((d) => (
                <li key={d.toISOString()}>{date(d)}</li>
              ))}
            </ul>
          </>
        )}
      </section>
      {products.length > 0 && (
        <section aria-labelledby="season-products" className="season-products">
          <h2 id="season-products">{se.products}</h2>
          <ProductGrid products={products} locale={locale} layout="list" />
        </section>
      )}
    </ContentTemplate>
  )
}

// ---------- Legal: identity boxes from the business global; translations say French prevails ----------
const LEGAL_LABELS = {
  fr: { officer: 'Responsable de la protection des renseignements personnels', merchant: 'Commerçant', name: 'Nom', role: 'Titre', email: 'Courriel', phone: 'Téléphone', neq: 'NEQ', address: 'Adresse', translation: null },
  en: { officer: 'Person in charge of personal information', merchant: 'Merchant', name: 'Name', role: 'Title', email: 'Email', phone: 'Phone', neq: 'Québec enterprise number', address: 'Address', translation: 'Translation for information only: in case of discrepancy, the French version prevails.', readFrench: 'Lire la version française' },
  es: { officer: 'Responsable de la protección de los datos personales', merchant: 'Comerciante', name: 'Nombre', role: 'Cargo', email: 'Correo', phone: 'Teléfono', neq: 'Número de empresa de Quebec', address: 'Dirección', translation: 'Traducción solo informativa: en caso de divergencia, la versión francesa prevalece.', readFrench: 'Lire la version française' },
}

// The person in charge (Loi 25 s. 3.1) and the merchant identity (LPC s. 54.4) come from the business
// global, so the footer, the policy and the contract never disagree.
function LegalTemplate(props) {
  const { page, business, locale } = props
  const l = LEGAL_LABELS[locale] || LEGAL_LABELS.en
  const officer = business?.privacyOfficer || {}
  const frPath = pathFor(page.key, 'fr')
  return (
    <ContentTemplate {...props} boilerplate>
      {l.translation && (
        <p className="notice translation-notice">
          {l.translation}{' '}
          <a href={frPath} hrefLang="fr" lang="fr">{l.readFrench}</a>
        </p>
      )}
      {page.key === 'confidentialite' && (
        <FactList
          id="legal-officer"
          title={l.officer}
          rows={[
            // Loi 25 s. 3.2 asks for the title and the contact information; the name shows only when it is given.
            ...(officer.name ? [[l.name, officer.name, 'nom de la personne responsable (Loi 25)', 'privacyOfficer.name']] : []),
            [l.role, officerTitle(officer.title, locale), 'titre de la personne responsable', 'privacyOfficer.title'],
            [l.email, officer.email, 'courriel de la personne responsable', 'privacyOfficer.email', <a key="mail" href={`mailto:${officer.email}`}>{officer.email}</a>],
            [l.phone, business?.phoneDisplay, 'téléphone', 'phoneDisplay'],
          ]}
        />
      )}
      {page.key === 'conditions-de-vente' && (
        <FactList
          id="legal-merchant"
          title={l.merchant}
          rows={[
            [l.name, business?.legalName, 'raison sociale', 'legalName'],
            [l.address, addressLine(business, locale), 'adresse', 'address', keepTogether(addressLine(business, locale))],
            [l.neq, business?.neq, 'NEQ', 'neq'],
            [l.phone, business?.phoneDisplay, 'téléphone', 'phoneDisplay'],
            [l.email, business?.email, 'courriel de la boutique', 'email'],
          ]}
        />
      )}
    </ContentTemplate>
  )
}

export const TEMPLATES = {
  home: HomeTemplate,
  // The Zoo page's visitor wants the way and the phone, not the order form (docs/08 §1: one main action per page).
  content: (p) =>
    p.page?.key === 'zoo-de-granby' ? (
      <ContentTemplate {...p} primary={mapsAction(p.business, p.locale)} secondary={phoneAction(p.business, p.locale)} />
    ) : (
      <ContentTemplate {...p} primary={p.page?.key === 'chef' ? null : orderAction(p.locale, p.served)} />
    ),
  about: AboutTemplate,
  visit: VisitTemplate,
  menu: MenuTemplate,
  category: CategoryTemplate,
  product: ProductTemplate,
  allergens: AllergensTemplate,
  legal: LegalTemplate,
  prices: PricesTemplate,
  calculator: CalculatorTemplate,
  seasonal: SeasonalTemplate,
  ...orderingTemplates,
}

export { SITE_ORIGIN }
