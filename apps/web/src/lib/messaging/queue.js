// Outbound texts/emails are queued in the "messages" collection and sent by the worker
// only after the undo window (16 §3.0: side effects wait for « Annuler »).
import { smsInfo } from './gsm.js'

export const UNDO_SECONDS = 5

// Messages about one order or request the customer started (CASL transactional). Any other template counts
// as commercial, and the worker sends a commercial message only with a verified consent (07 A5). The kind
// comes from this list, never from the caller.
export const TRANSACTIONAL_TEMPLATES = new Set(['order_confirmed', 'order_reminder', 'order_ready', 'order_not_picked_up', 'payment_link', 'other_slot', 'closure', 'request_received', 'request_answer', 'quote_sent'])
export const kindOf = (template) => (TRANSACTIONAL_TEMPLATES.has(template) ? 'transactional' : 'commercial')

// Server code only (the collection refuses REST writes): callers check who may act before queuing.
export async function enqueueMessage(payload, { channel, template, to, language = 'fr', orderId, requestId, body, subject, html, attachments, delaySeconds = UNDO_SECONDS, sendAfter }) {
  if (!to) return null
  const after = sendAfter ? new Date(sendAfter).toISOString() : new Date(Date.now() + delaySeconds * 1000).toISOString()
  const data = { channel, template, to, language, kind: kindOf(template), body, order: orderId, request: requestId, sendAfter: after, status: 'queued', attempts: 0 }
  if (channel === 'email') Object.assign(data, { subject, html, attachments: attachments || null })
  if (channel === 'sms' && body) data.segments = smsInfo(body).segments
  return payload.create({ collection: 'messages', data, overrideAccess: true, depth: 0 })
}

// « Annuler » inside the window: cancel what has not left yet.
export async function cancelQueued(payload, { orderId, requestId, template }) {
  if (orderId === undefined && requestId === undefined) return 0
  const where = { status: { equals: 'queued' } }
  if (orderId !== undefined) where.order = { equals: orderId }
  if (requestId !== undefined) where.request = { equals: requestId }
  if (template) where.template = { equals: template }
  const res = await payload.find({ collection: 'messages', where, limit: 20, overrideAccess: true, depth: 0 })
  for (const m of res.docs) {
    await payload.update({ collection: 'messages', id: m.id, data: { status: 'cancelled' }, overrideAccess: true, depth: 0 })
  }
  return res.docs.length
}
