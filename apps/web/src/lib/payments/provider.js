// Which payment adapter serves online payments (10 §1, 00 §2 #6: Stripe first, Square slot kept).
//  stripe  STRIPE_SECRET_KEY set (PaymentIntents + Payment Element, webhook marks orders paid)
//  mock    no Stripe keys, outside production (development and tests): a « Payer » button that settles at once
//  none    production without keys: online payment unavailable, the page asks the customer to call
//  counter reservation: the order is confirmed with its pickup code and paid at the counter, no card online
// PAYMENT_PROVIDER=stripe|mock|none|counter forces one; PAYMENT_MOCK=off disables the mock everywhere.
// That is the server's starting point. Since 2026-11-03 the owner connects Stripe and picks how customers pay in Studio
// › Plus › Paiement (lib/payments/settings.js reads the row, resolveOptions below decides). Pure module.
const PRODUCTION_ORIGIN = /^https:\/\/(www\.)?cocovanillegranby\.com\/?$/

export function mockAllowed(env = process.env) {
  if (env.PAYMENT_MOCK === 'off') return false
  return !PRODUCTION_ORIGIN.test(env.PUBLIC_ORIGIN || '')
}

export function paymentProvider(env = process.env) {
  const forced = env.PAYMENT_PROVIDER
  if (forced === 'stripe') return env.STRIPE_SECRET_KEY ? 'stripe' : 'none'
  if (forced === 'mock') return mockAllowed(env) ? 'mock' : 'none'
  if (forced === 'none') return 'none'
  if (forced === 'counter') return 'counter'
  if (env.STRIPE_SECRET_KEY) return 'stripe'
  return mockAllowed(env) ? 'mock' : 'none'
}

// What a customer can choose on the site. settings: the owner's row with its keys decrypted (lib/payments/settings.js).
// → { counter: at the counter?, online: 'stripe'|'mock'|null, mode: 'counter'|'online'|'both'|'none', connected, testMode }
export function resolveOptions(settings = {}, env = process.env) {
  const base = paymentProvider(env)
  const connected = Boolean(settings.secretKey && settings.publishableKey)
  let online = null
  if (settings.onlineEnabled !== false) {
    if (connected) online = settings.chargesEnabled === false ? null : 'stripe'
    else if (base === 'stripe' || base === 'mock') online = base
  }
  const counter = typeof settings.counterEnabled === 'boolean' ? settings.counterEnabled : base === 'counter'
  const mode = counter && online ? 'both' : online ? 'online' : counter ? 'counter' : 'none'
  return { counter, online, mode, connected, testMode: online === 'stripe' && connected && settings.live === false }
}

// The adapter of a web order. method: the customer's choice, 'comptoir' or 'en-ligne' (none on a page with no choice).
// null: that way of paying was just turned off, the page shows the choice again.
export function webProvider(options, method) {
  if (method === 'comptoir') return options.counter ? 'counter' : null
  if (method === 'en-ligne') return options.online || null
  return options.counter ? 'counter' : options.online || 'none'
}

// A custom-cake quote goes out as a deposit link only if a card can be taken and a message can carry the link.
export const quotesByLink = (options, channels) => Boolean(options.online && (channels.sms || channels.email))

// The ordering copy and a few labels are read in places that can't wait for the database: each process keeps the last
// mode it read (paymentOptions in lib/payments/settings.js, called first on every ordering page).
let remembered = null
export const rememberPaymentMode = (mode) => {
  remembered = mode
}
export function paymentMode(env = process.env) {
  if (remembered) return remembered
  return resolveOptions({}, env).mode
}
