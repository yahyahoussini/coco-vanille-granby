// Ordering templates (order, box, checkout, thanks), owned by the ordering module.
// Each receives { locale, business, shop, page, doc, query } from SitePage. They render on the server
// (dynamic routes in src/app/(site-*)/…); client components only enhance (message preview, copy link, Stripe).
import '@/styles/ordering.css'
import { notFound } from 'next/navigation'
import { marker } from '@/lib/facts'
import { money, clock, keepTogether } from '@/lib/i18n'
import { payloadClient, getProducts } from '@/lib/data'
import { dayOf, localParts } from '@/lib/studio/time'
import { offerStates } from '@/lib/ordering/create-order'
import { longDayLabel, windowLabel } from '@/lib/ordering/labels'
import { senderFacts } from '@/lib/messaging/templates'
import { totalsRows } from '@/lib/ordering/totals'
import { termsPath, Q } from '@/lib/ordering/paths'
import { AnswerBlock, Sections, Faq, MetaLine, Unbroken } from '../site/Contract'
import { Icon } from '../site/Icon'
import { orderingCopy } from '../ordering/copy'
import { RequestForm } from '../ordering/RequestForm'
import { ProductOrderList } from '../ordering/ProductOrderList'
import { AutoRefresh } from '../ordering/AutoRefresh'
import { requestContext } from '../ordering/server'
import { BoxTemplate, CheckoutTemplate } from '../ordering/BoxCheckout'
import { KeepPhone } from '../catalogue/KeepPhone'

const SYS = { overrideAccess: true, depth: 0 }
const one = (v) => (Array.isArray(v) ? v[0] : v)

// ---------- /commander/: products (when online ordering is on) + the custom-cake request form ----------
async function OrderTemplate({ locale, business, shop, doc }) {
  const ctx = await requestContext()
  const enabled = Boolean(shop?.ordering?.enabled)
  let products = []
  let states = new Map()
  if (enabled) {
    products = (await getProducts({ locale })).filter((p) => p.onlineOrderable && p.availability !== 'discontinued')
    states = await offerStates(await payloadClient(), products, { locale })
  }
  return (
    <article className="wrap page ordering order">
      <h1>{doc?.h1 ? <Unbroken text={doc.h1} /> : marker('titre de la page')}</h1>
      <AnswerBlock text={doc?.answer} />
      {enabled && <ProductOrderList locale={locale} products={products} states={states} shop={shop} boxToken={ctx.boxToken} boxItems={ctx.boxItems} />}
      <RequestForm locale={locale} business={business} draft={ctx.draft} />
      <Sections sections={doc?.sections} locale={locale} />
      <Faq items={doc?.faq} locale={locale} />
      <MetaLine doc={doc} locale={locale} />
    </article>
  )
}

const mapsLinks = (business) => {
  const a = business?.address
  const google = business?.google?.cid ? `https://maps.google.com/?cid=${business.google.cid}` : null
  const apple = a?.street ? `https://maps.apple.com/?address=${encodeURIComponent(`${a.street.replace(/^(\d+),\s*/, '$1 ')}, ${a.city}, ${a.region} ${a.postalCode || ''}, Canada`)}&q=${encodeURIComponent(business.name || 'Pâtisserie Coco Vanille')}` : null
  return { google, apple }
}

