import Link from 'next/link'
import { t, money, clock } from '@/lib/i18n'
import { pathFor, SITE_ORIGIN } from '@/lib/routes'
import { getProducts, getCategories, getAllergens } from '@/lib/data'
import { productNode } from '@/lib/schema'
import { marker } from '@/lib/facts'
import { Fact } from '../site/Fact'
import { HoursTable } from '../site/HoursTable'
import { OpenNow } from '../site/OpenNow'
import { AnswerBlock, KeyFacts, Sections, Faq, ConversionBand, MetaLine } from '../site/Contract'
import { orderingTemplates } from './ordering'

const prefixFor = (locale) => (locale === 'fr' ? '' : `/${locale}`)
const productPath = (p, locale) => (p?.category?.slug ? `${prefixFor(locale)}/${p.category.slug}/${p.slug}/` : null)

function Missing({ text }) {
  if (!text) return null
  return <p className="notice fact-needed" data-nosnippet="">{text}</p>
}

function orderAction(locale) {
  return { href: pathFor('commander', locale) || pathFor('commander', 'fr'), label: t(locale).actions.order, event: 'order_click' }
}

function mapsAction(business, locale) {
  if (!business?.google?.cid) return null
  return { href: `https://maps.google.com/?cid=${business.google.cid}`, label: t(locale).actions.directions, event: 'directions_click' }
}

function phoneAction(business, locale) {
  if (!business?.phone) return null
  return { href: `tel:${business.phone}`, label: t(locale).actions.call, event: 'phone_click' }
}

// Generic page-contract template: h1 → answer → sections → key facts → FAQ → action → meta.
function ContentTemplate({ doc, locale, conditionNotice, primary, secondary, children, keyFacts, boilerplate = false }) {
  return (
    <article className="wrap page">
      <h1>{doc?.h1 || doc?.title || <Fact value={null} label="titre de la page" />}</h1>
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
          <Sections sections={doc?.sections} />
          <KeyFacts items={keyFacts} locale={locale} />
          <Faq items={doc?.faq} locale={locale} />
        </>
      )}
      <ConversionBand primary={primary} secondary={secondary} />
      <MetaLine doc={doc} locale={locale} />
    </article>
  )
}

function ProductCard({ product, locale }) {
  const s = t(locale)
  const href = productPath(product, locale)
  const prices = (product.variants || []).map((v) => v.priceCents).filter((c) => typeof c === 'number')
  const from = prices.length ? Math.min(...prices) : null
  return (
    <li className="product-card">
      <h3>{href ? <Link href={href}>{product.title}</Link> : product.title}</h3>
      {product.summary && <p>{product.summary}</p>}
      <p className="price">
        {from !== null ? `${s.priceFrom} ${money(from, locale)} (${s.taxesExtra})` : <Fact value={null} label={`prix — ${product.title}`} />}
      </p>
      {product.availability === 'soldout' && <p className="badge badge-soldout">{s.soldOut}</p>}
    </li>
  )
}

function HomeTemplate({ doc, business, shop, locale }) {
  const s = t(locale)
  const hours = (shop?.hours || []).map((h) => ({ ...h, closesLabel: clock(h.closes, locale) }))
  return (
    <ContentTemplate doc={doc} locale={locale} primary={orderAction(locale)} secondary={mapsAction(business, locale)}>
      <OpenNow hours={hours} labels={{ open: s.openNow, closed: s.closedNow, until: s.until }} />
      <p className="category-sentence">
        <Fact value={business?.categorySentence} label="phrase de catégorie (option B en attente d’approbation)" id="categorySentence" />
      </p>
      <section aria-labelledby="home-hours">
        <h2 id="home-hours">{s.hours}</h2>
        <HoursTable shop={shop} locale={locale} />
      </section>
    </ContentTemplate>
  )
}

