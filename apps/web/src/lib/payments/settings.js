// How customers pay, as the owner set it in Studio › Plus › Paiement: the row of the global « payment-settings », with its
// keys opened for this process. Read fresh each time: Studio saves in one container, the site and the worker read in others.
import { openSecret } from './secrets.js'
import { resolveOptions, rememberPaymentMode } from './provider.js'

export const SETTINGS_SLUG = 'payment-settings'

export async function getPaymentSettings(payload, env = process.env) {
  const row = await payload.findGlobal({ slug: SETTINGS_SLUG, depth: 0, overrideAccess: true }).catch(() => ({}))
  const secretKey = openSecret(row?.stripeSecretKey, env)
  return {
    counterEnabled: typeof row?.counterEnabled === 'boolean' ? row.counterEnabled : null,
    onlineEnabled: typeof row?.onlineEnabled === 'boolean' ? row.onlineEnabled : null,
    publishableKey: row?.stripePublishableKey || null,
    secretKey,
    webhookSecret: openSecret(row?.stripeWebhookSecret, env),
    webhookId: row?.stripeWebhookId || null,
    webhookUrl: row?.stripeWebhookUrl || null,
    accountId: row?.stripeAccountId || null,
    accountName: row?.stripeAccountName || null,
    live: typeof row?.stripeLive === 'boolean' ? row.stripeLive : null,
    chargesEnabled: typeof row?.stripeChargesEnabled === 'boolean' ? row.stripeChargesEnabled : null,
    connectedAt: row?.stripeConnectedAt || null,
    // Keys stored, but PAYLOAD_SECRET changed since: Studio asks to connect again.
    unreadable: Boolean(row?.stripeSecretKey && !secretKey),
  }
}

// { counter, online, mode, connected, testMode, publishableKey }. Never carries the secret key.
export async function paymentOptions(payload, env = process.env) {
  const settings = await getPaymentSettings(payload, env)
  const options = resolveOptions(settings, env)
  rememberPaymentMode(options.mode)
  return { ...options, publishableKey: settings.publishableKey || env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || env.STRIPE_PUBLISHABLE_KEY || null }
}
