// Which payment adapter serves online payments (10 §1, 00 §2 #6: Stripe first, Square slot kept).
//  stripe  STRIPE_SECRET_KEY set (PaymentIntents + Payment Element, webhook marks orders paid)
//  mock    no Stripe keys, outside production (development and tests): a « Payer » button that settles at once
//  none    production without keys: online payment unavailable, the page asks the customer to call
// PAYMENT_PROVIDER=stripe|mock|none forces one; PAYMENT_MOCK=off disables the mock everywhere.
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
  if (env.STRIPE_SECRET_KEY) return 'stripe'
  return mockAllowed(env) ? 'mock' : 'none'
}