async function VitrineList({ locale, productionCategory }) {
  const products = await getProducts({ locale, productionCategory })
  if (!products.length) return <p><Fact value={null} label="liste des produits confirmée par le propriétaire" id="products" /></p>
  return (
    <ul className="product-grid">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} locale={locale} />
      ))}
    </ul>
  )
}

async function MenuTemplate(props) {
  const { locale } = props
  const categories = await getCategories(locale)
  return (
    <ContentTemplate {...props} primary={orderAction(locale)}>
      {categories.map((c) => (
        <section key={c.id} aria-labelledby={`cat-${c.id}`}>
          <h2 id={`cat-${c.id}`}>
            <Link href={`${prefixFor(locale)}/${c.slug}/`}>{c.title}</Link>
          </h2>
          {c.intro && <p>{c.intro}</p>}
          <VitrineList locale={locale} productionCategory={c.productionCategory} />
        </section>
      ))}
    </ContentTemplate>
  )
}

function CategoryTemplate(props) {
  const { page, locale } = props
  return (
    <ContentTemplate {...props} primary={orderAction(locale)}>
      <VitrineList locale={locale} productionCategory={page.category} />
    </ContentTemplate>
  )
}

function VisitTemplate(props) {
  const { business, shop, locale } = props
  const a = business?.address || {}
  return (
    <ContentTemplate {...props} primary={mapsAction(business, locale)} secondary={phoneAction(business, locale)}>
      <section aria-labelledby="visit-address">
        <h2 id="visit-address">{locale === 'en' ? 'Address' : locale === 'es' ? 'Dirección' : 'Adresse'}</h2>
        <address>
          {business?.name}
          <br />
          <Fact value={a.street} label="adresse" id="address.street" />, {a.city} ({a.region}) <Fact value={a.postalCode} label="code postal" id="address.postalCode" />
        </address>
        <p><Fact value={business?.parking} label="stationnement (photos et consignes)" id="parking" /></p>
      </section>
      <section aria-labelledby="visit-hours">
        <h2 id="visit-hours">{t(locale).hours}</h2>
        <HoursTable shop={shop} locale={locale} />
      </section>
    </ContentTemplate>
  )
}

