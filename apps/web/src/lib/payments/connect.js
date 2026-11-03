// Connecting the shop's Stripe account from Studio: the two keys are checked by Stripe itself, and the webhook that tells
// the site a card was paid is created here, so the owner never has to open that part of Stripe. stripe: a Stripe client
// (a stand-in in tests).
const PUBLISHABLE = /^pk_(live|test)_[A-Za-z0-9_]+$/
const SECRET = /^(sk|rk)_(live|test)_[A-Za-z0-9_]+$/

export const WEBHOOK_EVENTS = ['payment_intent.succeeded', 'payment_intent.payment_failed']
export const webhookUrlFor = (origin) => `${String(origin).replace(/\/$/, '')}/svc/paiement/webhook/`

// → { live } or { problem: words for the owner }
export function checkKeys(publishable, secret) {
  const pk = String(publishable || '').trim()
  const sk = String(secret || '').trim()
  if (!pk || !sk) return { problem: 'Collez les deux clés de Stripe : la clé publiable et la clé secrète.' }
  const p = pk.match(PUBLISHABLE)
  const s = sk.match(SECRET)
  if (!p) return { problem: 'La clé publiable commence par pk_live_ ou pk_test_. Vérifiez la première case.' }
  if (!s) return { problem: 'La clé secrète commence par sk_live_ ou sk_test_. Vérifiez la deuxième case.' }
  if (p[1] !== s[2]) return { problem: 'Une clé est en mode réel et l’autre en mode essai. Copiez les deux du même mode.' }
  return { live: p[1] === 'live', publishable: pk, secret: sk }
}

// The account behind the key, as Stripe answers. → { accountId, accountName, chargesEnabled, currency }
export async function readAccount(stripe) {
  const a = await stripe.accounts.retrieveCurrent()
  return {
    accountId: a.id || null,
    accountName: a.settings?.dashboard?.display_name || a.business_profile?.name || a.email || a.id || null,
    chargesEnabled: a.charges_enabled !== false,
    currency: a.default_currency || null,
  }
}

// One webhook for this site. A known endpoint is moved to the current address (the secret stays); otherwise the old ones
// this site made are removed and a new one is created. → { id, url, secret } (secret null: keep the stored one)
export async function ensureWebhook(stripe, { url, knownId = null }) {
  if (knownId) {
    const known = await stripe.webhookEndpoints.retrieve(knownId).catch(() => null)
    if (known && known.status !== 'disabled') {
      if (known.url !== url) await stripe.webhookEndpoints.update(knownId, { url })
      return { id: knownId, url, secret: null }
    }
  }
  const list = await stripe.webhookEndpoints.list({ limit: 100 })
  for (const old of list.data || []) {
    if (old.metadata?.site === 'coco-vanille' || old.url === url) await stripe.webhookEndpoints.del(old.id).catch(() => null)
  }
  const made = await stripe.webhookEndpoints.create({ url, enabled_events: WEBHOOK_EVENTS, description: 'Pâtisserie Coco Vanille : commandes du site', metadata: { site: 'coco-vanille' } })
  return { id: made.id, url, secret: made.secret }
}

// What went wrong, in the owner's words.
export function stripeProblem(e) {
  const type = e?.type || ''
  if (type === 'StripeAuthenticationError' || e?.statusCode === 401) return 'Stripe refuse cette clé secrète. Copiez-la de nouveau, en entier.'
  if (type === 'StripePermissionError' || e?.statusCode === 403) return 'Cette clé n’a pas toutes les permissions. Utilisez la clé secrète standard (sk_…).'
  if (type === 'StripeConnectionError') return 'Stripe ne répond pas pour le moment. Réessayez dans une minute.'
  return `Stripe a répondu : ${String(e?.message || 'erreur inconnue').slice(0, 160)}`
}
