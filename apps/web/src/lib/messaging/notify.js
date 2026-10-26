// What goes out, to whom, on which channel (10 §6). Every call queues; the worker sends after the undo window.
// The allergy note is never copied into a message (07 O9).
import { enqueueMessage } from './queue.js'
import { senderFacts, smsData, renderSms, orderConfirmedEmail, orderReadyEmail, requestReceivedEmail, quoteSentEmail, thanksUrl } from './templates.js'
import { pickupIcs } from '../ordering/ics.js'
import { closingOf, dayOf, addDays, zonedTime } from '../studio/time.js'

const SYS = { overrideAccess: true, depth: 0 }
const origin = () => (process.env.PUBLIC_ORIGIN || 'https://cocovanillegranby.com').replace(/\/$/, '')

async function facts(payload, business) {
  const b = business || (await payload.findGlobal({ slug: 'business', locale: 'fr', ...SYS }))
  return senderFacts(b, { origin: origin() })
}

const smsTo = (doc) => doc.customer?.phone || null
const emailTo = (doc) => doc.customer?.email || null
const langOf = (order) => order.locale || order.customer?.language || 'fr'

function icsAttachment(order, f) {
  const ics = pickupIcs(order, { location: [f.name, f.addressLine.fr].filter(Boolean).join(', '), url: thanksUrl(f, order) })
  return ics ? [{ filename: `cueillette-${order.number}.ics`, contentType: 'text/calendar; charset=utf-8; method=PUBLISH', content: ics }] : []
}

// Paid web order, confirmed phone order or deposit paid: the contract copy by email (+ .ics); SMS only without email.
export async function notifyOrderConfirmed(payload, order, { business } = {}) {
  const f = await facts(payload, business)
  const out = []
  if (emailTo(order)) {
    const mail = orderConfirmedEmail(order, f)
    out.push(await enqueueMessage(payload, { channel: 'email', template: 'order_confirmed', to: emailTo(order), language: langOf(order), orderId: order.id, ...mail, body: mail.text, attachments: icsAttachment(order, f) }))
  } else if (smsTo(order)) {
    out.push(await enqueueMessage(payload, { channel: 'sms', template: 'order_confirmed', to: smsTo(order), language: langOf(order), orderId: order.id, body: renderSms('order_confirmed', langOf(order), smsData('order_confirmed', { order, facts: f })) }))
  }
  return out.filter(Boolean)
}

// Day-before reminder by SMS (email when there is no phone is left to the confirmation): sent at 17 h the day
// before, only when the pickup is at least two days away. The worker skips it if the order was cancelled.
export async function scheduleReminder(payload, order, { business, now = new Date() } = {}) {
  const to = smsTo(order)
  const day = dayOf(order.pickupDate)
  if (!to || !day || !order.pickupWindowStart) return null
  const at = zonedTime(addDays(day, -1), '17:00')
  if (at.getTime() - new Date(now).getTime() < 12 * 3600 * 1000) return null
  const f = await facts(payload, business)
  return enqueueMessage(payload, { channel: 'sms', template: 'order_reminder', to, language: langOf(order), orderId: order.id, sendAfter: at, body: renderSms('order_reminder', langOf(order), smsData('order_reminder', { order, facts: f })) })
}

// « Prête » tapped in Studio (16 §3.2): SMS first (email when there is no phone).
export async function notifyReady(payload, order, { business, shop } = {}) {
  const f = await facts(payload, business)
  const s = shop || (await payload.findGlobal({ slug: 'shop', ...SYS }))
  const closes = closingOf(s, dayOf(order.pickupDate))
  if (smsTo(order)) return [await enqueueMessage(payload, { channel: 'sms', template: 'order_ready', to: smsTo(order), language: langOf(order), orderId: order.id, body: renderSms('order_ready', langOf(order), smsData('order_ready', { order, facts: f, closes })) })]
  if (emailTo(order)) {
    const mail = orderReadyEmail(order, f, { closes })
    return [await enqueueMessage(payload, { channel: 'email', template: 'order_ready', to: emailTo(order), language: langOf(order), orderId: order.id, ...mail, body: mail.text })]
  }
  return []
}

export async function notifyNotPickedUp(payload, order, { business } = {}) {
  const f = await facts(payload, business)
  if (!smsTo(order)) return []
  return [await enqueueMessage(payload, { channel: 'sms', template: 'order_not_picked_up', to: smsTo(order), language: langOf(order), orderId: order.id, body: renderSms('order_not_picked_up', langOf(order), smsData('order_not_picked_up', { order, facts: f })) })]
}

// Request form: email when given (with the summary), SMS otherwise.
export async function notifyRequestReceived(payload, request, { business } = {}) {
  const f = await facts(payload, business)
  const l = request.customer?.language || 'fr'
  if (emailTo(request)) {
    const mail = requestReceivedEmail(request, f)
    return [await enqueueMessage(payload, { channel: 'email', template: 'request_received', to: emailTo(request), language: l, requestId: request.id, ...mail, body: mail.text })]
  }
  if (smsTo(request)) return [await enqueueMessage(payload, { channel: 'sms', template: 'request_received', to: smsTo(request), language: l, requestId: request.id, body: renderSms('request_received', l, smsData('request_received', { request, facts: f })) })]
  return []
}

// Quote with its deposit link: email (full recap) and SMS (link), both when both are known (16a J4).
export async function notifyQuoteSent(payload, request, { business } = {}) {
  const f = await facts(payload, business)
  const l = request.customer?.language || 'fr'
  const out = []
  if (emailTo(request)) {
    const mail = quoteSentEmail(request, f)
    out.push(await enqueueMessage(payload, { channel: 'email', template: 'quote_sent', to: emailTo(request), language: l, requestId: request.id, ...mail, body: mail.text }))
  }
  if (smsTo(request)) out.push(await enqueueMessage(payload, { channel: 'sms', template: 'quote_sent', to: smsTo(request), language: l, requestId: request.id, body: renderSms('quote_sent', l, smsData('quote_sent', { request, facts: f })) }))
  return out.filter(Boolean)
}