async function AllergensTemplate(props) {
  const { locale } = props
  const s = t(locale)
  const [allergens, products] = await Promise.all([getAllergens(locale), getProducts({ locale })])
  return (
    <ContentTemplate {...props} secondary={phoneAction(props.business, locale)}>
      {products.length ? (
        <div className="table-scroll">
          <table className="allergen-table">
            <caption>{s.allergens}</caption>
            <thead>
              <tr>
                <th scope="col">{locale === 'en' ? 'Product' : 'Produit'}</th>
                <th scope="col">{s.allergens}</th>
                <th scope="col">{s.mayContain}</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const verified = Boolean(p.allergensVerified?.at)
                return (
                  <tr key={p.id}>
                    <th scope="row">{p.title}</th>
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
      )}
      <p className="small">{allergens.map((a) => a.label).join(' · ')}</p>
    </ContentTemplate>
  )
}

function ProductTemplate({ product, locale, business }) {
  const s = t(locale)
  const verified = Boolean(product.allergensVerified?.at)
  return (
    <article className="wrap page product">
      <h1>{product.title}</h1>
      <AnswerBlock text={product.summary} />
      <table className="sizes">
        <caption>{locale === 'en' ? 'Sizes and prices' : 'Formats et prix'}</caption>
        <thead>
          <tr>
            <th scope="col">{locale === 'en' ? 'Size' : 'Format'}</th>
            <th scope="col">{s.portions}</th>
            <th scope="col">{locale === 'en' ? 'Price' : 'Prix'}</th>
          </tr>
        </thead>
        <tbody>
          {(product.variants || []).map((v, i) => (
            <tr key={i}>
              <th scope="row">{v.label}</th>
              <td>{v.portionsMin ? `${v.portionsMin}${v.portionsMax ? `–${v.portionsMax}` : ''}` : <Fact value={null} label="portions" />}</td>
              <td>{typeof v.priceCents === 'number' ? `${money(v.priceCents, locale)} (${s.taxesExtra})` : <Fact value={null} label="prix" />}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <section aria-labelledby="product-allergens">
        <h2 id="product-allergens">{s.allergens}</h2>
        <p>{verified ? (product.allergens || []).map((a) => a.label).join(', ') || '—' : <Fact value={null} label="allergènes vérifiés par une personne" />}</p>
      </section>
      {product.availability === 'soldout' && <p className="badge badge-soldout">{s.soldOut}</p>}
      <ConversionBand primary={orderAction(locale)} secondary={phoneAction(business, locale)} />
    </article>
  )
}
ProductTemplate.schema = async ({ product, url }) => [productNode({ product, url })]

const LEGAL_LABELS = {
  fr: { officer: 'Responsable de la protection des renseignements personnels', merchant: 'Commerçant', name: 'Nom', role: 'Titre', email: 'Courriel', phone: 'Téléphone', neq: 'NEQ', address: 'Adresse', translation: null },
  en: { officer: 'Person in charge of personal information', merchant: 'Merchant', name: 'Name', role: 'Title', email: 'Email', phone: 'Phone', neq: 'Québec enterprise number', address: 'Address', translation: 'Translation for information only: in case of discrepancy, the French version prevails.', readFrench: 'Lire la version française' },
}

function FactList({ id, title, rows }) {
  return (
    <section className="fact-box" aria-labelledby={id}>
      <h2 id={id}>{title}</h2>
      <dl>
        {rows.map(([term, value, label, factId]) => (
          <div key={term}>
            <dt>{term}</dt>
            <dd><Fact value={value} label={label} id={factId} /></dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

// Legal pages: the person in charge (Loi 25 s. 3.1) and the merchant identity (LPC s. 54.4) come from the
// business global, so the footer, the policy and the contract never disagree. Translations say French prevails.
function LegalTemplate(props) {
  const { page, business, locale } = props
  const l = LEGAL_LABELS[locale] || LEGAL_LABELS.en
  const officer = business?.privacyOfficer || {}
  const a = business?.address || {}
  const frPath = pathFor(page.key, 'fr')
  return (
    <ContentTemplate {...props} boilerplate>
      {l.translation && (
        <p className="notice translation-notice">
          {l.translation} <a href={frPath} hrefLang="fr" lang="fr">{l.readFrench}</a>
        </p>
      )}
      {page.key === 'confidentialite' && (
        <FactList
          id="legal-officer"
          title={l.officer}
          rows={[
            [l.name, officer.name, 'nom de la personne responsable (Loi 25)', 'privacyOfficer.name'],
            [l.role, officer.title, 'titre de la personne responsable', 'privacyOfficer.title'],
            [l.email, officer.email, 'courriel de la personne responsable', 'privacyOfficer.email'],
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
            [l.address, a.street && `${a.street}, ${a.city} (${a.region}) ${a.postalCode || ''}`.trim(), 'adresse', 'address'],
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
  content: (p) => <ContentTemplate {...p} primary={orderAction(p.locale)} />,
  about: (p) => <ContentTemplate {...p} secondary={phoneAction(p.business, p.locale)} />,
  visit: VisitTemplate,
  menu: MenuTemplate,
  category: CategoryTemplate,
  product: ProductTemplate,
  allergens: AllergensTemplate,
  legal: LegalTemplate,
  prices: (p) => <ContentTemplate {...p} primary={orderAction(p.locale)} />,
  calculator: (p) => <ContentTemplate {...p} primary={orderAction(p.locale)} />,
  seasonal: (p) => <ContentTemplate {...p} primary={orderAction(p.locale)} />,
  ...orderingTemplates,
}

export { SITE_ORIGIN }
