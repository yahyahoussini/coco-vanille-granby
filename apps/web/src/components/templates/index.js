import Link from 'next/link'
import { t, clock, longDate } from '@/lib/i18n'
import { pathFor, SITE_ORIGIN } from '@/lib/routes'
import { getProducts, getCategories, getAllergens, payloadClient } from '@/lib/data'
import { productNode } from '@/lib/schema'
import { Fact } from '../site/Fact'
import { HoursTable } from '../site/HoursTable'
import { OpenNow } from '../site/OpenNow'
import { AnswerBlock, KeyFacts, Sections, Faq, ConversionBand, MetaLine, Unbroken } from '../site/Contract'
import { ProductGrid, SizesTable, AllergenBlock, LaCoupe, OfferBadge, productPath } from '../site/Products'
import { hoursSummary } from '../site/hours'
import { parseGuests, matchSizes, seasonState, monthYear, leadTimeText, fromPriceCents, sizeText, portionsText, priceText, perPortionText, offerBadge } from '../site/offer'
import { orderingTemplates } from './ordering'

// Every template receives { locale, business, shop, page, doc, conditionNotice } from SitePage (product pages: { product }).
// Facts come from the business/shop globals and the catalogue; a missing one renders as a marker (zero invention).

const prefixFor = (locale) => (locale === 'fr' ? '' : `/${locale}`)
const REGION = { QC: 'Québec' }

function Missing({ text }) {
  if (!text) return null
  return <p className="notice fact-needed" data-nosnippet="">{text}</p>
}

function orderAction(locale) {
  return { href: pathFor('commander', locale) || pathFor('commander', 'fr'), label: t(locale).actions.order, event: 'order_click' }
}

const googleMapsUrl = (business) => (business?.google?.cid ? `https://maps.google.com/?cid=${business.google.cid}` : null)

function mapsAction(business, locale) {
  const href = googleMapsUrl(business)
  return href ? { href, label: t(locale).actions.directions, event: 'directions_click' } : null
}

function phoneAction(business, locale) {
  if (!business?.phone) return null
  return { href: `tel:${business.phone}`, label: `${t(locale).actions.call} · ${business.phoneDisplay || business.phone}`, event: 'phone_click' }
}

// « 3, rue Court » in French, "3 rue Court" in English (the comma is French typography only).
const streetFor = (a = {}, locale) => (a.street && locale !== 'fr' ? a.street.replace(/^(\d+),\s*/, '$1 ') : a.street)

export function addressLine(business, locale = 'fr') {
  const a = business?.address || {}
  if (!a.street || !a.city) return null
  const region = REGION[a.region] || a.region
  return locale === 'fr' ? `${a.street}, ${a.city} (${region}) ${a.postalCode || ''}`.trim() : `${streetFor(a, locale)}, ${a.city}, ${region} ${a.postalCode || ''}`.trim()
}

const appleMapsUrl = (business) => {
  const a = business?.address
  if (!a?.street) return null
  const address = `${streetFor(a, 'en')}, ${a.city}, ${a.region} ${a.postalCode || ''}, Canada`.replace(/\s+,/g, ',')
  return `https://maps.apple.com/?address=${encodeURIComponent(address)}&q=${encodeURIComponent(business.name || 'Pâtisserie Coco Vanille')}`
}

const decimal = (n, locale) => new Intl.NumberFormat(locale === 'en' ? 'en-CA' : 'fr-CA', { maximumFractionDigits: 1 }).format(n)

// Google rating: only with a value AND its date, as text (never review markup on our own pages, v1 §10).
function ratingOf(business, locale) {
  const g = business?.google || {}
  if (typeof g.rating !== 'number' || !g.ratingAsOf) return null
  return { rating: decimal(g.rating, locale), count: g.reviewCount, date: longDate(g.ratingAsOf, locale), iso: g.ratingAsOf }
}

// « Coco Vanille en bref »: one fact per line, brand named in each, from the globals (v1 §7 key facts).
function briefItems({ business, shop, locale }) {
  const b = t(locale).brief
  const hours = hoursSummary(shop?.hours, locale)
  const address = addressLine(business, locale)
  const rating = ratingOf(business, locale)
  return [
    <Fact key="category" value={business?.categorySentence} label="phrase de catégorie" id="categorySentence" />,
    address ? <span key="address" data-fact="address">{b.address(address)}</span> : <Fact key="address" value={null} label="adresse" id="address" />,
    business?.phoneDisplay ? <span key="phone" data-fact="phone">{b.phone(business.phoneDisplay)}</span> : <Fact key="phone" value={null} label="téléphone" id="phone" />,
    hours ? <span key="hours" data-fact="hours">{b.hours(hours)}</span> : <Fact key="hours" value={null} label="heures d’ouverture confirmées par le propriétaire" id="hours" />,
    business?.legalName && business?.neq ? <span key="legal" data-fact="legalName">{b.legal(business.legalName, business.neq)}</span> : null,
    rating && rating.count ? <span key="rating" data-fact="google.rating">{b.rating(rating.rating, rating.count, rating.date)}</span> : null,
  ]
}

