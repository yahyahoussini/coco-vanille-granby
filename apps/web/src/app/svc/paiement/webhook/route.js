import { getPayload } from 'payload'
import config from '@payload-config'
import { verifyWebhook } from '@/lib/payments/stripe'
import { markOrderPaid, markDepositPaid, markOrderPaymentFailed } from '@/lib/payments/settle'

// POST /svc/paiement/webhook/: Stripe events. The signature is checked on the raw body; only
// payment_intent.succeeded marks an order (or a quote deposit) paid. Replays are harmless (idempotent).
export const dynamic = 'force-dynamic'

const json = (body, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' } })

export async function POST(request) {
  if (!process.env.STRIPE_WEBHOOK_SECRET) return json({ error: 'not configured' }, 503)
  const raw = await request.text()
  let event
  try {
    event = verifyWebhook(raw, request.headers.get('stripe-signature'))
  } catch {
    return json({ error: 'bad signature' }, 400)
  }
  const payload = await getPayload({ config })
  const intent = event.data?.object || {}
  const meta = intent.metadata || {}
  try {
    if (event.type === 'payment_intent.succeeded') {
      const amountCents = intent.amount_received ?? intent.amount
      if (meta.kind === 'deposit' && meta.requestId) {
        const req = await payload.findByID({ collection: 'requests', id: meta.requestId, overrideAccess: true, depth: 0, disableErrors: true }).catch(() => null)
        await markDepositPaid(payload, { requestId: meta.requestId, provider: 'stripe', reference: intent.id, amountCents, eventId: event.id, consent: req?.consent || {} })
      } else if (meta.orderId) {
        await markOrderPaid(payload, { orderId: meta.orderId, provider: 'stripe', reference: intent.id, amountCents, eventId: event.id })
      }
    } else if (event.type === 'payment_intent.payment_failed' && meta.orderId) {
      await markOrderPaymentFailed(payload, { orderId: meta.orderId, reference: intent.id, eventId: event.id, reason: intent.last_payment_error?.code || '' })
    }
  } catch (e) {
    payload.logger.error({ err: e, event: event.id }, 'stripe webhook failed')
    return json({ error: 'retry' }, 500)
  }
  return json({ received: true })
}
