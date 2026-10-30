import Link from 'next/link'
import { t } from '@/lib/i18n'
import { getProducts, getCategories, payloadClient } from '@/lib/data'
import { Fact } from '../site/Fact'
import { HoursTable } from '../site/HoursTable'
import { OpenNow } from '../site/OpenNow'
import { AnswerBlock, KeyFacts, Sections, Faq, ConversionBand, MetaLine, Unbroken } from '../site/Contract'
import { ProductGrid, Photo } from '../site/Products'
import { ReadMore } from '../site/ReadMore'
import { hoursSummary, pillSchedule } from '../site/hours'
import { vitrinePhotoOf } from '@/lib/studio/vitrine'
import { localParts } from '@/lib/studio/time'
import { longDayLabel } from '@/lib/ordering/labels'
import { Icon, CATEGORY_ICON } from '../site/Icon'
import { Ornament } from '../site/Ornament'
import { StockPhoto } from '../site/StockPhoto'
import { PHOTOS } from '@/lib/photos'
import { categoryHref, pageHref, orderAction, googleMapsUrl, mapsAction, phoneAction, streetFor, addressLine, ratingOf } from './shared'

// The home page template (registry key « home »): the logo stage, services, vitrine du jour, categories, cakes,
// hours and visit, Q&A, FAQ. Styles: src/styles/home.css.

// The short link beside a section title (UI words only, no business fact).
const HEAD_LINK = { fr: 'Voir la carte', en: 'See the menu', es: 'Ver la carta' }

// « Coco Vanille en bref »: one fact per line, brand named in each, from the globals (v1 §7 key facts).
function briefItems({ business, shop, locale }) {
  const b = t(locale).brief
  const hours = hoursSummary(shop?.hours, locale)
  const address = addressLine(business, locale)
  const rating = ratingOf(business, locale)
  return [
    <Fact key="category" value={business?.categorySentence} label="phrase de catégorie" id="categorySentence">
      {business?.categorySentence ? <Kept text={business.categorySentence} /> : null}
    </Fact>,
    address ? <span key="address" data-fact="address"><Kept text={b.address(address)} /></span> : <Fact key="address" value={null} label="adresse" id="address" />,
    business?.phoneDisplay ? <span key="phone" data-fact="phone"><Kept text={b.phone(business.phoneDisplay)} /></span> : <Fact key="phone" value={null} label="téléphone" id="phone" />,
    hours ? <span key="hours" data-fact="hours">{b.hours(hours)}</span> : <Fact key="hours" value={null} label="heures d’ouverture confirmées par le propriétaire" id="hours" />,
    business?.legalName && business?.neq ? <span key="legal" data-fact="legalName">{b.legal(business.legalName, business.neq)}</span> : null,
    rating && rating.count ? <span key="rating" data-fact="google.rating">{b.rating(rating.rating, rating.count, rating.date)}</span> : null,
  ]
}

// Display typography only: a non-breaking space before « : ; ! ? » (a colon never starts a line). Same words.
const frenchSpaces = (text) => String(text).replace(/ ([:;!?»])/g, '\u00a0$1').replace(/« /g, '«\u00a0')

// A phone number, a hyphenated word or a postal code never breaks across lines: spans only, the text is unchanged.
const KEEP = /(\S+-\S+|[A-Z]\d[A-Z] \d[A-Z]\d)/
function Kept({ text }) {
  return String(text ?? '')
    .split(KEEP)
    .map((part, i) => (i % 2 ? <span key={i} className="nowrap">{part}</span> : part))
}

// « Lead · more »: what follows the first « · » sits in its own span, so phones can hide it from view (home.css)
// while the HTML and the accessible name keep the whole text.
function Lead({ text, moreClass }) {
  const [lead, ...rest] = String(text ?? '').split(' · ')
  return (
    <>
      {lead}
      {rest.length > 0 && <span className={moreClass}> · {rest.join(' · ')}</span>}
    </>
  )
}

