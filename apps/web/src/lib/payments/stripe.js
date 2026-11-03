// Stripe adapter (10 §1, §4): PaymentIntents + Payment Element. Card data stays in Stripe's iframes (SAQ A);
// only the signed webhook marks an order paid. The keys come from Studio › Plus › Paiement (lib/payments/settings.js), else
// from the server's environment: STRIPE_SECRET_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOK_SECRET. Stripe.js is
// the versioned build matching the server SDK's API version (stripe@23 → 2026-09-30.endive); STRIPE_JS_URL overrides it.
import Stripe from 'stripe'
import { getPaymentSettings } from './settings.js'

export const STRIPE_JS_URL = process.env.STRIPE_JS_URL || 'https://js.stripe.com/endive/stripe.js'

// STRIPE_API_BASE: a local stand-in for Stripe's API, for tests on a developer's machine only.
function apiTarget(env = process.env) {
  if (!env.STRIPE_API_BASE) return {}
  const u = new URL(env.STRIPE_API_BASE)
  return { host: u.hostname, port: u.port || undefined, protocol: u.protocol.replace(':', '') }
}

const clients = new Map()
export function stripeFor(secretKey, env = process.env) {
  if (!secretKey) return null
  if (!clients.has(secretKey)) clients.set(secretKey, new Stripe(secretKey, { maxNetworkRetries: 2, appInfo: { name: 'coco-vanille-commandes' }, ...apiTarget(env) }))
  return clients.get(secretKey)
}

export async function stripeClient(payload, env = process.env) {
  const settings = await getPaymentSettings(payload, env)
  return stripeFor(settings.secretKey || env.STRIPE_SECRET_KEY, env)
}

const reusable = ['requires_payment_method', 'requires_confirmation', 'requires_action', 'processing']

// One PaymentIntent per order (kind 'order') or per quote deposit (kind 'deposit'), reused while it can still
// be paid. The idempotency key ties a retry to the same intent. → { id, clientSecret, status }
export async function ensureIntent(payload, { kind, id, number, amountCents, reference, description, email }) {
  const stripe = await stripeClient(payload)
  if (!stripe) throw Object.assign(new Error('stripe_not_configured'), { code: 'payment_unavailable' })
  if (reference) {
    const existing = await stripe.paymentIntents.retrieve(reference).catch(() => null)
    if (existing && existing.amount === amountCents && (reusable.includes(existing.status) || existing.status === 'succeeded')) {
      return { id: existing.id, clientSecret: existing.client_secret, status: existing.status, created: false }
    }
    // The amount changed (a new quote): the old intent must not stay payable in a tab left open.
    if (existing && existing.amount !== amountCents && reusable.includes(existing.status) && existing.status !== 'processing') await stripe.paymentIntents.cancel(existing.id).catch(() => null)
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

export async function cancelIntent(payload, reference) {
  if (!reference) return null
  const stripe = await stripeClient(payload)
  if (!stripe) return null
  return stripe.paymentIntents.cancel(reference).catch(() => null)
}

// The secret that signs this site's webhook: from Studio, else the environment.
export async function webhookSecret(payload, env = process.env) {
  const settings = await getPaymentSettings(payload, env)
  return settings.webhookSecret || env.STRIPE_WEBHOOK_SECRET || null
}

// Verifies the Stripe-Signature header against the raw body. Throws when it does not match.
export function verifyWebhook(rawBody, signature, secret) {
  if (!secret) throw Object.assign(new Error('webhook secret missing'), { code: 'not_configured' })
  return Stripe.webhooks.constructEvent(rawBody, signature || '', secret)
}

// For tests: a valid signature header for a payload.
export const testSignature = (payload, secret) => Stripe.webhooks.generateTestHeaderString({ payload, secret })
