// Stripe adapter (10 §1, §4): PaymentIntents + Payment Element. Card data stays in Stripe's iframes (SAQ A);
// only the signed webhook marks an order paid. Env: STRIPE_SECRET_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
// STRIPE_WEBHOOK_SECRET. Stripe.js is the versioned build matching the server SDK's API version
// (stripe@23 → 2026-09-30.endive); STRIPE_JS_URL overrides it.
import Stripe from 'stripe'

export const STRIPE_JS_URL = process.env.STRIPE_JS_URL || 'https://js.stripe.com/endive/stripe.js'

let client = null
export function stripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) return null
  client ??= new Stripe(process.env.STRIPE_SECRET_KEY, { maxNetworkRetries: 2, appInfo: { name: 'coco-vanille-commandes' } })
  return client
}

export const publishableKey = () => process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || process.env.STRIPE_PUBLISHABLE_KEY || null

const reusable = ['requires_payment_method', 'requires_confirmation', 'requires_action', 'processing']

// One PaymentIntent per order (kind 'order') or per quote deposit (kind 'deposit'), reused while it can still
// be paid. The idempotency key ties a retry to the same intent. → { id, clientSecret, status }
export async function ensureIntent({ kind, id, number, amountCents, reference, description, email }) {
  const stripe = stripeClient()
  if (!stripe) throw Object.assign(new Error('stripe_not_configured'), { code: 'payment_unavailable' })
  if (reference) {
    const existing = await stripe.paymentIntents.retrieve(reference).catch(() => null)
    if (existing && existing.amount === amountCents && (reusable.includes(existing.status) || existing.status === 'succeeded')) {
      return { id: existing.id, clientSecret: existing.client_secret, status: existing.status, created: false }
    }
  }
  const intent = await stripe.paymentIntents.create(
    {
      amount: amountCents,
      currency: 'cad',
      automatic_payment_methods: { enabled: true },
      description,
      receipt_email: email || undefined,
      metadata: { kind, [kind === 'deposit' ? 'requestId' : 'orderId']: String(id), number: number ? String(number) : '' },
    },
    { idempotencyKey: `${kind}-${id}-${amountCents}` },
  )
  return { id: intent.id, clientSecret: intent.client_secret, status: intent.status, created: true }
}

export async function cancelIntent(reference) {
  const stripe = stripeClient()
  if (!stripe || !reference) return null
  return stripe.paymentIntents.cancel(reference).catch(() => null)
}

// Verifies the Stripe-Signature header against the raw body. Throws when it does not match.
export function verifyWebhook(rawBody, signature, secret = process.env.STRIPE_WEBHOOK_SECRET) {
  if (!secret) throw Object.assign(new Error('webhook secret missing'), { code: 'not_configured' })
  return Stripe.webhooks.constructEvent(rawBody, signature || '', secret)
}

// For tests: a valid signature header for a payload.
export const testSignature = (payload, secret) => Stripe.webhooks.generateTestHeaderString({ payload, secret })
