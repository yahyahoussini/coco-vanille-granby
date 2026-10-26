// « Ma boîte » (/boite/<token>/) and the checkout (/commander/paiement/): review step, payment step, quote deposit.
// Server-rendered forms that work without JavaScript; the Stripe card form and the copy button are enhancements.
// Day chips + window chips, never a tiny calendar (08 P14–P16). Totals with TPS and TVQ before payment (07 O1).
import { redirect } from 'next/navigation'
import { money, clock } from '@/lib/i18n'
import { payloadClient } from '@/lib/data'
import { localParts, dayOf } from '@/lib/studio/time'
import { decodeBox } from '@/lib/ordering/box'
import { productLine, lineBlockers } from '@/lib/ordering/lines'
import { bookableDays, dayAvailability, earliestReady } from '@/lib/ordering/availability'
import { closestWindows } from '@/lib/ordering/slots'
import { engineContext } from '@/lib/ordering/context'
import { orderTotals, totalsRows } from '@/lib/ordering/totals'
import { errorText } from '@/lib/ordering/errors'
import { dayLabel, longDayLabel, windowLabel } from '@/lib/ordering/labels'
import { boxPath, checkoutPath, thanksPath, orderPath, termsPath, Q } from '@/lib/ordering/paths'
import { openInBrowserHref } from '@/lib/ordering/iab'
import { paymentProvider } from '@/lib/payments/provider'
import { ensureIntent, publishableKey, STRIPE_JS_URL } from '@/lib/payments/stripe'
import { senderFacts } from '@/lib/messaging/templates'
import { orderingCopy } from './copy'
import { requestContext } from './server'
import { Field, CheckboxField, ErrorSummary, describedBy } from './Field'
import { MessagePreview } from './MessagePreview'
import { CopyLink } from './CopyLink'
import { StripePayment } from './StripePayment'

const SYS = { overrideAccess: true, depth: 0 }
const one = (v) => (Array.isArray(v) ? v[0] : v)
const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/
const TOKEN = /^[\w-]{10,64}$/
const origin = () => (process.env.PUBLIC_ORIGIN || 'https://cocovanillegranby.com').replace(/\/$/, '')
const optionalLabel = (locale) => ({ fr: '(facultatif)', en: '(optional)', es: '(opcional)' })[locale] || '(facultatif)'

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

