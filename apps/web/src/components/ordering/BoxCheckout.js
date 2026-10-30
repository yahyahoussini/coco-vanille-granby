// « Ma boîte » (/boite/<token>/) and the checkout (/commander/paiement/): review step, payment step, quote deposit.
// Server-rendered forms that work without JavaScript; the Stripe card form and the copy button are enhancements.
// Day chips + window chips, never a tiny calendar (08 P14–P16). Totals with TPS and TVQ before payment (07 O1).
import { redirect } from 'next/navigation'
import { money, clock, keepTogether } from '@/lib/i18n'
import { payloadClient } from '@/lib/data'
import { localParts, dayOf } from '@/lib/studio/time'
import { decodeBox } from '@/lib/ordering/box'
import { productLine, lineBlockers } from '@/lib/ordering/lines'
import { bookableDays, dayAvailability, earliestReady } from '@/lib/ordering/availability'
import { closestWindows } from '@/lib/ordering/slots'
import { engineContext } from '@/lib/ordering/context'
import { orderTotals, totalsRows } from '@/lib/ordering/totals'
import { errorText } from '@/lib/ordering/errors'
import { longDayLabel, windowLabel } from '@/lib/ordering/labels'
import { boxPath, checkoutPath, thanksPath, orderPath, termsPath, Q } from '@/lib/ordering/paths'
import { openInBrowserHref } from '@/lib/ordering/iab'
import { paymentProvider } from '@/lib/payments/provider'
import { ensureIntent, publishableKey, STRIPE_JS_URL } from '@/lib/payments/stripe'
import { senderFacts } from '@/lib/messaging/templates'
import { CardMedia, familyOf } from '@/components/site/Products'
import { Icon } from '@/components/site/Icon'
import { QtyStepper } from '@/components/catalogue/QtyStepper'
import { CurrentChip } from '@/components/catalogue/CurrentChip'
import { KeepPhone } from '@/components/catalogue/KeepPhone'
import { catalogueCopy } from '@/components/catalogue/copy'
import { orderingCopy } from './copy'
import { requestContext } from './server'
import { Field, CheckboxField, ErrorSummary, describedBy } from './Field'
import { MessagePreview } from './MessagePreview'
import { CopyLink } from './CopyLink'
import { StripePayment } from './StripePayment'
import { Steps } from './Steps'

const SYS = { overrideAccess: true, depth: 0 }
const one = (v) => (Array.isArray(v) ? v[0] : v)
const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/
const TOKEN = /^[\w-]{10,64}$/
const origin = () => (process.env.PUBLIC_ORIGIN || 'https://cocovanillegranby.com').replace(/\/$/, '')
const optionalLabel = (locale) => ({ fr: '(facultatif)', en: '(optional)', es: '(opcional)' })[locale] || '(facultatif)'
const TAGS = { fr: 'fr-CA', en: 'en-CA', es: 'es' }

// A day chip in three parts (« jeudi » · « 29 » · « oct. »): the same words as dayLabel, read in the same order.
function dayParts(iso, locale) {
  const date = new Date(`${iso.slice(0, 10)}T12:00:00Z`)
  const part = (options) => new Intl.DateTimeFormat(TAGS[locale] || TAGS.fr, { ...options, timeZone: 'UTC' }).format(date)
  const day = part({ day: 'numeric' })
  return { weekday: part({ weekday: 'long' }), day: locale === 'fr' && day === '1' ? '1er' : day, month: part({ month: 'short' }) }
}

// Box items → products (in the page language) + engine lines + what blocks each line.
async function boxLines(items, { locale, shop, now }) {
  const payload = await payloadClient()
  const out = []
  for (const item of items) {
    const product = await payload.findByID({ collection: 'products', id: item.productId, locale, overrideAccess: true, depth: 1, disableErrors: true }).catch(() => null)
    const line = productLine(product, item.variantIndex, item.qty, { message: item.message, now })
    out.push({ item, product, line, blockers: lineBlockers(product, line, { source: 'web', shop, now }) })
  }
  return out
}

