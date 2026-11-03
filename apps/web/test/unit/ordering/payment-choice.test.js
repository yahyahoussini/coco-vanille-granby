// How a customer pays is the owner's choice in Studio › Plus › Paiement: at the counter, online, or both.
import { test, describe, before, after, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { resolveOptions, webProvider, quotesByLink, paymentMode, rememberPaymentMode } from '../../../src/lib/payments/provider.js'
import { sealSecret, openSecret, maskKey } from '../../../src/lib/payments/secrets.js'
import { checkKeys, webhookUrlFor } from '../../../src/lib/payments/connect.js'
import { getPaymentSettings, paymentOptions } from '../../../src/lib/payments/settings.js'
import { webhookSecret, verifyWebhook, testSignature } from '../../../src/lib/payments/stripe.js'
import { PAYMENT_FACTS, paymentAnswers } from '../../../src/lib/payment-facts.js'
import { factIdFor, FACTS } from '../../../src/lib/facts-catalog.js'
import { pages } from '../../../src/seed/content.js'
import { perform } from '../../../src/lib/studio/actions/index.js'
import { createOrder } from '../../../src/lib/ordering/create-order.js'
import { termsVersionOf } from '../../../src/lib/payments/consent.js'
import { fakePayload } from './fake-payload.js'
import { shop, pools, cake, local } from './fixtures.js'

const ENV = { PAYLOAD_SECRET: 'a-test-secret', PUBLIC_ORIGIN: 'https://coco.example' }
const counterEnv = { ...ENV, PAYMENT_PROVIDER: 'counter' }
const keys = { publishableKey: 'pk_live_x', secretKey: 'sk_live_x', live: true, chargesEnabled: true }

describe('what a customer can choose', () => {
  test('the server alone: at the counter only, until Stripe is connected', () => {
    const o = resolveOptions({}, counterEnv)
    assert.deepEqual([o.mode, o.counter, o.online, o.connected], ['counter', true, null, false])
  })

  test('Stripe connected: both ways; the owner can then turn either one off', () => {
    assert.equal(resolveOptions(keys, counterEnv).mode, 'both')
    assert.equal(resolveOptions(keys, counterEnv).online, 'stripe')
    assert.equal(resolveOptions({ ...keys, counterEnabled: false }, counterEnv).mode, 'online')
    assert.equal(resolveOptions({ ...keys, onlineEnabled: false }, counterEnv).mode, 'counter')
  })

  test('no card is offered until Stripe has activated the account', () => {
    assert.equal(resolveOptions({ ...keys, chargesEnabled: false }, counterEnv).online, null)
    assert.equal(resolveOptions({ ...keys, chargesEnabled: false }, counterEnv).mode, 'counter')
  })

  test('test keys say so', () => {
    assert.equal(resolveOptions({ ...keys, live: false }, counterEnv).testMode, true)
    assert.equal(resolveOptions(keys, counterEnv).testMode, false)
  })

  test('nothing in the owner’s row and no counter: the environment still decides (development, tests)', () => {
    assert.equal(resolveOptions({}, { PUBLIC_ORIGIN: 'http://localhost:3000' }).mode, 'online')
    assert.equal(resolveOptions({}, { PUBLIC_ORIGIN: 'http://localhost:3000' }).online, 'mock')
  })

  test('the customer’s choice picks the adapter; a way just turned off asks again', () => {
    const both = resolveOptions(keys, counterEnv)
    assert.equal(webProvider(both, 'comptoir'), 'counter')
    assert.equal(webProvider(both, 'en-ligne'), 'stripe')
    assert.equal(webProvider(both, null), 'counter')
    const counter = resolveOptions({}, counterEnv)
    assert.equal(webProvider(counter, 'en-ligne'), null)
    const online = resolveOptions({ ...keys, counterEnabled: false }, counterEnv)
    assert.equal(webProvider(online, 'comptoir'), null)
    assert.equal(webProvider(resolveOptions({ counterEnabled: false }, { PAYMENT_PROVIDER: 'none' }), null), 'none')
  })

  test('a deposit link needs a card to take and a message to carry it', () => {
    const both = resolveOptions(keys, counterEnv)
    assert.equal(quotesByLink(both, { sms: false, email: false }), false)
    assert.equal(quotesByLink(both, { sms: true, email: false }), true)
    assert.equal(quotesByLink(resolveOptions({}, counterEnv), { sms: true, email: true }), false)
  })
})

describe('the keys at rest', () => {
  test('sealed and opened with PAYLOAD_SECRET; another secret or a changed value reads nothing', () => {
    const sealed = sealSecret('sk_live_abc', ENV)
    assert.ok(!sealed.includes('sk_live_abc'))
    assert.equal(openSecret(sealed, ENV), 'sk_live_abc')
    assert.equal(openSecret(sealed, { PAYLOAD_SECRET: 'another' }), null)
    assert.equal(openSecret(`${sealed}x`, ENV), null)
    assert.equal(openSecret(null, ENV), null)
    assert.notEqual(sealSecret('sk_live_abc', ENV), sealed, 'a new nonce each time')
  })

  test('Studio only ever shows the start and the end of a key', () => {
    assert.equal(maskKey('sk_live_abcdefghij1234'), 'sk_live_…1234')
    assert.equal(maskKey(null), '')
  })

  test('a row whose key can no longer be read asks to connect again', async () => {
    const payload = fakePayload({ globals: { 'payment-settings': { stripePublishableKey: 'pk_live_x', stripeSecretKey: sealSecret('sk_live_x', { PAYLOAD_SECRET: 'old' }) } } })
    const s = await getPaymentSettings(payload, ENV)
    assert.equal(s.secretKey, null)
    assert.equal(s.unreadable, true)
    assert.equal(resolveOptions(s, counterEnv).online, null)
  })

  test('the webhook secret comes from Studio, else the environment; a bad signature stays refused', async () => {
    const payload = fakePayload({ globals: { 'payment-settings': { stripeWebhookSecret: sealSecret('whsec_studio', ENV) } } })
    assert.equal(await webhookSecret(payload, ENV), 'whsec_studio')
    assert.equal(await webhookSecret(fakePayload(), { ...ENV, STRIPE_WEBHOOK_SECRET: 'whsec_env' }), 'whsec_env')
    assert.equal(await webhookSecret(fakePayload(), ENV), null)
    const body = JSON.stringify({ id: 'evt_1', object: 'event', type: 'payment_intent.succeeded', data: { object: {} } })
    assert.equal(verifyWebhook(body, testSignature(body, 'whsec_studio'), 'whsec_studio').id, 'evt_1')
    assert.throws(() => verifyWebhook(body, testSignature(body, 'whsec_other'), 'whsec_studio'))
  })
})

describe('the two keys the owner pastes', () => {
  test('they must look right and belong to the same mode', () => {
    assert.match(checkKeys('', '').problem, /deux clés/)
    assert.match(checkKeys('sk_live_x', 'sk_live_y').problem, /publiable/)
    assert.match(checkKeys('pk_live_x', 'pk_live_y').problem, /secrète/)
    assert.match(checkKeys('pk_live_x', 'sk_test_y').problem, /même mode/)
    assert.equal(checkKeys(' pk_live_x ', ' sk_live_y ').live, true)
    assert.equal(checkKeys('pk_test_x', 'rk_test_y').live, false)
  })

  test('the webhook address follows the site', () => {
    assert.equal(webhookUrlFor('https://coco.example/'), 'https://coco.example/svc/paiement/webhook/')
  })
})

// The real Stripe SDK against a small stand-in for its API: the calls the connection makes, with what Stripe answers.
describe('connecting Stripe from Studio', () => {
  const owner = { id: 1, role: 'proprietaire', name: 'Proprio', active: true }
  const manager = { id: 3, role: 'gerant', name: 'Gérant', active: true }
  const device = { id: 't', kind: 'telephone' }
  const act = (payload, type, input = {}, user = owner, stepUp = true) => perform(payload, { user, device, stepUp, type, input })
  let server
  let seen
  let account
  let endpoints
  const saved = {}

  before(async () => {
    server = createServer((req, res) => {
      let body = ''
      req.on('data', (d) => (body += d))
      req.on('end', () => {
        const path = req.url.split('?')[0]
        seen.push(`${req.method} ${path}`)
        const send = (status, json) => {
          res.writeHead(status, { 'content-type': 'application/json', 'request-id': 'req_test' })
          res.end(JSON.stringify(json))
        }
        if ((req.headers.authorization || '').includes('sk_live_refused')) return send(401, { error: { type: 'invalid_request_error', message: 'Invalid API Key provided' } })
        if (path === '/v1/account') return send(200, account)
        if (path === '/v1/refunds') return send(200, { id: 're_1', object: 'refund', status: 'succeeded', amount: Number(new URLSearchParams(body).get('amount')) })
        if (path === '/v1/webhook_endpoints' && req.method === 'GET') return send(200, { object: 'list', data: endpoints, has_more: false })
        if (path === '/v1/webhook_endpoints' && req.method === 'POST') {
          const url = new URLSearchParams(body).get('url')
          const made = { id: `we_${endpoints.length + 1}`, object: 'webhook_endpoint', url, status: 'enabled', secret: 'whsec_made', metadata: { site: 'coco-vanille' } }
          endpoints.push(made)
          return send(200, made)
        }
        const m = path.match(/^\/v1\/webhook_endpoints\/(.+)$/)
        if (m) {
          const found = endpoints.find((e) => e.id === m[1])
          if (!found) return send(404, { error: { type: 'invalid_request_error', message: 'No such webhook endpoint' } })
          if (req.method === 'DELETE') {
            endpoints = endpoints.filter((e) => e.id !== m[1])
            return send(200, { id: m[1], deleted: true })
          }
          if (req.method === 'POST') found.url = new URLSearchParams(body).get('url')
          const { secret, ...rest } = found
          return send(200, rest)
        }
        send(404, { error: { type: 'invalid_request_error', message: `no stub for ${path}` } })
      })
    })
    await new Promise((r) => server.listen(0, '127.0.0.1', r))
    for (const k of ['STRIPE_API_BASE', 'PAYLOAD_SECRET', 'PUBLIC_ORIGIN', 'PAYMENT_PROVIDER']) saved[k] = process.env[k]
    process.env.STRIPE_API_BASE = `http://127.0.0.1:${server.address().port}`
    process.env.PAYLOAD_SECRET = ENV.PAYLOAD_SECRET
    process.env.PUBLIC_ORIGIN = ENV.PUBLIC_ORIGIN
    process.env.PAYMENT_PROVIDER = 'counter'
  })
  after(async () => {
    for (const [k, v] of Object.entries(saved)) {
      if (v === undefined) delete process.env[k]
      else process.env[k] = v
    }
    await new Promise((r) => server.close(r))
  })
  beforeEach(() => {
    seen = []
    endpoints = []
    account = { id: 'acct_1', object: 'account', charges_enabled: true, default_currency: 'cad', settings: { dashboard: { display_name: 'Pâtisserie Coco Vanille inc.' } } }
  })
  const options = (payload) => paymentOptions(payload)

  test('checked by Stripe, the webhook made, the keys sealed, both ways offered; nothing secret in the log', async () => {
    const payload = fakePayload()
    const r = await act(payload, 'payment.connect', { publishable: 'pk_live_abc', secret: 'sk_live_secretvalue1234' })
    assert.ok(r.ok, r.message)
    assert.match(r.message, /paiement en ligne est offert/)
    assert.ok(seen.includes('GET /v1/account'))
    assert.ok(seen.includes('POST /v1/webhook_endpoints'))
    assert.equal(endpoints[0].url, 'https://coco.example/svc/paiement/webhook/')
    const settings = await getPaymentSettings(payload)
    assert.equal(settings.secretKey, 'sk_live_secretvalue1234')
    assert.equal(settings.webhookSecret, 'whsec_made')
    assert.equal(settings.accountName, 'Pâtisserie Coco Vanille inc.')
    assert.equal((await options(payload)).mode, 'both')
    const stored = JSON.stringify(await payload.findGlobal({ slug: 'payment-settings' }))
    assert.ok(!stored.includes('sk_live_secretvalue1234'), 'stored sealed')
    assert.ok(!stored.includes('whsec_made'), 'stored sealed')
    const log = JSON.stringify(payload.store['audit-log'] || [])
    assert.ok(!log.includes('secretvalue'), 'not in the audit log')
    assert.match(log, /a connecté Stripe/)
  })

  test('a key Stripe refuses changes nothing, and says so in words', async () => {
    const payload = fakePayload()
    const r = await act(payload, 'payment.connect', { publishable: 'pk_live_abc', secret: 'sk_live_refused' })
    assert.equal(r.ok, false)
    assert.match(r.message, /refuse cette clé/)
    assert.equal((await getPaymentSettings(payload)).secretKey, null)
  })

  test('an account Stripe has not activated: connected, no card offered, until « Vérifier la connexion »', async () => {
    const payload = fakePayload()
    account.charges_enabled = false
    const r = await act(payload, 'payment.connect', { publishable: 'pk_live_abc', secret: 'sk_live_x' })
    assert.ok(r.ok)
    assert.match(r.message, /pas encore activé/)
    assert.equal((await options(payload)).online, null)
    assert.equal((await options(payload)).mode, 'counter')
    const refused = await act(payload, 'payment.methods', { counter: 'true', online: 'true' })
    assert.equal(refused.code, 'charges')
    account.charges_enabled = true
    assert.ok((await act(payload, 'payment.check')).ok)
    assert.equal((await options(payload)).online, 'stripe')
  })

  test('« Vérifier la connexion » moves the webhook when the site moves, and keeps its secret', async () => {
    const payload = fakePayload()
    await act(payload, 'payment.connect', { publishable: 'pk_live_abc', secret: 'sk_live_x' })
    process.env.PUBLIC_ORIGIN = 'https://cocovanillegranby.com'
    try {
      assert.ok((await act(payload, 'payment.check')).ok)
    } finally {
      process.env.PUBLIC_ORIGIN = ENV.PUBLIC_ORIGIN
    }
    assert.equal(endpoints.length, 1)
    assert.equal(endpoints[0].url, 'https://cocovanillegranby.com/svc/paiement/webhook/')
    assert.equal((await getPaymentSettings(payload)).webhookSecret, 'whsec_made')
  })

  test('at least one way stays open; a card needs Stripe', async () => {
    const payload = fakePayload()
    assert.equal((await act(payload, 'payment.methods', {})).code, 'none')
    assert.equal((await act(payload, 'payment.methods', { online: 'true' })).code, 'not_connected')
    await act(payload, 'payment.connect', { publishable: 'pk_live_abc', secret: 'sk_live_x' })
    assert.ok((await act(payload, 'payment.methods', { online: 'true' })).ok)
    assert.equal((await options(payload)).mode, 'online')
    assert.ok((await act(payload, 'payment.methods', { counter: 'true' })).ok)
    assert.equal((await options(payload)).mode, 'counter')
  })

  test('disconnecting removes the webhook and the keys; customers pay at pickup', async () => {
    const payload = fakePayload()
    await act(payload, 'payment.connect', { publishable: 'pk_live_abc', secret: 'sk_live_x' })
    assert.ok((await act(payload, 'payment.disconnect')).ok)
    assert.equal(endpoints.length, 0)
    const settings = await getPaymentSettings(payload)
    assert.equal(settings.secretKey, null)
    assert.equal(settings.publishableKey, null)
    assert.equal((await options(payload)).mode, 'counter')
  })

  test('a card payment is refunded through the Stripe account connected in Studio', async () => {
    const paid = { id: 5, number: 1001, status: 'paid', items: [], customer: {}, timeline: [], totals: { totalCents: 6000 }, payment: { provider: 'stripe', kind: 'full', status: 'paid', reference: 'pi_1', amountCents: 6000 } }
    const payload = fakePayload({ collections: { orders: [paid], messages: [] } })
    await act(payload, 'payment.connect', { publishable: 'pk_live_abc', secret: 'sk_live_x' })
    const r = await act(payload, 'order.refund', { orderId: 5, reason: 'erreur' })
    assert.ok(r.ok, r.message)
    assert.ok(seen.includes('POST /v1/refunds'))
    assert.equal(payload.store.orders[0].status, 'refunded')
  })

  test('owner only, with a confirmation of identity', async () => {
    const payload = fakePayload()
    assert.equal((await act(payload, 'payment.connect', { publishable: 'pk_live_a', secret: 'sk_live_a' }, manager)).status, 403)
    assert.equal((await act(payload, 'payment.methods', { counter: 'true' }, manager)).status, 403)
    assert.equal((await act(payload, 'payment.disconnect', {}, manager)).status, 403)
    assert.equal((await act(payload, 'payment.connect', { publishable: 'pk_live_a', secret: 'sk_live_a' }, owner, false)).code, 'step_up')
    assert.equal((await act(payload, 'payment.methods', { counter: 'true' }, owner, false)).code, 'step_up')
  })

  test('the accepted terms say when a card can be taken online', async () => {
    const payload = fakePayload({ globals: { shop: { ordering: { termsVersion: 'cv-1' } } } })
    assert.equal(await termsVersionOf(payload), 'cv-1')
    await act(payload, 'payment.connect', { publishable: 'pk_live_abc', secret: 'sk_live_x' })
    assert.equal(await termsVersionOf(payload), 'cv-1+paiement-en-ligne')
  })
})

describe('the sentences of the site follow the choice', () => {
  const copyOf = (locale) => JSON.stringify(pages.map((p) => p.locales[locale]).filter(Boolean))

  test('each one is asked by the copy, in both languages, and is never a question in « Faits du site »', () => {
    for (const f of PAYMENT_FACTS) {
      for (const locale of ['fr', 'en']) {
        for (const label of f[locale]) {
          assert.equal(factIdFor(locale, label), f.id)
          assert.ok(copyOf(locale).includes(`[[FACT NEEDED: ${label}]]`), `${locale}: ${label}`)
        }
      }
      assert.ok(!FACTS.some((q) => q.id === f.id))
    }
  })

  test('paying at pickup only: nothing about Stripe; online: Stripe is named where the law asks', () => {
    const counter = [...paymentAnswers('counter', 'fr').values()].join(' ')
    assert.doesNotMatch(counter, /Stripe/)
    for (const mode of ['both', 'online']) {
      for (const locale of ['fr', 'en']) {
        const a = paymentAnswers(mode, locale)
        assert.match(a.get('auto:paiement-fournisseur'), /Stripe/)
        assert.match(a.get('auto:paiement-vie-privee'), /Stripe/)
        assert.match(a.get('auto:paiement-temoins'), /Stripe/)
      }
    }
    assert.match(paymentAnswers('both', 'fr').get('auto:paiement-facon'), /à la cueillette.*en ligne/)
    assert.equal(paymentAnswers('none', 'en').get('auto:paiement-facon'), 'at pickup')
  })
})

describe('a web order takes the way the customer chose', () => {
  const customer = { firstName: 'Julie', phone: '450 555-0101', email: 'julie@exemple.test', language: 'fr' }
  const consent = { terms: true, termsVersion: 'cv-1' }
  const NOW = local('2026-10-27', '10:00')
  const place = (payload, method, extra = {}) => {
    const items = [{ productId: 11, variantIndex: 0, qty: 1 }]
    return createOrder(payload, { source: 'web', locale: 'fr', items, pickup: { date: '2026-10-29', windowStart: '10:15' }, customer, consent, payment: { method }, now: NOW, ...extra })
  }
  const saved = {}
  before(() => {
    for (const k of ['PAYMENT_PROVIDER', 'PAYLOAD_SECRET', 'STRIPE_SECRET_KEY']) saved[k] = process.env[k]
    process.env.PAYMENT_PROVIDER = 'counter'
    process.env.PAYLOAD_SECRET = ENV.PAYLOAD_SECRET
    delete process.env.STRIPE_SECRET_KEY
  })
  after(() => {
    for (const [k, v] of Object.entries(saved)) {
      if (v === undefined) delete process.env[k]
      else process.env[k] = v
    }
    rememberPaymentMode(null)
  })
  const connected = () => ({ stripePublishableKey: 'pk_live_x', stripeSecretKey: sealSecret('sk_live_x', ENV), stripeLive: true, stripeChargesEnabled: true, onlineEnabled: true })
  const world = (settings) => fakePayload({ globals: { shop: shop(), business: {}, 'payment-settings': settings }, collections: { products: [cake()], 'capacity-pools': pools(), orders: [] } })

  test('at the counter: confirmed at once, the amount due at pickup, no email needed', async () => {
    const r = await place(world(connected()), 'comptoir', { customer: { ...customer, email: '' } })
    assert.deepEqual(r.errors, [])
    assert.equal(r.order.status, 'paid')
    assert.equal(r.order.payment.provider, 'counter')
    assert.ok(r.order.totals.balanceCents > 0)
    assert.equal(r.paymentLink, null)
  })

  test('online: held while the customer pays, an email for the receipt, nothing due at pickup', async () => {
    const r = await place(world(connected()), 'en-ligne')
    assert.deepEqual(r.errors, [])
    assert.equal(r.order.status, 'pending_payment')
    assert.equal(r.order.payment.provider, 'stripe')
    assert.equal(r.order.totals.balanceCents, 0)
    assert.ok(r.order.holdExpiresAt)
    assert.match(r.paymentLink, /commande=/)
    const noEmail = await place(world(connected()), 'en-ligne', { customer: { ...customer, email: '' } })
    assert.ok(noEmail.errors.some((e) => e.field === 'email'))
  })

  test('a way the owner just turned off is refused with a clear word, and the page offers the choice again', async () => {
    const r = await place(world({}), 'en-ligne')
    assert.equal(r.order, null)
    assert.deepEqual(r.errors.map((e) => e.code), ['payment_method_unavailable'])
    const off = await place(world({ ...connected(), counterEnabled: false }), 'comptoir')
    assert.deepEqual(off.errors.map((e) => e.code), ['payment_method_unavailable'])
  })

  test('the copy follows the mode the page just read', async () => {
    await paymentOptions(world(connected()))
    assert.equal(paymentMode(), 'both')
    await paymentOptions(world({}))
    assert.equal(paymentMode(), 'counter')
  })
})