function RequestThanks({ request, locale, business }) {
  const s = orderingCopy(locale)
  const t = s.thanks
  const when = localParts(new Date(request.answerBy))
  const answer = `${longDayLabel(when.iso, locale)}, ${clock(`${String(when.hh).padStart(2, '0')}:${String(when.mm).padStart(2, '0')}`, locale)}`
  return (
    <article className="wrap page ordering thanks request-thanks">
      <span className="thanks-emblem icon-badge" aria-hidden="true">
        <Icon name="check" size={34} strokeWidth={2} />
      </span>
      <h1>{s.pageTitles.requestThanks}</h1>
      <p className="answer">{t.requestText(answer)}</p>
      {request.hasAllergy && <p className="notice">{t.requestAllergy}</p>}
      <section aria-labelledby="demande-resume" className="order-summary summary-card">
        <h2 id="demande-resume">{locale === 'fr' ? 'Qu’avez-vous demandé?' : locale === 'es' ? '¿Qué solicitó?' : 'What did you ask for?'}</h2>
        <dl className="summary-list">
          <div>
            <dt>{s.request.occasion}</dt>
            <dd>{request.occasion}</dd>
          </div>
          {request.guests ? (
            <div>
              <dt>{s.request.guests}</dt>
              <dd>{request.guests}</dd>
            </div>
          ) : null}
          <div>
            <dt>{s.request.date}</dt>
            <dd>{longDayLabel(dayOf(request.eventDate), locale)}</dd>
          </div>
          {request.cakeMessage ? (
            <div>
              <dt>{s.request.message}</dt>
              <dd>« {request.cakeMessage} »</dd>
            </div>
          ) : null}
        </dl>
      </section>
      {business?.phoneDisplay && (
        <p className="thanks-call">
          <Icon name="phone" size={18} />
          <a href={`tel:${business.phone}`}>
            <span>
              <KeepPhone text={t.call(business.phoneDisplay)} phone={business.phoneDisplay} />
            </span>
          </a>
        </p>
      )}
    </article>
  )
}

function OrderThanks({ order, locale, business }) {
  const s = orderingCopy(locale)
  const t = s.thanks
  const facts = senderFacts(business)
  const maps = mapsLinks(business)
  const paid = ['paid', 'ready', 'picked_up'].includes(order.status)
  const cancelled = ['cancelled', 'refunded'].includes(order.status)
  const day = dayOf(order.pickupDate)
  const tbd = { fr: 'heure à convenir avec la boutique', en: 'time to be agreed with the shop', es: 'hora por acordar con la tienda' }[locale] || 'heure à convenir avec la boutique'
  const when = `${longDayLabel(day, locale)}, ${order.pickupWindowStart ? windowLabel(order.pickupWindowStart, order.pickupWindowEnd || order.pickupWindowStart, locale) : tbd}`
  const title = cancelled ? t.order(order.number) : paid ? `${s.pageTitles.thanks} ${t.order(order.number)}` : s.pageTitles.pending
  return (
    <article className="wrap page ordering thanks">
      <h1>{title}</h1>
      {cancelled && <p className="notice">{t.cancelled}</p>}
      {!paid && !cancelled && (
        <div className="thanks-pending">
          <p className="answer">{t.pendingText}</p>
          <p>
            <a className="btn btn-quiet" href={`?${Q.order}=${order.accessToken}`}>
              {t.refresh}
            </a>
          </p>
          <AutoRefresh />
        </div>
      )}
      {paid && (
        <div className="thanks-layout">
          <div className="pickup-code" role="group" aria-labelledby="code-title">
            <p id="code-title" className="pickup-code-label">
              {t.code}
            </p>
            <p className="pickup-code-value">{order.pickupCode}</p>
            <p className="small">{t.codeHint}</p>
          </div>
          <div className="thanks-cards">
            <section aria-labelledby="merci-quand" className="info-card">
              <div className="info-card-head">
                <span className="info-card-icon icon-badge" aria-hidden="true">
                  <Icon name="calendar" size={24} />
                </span>
                <h2 id="merci-quand">{t.when}</h2>
              </div>
              <p className="thanks-when">{keepTogether(when)}</p>
              {order.pickupWindowStart && (
                <p>
                  <a className="btn btn-quiet" href={`/svc/calendrier/?${Q.order}=${order.accessToken}`} download={`cueillette-${order.number}.ics`}>
                    <Icon name="calendar" size={18} />
                    {t.calendar}
                  </a>
                </p>
              )}
            </section>
            <section aria-labelledby="merci-ou" className="info-card">
              <div className="info-card-head">
                <span className="info-card-icon icon-badge" aria-hidden="true">
                  <Icon name="pin" size={24} />
                </span>
                <h2 id="merci-ou">{t.where}</h2>
              </div>
              <address>
                {facts.name}
                <br />
                {keepTogether(facts.addressLine[locale] || facts.addressLine.fr)}
              </address>
              <p className="map-links thanks-maps">
                {maps.google && (
                  <a className="btn btn-quiet" href={maps.google}>
                    <Icon name="directions" size={18} />
                    {t.directions}
                  </a>
                )}
                {maps.apple && (
                  <a className="btn btn-quiet" href={maps.apple}>
                    <Icon name="pin" size={18} />
                    {t.apple}
                  </a>
                )}
              </p>
            </section>
          </div>
          {order.customer?.email && (
            <p className="thanks-emailed">
              <Icon name="mail" size={18} />
              {t.emailed(order.customer.email)}
            </p>
          )}
        </div>
      )}
      <section aria-labelledby="merci-commande" className="order-summary summary-card">
        <h2 id="merci-commande">{locale === 'fr' ? 'Qu’avez-vous commandé?' : locale === 'es' ? '¿Qué pidió?' : 'What did you order?'}</h2>
        <ul className="summary-items">
          {(order.items || []).map((it, i) => (
            <li key={i}>
              <span>
                {it.qty} × {it.title}
                {it.variantLabel ? (
                  <span className="summary-variant">
                    <span className="visually-hidden"> · </span>
                    {it.variantLabel}
                  </span>
                ) : null}
                {it.message ? <span className="small"> · « {it.message} »</span> : null}
              </span>
              <span>{money(it.unitPriceCents * it.qty, locale)}</span>
            </li>
          ))}
        </ul>
        <TotalsTable totals={order.totals} locale={locale} id="merci-totaux" />
      </section>
      {/* One link a line on a phone (the dot only joins them on a wide screen). */}
      <p className="thanks-links">
        <a href={termsPath(locale)}>{t.terms}</a>
        {business?.phoneDisplay && (
          <>
            <span className="thanks-links-sep" aria-hidden="true">
              {' · '}
            </span>
            <a href={`tel:${business.phone}`}>
              <span>
                <KeepPhone text={t.call(business.phoneDisplay)} phone={business.phoneDisplay} />
              </span>
            </a>
          </>
        )}
      </p>
    </article>
  )
}