// ---------- Home: real-text hero beside the logo stage, services, vitrine du jour, cakes, hours, Q&A, FAQ ----------
// The h1 keeps its exact text; only its place phrase (« au centre-ville de Granby ») is set in the accent colour.
function HeroTitle({ text }) {
  if (!text) return <Fact value={null} label="titre de la page" />
  const m = text.match(/^(.+?)(\s(?:au|aux|à|en|in|at|downtown|del?)\s.+)$/i)
  if (!m) return <Unbroken text={text} />
  return (
    <>
      <Unbroken text={m[1]} />
      <span className="h1-accent">
        <Unbroken text={m[2]} />
      </span>
    </>
  )
}

// The logo's ring of words, set on a circle (decorative: the same words are real text on the page).
function RingText({ text }) {
  return (
    <svg className="stage-ring" viewBox="0 0 400 400" aria-hidden="true" focusable="false">
      <defs>
        <path id="hero-ring-path" d="M200 200m-176 0a176 176 0 1 1 352 0a176 176 0 1 1-352 0" />
      </defs>
      <text>
        <textPath href="#hero-ring-path" textLength="1090">{`${text}${text}`}</textPath>
      </text>
    </svg>
  )
}

const CATEGORY_SURFACE = { viennoiseries: 'surface-caramel', pains: 'surface-sunk', patisseries: 'surface-blush', gateaux: 'surface-pistache' }

