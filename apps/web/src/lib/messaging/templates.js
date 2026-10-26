// Customer messages (10 §6, 07 §1E, §4 O6). All transactional: they identify the sender and say how to stop.
// SMS: one GSM-7 segment (≤ 160), no order contents, never the allergy note (07 O9). Email: French first,
// then the customer's language; the order confirmation is the contract copy (07 O6).
import { toGsm } from './gsm.js'
import { money, clock, longDate } from '../i18n.js'
import { dayOf } from '../studio/time.js'
import { longDayLabel } from '../ordering/labels.js'
import { totalsRows } from '../ordering/totals.js'

const LOCALES = ['fr', 'en', 'es']
const lang = (l) => (LOCALES.includes(l) ? l : 'fr')
const time = (hhmm, l) => (l === 'es' ? hhmm : clock(hhmm, l))
const shortDay = (iso, l) => {
  const d = new Date(`${dayOf(iso)}T12:00:00Z`)
  const s = new Intl.DateTimeFormat(l === 'en' ? 'en-CA' : l === 'es' ? 'es' : 'fr-CA', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' }).format(d)
  return l === 'fr' ? s.replace(/(^|\s)1(\s)/, '$11er$2') : s
}
const localWhen = (date, l) => {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Toronto', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date(date)).map((x) => [x.type, x.value]))
  return { iso: `${p.year}-${p.month}-${p.day}`, hhmm: `${p.hour}:${p.minute}` }
}

// Facts shared by every template, from the business global (never invented: missing → left out).
export function senderFacts(business = {}, { origin = 'https://cocovanillegranby.com' } = {}) {
  const a = business.address || {}
  const streetFr = a.street || ''
  const streetEn = streetFr.replace(/^(\d+),\s*/, '$1 ')
  return {
    name: business.name || 'Pâtisserie Coco Vanille',
    legalName: business.legalName || null,
    neq: business.neq || null,
    phone: business.phoneDisplay || null,
    email: business.email || null,
    street: { fr: streetFr, en: streetEn, es: streetEn },
    addressLine: {
      fr: streetFr ? `${streetFr}, ${a.city || 'Granby'} (Québec) ${a.postalCode || ''}`.trim() : '',
      en: streetEn ? `${streetEn}, ${a.city || 'Granby'}, Québec ${a.postalCode || ''}`.trim() : '',
      es: streetEn ? `${streetEn}, ${a.city || 'Granby'}, Quebec ${a.postalCode || ''}`.trim() : '',
    },
    city: a.city || 'Granby',
    maps: business.google?.cid ? `https://maps.google.com/?cid=${business.google.cid}` : null,
    origin: origin.replace(/\/$/, ''),
  }
}

const conditionsPath = { fr: '/conditions-de-vente/', en: '/en/terms-of-sale/', es: '/conditions-de-vente/' }
const thanksPath = { fr: '/commander/merci/', en: '/en/order/thanks/', es: '/es/pedidos/gracias/' }
export const thanksUrl = (facts, order) => `${facts.origin}${thanksPath[lang(order.locale)]}?commande=${order.accessToken}`

// ---------------------------------------------------------------- SMS (one GSM-7 segment each)
const STOP = { fr: 'STOP pour ne plus recevoir de textos.', en: 'Reply STOP to opt out.', es: 'Responda STOP para darse de baja.' }

const SMS = {
  request_received: {
    fr: (d) => `Coco Vanille : votre demande pour le ${d.day} est bien arrivée. Réponse d'ici le ${d.answerBy}. ${STOP.fr}`,
    en: (d) => `Coco Vanille: your request for ${d.day} has arrived. We will reply by ${d.answerBy}. ${STOP.en}`,
    es: (d) => `Coco Vanille: recibimos su solicitud para el ${d.day}. Respuesta antes del ${d.answerBy}. ${STOP.es}`,
  },
  quote_sent: {
    // The link carries the date, the validity and the recap: the text stays one segment with a 4-digit price.
    fr: (d) => `Coco Vanille : votre soumission est arrivée. Acompte de ${d.deposit} : ${d.link} ${STOP.fr}`,
    en: (d) => `Coco Vanille: your quote is ready. Deposit ${d.deposit}: ${d.link} ${STOP.en}`,
    es: (d) => `Coco Vanille: ya tiene su presupuesto. Anticipo ${d.deposit}: ${d.link} ${STOP.es}`,
  },
  order_confirmed: {
    fr: (d) => `Coco Vanille : commande ${d.number} confirmée, cueillette le ${d.day} ${d.start ? `entre ${d.start} et ${d.end}` : 'heure à convenir'}, ${d.street}. Code ${d.code}. ${STOP.fr}`,
    en: (d) => `Coco Vanille: order ${d.number} confirmed, pickup ${d.day} ${d.start ? `${d.start}-${d.end}` : 'time to be agreed'}, ${d.street}. Code ${d.code}. ${STOP.en}`,
    es: (d) => `Coco Vanille: pedido ${d.number} confirmado, recogida el ${d.day} ${d.start ? `${d.start}-${d.end}` : 'hora por acordar'}, ${d.street}. Clave ${d.code}. ${STOP.es}`,
  },
  order_ready: {
    fr: (d) => `Coco Vanille : votre commande ${d.number} vous attend au comptoir${d.closes ? ` jusqu'à ${d.closes}` : ''}. ${d.street}, ${d.city}. ${STOP.fr}`,
    en: (d) => `Coco Vanille: your order ${d.number} is ready at the counter${d.closes ? ` until ${d.closes}` : ''}. ${d.street}, ${d.city}. ${STOP.en}`,
    es: (d) => `Coco Vanille: su pedido ${d.number} le espera en el mostrador${d.closes ? ` hasta las ${d.closes}` : ''}. ${d.street}, ${d.city}. ${STOP.es}`,
  },
  order_reminder: {
    fr: (d) => `Coco Vanille : rappel, cueillette demain (${d.weekday}) entre ${d.start} et ${d.end}. Commande ${d.number}. ${STOP.fr}`,
    en: (d) => `Coco Vanille: reminder, pickup tomorrow (${d.weekday}) ${d.start}-${d.end}. Order ${d.number}. ${STOP.en}`,
    es: (d) => `Coco Vanille: recordatorio, recogida mañana (${d.weekday}) ${d.start}-${d.end}. Pedido ${d.number}. ${STOP.es}`,
  },
  order_not_picked_up: {
    fr: (d) => `Coco Vanille : votre commande ${d.number} n'a pas été récupérée. Appelez-nous${d.phone ? ` au ${d.phone}` : ''} pour convenir d'une heure. ${STOP.fr}`,
    en: (d) => `Coco Vanille: your order ${d.number} was not picked up. Call us${d.phone ? ` at ${d.phone}` : ''} to set a time. ${STOP.en}`,
    es: (d) => `Coco Vanille: su pedido ${d.number} no fue recogido. Llame a la tienda${d.phone ? ` al ${d.phone}` : ''} para acordar una hora. ${STOP.es}`,
  },
}

export const SMS_TEMPLATES = Object.keys(SMS)

const weekdayShort = (iso, l) => new Intl.DateTimeFormat(l === 'en' ? 'en-CA' : l === 'es' ? 'es' : 'fr-CA', { weekday: 'short', timeZone: 'UTC' }).format(new Date(`${dayOf(iso)}T12:00:00Z`))

// Data for SMS templates from an order or a request.
export function smsData(template, { order, request, facts, closes, link }) {
  const l = lang(order?.locale || request?.customer?.language)
  if (request) {
    const answer = request.answerBy ? localWhen(request.answerBy, l) : null
    const valid = request.quote?.validUntil ? localWhen(request.quote.validUntil, l) : null
    return {
      day: shortDay(request.eventDate, l),
      answerBy: answer ? `${shortDay(answer.iso, l)}, ${time(answer.hhmm, l)}` : '',
      deposit: request.quote ? money(request.quote.depositCents, l) : '',
      validUntil: valid ? shortDay(valid.iso, l) : '',
      link: link || request.quote?.paymentLink || '',
    }
  }
  return {
    number: order.number,
    day: shortDay(order.pickupDate, l),
    weekday: weekdayShort(order.pickupDate, l),
    start: order.pickupWindowStart ? time(order.pickupWindowStart, l) : '',
    end: order.pickupWindowEnd ? time(order.pickupWindowEnd, l) : '',
    code: order.pickupCode,
    street: facts.street[l] || facts.street.fr,
    city: facts.city,
    phone: facts.phone,
    closes: closes ? time(closes, l) : null,
  }
}

export function renderSms(template, locale, data) {
  const fn = SMS[template]?.[lang(locale)]
  if (!fn) throw new Error(`SMS template inconnu : ${template}`)
  // « p.m.. » → « p.m. » when a clock ends a sentence.
  return toGsm(fn(data).replace(/\s+/g, ' ').replace(/\.\.(?!\.)/g, '.').trim())
}

// ---------------------------------------------------------------- Email
const E = {
  fr: {
    hello: (n) => (n ? `Bonjour ${n},` : 'Bonjour,'),
    pickup: 'Cueillette',
    code: (c) => `Code de cueillette : ${c} (à donner au comptoir)`,
    directions: 'Itinéraire',
    items: 'Votre commande',
    message: 'Message sur le gâteau',
    paidOnline: (d, amount) => `Payé en ligne par carte le ${d} : ${amount}`,
    paidMock: (amount) => `Paiement simulé (démonstration) : ${amount}`,
    payAtCounter: (amount) => `À payer au comptoir à la cueillette : ${amount}`,
    depositPaid: (dep, bal) => `Acompte payé : ${dep} · Solde à la cueillette : ${bal}`,
    currency: 'Montants en dollars canadiens (CAD).',
    cancel: 'Annulation et remboursement',
    cancelText: (p) => `Pour annuler ou changer la date, appelez la boutique${p ? ` au ${p}` : ''}; les conditions de vente précisent les délais et le sort de l’acompte. Si la boutique ne peut pas honorer la commande, vous choisissez une autre plage de cueillette ou un remboursement complet, versé dans les 15 jours.`,
    terms: 'Conditions de vente',
    termsText: (v, at) => `Vous avez accepté les conditions de vente${v ? ` (version ${v})` : ''}${at ? ` le ${at}` : ''}.`,
    allergy: (p) => `Une question d’allergie? Appelez-nous${p ? ` au ${p}` : ''}.`,
    merchant: 'Commerçant',
    footer: (p) => `Message transactionnel de la Pâtisserie Coco Vanille au sujet de votre commande. Pour ne plus recevoir nos courriels, répondez « désabonnement »${p ? ` ou appelez le ${p}` : ''}.`,
    addToCalendar: 'Le fichier joint ajoute la cueillette à votre calendrier.',
    follow: 'Suivre ma commande',
    confirmedSubject: (n, when) => `Commande ${n} confirmée · cueillette ${when}`,
    confirmedLead: (n) => `Merci! Votre commande ${n} est confirmée. Ce courriel est votre copie du contrat.`,
    readySubject: (n) => `Votre commande ${n} est prête`,
    readyLead: (n, until) => `Votre commande ${n} vous attend au comptoir${until ? ` jusqu’à ${until}` : ''}.`,
    requestSubject: (d) => `Demande de gâteau reçue · ${d}`,
    requestLead: (when) => `Merci! Nous avons bien reçu votre demande. Nous vous répondons d’ici le ${when}, avec un prix et un lien pour l’acompte.`,
    requestAllergy: 'Vous avez signalé une allergie : nous vous appellerons pour en parler avant de vous proposer un prix.',
    occasion: 'Occasion',
    guests: 'Invités',
    date: 'Date de cueillette',
    flavour: 'Saveur',
    details: 'Détails',
    photos: (n) => `${n} photo(s) d’inspiration jointe(s)`,
    quoteSubject: (d) => `Votre prix pour le ${d}`,
    quoteLead: 'Voici le prix de votre gâteau. La date est réservée provisoirement jusqu’à l’expiration de la soumission.',
    quoteValid: (d) => `Soumission valide jusqu’au ${d}.`,
    quotePay: 'Payer l’acompte',
  },
  en: {
    hello: (n) => (n ? `Hello ${n},` : 'Hello,'),
    pickup: 'Pickup',
    code: (c) => `Pickup code: ${c} (give it at the counter)`,
    directions: 'Directions',
    items: 'Your order',
    message: 'Message on the cake',
    paidOnline: (d, amount) => `Paid online by card on ${d}: ${amount}`,
    paidMock: (amount) => `Simulated payment (demo): ${amount}`,
    payAtCounter: (amount) => `To pay at the counter at pickup: ${amount}`,
    depositPaid: (dep, bal) => `Deposit paid: ${dep} · Balance at pickup: ${bal}`,
    currency: 'Amounts in Canadian dollars (CAD).',
    cancel: 'Cancellation and refund',
    cancelText: (p) => `To cancel or change the date, call the shop${p ? ` at ${p}` : ''}; the conditions of sale set out the deadlines and what happens to the deposit. If the shop cannot fill the order, you choose another pickup slot or a full refund, paid within 15 days.`,
    terms: 'Conditions of sale',
    termsText: (v, at) => `You accepted the conditions of sale${v ? ` (version ${v})` : ''}${at ? ` on ${at}` : ''}. The French version is the reference.`,
    allergy: (p) => `An allergy question? Call us${p ? ` at ${p}` : ''}.`,
    merchant: 'Merchant',
    footer: (p) => `Transactional message from Pâtisserie Coco Vanille about your order. To stop receiving our emails, reply “unsubscribe”${p ? ` or call ${p}` : ''}.`,
    addToCalendar: 'The attached file adds the pickup to your calendar.',
    follow: 'Track my order',
    confirmedSubject: (n, when) => `Order ${n} confirmed · pickup ${when}`,
    confirmedLead: (n) => `Thank you! Your order ${n} is confirmed. This email is your copy of the contract.`,
    readySubject: (n) => `Your order ${n} is ready`,
    readyLead: (n, until) => `Your order ${n} is waiting for you at the counter${until ? ` until ${until}` : ''}.`,
    requestSubject: (d) => `Cake request received · ${d}`,
    requestLead: (when) => `Thank you! We received your request. We will reply by ${when}, with a price and a deposit link.`,
    requestAllergy: 'You mentioned an allergy: we will call you to talk about it before we send a price.',
    occasion: 'Occasion',
    guests: 'Guests',
    date: 'Pickup date',
    flavour: 'Flavour',
    details: 'Details',
    photos: (n) => `${n} inspiration photo(s) attached`,
    quoteSubject: (d) => `Your price for ${d}`,
    quoteLead: 'Here is the price of your cake. The date is held for you until the quote expires.',
    quoteValid: (d) => `Quote valid until ${d}.`,
    quotePay: 'Pay the deposit',
  },
}
E.es = {
  ...E.en,
  hello: (n) => (n ? `Hola ${n}:` : 'Hola:'),
  pickup: 'Recogida',
  code: (c) => `Código de recogida: ${c} (entréguelo en el mostrador)`,
  directions: 'Cómo llegar',
  items: 'Su pedido',
  message: 'Mensaje en el pastel',
  currency: 'Importes en dólares canadienses (CAD).',
  cancel: 'Cancelación y reembolso',
  terms: 'Condiciones de venta',
  allergy: (p) => `¿Una pregunta sobre alergias? Llámenos${p ? ` al ${p}` : ''}.`,
  merchant: 'Comercio',
  confirmedSubject: (n, when) => `Pedido ${n} confirmado · recogida ${when}`,
  confirmedLead: (n) => `¡Gracias! Su pedido ${n} está confirmado. Este correo es su copia del contrato.`,
  readySubject: (n) => `Su pedido ${n} está listo`,
  requestSubject: (d) => `Solicitud de pastel recibida · ${d}`,
  quoteSubject: (d) => `Su precio para el ${d}`,
}

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// A block = [{ h?: heading, p?: paragraph, rows?: [[label, value]], link?: { href, text } }] in one language.
function renderBlocks(blocks) {
  const text = []
  const html = []
  for (const { locale, parts } of blocks) {
    html.push(`<div lang="${locale === 'en' ? 'en-CA' : locale === 'es' ? 'es' : 'fr-CA'}" style="margin:0 0 32px">`)
    for (const part of parts) {
      if (part.h) {
        text.push('', part.h.toUpperCase())
        html.push(`<h2 style="font-family:Georgia,serif;font-size:18px;margin:24px 0 8px;color:#2e211a">${esc(part.h)}</h2>`)
      }
      if (part.p) {
        text.push(part.p)
        html.push(`<p style="margin:0 0 12px">${esc(part.p)}</p>`)
      }
      if (part.rows) {
        for (const [label, value] of part.rows) text.push(`${label} · ${value}`)
        html.push(`<table role="presentation" style="border-collapse:collapse;width:100%;max-width:560px">${part.rows.map(([label, value], i) => `<tr><td style="padding:6px 8px 6px 0;border-top:1px solid #e6dccb${i === part.rows.length - 1 && part.strongLast ? ';font-weight:700' : ''}">${esc(label)}</td><td style="padding:6px 0;border-top:1px solid #e6dccb;text-align:right;white-space:nowrap${i === part.rows.length - 1 && part.strongLast ? ';font-weight:700' : ''}">${esc(value)}</td></tr>`).join('')}</table>`)
      }
      if (part.link) {
        text.push(`${part.link.text} : ${part.link.href}`)
        html.push(`<p style="margin:0 0 12px"><a href="${esc(part.link.href)}" style="color:#96344a">${esc(part.link.text)}</a></p>`)
      }
    }
    html.push('</div>')
    text.push('', '—', '')
  }
  return {
    text: text.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n',
    html: `<!doctype html><html><body style="margin:0;padding:24px;background:#f7f0e3;color:#2e211a;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.5"><div style="max-width:600px;margin:0 auto;background:#fffcf6;padding:24px;border-radius:12px">${html.join('')}</div></body></html>`,
  }
}

const languagesFor = (locale) => (lang(locale) === 'fr' ? ['fr'] : ['fr', lang(locale)])

function merchantParts(l, facts) {
  const c = E[l]
  const identity = [facts.legalName || facts.name, facts.neq ? `NEQ ${facts.neq}` : null].filter(Boolean).join(' · ')
  const contact = [facts.addressLine[l], facts.phone, facts.email].filter(Boolean).join(' · ')
  return [{ h: c.merchant, p: identity }, { p: contact }, { p: c.footer(facts.phone) }]
}

function itemsRows(order, l) {
  return (order.items || []).map((it) => [`${it.qty} × ${it.title}${it.variantLabel ? ` · ${it.variantLabel}` : ''}`, money(it.unitPriceCents * it.qty, l)])
}

function paymentLine(order, l) {
  const c = E[l]
  const total = money(order.totals?.totalCents, l)
  if (order.totals?.depositCents) return c.depositPaid(money(order.totals.depositCents, l), money(order.totals.balanceCents, l))
  if (order.payment?.provider === 'counter') return c.payAtCounter(total)
  if (order.payment?.provider === 'mock') return c.paidMock(total)
  return c.paidOnline(order.payment?.paidAt ? longDate(order.payment.paidAt, l) : '', total)
}

const TIME_TBD = { fr: 'heure à convenir avec la boutique', en: 'time to be agreed with the shop', es: 'hora por acordar con la tienda' }
const whenText = (order, l) => {
  const day = longDayLabel(dayOf(order.pickupDate), l)
  if (!order.pickupWindowStart) return `${day}, ${TIME_TBD[l]}`
  const end = order.pickupWindowEnd || order.pickupWindowStart
  return `${day}, ${l === 'en' ? `${clock(order.pickupWindowStart, 'en')}–${clock(end, 'en')}` : l === 'es' ? `${order.pickupWindowStart}–${end}` : `${clock(order.pickupWindowStart)} à ${clock(end)}`}`
}

// Order confirmation = contract copy (07 O6): everything shown at review + merchant identity + conditions.
export function orderConfirmedEmail(order, facts) {
  const l0 = lang(order.locale)
  const blocks = languagesFor(l0).map((l) => {
    const c = E[l]
    const messages = (order.items || []).filter((it) => it.message).map((it) => `${c.message} (${it.title}) : « ${it.message} »`)
    const accepted = order.consent?.termsAcceptedAt ? `${longDate(order.consent.termsAcceptedAt, l)}, ${clock(localWhen(order.consent.termsAcceptedAt, l).hhmm, l)}` : null
    return {
      locale: l,
      parts: [
        { p: c.hello(order.customer?.firstName) },
        { p: c.confirmedLead(order.number) },
        { h: c.pickup, p: whenText(order, l) },
        { p: [facts.name, facts.addressLine[l]].filter(Boolean).join(', ') },
        { p: c.code(order.pickupCode) },
        facts.maps ? { link: { href: facts.maps, text: c.directions } } : null,
        { p: c.addToCalendar },
        { h: c.items, rows: itemsRows(order, l) },
        ...messages.map((m) => ({ p: m })),
        { rows: totalsRows(order.totals, l).map((r) => [r.label, r.text]), strongLast: !order.totals?.depositCents },
        { p: paymentLine(order, l) },
        { p: c.currency },
        { h: c.cancel, p: c.cancelText(facts.phone) },
        { h: c.terms, p: c.termsText(order.consent?.termsVersion, accepted) },
        { link: { href: `${facts.origin}${conditionsPath[l]}`, text: c.terms } },
        { link: { href: thanksUrl(facts, order), text: c.follow } },
        { p: c.allergy(facts.phone) },
        ...merchantParts(l, facts),
      ].filter(Boolean),
    }
  })
  return { subject: E.fr.confirmedSubject(order.number, whenText(order, 'fr')) + (l0 !== 'fr' ? ` / ${E[l0].confirmedSubject(order.number, whenText(order, l0))}` : ''), ...renderBlocks(blocks) }
}

export function orderReadyEmail(order, facts, { closes } = {}) {
  const l0 = lang(order.locale)
  const blocks = languagesFor(l0).map((l) => {
    const c = E[l]
    return {
      locale: l,
      parts: [
        { p: c.hello(order.customer?.firstName) },
        { p: c.readyLead(order.number, closes ? clock(closes, l) : null) },
        { p: [facts.name, facts.addressLine[l]].filter(Boolean).join(', ') },
        { p: c.code(order.pickupCode) },
        facts.maps ? { link: { href: facts.maps, text: c.directions } } : null,
        ...merchantParts(l, facts),
      ].filter(Boolean),
    }
  })
  return { subject: E.fr.readySubject(order.number) + (l0 !== 'fr' ? ` / ${E[l0].readySubject(order.number)}` : ''), ...renderBlocks(blocks) }
}

function requestRows(request, l) {
  const c = E[l]
  return [
    [c.occasion, request.occasion],
    request.guests ? [c.guests, String(request.guests)] : null,
    [c.date, longDayLabel(dayOf(request.eventDate), l)],
    request.flavour ? [c.flavour, request.flavour] : null,
    request.cakeMessage ? [c.message, `« ${request.cakeMessage} »`] : null,
  ].filter(Boolean)
}

export function requestReceivedEmail(request, facts) {
  const l0 = lang(request.customer?.language)
  const answer = request.answerBy ? localWhen(request.answerBy, l0) : null
  const blocks = languagesFor(l0).map((l) => {
    const c = E[l]
    const when = answer ? `${longDayLabel(answer.iso, l)}, ${clock(answer.hhmm, l)}` : ''
    return {
      locale: l,
      parts: [
        { p: c.hello(request.customer?.firstName) },
        { p: c.requestLead(when) },
        request.hasAllergy ? { p: c.requestAllergy } : null,
        { rows: requestRows(request, l) },
        request.details ? { h: c.details, p: request.details } : null,
        request.photos?.length ? { p: c.photos(request.photos.length) } : null,
        { p: c.allergy(facts.phone) },
        ...merchantParts(l, facts),
      ].filter(Boolean),
    }
  })
  const day = shortDay(request.eventDate, 'fr')
  return { subject: E.fr.requestSubject(day) + (l0 !== 'fr' ? ` / ${E[l0].requestSubject(shortDay(request.eventDate, l0))}` : ''), ...renderBlocks(blocks) }
}

export function quoteSentEmail(request, facts) {
  const l0 = lang(request.customer?.language)
  const q = request.quote || {}
  const valid = q.validUntil ? localWhen(q.validUntil, l0) : null
  const blocks = languagesFor(l0).map((l) => {
    const c = E[l]
    const totals = { subtotalCents: q.subtotalCents, gstCents: q.gstCents, qstCents: q.qstCents, totalCents: q.totalCents, depositCents: q.depositCents !== q.totalCents ? q.depositCents : null, balanceCents: q.balanceCents }
    return {
      locale: l,
      parts: [
        { p: c.hello(request.customer?.firstName) },
        { p: c.quoteLead },
        { rows: requestRows(request, l) },
        { rows: totalsRows(totals, l).map((r) => [r.label, r.text]) },
        { p: c.currency },
        valid ? { p: c.quoteValid(`${longDayLabel(valid.iso, l)}, ${clock(valid.hhmm, l)}`) } : null,
        q.paymentLink ? { link: { href: q.paymentLink, text: c.quotePay } } : null,
        { link: { href: `${facts.origin}${conditionsPath[l]}`, text: c.terms } },
        { p: c.allergy(facts.phone) },
        ...merchantParts(l, facts),
      ].filter(Boolean),
    }
  })
  const day = longDayLabel(dayOf(request.eventDate), 'fr')
  return { subject: E.fr.quoteSubject(day) + (l0 !== 'fr' ? ` / ${E[l0].quoteSubject(longDayLabel(dayOf(request.eventDate), l0))}` : ''), ...renderBlocks(blocks) }
}