export function TotalsTable({ totals, locale, id, caption }) {
  if (!totals) return null
  const rows = totalsRows(totals, locale)
  return (
    <table className="totals" id={id}>
      {caption && <caption>{caption}</caption>}
      <tbody>
        {rows.map((r) => (
          <tr key={r.key} className={`totals-${r.key}`}>
            <th scope="row">{r.label}</th>
            <td>{r.text}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// ---------- /commander/merci/: ?commande=<token> (order) or ?demande=<token> (custom-cake request) ----------
async function ThanksTemplate({ locale, business, query = {} }) {
  const payload = await payloadClient()
  const orderToken = one(query[Q.order])
  const requestToken = one(query[Q.request])
  const s = orderingCopy(locale)
  if (orderToken && /^[\w-]{10,64}$/.test(orderToken)) {
    const order = (await payload.find({ collection: 'orders', where: { accessToken: { equals: orderToken } }, limit: 1, ...SYS })).docs[0]
    if (order) return <OrderThanks order={order} locale={locale} business={business} />
  }
  if (requestToken && /^[\w-]{10,64}$/.test(requestToken)) {
    const request = (await payload.find({ collection: 'requests', where: { accessToken: { equals: requestToken } }, limit: 1, ...SYS })).docs[0]
    // Deposit paid → the order it became. Back from Stripe before the webhook → waiting state.
    if (request?.order) {
      const order = await payload.findByID({ collection: 'orders', id: request.order, ...SYS, disableErrors: true }).catch(() => null)
      if (order) return <OrderThanks order={order} locale={locale} business={business} />
    }
    if (request && request.status === 'quoted' && one(query.payment_intent)) {
      return (
        <article className="wrap page ordering thanks">
          <h1>{s.pageTitles.pending}</h1>
          <div className="thanks-pending">
            <p className="answer">{s.thanks.pendingText}</p>
          </div>
          <AutoRefresh />
        </article>
      )
    }
    if (request) return <RequestThanks request={request} locale={locale} business={business} />
  }
  if (!orderToken && !requestToken) notFound()
  return (
    <article className="wrap page ordering thanks">
      <h1>{s.pageTitles.thanks}</h1>
      <p>{s.thanks.notFound}</p>
    </article>
  )
}

export const orderingTemplates = {
  order: OrderTemplate,
  box: BoxTemplate,
  checkout: CheckoutTemplate,
  thanks: ThanksTemplate,
}