function Hidden({ fields }) {
  return Object.entries(fields)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([name, value]) => <input key={name} type="hidden" name={name} value={value} />)
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
        <p>{c.empty}</p>
        <p>
          <a className="btn btn-primary" href={`${orderPath(locale)}#commande-en-ligne`}>
            {c.browse}
          </a>
        </p>
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

  return (
    <article className="wrap page ordering box">
      <h1>{s.pageTitles.box}</h1>
      <InAppNotice iab={ctx.iab} ua={ctx.ua} url={url} locale={locale} />

      <section aria-labelledby="boite-articles">
        <h2 id="boite-articles">{c.itemsTitle}</h2>
        <ul className="box-lines">
          {rows.map(({ item, product, line, blockers }, i) => (
            <li key={i} className="box-line">
              <p className="box-line-head">
                <span>
                  {line.qty} × {product?.title || '—'}
                  {line.variantLabel ? ` · ${line.variantLabel}` : ''}
                </span>
                <span>{Number.isInteger(line.cents) && line.cents > 0 ? money(line.cents * line.qty, locale) : ''}</span>
              </p>
              {blockers.length > 0 && (
                <p className="field-error">
                  {c.unavailable} {blockers.map((b) => errorText(b, locale)).join(' ')}
                </p>
              )}
              <div className="box-line-forms">
                <form method="post" action="/svc/boite/">
                  <Hidden fields={{ action: 'set', line: i, token, locale, jour: keepDay }} />
                  <div className="field">
                    <label htmlFor={`qty-${i}`}>{c.qty}</label>
                    <input id={`qty-${i}`} name="qty" type="number" inputMode="numeric" min={1} max={50} step={1} defaultValue={line.qty} />
                  </div>
                  <button type="submit" className="btn btn-quiet">
                    {c.update}
                  </button>
                </form>
                <form method="post" action="/svc/boite/">
                  <Hidden fields={{ action: 'remove', line: i, token, locale, jour: keepDay }} />
                  <button type="submit" className="link-button">
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
                    <button type="submit" className="btn btn-quiet">
                      {c.saveMessage}
                    </button>
                  </form>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="boite-jour">
        <h2 id="boite-jour">{c.dayTitle}</h2>
        {days.length ? (
          <>
            <p className="field-hint">{c.dayHint}</p>
            <ul className="chips day-chips">
              {shown.map((d) => (
                <li key={d.date}>
                  <a className="chip" href={`${boxPath(locale, token)}?${Q.day}=${d.date}${all ? '&toutes=1' : ''}#boite-heure`} aria-current={selected?.date === d.date ? 'true' : undefined}>
                    {dayLabel(d.date, locale)}
                    <span className="small">{c.slots(d.windows.length)}</span>
                  </a>
                </li>
              ))}
            </ul>
            {!all && days.length > shown.length && (
              <p>
                <a href={`${boxPath(locale, token)}?toutes=1${selected ? `&${Q.day}=${selected.date}` : ''}#boite-jour`}>{c.moreDays}</a>
              </p>
            )}
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
                <div key={part}>
                  <p className="chip-group-title" id={`plages-${part}`}>
                    {c.parts[part]}
                  </p>
                  <ul className="chips" aria-labelledby={`plages-${part}`}>
                    {list.map(({ w, i }) => (
                      <li key={w.start}>
                        <input type="radio" id={`plage-${i}`} name={Q.window} value={w.start} required defaultChecked={i === 0} />
                        <label className="chip" htmlFor={`plage-${i}`}>
                          {clock(w.start, locale)}
                          {/* Scarcity only when it is real and close (02 §7): live count, last places only. */}
                          {w.remaining <= 2 && <span className="small">{c.left(w.remaining)}</span>}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </fieldset>
            <button type="submit" className="btn btn-primary">
              {c.continue}
            </button>
          </form>
        </section>
      )}

      <section aria-labelledby="boite-total">
        <h2 id="boite-total">{c.totalsTitle}</h2>
        {totals ? <TotalsTable totals={totals} locale={locale} id="boite-totaux" /> : <p className="notice">{errorText('price_missing', locale)}</p>}
        <p className="small">{c.totalsNote}</p>
      </section>

      <section aria-labelledby="boite-lien" className="share-box">
        <h2 id="boite-lien">{locale === 'fr' ? 'Comment retrouver cette boîte plus tard?' : locale === 'es' ? '¿Cómo encontrar esta caja más tarde?' : 'How do you find this box later?'}</h2>
        <p>{c.shareHint}</p>
        <p>
          <code>{url}</code>
        </p>
        <CopyLink url={url} label={c.copy} done={c.copied} />
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
      <InAppNotice iab={ctx.iab} ua={ctx.ua} url={url} locale={locale} />
      <p>
        <a href={back}>{c.back}</a>
      </p>
      <ErrorSummary id="erreurs" title={c.errorsTitle} errors={errors} />
      {(blockers.length > 0 || !slot || slotError) && (
        <div className="notice" role="status">
          {blockers.length > 0 ? (
            <p>{[...new Set(blockers)].map((b) => errorText(b, locale)).join(' ')}</p>
          ) : (
            <>
              <p>{errorText(slotError?.code && slotError.code !== 'slot_taken' ? slotError.code : 'slot_taken', locale)}</p>
              {alternatives.length > 0 && (
                <p>
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
          <section className="review" aria-labelledby="recapitulatif">
            <h2 id="recapitulatif">{c.reviewTitle}</h2>
            <dl className="summary-list">
              <div>
                <dt>{c.pickup}</dt>
                <dd>
                  {longDayLabel(day, locale)}, {windowLabel(slot.start, slot.end, locale)}{' '}
                  <a className="edit" href={back}>
                    {c.edit}
                  </a>
                </dd>
              </div>
              <div>
                <dt>{c.where}</dt>
                <dd>{[facts.name, facts.addressLine[locale] || facts.addressLine.fr].filter(Boolean).join(', ')}</dd>
              </div>
            </dl>
            <ul className="summary-items">
              {rows.map(({ line, product }, i) => (
                <li key={i}>
                  <span>
                    {line.qty} × {product?.title}
                    {line.variantLabel ? ` · ${line.variantLabel}` : ''} <span className="small">({money(line.cents, locale)})</span>
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
            <p>
              <a className="edit" href={boxPath(locale, box)}>
                {c.edit}
              </a>
            </p>
            <TotalsTable totals={totals} locale={locale} id="recap-totaux" />
            <p className="small">
              {s.box.totalsNote} {locale === 'en' ? 'Amounts in Canadian dollars (CAD).' : 'Montants en dollars canadiens (CAD).'}
            </p>
            <h3>{c.cancelTitle}</h3>
            <p>{c.cancelText(business?.phoneDisplay)}</p>
            <p className="small">{[facts.legalName || facts.name, facts.neq ? `NEQ ${facts.neq}` : null, facts.addressLine.fr, facts.phone, facts.email].filter(Boolean).join(' · ')}</p>
          </section>

          <fieldset>
            <legend>{c.you}</legend>
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

          <fieldset>
            <legend>{c.allergyTitle}</legend>
            <Field id="c-allergyNote" label={c.allergy} hint={c.allergyHint} error={err('allergyNote')}>
              <textarea id="c-allergyNote" name="allergyNote" rows={3} maxLength={500} aria-describedby={describedBy('c-allergyNote', { hint: true, error: err('allergyNote') })} />
            </Field>
            <p className="small">{c.allergyCall(business?.phoneDisplay)}</p>
          </fieldset>


          <fieldset>
            <legend>{c.consentTitle}</legend>
            <p className="field-hint">{c.consentHint}</p>
            {Object.entries(c.consents).map(([name, label]) => (
              <CheckboxField key={name} id={`c-${name}`} name={name} label={label} defaultChecked={false} />
            ))}
          </fieldset>

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
            <button type="submit" className="btn btn-primary">
              {c.pay(money(totals.totalCents, locale))}
            </button>
          )}
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
      {!live ? (
        <>
          <p className="notice">{c.expired}</p>
          <p>
            <a className="btn btn-primary" href={boxPath(locale, order.boxToken || '')}>
              {s.checkout.back}
            </a>
          </p>
        </>
      ) : (
        <>
          <InAppNotice iab={ctx.iab} ua={ctx.ua} url={`${origin()}${boxPath(locale, order.boxToken || '')}`} locale={locale} />
          <p>
            {longDayLabel(day, locale)}, {windowLabel(order.pickupWindowStart, order.pickupWindowEnd, locale)}
          </p>
          {until && <p className="badge badge-later">{c.held(clock(`${String(until.hh).padStart(2, '0')}:${String(until.mm).padStart(2, '0')}`, locale))}</p>}
          <section aria-labelledby="a-payer">
            <h2 id="a-payer">{locale === 'fr' ? 'Combien payer maintenant?' : locale === 'es' ? '¿Cuánto pagar ahora?' : 'How much to pay now?'}</h2>
            <p className="pay-amount">{amount}</p>
            <TotalsTable totals={order.totals} locale={locale} id="paiement-totaux" />
            <p className="small">{c.secure}</p>
            {order.payment?.provider === 'mock' && (
              <form method="post" action="/svc/paiement/mock/" className="pay-panel">
                <Hidden fields={{ commande: order.accessToken, locale }} />
                <p className="notice">{c.mockNote}</p>
                <button type="submit" className="btn btn-primary">
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
                  labels={{ button: c.button(amount), processing: c.processing, failed: c.failed, mustCheck: errorText('terms_required', locale) }}
                />
                <noscript>
                  <p className="notice">{business?.phoneDisplay ? `${c.failed} ${s.thanks.call(business.phoneDisplay)}` : c.failed}</p>
                </noscript>
              </>
            )}
          </section>
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
    <article className="wrap page ordering checkout pay">
      <h1>{c.quoteTitle}</h1>
      <dl className="summary-list">
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
      <section aria-labelledby="soumission-prix">
        <h2 id="soumission-prix">{locale === 'fr' ? 'Combien coûte votre gâteau?' : locale === 'es' ? '¿Cuánto cuesta su pastel?' : 'How much is your cake?'}</h2>
        <TotalsTable totals={totals} locale={locale} id="soumission-totaux" />
        {valid && <p>{c.validUntil(`${longDayLabel(valid.iso, locale)}, ${clock(`${String(valid.hh).padStart(2, '0')}:${String(valid.mm).padStart(2, '0')}`, locale)}`)}</p>}
        <h3>{ck.cancelTitle}</h3>
        <p>{ck.cancelText(business?.phoneDisplay)}</p>
      </section>
      {expired ? (
        <p className="notice">{c.quoteExpired}</p>
      ) : (
        <section aria-labelledby="paiement" className="pay-panel">
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
                <button type="submit" className="btn btn-primary">
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
              labels={{ button: c.button(deposit), processing: c.processing, failed: c.failed, mustCheck: errorText('terms_required', locale) }}
              mustCheck={locale !== 'fr' ? ['q-terms', 'q-frenchFirst'] : ['q-terms']}
              accept={{ url: '/svc/paiement/accepter/', body: { soumission: req.accessToken, locale }, fields: { terms: 'q-terms', frenchFirst: 'q-frenchFirst' } }}
            />
          )}
          <p className="small">{c.secure}</p>
        </section>
      )}
    </article>
  )
}