function TotalsTable({ totals, locale, id }) {
  if (!totals) return null
  return (
    <table className="totals" id={id}>
      <tbody>
        {totalsRows(totals, locale).map((r) => (
          <tr key={r.key} className={`totals-${r.key}`}>
            <th scope="row">{r.label}</th>
            <td>{r.text}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function InAppNotice({ iab, ua, url, locale }) {
  if (!iab) return null
  const c = orderingCopy(locale).iab
  const href = openInBrowserHref(url, ua)
  return (
    <aside className="iab-notice" aria-labelledby="iab-title">
      <span className="iab-icon" aria-hidden="true">
        <Icon name="info" size={22} />
      </span>
      <div className="iab-body">
        <p id="iab-title">
          <strong>{c.title(c[iab])}</strong>
        </p>
        <p>{c.text}</p>
        <p className="actions">
          <a className="btn btn-quiet" href={href}>
            {/iPhone|iPad|iPod/i.test(ua) ? c.open : c.openOther}
          </a>
          <CopyLink url={url} label={orderingCopy(locale).box.copy} done={orderingCopy(locale).box.copied} />
        </p>
      </div>
    </aside>
  )
}

// Windows grouped by part of the day, so 30-odd chips stay scannable.
function partsOfDay(windows) {
  const groups = { morning: [], afternoon: [], evening: [] }
  windows.forEach((w, i) => {
    const h = Number(w.start.slice(0, 2))
    groups[h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening'].push({ w, i })
  })
  return Object.entries(groups).filter(([, list]) => list.length)
}

// What the customer already typed, handed to the card form (Stripe Payment Element defaultValues).
const billingOf = (customer = {}) => ({
  name: [customer?.firstName, customer?.lastName].filter(Boolean).join(' ') || undefined,
  email: customer?.email || undefined,
  phone: customer?.phone || undefined,
})

function Hidden({ fields }) {
  return Object.entries(fields)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([name, value]) => <input key={name} type="hidden" name={name} value={value} />)
}

function BackLink({ href, children }) {
  return (
    <p className="back-link">
      <a href={href}>
        <Icon name="arrow" size={18} className="icon-back" />
        {children}
      </a>
    </p>
  )
}

// ---------------------------------------------------------------- « Ma boîte »
export async function BoxTemplate({ locale, shop, query = {} }) {
  const s = orderingCopy(locale)
  const c = s.box
  const ctx = await requestContext()
  const token = query.token || null
  const wantedDay = one(query[Q.day])
  if (!token && ctx.boxToken && ctx.boxItems.length) redirect(`${boxPath(locale, ctx.boxToken)}${ISO_DAY.test(wantedDay || '') ? `?${Q.day}=${wantedDay}` : ''}`)
  const items = decodeBox(token)
  if (!items.length) {
    return (
      <article className="wrap page ordering box">
        <h1>{s.pageTitles.box}</h1>
        <Steps locale={locale} current="box" />
        <div className="box-empty">
          <span className="box-empty-emblem icon-badge" aria-hidden="true">
            <Icon name="box" size={40} strokeWidth={1.4} />
          </span>
          <p>{c.empty}</p>
          <p>
            <a className="btn btn-primary" href={`${orderPath(locale)}#commande-en-ligne`}>
              {c.browse}
              <Icon name="arrow" size={20} />
            </a>
          </p>
        </div>
      </article>
    )
  }

  const now = new Date()
  const ectx = await engineContext(await payloadClient(), { now })
  const rows = await boxLines(items, { locale, shop: ectx.shop, now })
  const lines = rows.map((r) => r.line)
  const blocked = rows.some((r) => r.blockers.length)
  const all = one(query.toutes) === '1'
  const avail = blocked ? { days: [], reason: rows.find((r) => r.blockers.length).blockers[0] } : bookableDays(lines, ectx.shop, { now, pools: ectx.pools, usage: ectx.usage, limit: 60 })
  const days = avail.days
  const shown = all ? days : days.slice(0, 8)
  const selected = days.find((d) => d.date === wantedDay) || days[0] || null
  let totals = null
  if (!rows.some((r) => r.blockers.some((b) => ['price_missing', 'tax_class_pending', 'tax_weight_missing', 'product_missing', 'variant_missing'].includes(b)))) {
    try {
      totals = orderTotals(lines, { supplyDate: selected?.date || localParts(now).iso })
    } catch {
      totals = null
    }
  }
  const url = `${origin()}${boxPath(locale, token)}`
  const keepDay = selected ? selected.date : ''
  const k = catalogueCopy(locale)

  return (
    <article className="wrap page ordering box">
      <h1>{s.pageTitles.box}</h1>
      <Steps locale={locale} current="day" />
      <InAppNotice iab={ctx.iab} ua={ctx.ua} url={url} locale={locale} />

      <div className="box-layout">
        <section aria-labelledby="boite-articles" className="box-items">
          <h2 id="boite-articles">{c.itemsTitle}</h2>
          <ul className="box-lines">
            {rows.map(({ item, product, line, blockers }, i) => (
              <li key={i} className={`box-line family-${familyOf(product)}`}>
                <CardMedia product={product} className="box-line-media" iconSize={26} />
                <div className="box-line-main">
                  <p className="box-line-head">
                    <span className="box-line-name">
                      {line.qty} × {product?.title || '—'}
                      {/* The size on its own small line; the « · » keeps it one phrase for screen readers. */}
                      {line.variantLabel ? (
                        <span className="box-line-variant">
                          <span className="visually-hidden"> · </span>
                          {line.variantLabel}
                        </span>
                      ) : (
                        ''
                      )}
                    </span>
                    <span className="box-line-price">{Number.isInteger(line.cents) && line.cents > 0 ? money(line.cents * line.qty, locale) : ''}</span>
                  </p>
                  {blockers.length > 0 && (
                    <p className="field-error">
                      {c.unavailable} {blockers.map((b) => errorText(b, locale)).join(' ')}
                    </p>
                  )}
                </div>
                {/* Under the whole line: quantity (« − 1 + » once the script runs) and its update, remove, the message. */}
                <div className="box-line-forms">
                  <form method="post" action="/svc/boite/" className="box-qty-form">
                    <Hidden fields={{ action: 'set', line: i, token, locale, jour: keepDay }} />
                    <div className="field">
                      <label htmlFor={`qty-${i}`}>{c.qty}</label>
                      <QtyStepper id={`qty-${i}`} defaultValue={line.qty} labels={{ less: k.less, more: k.more }} />
                    </div>
                    <button type="submit" className="btn btn-quiet btn-small">
                      {c.update}
                    </button>
                  </form>
                  <form method="post" action="/svc/boite/" className="box-remove-form">
                    <Hidden fields={{ action: 'remove', line: i, token, locale, jour: keepDay }} />
                    <button type="submit" className="link-button">
                      <Icon name="close" size={18} />
                      {c.remove}
                    </button>
                  </form>
                  {line.messageMax > 0 && (
                    <form method="post" action="/svc/boite/" className="message-form">
                      <Hidden fields={{ action: 'set', line: i, token, locale, jour: keepDay, qty: line.qty }} />
                      <div className="field-with-preview">
                        <div className="field">
                          <label htmlFor={`msg-${i}`}>{c.messageLabel(line.messageMax)}</label>
                          <input id={`msg-${i}`} name="message" type="text" maxLength={line.messageMax} defaultValue={item.message} autoComplete="off" />
                        </div>
                        <MessagePreview inputId={`msg-${i}`} initial={item.message} caption={s.request.preview} max={line.messageMax} />
                      </div>
                      <button type="submit" className="btn btn-quiet btn-small">
                        {c.saveMessage}
                      </button>
                    </form>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="boite-total" className="box-summary summary-card">
          <h2 id="boite-total">{c.totalsTitle}</h2>
          {totals ? <TotalsTable totals={totals} locale={locale} id="boite-totaux" /> : <p className="notice">{errorText('price_missing', locale)}</p>}
          <p className="small">{c.totalsNote}</p>
        </section>

        <section aria-labelledby="boite-jour" className="box-days">
          <h2 id="boite-jour">{c.dayTitle}</h2>
          {days.length ? (
            <>
              <p className="field-hint">{c.dayHint}</p>
              <ul className="chips day-chips">
                {shown.map((d) => {
                  const p = dayParts(d.date, locale)
                  return (
                    <li key={d.date}>
                      <a className="chip day-chip" href={`${boxPath(locale, token)}?${Q.day}=${d.date}${all ? '&toutes=1' : ''}#boite-heure`} aria-current={selected?.date === d.date ? 'true' : undefined}>
                        <span className="day-chip-weekday">{p.weekday}</span> <span className="day-chip-day">{p.day}</span> <span className="day-chip-month">{p.month}</span>{' '}
                        <span className="small">{c.slots(d.windows.length)}</span>
                      </a>
                    </li>
                  )
                })}
              </ul>
              {!all && days.length > shown.length && (
                <p className="more-days">
                  <a href={`${boxPath(locale, token)}?toutes=1${selected ? `&${Q.day}=${selected.date}` : ''}#boite-jour`}>
                    {c.moreDays}
                    <Icon name="chevron" size={18} />
                  </a>
                </p>
              )}
              <CurrentChip within=".box-days" list=".day-chips" current='[aria-current="true"]' />
            </>
          ) : (
            <p className="notice">
              {c.noDays} {errorText(avail.reason, locale)}
            </p>
          )}
        </section>

        {selected && (
          <section aria-labelledby="boite-heure" className="window-chips">
            <h2 id="boite-heure">{c.windowTitle(longDayLabel(selected.date, locale))}</h2>
            <form method="get" action={checkoutPath(locale)}>
              <input type="hidden" name="boite" value={token} />
              <input type="hidden" name={Q.day} value={selected.date} />
              <fieldset>
                <legend className="field-hint">{c.windowHint}</legend>
                {partsOfDay(selected.windows).map(([part, list]) => (
                  <div key={part} className="chip-group">
                    <p className="chip-group-title" id={`plages-${part}`}>
                      {c.parts[part]}
                      <span className="chip-group-range">
                        {clock(list[0].w.start, locale)}
                        {list.length > 1 && <> – {clock(list.at(-1).w.start, locale)}</>}
                      </span>
                    </p>
                    <ul className="chips" aria-labelledby={`plages-${part}`}>
                      {list.map(({ w, i }) => (
                        <li key={w.start}>
                          <input type="radio" id={`plage-${i}`} name={Q.window} value={w.start} required defaultChecked={i === 0} />
                          <label className="chip" htmlFor={`plage-${i}`}>
                            {clock(w.start, locale)}
                            {/* Scarcity only when it is real and close (02 §7): live count, last places only. */}
                            {w.remaining <= 2 && (
                              <>
                                {' '}
                                <span className="small">{c.left(w.remaining)}</span>
                              </>
                            )}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </fieldset>
              <div className="box-continue">
                {totals && <p className="box-continue-total">{c.totalLine(money(totals.totalCents, locale))}</p>}
                <button type="submit" className="btn btn-primary">
                  {c.continue}
                  <Icon name="arrow" size={20} />
                </button>
              </div>
            </form>
          </section>
        )}
      </div>

      <section aria-labelledby="boite-lien" className="share-box">
        <span className="share-icon icon-badge" aria-hidden="true">
          <Icon name="send" size={22} />
        </span>
        <div className="share-body">
          <h2 id="boite-lien">{locale === 'fr' ? 'Comment retrouver cette boîte plus tard?' : locale === 'es' ? '¿Cómo encontrar esta caja más tarde?' : 'How do you find this box later?'}</h2>
          <p>{c.shareHint}</p>
          <p className="share-url">
            <code>{url}</code>
          </p>
          <CopyLink url={url} label={c.copy} done={c.copied} />
        </div>
      </section>
    </article>
  )
}

// ---------------------------------------------------------------- Checkout
export async function CheckoutTemplate({ locale, business, shop, query = {} }) {
  if (one(query[Q.order])) return PaymentStep({ locale, business, token: one(query[Q.order]) })
  if (one(query[Q.quote])) return QuoteStep({ locale, business, token: one(query[Q.quote]), error: one(query[Q.error]) })
  const box = one(query.boite)
  if (!box) redirect(boxPath(locale))
  return ReviewStep({ locale, business, shop, box, day: one(query[Q.day]), start: one(query[Q.window]) })
}

async function ReviewStep({ locale, business, box, day, start }) {
  const s = orderingCopy(locale)
  const c = s.checkout
  const ctx = await requestContext()
  const items = decodeBox(box)
  if (!items.length) redirect(boxPath(locale))
  const now = new Date()
  const ectx = await engineContext(await payloadClient(), { now })
  const rows = await boxLines(items, { locale, shop: ectx.shop, now })
  const lines = rows.map((r) => r.line)
  const blockers = rows.flatMap((r) => r.blockers)
  const back = `${boxPath(locale, box)}${ISO_DAY.test(day || '') ? `?${Q.day}=${day}` : ''}`
  const draft = ctx.checkoutDraft || {}
  const values = draft.v || {}
  const errors = (draft.e || []).map((e) => ({ ...e, field: e.field && ['firstName', 'lastName', 'email', 'phone', 'terms', 'frenchFirst', 'allergyNote'].includes(e.field) ? `c-${e.field}` : null, text: errorText(e.code, locale) }))
  const err = (f) => errors.find((e) => e.field === `c-${f}`)?.text
  const slotError = (draft.e || []).find((e) => e.field === 'pickup')

  let slot = null
  let alternatives = []
  if (!blockers.length && ISO_DAY.test(day || '')) {
    const d = dayAvailability(lines, ectx.shop, day, { now, pools: ectx.pools, usage: ectx.usage, ready: earliestReady(lines, ectx.shop, now) })
    slot = d.windows.find((w) => w.start === start) || null
    if (!slot) alternatives = closestWindows(d.windows, start || '00:00')
  }
  let totals = null
  try {
    totals = blockers.length ? null : orderTotals(lines, { supplyDate: day })
  } catch {
    totals = null
  }
  const facts = senderFacts(business)
  const provider = paymentProvider()
  const url = `${origin()}${boxPath(locale, box)}`
  const checkoutUrl = (w) => `${checkoutPath(locale)}?boite=${box}&${Q.day}=${day}&${Q.window}=${w}`

  return (
    <article className="wrap page ordering checkout">
      <h1>{s.pageTitles.checkout}</h1>
      <Steps locale={locale} current="you" />
      <InAppNotice iab={ctx.iab} ua={ctx.ua} url={url} locale={locale} />
      <BackLink href={back}>{c.back}</BackLink>
      <ErrorSummary id="erreurs" title={c.errorsTitle} errors={errors} />
      {(blockers.length > 0 || !slot || slotError) && (
        <div className="notice" role="status">
          {blockers.length > 0 ? (
            <p>{[...new Set(blockers)].map((b) => errorText(b, locale)).join(' ')}</p>
          ) : (
            <>
              <p>{errorText(slotError?.code && slotError.code !== 'slot_taken' ? slotError.code : 'slot_taken', locale)}</p>
              {alternatives.length > 0 && (
                <p className="alternatives">
                  {c.alternatives}{' '}
                  {alternatives.map((w, i) => (
                    <span key={w.start}>
                      {i > 0 && ' · '}
                      <a href={checkoutUrl(w.start)}>{clock(w.start, locale)}</a>
                    </span>
                  ))}
                </p>
              )}
              <p>
                <a href={back}>{c.back}</a>
              </p>
            </>
          )}
        </div>
      )}

      {slot && totals && (
        <form method="post" action="/svc/commande/" className="checkout-form">
          <Hidden fields={{ locale, boite: box, jour: day, plage: slot.start }} />
          <section className="review summary-card" aria-labelledby="recapitulatif">
            <h2 id="recapitulatif">{c.reviewTitle}</h2>
            <dl className="summary-list">
              <div>
                <dt>
                  <Icon name="calendar" size={18} />
                  {c.pickup}
                </dt>
                <dd>
                  {longDayLabel(day, locale)}, {windowLabel(slot.start, slot.end, locale)}{' '}
                  <a className="edit" href={back}>
                    {c.edit}
                  </a>
                </dd>
              </div>
              <div>
                <dt>
                  <Icon name="pin" size={18} />
                  {c.where}
                </dt>
                <dd>{keepTogether([facts.name, facts.addressLine[locale] || facts.addressLine.fr].filter(Boolean).join(', '))}</dd>
              </div>
            </dl>
            <ul className="summary-items">
              {rows.map(({ line, product }, i) => (
                <li key={i}>
                  <span>
                    {line.qty} × {product?.title}
                    {/* The size and the unit price on a small second line. */}
                    <span className="summary-variant">
                      {line.variantLabel ? (
                        <>
                          <span className="visually-hidden"> · </span>
                          {line.variantLabel}{' '}
                        </>
                      ) : null}
                      ({money(line.cents, locale)})
                    </span>
                    {line.message ? (
                      <span className="small">
                        {' '}
                        · {c.message} « {line.message} »
                      </span>
                    ) : null}
                  </span>
                  <span>{money(line.cents * line.qty, locale)}</span>
                </li>
              ))}
            </ul>
            <p className="summary-edit">
              <a className="edit" href={boxPath(locale, box)}>
                {c.edit}
              </a>
            </p>
            <TotalsTable totals={totals} locale={locale} id="recap-totaux" />
            <p className="small">
              {s.box.totalsNote} {locale === 'en' ? 'Amounts in Canadian dollars (CAD).' : 'Montants en dollars canadiens (CAD).'}
            </p>
          </section>

          <div className="checkout-fields">
            <fieldset className="form-group">
              <legend>
                <span className="legend-icon" aria-hidden="true">
                  <Icon name="users" size={20} />
                </span>
                {c.you}
              </legend>
              <div className="field-row">
                <Field id="c-firstName" label={c.firstName} error={err('firstName')}>
                  <input id="c-firstName" name="firstName" type="text" required maxLength={60} autoComplete="given-name" defaultValue={values.firstName || ''} aria-invalid={err('firstName') ? 'true' : undefined} aria-describedby={describedBy('c-firstName', { error: err('firstName') })} />
                </Field>
                <Field id="c-lastName" label={c.lastName} optional optionalLabel={optionalLabel(locale)}>
                  <input id="c-lastName" name="lastName" type="text" maxLength={60} autoComplete="family-name" defaultValue={values.lastName || ''} />
                </Field>
              </div>
              <div className="field-row">
                <Field id="c-email" label={c.email} hint={c.emailHint} error={err('email')}>
                  <input id="c-email" name="email" type="email" required maxLength={120} autoComplete="email" defaultValue={values.email || ''} aria-invalid={err('email') ? 'true' : undefined} aria-describedby={describedBy('c-email', { hint: true, error: err('email') })} />
                </Field>
                <Field id="c-phone" label={c.phone} hint={c.phoneHint} error={err('phone')}>
                  <input id="c-phone" name="phone" type="tel" required maxLength={30} autoComplete="tel" inputMode="tel" defaultValue={values.phone || ''} aria-invalid={err('phone') ? 'true' : undefined} aria-describedby={describedBy('c-phone', { hint: true, error: err('phone') })} />
                </Field>
              </div>
            </fieldset>

            <fieldset className="form-group">
              <legend>
                <span className="legend-icon" aria-hidden="true">
                  <Icon name="leaf" size={20} />
                </span>
                {c.allergyTitle}
              </legend>
              <Field id="c-allergyNote" label={c.allergy} hint={c.allergyHint} error={err('allergyNote')}>
                <textarea id="c-allergyNote" name="allergyNote" rows={3} maxLength={500} aria-describedby={describedBy('c-allergyNote', { hint: true, error: err('allergyNote') })} />
              </Field>
              <p className="small">
                <KeepPhone text={c.allergyCall(business?.phoneDisplay)} phone={business?.phoneDisplay} />
              </p>
            </fieldset>

            <fieldset className="form-group">
              <legend>
                <span className="legend-icon" aria-hidden="true">
                  <Icon name="mail" size={20} />
                </span>
                {c.consentTitle}
              </legend>
              <p className="field-hint">{c.consentHint}</p>
              {Object.entries(c.consents).map(([name, label]) => (
                <CheckboxField key={name} id={`c-${name}`} name={name} label={label} defaultChecked={false} />
              ))}
            </fieldset>

            <div className="checkout-policy">
              <h3>{c.cancelTitle}</h3>
              <p>
                <KeepPhone text={c.cancelText(business?.phoneDisplay)} phone={business?.phoneDisplay} />
              </p>
              <p className="small">
                <KeepPhone text={[facts.legalName || facts.name, facts.neq ? `NEQ ${facts.neq}` : null, facts.addressLine.fr, facts.phone, facts.email].filter(Boolean).join(' · ')} phone={facts.phone} />
              </p>
            </div>

            <div className="terms">
              <CheckboxField id="c-terms" name="terms" required error={err('terms')}>
                {c.terms}
                <a href={termsPath('fr')}>{c.termsLink}</a>
                {locale === 'en' && (
                  <>
                    {' '}
                    (<a href={termsPath('en')}>English translation</a>)
                  </>
                )}
              </CheckboxField>
              {locale !== 'fr' && c.frenchFirst && <CheckboxField id="c-frenchFirst" name="frenchFirst" required label={c.frenchFirst} error={err('frenchFirst')} />}
            </div>
            {provider === 'none' ? (
              <p className="notice">{c.noPayment}</p>
            ) : (
              <button type="submit" className="btn btn-primary pay-button">
                {c.pay(money(totals.totalCents, locale))}
              </button>
            )}
          </div>
        </form>
      )}
    </article>
  )
}

async function PaymentStep({ locale, business, token }) {
  const s = orderingCopy(locale)
  const c = s.pay
  const payload = await payloadClient()
  const order = TOKEN.test(token || '') ? (await payload.find({ collection: 'orders', where: { accessToken: { equals: token } }, limit: 1, ...SYS })).docs[0] : null
  if (!order) {
    return (
      <article className="wrap page ordering checkout">
        <h1>{s.pageTitles.pay}</h1>
        <p>{s.thanks.notFound}</p>
      </article>
    )
  }
  if (order.payment?.status === 'paid' || ['paid', 'ready', 'picked_up'].includes(order.status)) redirect(`${thanksPath(locale)}?${Q.order}=${order.accessToken}`)
  const ctx = await requestContext()
  const live = order.status === 'pending_payment' && order.holdExpiresAt && new Date(order.holdExpiresAt).getTime() > Date.now()
  const amount = money(order.totals?.totalCents, locale)
  const until = order.holdExpiresAt ? localParts(new Date(order.holdExpiresAt)) : null
  const day = dayOf(order.pickupDate)
  let stripe = null
  if (live && order.payment?.provider === 'stripe') {
    const intent = await ensureIntent({ kind: 'order', id: order.id, number: order.number, amountCents: order.totals.totalCents, reference: order.payment?.reference, description: `Commande ${order.number} · Pâtisserie Coco Vanille`, email: order.customer?.email })
    if (intent.id !== order.payment?.reference) await payload.update({ collection: 'orders', id: order.id, data: { payment: { reference: intent.id } }, ...SYS })
    stripe = intent
  }
  return (
    <article className="wrap page ordering checkout pay">
      <h1>{s.pageTitles.pay}</h1>
      <Steps locale={locale} current="pay" />
      {!live ? (
        <div className="pay-expired">
          <p className="notice">{c.expired}</p>
          <p>
            <a className="btn btn-primary" href={boxPath(locale, order.boxToken || '')}>
              {s.checkout.back}
            </a>
          </p>
        </div>
      ) : (
        <>
          <InAppNotice iab={ctx.iab} ua={ctx.ua} url={`${origin()}${boxPath(locale, order.boxToken || '')}`} locale={locale} />
          <div className="pay-card summary-card">
            <div className="pay-head">
              <p className="pay-when">
                <Icon name="calendar" size={20} />
                {longDayLabel(day, locale)}, {windowLabel(order.pickupWindowStart, order.pickupWindowEnd, locale)}
              </p>
              {until && <p className="badge badge-later">{c.held(keepTogether(clock(`${String(until.hh).padStart(2, '0')}:${String(until.mm).padStart(2, '0')}`, locale)))}</p>}
            </div>
            <section aria-labelledby="a-payer">
              <h2 id="a-payer">{locale === 'fr' ? 'Combien payer maintenant?' : locale === 'es' ? '¿Cuánto pagar ahora?' : 'How much to pay now?'}</h2>
              <p className="pay-amount">{amount}</p>
              <TotalsTable totals={order.totals} locale={locale} id="paiement-totaux" />
              <p className="small pay-secure">{c.secure}</p>
              {order.payment?.provider === 'mock' && (
                <form method="post" action="/svc/paiement/mock/" className="pay-panel">
                  <Hidden fields={{ commande: order.accessToken, locale }} />
                  <p className="notice">{c.mockNote}</p>
                  <button type="submit" className="btn btn-primary pay-button">
                    {c.button(amount)}
                  </button>
                </form>
              )}
              {stripe && (
                <>
                  <StripePayment
                    scriptUrl={STRIPE_JS_URL}
                    publishableKey={publishableKey()}
                    clientSecret={stripe.clientSecret}
                    returnPath={`${thanksPath(locale)}?${Q.order}=${order.accessToken}`}
                    locale={locale}
                    wallets={!ctx.iab}
                    billing={billingOf(order.customer)}
                    labels={{ button: c.button(amount), processing: c.processing, failed: c.failed, or: c.orCard, mustCheck: errorText('terms_required', locale) }}
                  />
                  <noscript>
                    <p className="notice">{business?.phoneDisplay ? `${c.failed} ${s.thanks.call(business.phoneDisplay)}` : c.failed}</p>
                  </noscript>
                </>
              )}
            </section>
          </div>
        </>
      )}
    </article>
  )
}

async function QuoteStep({ locale, business, token, error }) {
  const s = orderingCopy(locale)
  const c = s.pay
  const payload = await payloadClient()
  const req = TOKEN.test(token || '') ? (await payload.find({ collection: 'requests', where: { accessToken: { equals: token } }, limit: 1, ...SYS })).docs[0] : null
  if (!req || !req.quote?.depositCents) {
    return (
      <article className="wrap page ordering checkout">
        <h1>{c.quoteTitle}</h1>
        <p>{s.thanks.notFound}</p>
      </article>
    )
  }
  const q = req.quote
  if (req.payment?.status === 'paid' && req.order) {
    const order = await payload.findByID({ collection: 'orders', id: req.order, ...SYS, disableErrors: true }).catch(() => null)
    if (order) redirect(`${thanksPath(locale)}?${Q.order}=${order.accessToken}`)
  }
  const expired = req.status !== 'quoted' || (q.validUntil && new Date(q.validUntil).getTime() < Date.now())
  const valid = q.validUntil ? localParts(new Date(q.validUntil)) : null
  const totals = { subtotalCents: q.subtotalCents, gstCents: q.gstCents, qstCents: q.qstCents, totalCents: q.totalCents, depositCents: q.depositCents !== q.totalCents ? q.depositCents : null, balanceCents: q.balanceCents }
  const deposit = money(q.depositCents, locale)
  const provider = paymentProvider()
  let stripe = null
  if (!expired && provider === 'stripe') {
    stripe = await ensureIntent({ kind: 'deposit', id: req.id, amountCents: q.depositCents, reference: req.payment?.reference, description: `Acompte · ${req.occasion} · Pâtisserie Coco Vanille`, email: req.customer?.email })
    if (stripe.id !== req.payment?.reference) await payload.update({ collection: 'requests', id: req.id, data: { payment: { provider: 'stripe', reference: stripe.id, status: 'pending' } }, ...SYS })
  }
  const ck = s.checkout
  return (
    <article className="wrap page ordering checkout pay quote">
      <h1>{c.quoteTitle}</h1>
      <div className="quote-layout">
        <div className="quote-main">
          <dl className="summary-list summary-card">
            <div>
              <dt>{s.request.occasion}</dt>
              <dd>{req.occasion}</dd>
            </div>
            <div>
              <dt>{s.request.date}</dt>
              <dd>{longDayLabel(dayOf(req.eventDate), locale)}</dd>
            </div>
            {req.guests ? (
              <div>
                <dt>{s.request.guests}</dt>
                <dd>{req.guests}</dd>
              </div>
            ) : null}
            {req.flavour ? (
              <div>
                <dt>{s.request.flavour}</dt>
                <dd>{req.flavour}</dd>
              </div>
            ) : null}
            {req.cakeMessage ? (
              <div>
                <dt>{s.request.message}</dt>
                <dd>« {req.cakeMessage} »</dd>
              </div>
            ) : null}
          </dl>
          <section aria-labelledby="soumission-prix" className="quote-prices">
            <h2 id="soumission-prix">{locale === 'fr' ? 'Combien coûte votre gâteau?' : locale === 'es' ? '¿Cuánto cuesta su pastel?' : 'How much is your cake?'}</h2>
            <TotalsTable totals={totals} locale={locale} id="soumission-totaux" />
            {valid && <p>{c.validUntil(`${longDayLabel(valid.iso, locale)}, ${clock(`${String(valid.hh).padStart(2, '0')}:${String(valid.mm).padStart(2, '0')}`, locale)}`)}</p>}
            <h3>{ck.cancelTitle}</h3>
            <p>
              <KeepPhone text={ck.cancelText(business?.phoneDisplay)} phone={business?.phoneDisplay} />
            </p>
          </section>
        </div>
        {expired ? (
          <p className="notice">{c.quoteExpired}</p>
        ) : (
          <section aria-labelledby="paiement" className="pay-panel pay-card summary-card">
            <h2 id="paiement">{c.deposit}</h2>
            <p className="pay-amount">{deposit}</p>
            {error && (
              <p className="field-error" role="alert">
                {errorText(error, locale)}
              </p>
            )}
            <form method="post" action="/svc/paiement/mock/" className="pay-panel" id="soumission-form">
              <Hidden fields={{ soumission: req.accessToken, locale }} />
              <CheckboxField id="q-terms" name="terms" required>
                {ck.terms}
                <a href={termsPath('fr')}>{ck.termsLink}</a>
              </CheckboxField>
              {locale !== 'fr' && ck.frenchFirst && <CheckboxField id="q-frenchFirst" name="frenchFirst" required label={ck.frenchFirst} />}
              {provider === 'mock' && (
                <>
                  <p className="notice">{c.mockNote}</p>
                  <button type="submit" className="btn btn-primary pay-button">
                    {c.button(deposit)}
                  </button>
                </>
              )}
              {provider === 'none' && <p className="notice">{ck.noPayment}</p>}
            </form>
            {stripe && (
              <StripePayment
                scriptUrl={STRIPE_JS_URL}
                publishableKey={publishableKey()}
                clientSecret={stripe.clientSecret}
                returnPath={`${thanksPath(locale)}?${Q.request}=${req.accessToken}`}
                locale={locale}
                wallets
                billing={billingOf(req.customer)}
                labels={{ button: c.button(deposit), processing: c.processing, failed: c.failed, or: c.orCard, mustCheck: errorText('terms_required', locale) }}
                mustCheck={locale !== 'fr' ? ['q-terms', 'q-frenchFirst'] : ['q-terms']}
                accept={{ url: '/svc/paiement/accepter/', body: { soumission: req.accessToken, locale }, fields: { terms: 'q-terms', frenchFirst: 'q-frenchFirst' } }}
              />
            )}
            <p className="small">{c.secure}</p>
          </section>
        )}
      </div>
    </article>
  )
}