export async function HomeTemplate(props) {
  const { doc, business, shop, locale, served } = props
  const s = t(locale)
  const h = s.home
  const today = localParts().iso
  const [products, categories, photo] = await Promise.all([getProducts({ locale }), getCategories(locale), payloadClient().then((payload) => vitrinePhotoOf(payload, today)).catch(() => null)])
  const vitrine = products.filter((p) => p.vitrine && p.availability !== 'discontinued')
  const rating = ratingOf(business, locale)
  const maps = mapsAction(business, locale)
  const phone = phoneAction(business, locale)
  const order = orderAction(locale, served)
  const request = order ? { href: `${order.href}#demande`, label: h.request } : null
  const visitHref = pageHref(served, locale, 'nous-trouver')
  const menuHref = pageHref(served, locale, 'carte')
  const openLabels = { open: s.openNow, closed: s.closedNow, until: s.until }
  const cards = categories
    .map((c) => ({ href: categoryHref(c, locale, served), label: c.title, key: c.id, photo: PHOTOS[c.productionCategory] ? c.productionCategory : null, icon: CATEGORY_ICON[c.productionCategory] || 'dessert', surface: CATEGORY_SURFACE[c.productionCategory] || 'surface-caramel' }))
    .filter((c) => c.href)
  const more = [
    ...(order ? [{ href: order.href, label: s.nav.commander, key: 'commander', icon: 'box' }] : []),
    ...[
      ['gateaux-personnalises', 'cake'],
      ['prix', 'sparkles'],
      ['faq', 'info'],
      ['nous-trouver', 'pin'],
    ].map(([key, icon]) => ({ href: pageHref(served, locale, key), label: s.pageNames[key] || s.nav[key], key, icon })),
  ].filter((l) => l.href)
  const street = streetFor(business?.address || {}, locale)
  // The logo: a small seal on the phone's photo card, the large stage logo from 48rem (or with no photo).
  const sealSizes = `(min-width: 60rem) 26rem, (min-width: 48rem) 72vw, ${PHOTOS.hero ? '96px' : '60vw'}`

  return (
    <article className="page home">
      <header className="hero" data-stage="">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <span className="eyebrow hero-eyebrow">
              <span>
                <Lead text={h.eyebrow} moreClass="eyebrow-more" />
              </span>
            </span>
            <h1>
              <HeroTitle text={doc?.h1} />
            </h1>
            <p className="hero-deck">
              <Fact value={business?.categorySentence} label="phrase de catégorie (option B en attente d’approbation)" id="categorySentence">
                {business?.categorySentence ? <Kept text={frenchSpaces(business.categorySentence)} /> : null}
              </Fact>
            </p>
            <div className="hero-actions">
              {order && (
                <a className="btn btn-primary btn-large" href={order.href} data-event={order.event} data-magnetic="">
                  <Icon name="box" size={20} />
                  {order.label}
                  <Icon name="arrow" size={20} className="icon-arrow" />
                </a>
              )}
              {request && (
                <a className="btn btn-quiet btn-large" href={request.href}>
                  <Icon name="cake" size={20} />
                  {request.label}
                </a>
              )}
            </div>
            <ul className="hero-chips rail" aria-label={h.chipsLabel}>
              <li className="hero-chip-open">
                <OpenNow schedule={pillSchedule(shop)} locale={locale} labels={openLabels} />
              </li>
              {street && (
                <li>
                  {visitHref ? (
                    <Link className="chip" href={visitHref}>
                      <Icon name="pin" size={18} />
                      {street}
                    </Link>
                  ) : (
                    <span className="chip">
                      <Icon name="pin" size={18} />
                      {street}
                    </span>
                  )}
                </li>
              )}
              {business?.phone && (
                <li>
                  <a className="chip" href={`tel:${business.phone}`} data-event="phone_click">
                    <Icon name="phone" size={18} />
                    {business.phoneDisplay || business.phone}
                  </a>
                </li>
              )}
            </ul>
          </div>
          {/* Phones: a wide photo card above the title, the logo as its seal. From 48rem: the arch, ring and ornaments. */}
          <div className={`hero-stage${PHOTOS.hero ? ' has-photo' : ''}`} aria-hidden="true">
            <div className="stage-arch" data-parallax="0.04">
              {PHOTOS.hero && <StockPhoto name="hero" locale={locale} priority decorative className="stage-photo" sizes="(min-width: 60rem) 28rem, (min-width: 48rem) 33rem, 92vw" />}
            </div>
            <Ornament name="palm" className="stage-palm" data-depth="0.45" />
            <div className="stage-badge" data-tilt="">
              <div className="stage-spin" data-scroll-progress="">
                <RingText text={h.ring} />
              </div>
              <picture>
                <source type="image/avif" srcSet="/brand/logo-badge-384.avif 384w, /brand/logo-badge-768.avif 768w" sizes={sealSizes} />
                <img className="stage-logo" src="/brand/logo-badge-384.webp" srcSet="/brand/logo-badge-384.webp 384w, /brand/logo-badge-768.webp 768w" sizes={sealSizes} width="384" height="384" alt="" fetchPriority={PHOTOS.hero ? 'auto' : 'high'} decoding="async" />
              </picture>
            </div>
            <Ornament name="vanilla" className="stage-vanilla" data-depth="0.9" />
            <Ornament name="coconut" className="stage-coconut" data-depth="0.7" />
            <span className="stage-chip stage-chip-cake" data-depth="0.35">
              <Icon name="cake" size={18} />
              {h.services[1].title}
            </span>
            <span className="stage-chip stage-chip-cafe" data-depth="0.6">
              <Icon name="coffee" size={18} />
              {h.services[2].title}
            </span>
          </div>
        </div>
      </header>

      <div className="marquee" aria-hidden="true" data-scroll-progress="" data-nosnippet="">
        <div className="marquee-track">
          {[0, 1, 2].flatMap((n) =>
            h.marquee.map((word) => (
              <span key={`${n}-${word}`} className="marquee-item">
                {word}
                <Icon name="heart" size={16} className="marquee-heart" />
              </span>
            )),
          )}
        </div>
      </div>

      <div className="wrap">
        <section className="home-intro" aria-label={h.brief}>
          <div className="intro-answer" data-reveal="">
            <AnswerBlock text={doc?.answer} />
            {rating && (
              <p className="rating-strip" data-fact="google.rating">
                <span className="rating-star" aria-hidden="true">★ </span>
                {h.rating(rating.rating, rating.count ?? '—', rating.date)}
                {googleMapsUrl(business) && (
                  <>
                    {' · '}
                    <a href={googleMapsUrl(business)}>{h.seeReviews}</a>
                  </>
                )}
              </p>
            )}
          </div>
          {/* Phones show the first facts and « Lire la suite »; every fact stays in the HTML (and shows without JS). */}
          <div className="intro-facts" data-reveal="" data-clamp="">
            <div className="clamp-body">
              <KeyFacts items={briefItems(props)} locale={locale} title={h.brief} />
            </div>
            <ReadMore locale={locale} />
          </div>
        </section>

        <section className="services" aria-labelledby="home-services">
          <h2 id="home-services" className="section-title">{h.servicesTitle}</h2>
          <ul className="services-grid" data-reveal-stagger="">
            {h.services.map((sv) => (
              <li key={sv.title} className={`service${sv.icon === 'coffee' && PHOTOS.cafe ? ' has-photo' : ''}`} data-reveal="">
                {sv.icon === 'coffee' && PHOTOS.cafe && <StockPhoto name="cafe" locale={locale} decorative className="service-bg" sizes="(min-width: 60rem) 18rem, (min-width: 48rem) 45vw, 92vw" />}
                <span className="icon-badge">
                  <Icon name={sv.icon} size={26} />
                </span>
                <h3>{sv.title}</h3>
                <p>{frenchSpaces(sv.text)}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="home-vitrine" className="vitrine">
          <div className="home-head">
            <h2 id="home-vitrine" className="section-title">{h.vitrine}</h2>
            {menuHref && vitrine.length > 0 && (
              <Link href={menuHref} className="home-head-link">
                {HEAD_LINK[locale] || HEAD_LINK.fr}
                <Icon name="arrow" size={18} />
              </Link>
            )}
          </div>
          {photo && (
            <figure className="vitrine-photo">
              <Photo media={photo} size="hero" lang={locale === 'fr' ? undefined : 'fr'} />
              <figcaption>{s.vitrinePhoto(longDayLabel(today, locale))}</figcaption>
            </figure>
          )}
          {vitrine.length ? (
            <ProductGrid products={vitrine} locale={locale} showPlanned layout="rail" />
          ) : photo ? (
            menuHref && (
              <p className="vitrine-more">
                <Link href={menuHref} className="link-arrow">
                  {h.seeMenu}
                  <Icon name="arrow" size={18} />
                </Link>
              </p>
            )
          ) : (
            <div className="vitrine-empty" data-reveal="">
              <span className="icon-badge">
                <Icon name="store" size={26} />
              </span>
              <p>
                {h.vitrineEmpty}{' '}
                {menuHref && (
                  <Link href={menuHref} className="link-arrow">
                    {h.seeMenu}
                    <Icon name="arrow" size={18} />
                  </Link>
                )}
              </p>
            </div>
          )}
        </section>

        {(cards.length > 0 || more.length > 0) && (
          <nav aria-labelledby="home-start" className="start">
            <h2 id="home-start" className="section-title">{h.start}</h2>
            {cards.length > 0 && (
              <ul className="category-cards rail" data-reveal-stagger="">
                {cards.map((c) => (
                  <li key={c.key} data-reveal="">
                    <Link href={c.href} className={`category-card ${c.surface}${c.photo ? ' has-photo' : ''}`} data-spotlight="">
                      {c.photo && <StockPhoto name={c.photo} locale={locale} decorative className="category-photo" sizes="(min-width: 60rem) 17rem, (min-width: 48rem) 45vw, 62vw" />}
                      <span className="icon-badge">
                        <Icon name={c.icon} size={28} />
                      </span>
                      <span className="category-name">{c.label}</span>
                      <Icon name="arrow" size={20} className="icon-arrow" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {more.length > 0 && (
              <ul className="start-links rail">
                {more.map((l) => (
                  <li key={l.key}>
                    <Link href={l.href} className="chip">
                      <Icon name={l.icon} size={18} />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </nav>
        )}
      </div>

      {request && (
        <section className="cake-band" aria-labelledby="home-cakes">
          <Ornament name="palm" className="cake-band-palm" />
          {/* Read in order: the title, the three steps, the action, then the photo. From 60rem the steps take the
              right column (grid areas in home.css). */}
          <div className="wrap cake-band-grid">
            <div className="cake-band-head" data-reveal="">
              <span className="eyebrow">{h.cakeEyebrow}</span>
              <h2 id="home-cakes">{h.cakeTitle}</h2>
            </div>
            <ol className="cake-steps" data-reveal-stagger="">
              {h.cakeSteps.map((step, i) => (
                <li key={step} data-reveal="">
                  <span className="step-num" aria-hidden="true">{i + 1}</span>
                  <span>{frenchSpaces(step)}</span>
                </li>
              ))}
            </ol>
            <div className="cake-band-cta" data-reveal="">
              <a className="btn btn-light btn-large" href={request.href} data-magnetic="">
                <Icon name="cake" size={20} />
                {request.label}
                <Icon name="arrow" size={20} className="icon-arrow" />
              </a>
            </div>
            {PHOTOS.ateliers && <StockPhoto name="ateliers" locale={locale} className="cake-band-photo" sizes="(min-width: 60rem) 30rem, 92vw" />}
          </div>
        </section>
      )}

      <div className="wrap">
        <section aria-labelledby="home-hours" className="visit-block">
          <div className="visit-hours card" data-reveal="">
            <div className="visit-hours-head">
              <h2 id="home-hours">{h.hoursQuestion}</h2>
              <OpenNow schedule={pillSchedule(shop)} locale={locale} labels={openLabels} />
            </div>
            <HoursTable shop={shop} locale={locale} />
          </div>
          <div className="visit-where card" data-reveal="">
            <span className="icon-badge">
              <Icon name="pin" size={26} />
            </span>
            <h3>{h.visitTitle}</h3>
            {addressLine(business, locale) ? <p className="visit-address"><Kept text={addressLine(business, locale)} /></p> : <p><Fact value={null} label="adresse" id="address" /></p>}
            <div className="visit-actions">
              {maps && (
                <a className="btn btn-primary" href={maps.href} data-event={maps.event}>
                  <Icon name="directions" size={18} />
                  {maps.label}
                </a>
              )}
              {phone && (
                <a className="btn btn-quiet" href={phone.href} data-event={phone.event}>
                  <Icon name="phone" size={18} />
                  <span>
                    <Lead text={phone.label} moreClass="phone-more" />
                  </span>
                </a>
              )}
            </div>
            {visitHref && (
              <Link href={visitHref} className="link-arrow">
                {s.nav['nous-trouver']}
                <Icon name="arrow" size={18} />
              </Link>
            )}
          </div>
        </section>
        <Sections sections={doc?.sections} locale={locale} />
        <Faq items={doc?.faq} locale={locale} />
        <section className="finale" aria-labelledby="home-finale" data-reveal="">
          <img className="finale-badge" src="/brand/logo-badge-192.webp" srcSet="/brand/logo-badge-192.webp 192w, /brand/logo-badge-384.webp 384w" sizes="(min-width: 48rem) 120px, 80px" width="120" height="120" alt="" loading="lazy" decoding="async" />
          <h2 id="home-finale">{h.finale}</h2>
          <ConversionBand primary={order} secondary={maps || phone} />
        </section>
        <MetaLine doc={doc} locale={locale} />
      </div>
    </article>
  )
}

