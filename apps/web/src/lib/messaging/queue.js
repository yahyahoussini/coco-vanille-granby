// Outbound texts/emails are queued in the "messages" collection and sent by the worker
// only after the undo window (16 §3.0: side effects wait for « Annuler »).
export const UNDO_SECONDS = 5

export async function enqueueMessage(payload, { channel, template, to, language = 'fr', orderId, kind = 'transactional', body, delaySeconds = UNDO_SECONDS, req }) {
  if (!to) return null
  const sendAfter = new Date(Date.now() + delaySeconds * 1000).toISOString()
  return payload.create({
    collection: 'messages',
    data: { channel, template, to, language, kind, body, order: orderId, sendAfter, status: 'queued' },
    req,
    overrideAccess: !req,
  })
}

// « Annuler » inside the window: cancel what has not left yet.
export async function cancelQueued(payload, { orderId, template }) {
  const res = await payload.find({
    collection: 'messages',
    where: { order: { equals: orderId }, template: { equals: template }, status: { equals: 'queued' } },
    limit: 20,
    overrideAccess: true,
  })
  for (const m of res.docs) {
    await payload.update({ collection: 'messages', id: m.id, data: { status: 'cancelled' }, overrideAccess: true })
  }
  return res.docs.length
}