// Generic page-contract template: h1 → answer → template content → sections → key facts → FAQ → action → meta.
function ContentTemplate({ doc, locale, conditionNotice, primary, secondary, children, keyFacts, keyFactsTitle, slot, boilerplate = false, className = '' }) {
  return (
    <article className={`wrap page ${className}`.trim()}>
      <h1>{doc?.h1 || doc?.title ? <Unbroken text={doc?.h1 || doc?.title} /> : <Fact value={null} label="titre de la page" />}</h1>
      <Missing text={conditionNotice} />
      <AnswerBlock text={doc?.answer} />
      {children}
      {boilerplate ? (
        <div data-nosnippet="">
          <Sections sections={doc?.sections} />
          <Faq items={doc?.faq} locale={locale} />
        </div>
      ) : (
        <>
          <Sections sections={doc?.sections} slot={slot} />
          <KeyFacts items={keyFacts} locale={locale} title={keyFactsTitle} />
          <Faq items={doc?.faq} locale={locale} />
        </>
      )}
      <ConversionBand primary={primary} secondary={secondary} />
      <MetaLine doc={doc} locale={locale} />
    </article>
  )
}

// ---------- Home: typographic hero (real h1, no image needed), vitrine du jour, key facts, hours ----------
async function HomeTemplate(props) {
  const { doc, business, shop, locale } = props
  const s = t(locale)
  const h = s.home
  const hours = (shop?.hours || []).map((x) => ({ ...x, closesLabel: clock(x.closes, locale) }))
  const [products, categories] = await Promise.all([getProducts({ locale }), getCategories(locale)])
  const vitrine = products.filter((p) => p.vitrine && p.availability !== 'discontinued')
  const rating = ratingOf(business, locale)
  const maps = mapsAction(business, locale)
  const order = orderAction(locale)
  const start = [
    ...categories.map((c) => ({ href: `${prefixFor(locale)}/${c.slug}/`, label: c.title, key: c.id })),
    { href: order.href, label: s.nav.commander, key: 'commander' },
    { href: pathFor('nous-trouver', locale), label: s.nav['nous-trouver'], key: 'nous-trouver' },
  ].filter((l) => l.href)

  return (
    <article className="page home">
      <header className="hero">
        <div className="wrap hero-inner">
          <p className="eyebrow">{h.eyebrow}</p>
          <h1>{doc?.h1 ? <Unbroken text={doc.h1} /> : <Fact value={null} label="titre de la page" />}</h1>
          <p className="hero-deck">
            <Fact value={business?.categorySentence} label="phrase de catégorie (option B en attente d’approbation)" id="categorySentence" />
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href={order.href} data-event={order.event}>{order.label}</a>
            {maps && <a className="btn btn-quiet" href={maps.href} data-event={maps.event}>{maps.label}</a>}
          </div>
          <OpenNow hours={hours} labels={{ open: s.openNow, closed: s.closedNow, until: s.until }} />
        </div>
      </header>
      <div className="wrap">
        <AnswerBlock text={doc?.answer} />
        {rating && (
          <p className="rating-strip" data-fact="google.rating">
            <span aria-hidden="true">★ </span>
            {h.rating(rating.rating, rating.count ?? '—', rating.date)}
            {googleMapsUrl(business) && (
              <>
                {' · '}
                <a href={googleMapsUrl(business)}>{h.seeReviews}</a>
              </>
            )}
          </p>
        )}
        <section aria-labelledby="home-vitrine" className="vitrine">
          <h2 id="home-vitrine">{h.vitrine}</h2>
          {vitrine.length ? (
            <ProductGrid products={vitrine} locale={locale} showPlanned />
          ) : (
            <p className="vitrine-empty">
              {h.vitrineEmpty} <Link href={pathFor('carte', locale)}>{h.seeMenu}</Link>
            </p>
          )}
        </section>
        <KeyFacts items={briefItems(props)} locale={locale} title={h.brief} />
        <section aria-labelledby="home-hours" className="hours-block">
          <h2 id="home-hours">{h.hoursQuestion}</h2>
          <HoursTable shop={shop} locale={locale} />
        </section>
        <Sections sections={doc?.sections} />
        <nav aria-labelledby="home-start" className="start">
          <h2 id="home-start">{h.start}</h2>
          <ul className="start-grid">
            {start.map((l) => (
              <li key={l.key}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <Faq items={doc?.faq} locale={locale} />
        <ConversionBand primary={order} secondary={maps || phoneAction(business, locale)} />
        <MetaLine doc={doc} locale={locale} />
      </div>
    </article>
  )
}

// ---------- Menu hub and category pages ----------
async function CategoryList({ locale, productionCategory, level }) {
  const products = await getProducts({ locale, productionCategory })
  if (!products.length) return <p><Fact value={null} label="liste des produits confirmée par le propriétaire" id="products" /></p>
  return <ProductGrid products={products} locale={locale} level={level} />
}

async function MenuTemplate(props) {
  const { locale } = props
  const categories = await getCategories(locale)
  const list = (
    <div className="menu-families">
      {categories.map((c) => (
        <section key={c.id} aria-labelledby={`cat-${c.id}`} className="menu-family">
          <h3 id={`cat-${c.id}`}>
            <Link href={`${prefixFor(locale)}/${c.slug}/`}>{c.title}</Link>
          </h3>
          {c.intro && <p>{c.intro}</p>}
          <CategoryList locale={locale} productionCategory={c.productionCategory} level={4} />
        </section>
      ))}
    </div>
  )
  return <ContentTemplate {...props} primary={orderAction(locale)} slot={{ after: 0, node: list }} />
}

function CategoryTemplate(props) {
  const { page, locale } = props
  const list = <CategoryList locale={locale} productionCategory={page.category} level={3} />
  return <ContentTemplate {...props} className={`category category-${page.category}`} primary={orderAction(locale)} slot={{ after: 0, node: list }} />
}

// ---------- Visit: address, link-out buttons (no map tiles), parking, hours ----------
function VisitTemplate(props) {
  const { business, shop, locale } = props
  const v = t(locale).visit
  const a = business?.address || {}
  const google = googleMapsUrl(business)
  const apple = appleMapsUrl(business)
  return (
    <ContentTemplate {...props} primary={mapsAction(business, locale)} secondary={phoneAction(business, locale)}>
      <section aria-labelledby="visit-address" className="visit-card">
        <h2 id="visit-address">{v.address}</h2>
        <address>
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
            {google && <a className="btn btn-quiet" href={google} data-event="directions_click">{v.google}</a>}
            {apple && <a className="btn btn-quiet" href={apple} data-event="directions_click">{v.apple}</a>}
          </p>
        )}
        <dl className="visit-facts">
          <div>
            <dt>{v.phone}</dt>
            <dd>
              <Fact value={business?.phone} label="téléphone" id="phone">
                <a href={`tel:${business?.phone}`} data-event="phone_click">{business?.phoneDisplay || business?.phone}</a>
              </Fact>
            </dd>
          </div>
          <div>
            <dt>{v.parking}</dt>
            <dd><Fact value={business?.parking} label="stationnement (rues, terrains, tarifs)" id="parking" /></dd>
          </div>
        </dl>
        <HoursTable shop={shop} locale={locale} />
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

function AboutTemplate(props) {
  const { business, locale } = props
  const l = t(locale).about
  const facebook = (business?.sameAs || []).find((x) => x.verified && /facebook\.com/.test(x.url))
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
          [l.address, addressLine(business, locale), 'adresse', 'address'],
          [l.phone, business?.phone, 'téléphone', 'phone', <a key="tel" href={`tel:${business?.phone}`}>{business?.phoneDisplay}</a>],
          [l.email, business?.email, 'courriel de la boutique', 'email', <a key="mail" href={`mailto:${business?.email}`}>{business?.email}</a>],
          [l.languages, (business?.languagesServed || []).map((x) => names[x] || x).join(', '), 'langues de service', 'languagesServed'],
          [l.social, facebook?.url, 'page officielle vérifiée', 'sameAs', <a key="fb" href={facebook?.url}>{facebook?.url?.replace(/^https:\/\/(www\.)?/, '').replace(/\/$/, '')}</a>],
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
  const table = products.length ? (
    <div className="table-scroll" role="region" aria-label={s.allergens} tabIndex={0}>
      <table className="allergen-table">
        <caption>{s.allergens}</caption>
        <thead>
          <tr>
            <th scope="col">{s.offer.product}</th>
            <th scope="col">{s.offer.contains}</th>
            <th scope="col">{s.mayContain}</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => {
            const verified = Boolean(p.allergensVerified?.at)
            const href = productPath(p, locale)
            return (
              <tr key={p.id}>
                <th scope="row">{href ? <Link href={href}>{p.title}</Link> : p.title}</th>
                <td>{verified ? (p.allergens || []).map((a) => a.label).join(', ') || '—' : <Fact value={null} label="allergènes vérifiés par une personne" />}</td>
                <td>{verified ? (p.mayContain || []).map((a) => a.label).join(', ') || '—' : '—'}</td>
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
    <ContentTemplate {...props} primary={orderAction(locale)}>
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
    <ContentTemplate {...props} className="calculator" primary={orderAction(locale)} secondary={phoneAction(business, locale)}>
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
            <p id="invites-error" className="form-error" role="alert">{c.invalid}</p>
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
              <p className="calc-best">
                <span className="badge badge-best">{c.bestFit}</span>{' '}
                {productPath(best.product, locale) ? <Link href={productPath(best.product, locale)}>{best.product.title}</Link> : best.product.title}
                {' · '}
                {sizeText(best.variant, locale)} · {c.feeds(best.feeds)}
                {priceText(best.variant, locale) && ` · ${priceText(best.variant, locale)}`}
                {perPortionText(best.variant, locale) && ` (${perPortionText(best.variant, locale)} ${s.offer.each})`}
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
    <ContentTemplate {...props} className="seasonal" primary={st.state === 'open' ? { ...orderAction(locale), label: t(locale).actions.preorder } : orderAction(locale)}>
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
        <section aria-labelledby="season-products">
          <h2 id="season-products">{se.products}</h2>
          <ProductGrid products={products} locale={locale} />
        </section>
      )}
    </ContentTemplate>
  )
}

// ---------- Product: sizes table, verified allergens, lead time, the engine's availability (« Prête dès … ») ----------
function ProductTemplate({ product, offer, shop, locale, business }) {
  const s = t(locale)
  const o = s.offer
  const lead = leadTimeText(product.leadTimeHours, locale)
  const from = fromPriceCents(product)
  const first = (product.variants || [])[0] || {}
  const orderingEnabled = Boolean(shop?.ordering?.enabled)
  const ready = offerBadge(offer, { orderingEnabled })?.tone === 'ready'
  return (
    <article className="wrap page product">
      <div className="product-head">
        <div className="product-intro">
          <h1><Unbroken text={product.title} /></h1>
          {product.summary ? (
            <AnswerBlock text={product.summary} />
          ) : (
            <p className="answer"><Fact value={null} label="description du produit, 40 à 60 mots" id="summary" /></p>
          )}
          <p className="price product-price">
            {from !== null ? `${s.priceFrom} ${priceText({ priceCents: from }, locale)} (${s.taxesExtra})` : <Fact value={null} label={`prix — ${product.title}`} />}
            {portionsText(first, locale) && <span className="small"> · {portionsText(first, locale)} {s.portions}</span>}
          </p>
          <OfferBadge state={offer} orderingEnabled={orderingEnabled} skip={['ready']} />
        </div>
        <LaCoupe photos={product.photos} caption={product.title} locale={locale} />
      </div>
      <section aria-labelledby="product-sizes">
        <h2 id="product-sizes">{o.sizesTitle}</h2>
        <SizesTable variants={product.variants} locale={locale} caption={`${product.title} · ${o.pricesCaption}`} />
      </section>
      <section aria-labelledby="product-ready">
        <h2 id="product-ready">{o.readyTitle}</h2>
        {ready && <OfferBadge state={offer} orderingEnabled={orderingEnabled} />}
        <p>{lead ? o.leadTime(lead) : <Fact value={null} label="délai de préparation" id="leadTimeHours" />}</p>
      </section>
      <AllergenBlock product={product} business={business} locale={locale} />
      <ConversionBand primary={orderAction(locale)} secondary={phoneAction(business, locale)} />
      <MetaLine doc={product} locale={locale} />
    </article>
  )
}
ProductTemplate.schema = async ({ product, offer, url }) => [productNode({ product, offer, url })]

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
            [l.name, officer.name, 'nom de la personne responsable (Loi 25)', 'privacyOfficer.name'],
            [l.role, officer.title, 'titre de la personne responsable', 'privacyOfficer.title'],
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
            [l.address, addressLine(business, locale), 'adresse', 'address'],
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
  content: (p) => <ContentTemplate {...p} primary={p.page?.key === 'chef' ? null : orderAction(p.locale)} />,
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
