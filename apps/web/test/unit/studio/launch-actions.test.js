// What the owner does after the launch of 2026-11-04: checks or changes an answer, checks prices, edits formats, sets the
// reservation, turns a request into an order, and asks for alerts.
import { test, describe, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { fakePayload } from '../ordering/fake-payload.js'
import { perform, undo } from '../../../src/lib/studio/actions/index.js'
import { vapidKeys, pushToTeam } from '../../../src/lib/studio/push.js'
import { PROPOSALS } from '../../../src/lib/facts-proposals.js'
import { confirmed } from './launch-helpers.js'

const owner = { id: 1, role: 'proprietaire', name: 'Proprio', active: true }
const manager = { id: 3, role: 'gerant', name: 'Gérant', active: true }
const lea = { id: 2, role: 'comptoir', name: 'Léa', active: true }
const device = { id: 't', kind: 'telephone' }
const act = (payload, type, input, user = owner, stepUp = true) => perform(payload, { user, device, stepUp, type, input })

describe('« Faits du site »', () => {
  let payload
  beforeEach(() => {
    payload = fakePayload({ collections: { 'site-facts': [{ id: 5, key: 'places', ...PROPOSALS.places, proposed: true }] } })
  })
  const row = () => payload.store['site-facts'].find((d) => d.key === 'places')

  test('« C’est bon » keeps the words and records who checked; « Annuler » puts it back to check', async () => {
    const r = await act(payload, 'fact.confirm', { key: 'places' })
    assert.ok(r.ok, r.message)
    assert.equal(row().fr, PROPOSALS.places.fr)
    assert.equal(row().proposed, false)
    assert.equal(row().verifiedBy, owner.id)
    const u = await undo(payload, { user: owner, id: r.undo.id })
    assert.ok(u.ok)
    assert.equal(row().proposed, true)
    assert.equal(row().verifiedBy, null)
  })

  test('nothing to check on a fact with no answer', async () => {
    const r = await act(payload, 'fact.confirm', { key: 'chef-nom' })
    assert.equal(r.code, 'fact_empty')
  })

  test('a new answer counts as checked; the French changed alone: the English stays, flagged', async () => {
    const r = await act(payload, 'fact.answer', { key: 'places', fr: '12 places', en: PROPOSALS.places.en })
    assert.ok(r.ok)
    assert.match(r.message, /version anglaise/)
    assert.deepEqual([row().fr, row().en, row().proposed, row().enReview], ['12 places', PROPOSALS.places.en, false, true])
    await act(payload, 'fact.answer', { key: 'places', fr: '12 places', en: '12 seats' })
    assert.deepEqual([row().en, row().enReview], ['12 seats', false])
  })

  test('an emptied answer brings the proposal back to check; a fact with no proposal goes back to no answer', async () => {
    await act(payload, 'fact.answer', { key: 'places', fr: '12 places', en: '12 seats' })
    const r = await act(payload, 'fact.answer', { key: 'places', fr: '', en: '' })
    assert.match(r.message, /proposition/)
    assert.deepEqual([row().fr, row().en, row().proposed, row().verifiedAt], [PROPOSALS.places.fr, PROPOSALS.places.en, true, null])
    await act(payload, 'fact.answer', { key: 'chef-nom', fr: 'Sam, chef', en: 'Sam, chef' })
    await act(payload, 'fact.answer', { key: 'chef-nom', fr: '', en: '' })
    const chef = payload.store['site-facts'].find((d) => d.key === 'chef-nom')
    assert.deepEqual([chef.fr, chef.proposed], [null, false])
  })

  test('the counter cannot check an answer', async () => {
    assert.equal((await act(payload, 'fact.confirm', { key: 'places' }, lea)).code, 'forbidden')
  })
})

describe('Produits', () => {
  const product = (over = {}) => ({ id: 9, title: 'Gâteau', slug: 'gateau', _status: 'published', taxClass: 'zero', priceEstimated: true, availability: 'instock', variants: [{ id: 'a', label: '6 po', sizeInches: 6, portionsMin: 6, portionsMax: 8, priceCents: 4500 }, { id: 'b', label: '8 po', sizeInches: 8, portionsMin: 10, portionsMax: 12, priceCents: 6500 }], ...over })
  const setup = (p = product()) => fakePayload({ collections: { products: [p], categories: [{ id: 1, productionCategory: 'gateaux' }] } })
  const saved = (payload) => payload.store.products[0]

  test('« Ces prix sont les bons » needs the identity check, then takes « prix indicatif » off; « Annuler » puts it back', async () => {
    const payload = setup()
    assert.equal((await act(payload, 'product.pricesOk', { productId: 9 }, owner, false)).code, 'step_up')
    assert.equal((await act(payload, 'product.pricesOk', { productId: 9 }, lea)).code, 'forbidden')
    const r = await act(payload, 'product.pricesOk', { productId: 9 })
    assert.ok(r.ok)
    assert.equal(saved(payload).priceEstimated, false)
    await undo(payload, { user: owner, id: r.undo.id })
    assert.equal(saved(payload).priceEstimated, true)
  })

  test('formats: a price changes, a new row joins, a marked row leaves, inches follow the name', async () => {
    const payload = setup()
    const r = await act(payload, 'product.formats', { productId: 9, label: ['6 po', '8 po', '12 po'], labelEn: ['6-inch', '8-inch', '12-inch'], portionsMin: ['6', '10', '20'], portionsMax: ['8', '12', '24'], price: ['47,50', '65', '130'], grams: ['', '', ''], remove: ['1'], checked: 'true' })
    assert.ok(r.ok, r.message)
    const v = saved(payload).variants
    // The fake keeps one label per row, the last written: the English one (Payload keeps each language).
    assert.deepEqual(v.map((x) => [x.label, x.priceCents, x.portionsMin, x.sizeInches]), [['6-inch', 4750, 6, 6], ['12-inch', 13000, 20, 12]])
    assert.equal(saved(payload).priceEstimated, false)
  })

  test('formats: a bad price, no format left, or no weight under the bakery rule are refused and change nothing', async () => {
    const payload = setup()
    assert.equal((await act(payload, 'product.formats', { productId: 9, label: ['6 po'], price: ['beaucoup'] })).code, 'price_invalid')
    assert.equal((await act(payload, 'product.formats', { productId: 9, label: ['6 po'], price: ['45'], remove: ['0'] })).code, 'formats')
    const rule = setup(product({ taxClass: 'rule' }))
    assert.equal((await act(rule, 'product.formats', { productId: 9, label: ['6 po'], price: ['45'], grams: [''] })).code, 'grams')
    assert.equal(saved(payload).variants.length, 2)
  })

  test('« Retirer de la carte » takes it off the site; « Annuler » brings it back', async () => {
    const payload = setup()
    const r = await act(payload, 'product.retire', { productId: 9 })
    assert.equal(saved(payload).availability, 'discontinued')
    await undo(payload, { user: owner, id: r.undo.id })
    assert.equal(saved(payload).availability, 'instock')
  })

  test('a new product needs a name, a family, a format with a price; only the owner sets its tax', async () => {
    const payload = setup()
    const input = { family: 'gateaux', title: 'Tarte test', leadHours: '48', label: ['À l’unité'], labelEn: ['Each'], portionsMin: ['1'], portionsMax: [''], price: ['6,50'], grams: [''], taxClass: 'taxable', online: 'true' }
    assert.equal((await act(payload, 'product.create', { ...input, title: '' })).code, 'title')
    assert.equal((await act(payload, 'product.create', { ...input, family: 'x' })).code, 'family')
    assert.equal((await act(payload, 'product.create', { ...input, price: [''] })).code, 'price_invalid')
    const r = await act(payload, 'product.create', input)
    assert.ok(r.ok, r.message)
    assert.match(r.data.redirect, /^\/plus\/produits\/\d+\/$/)
    const made = payload.store.products.at(-1)
    assert.deepEqual([made.slug, made.taxClass, made.priceEstimated, made.onlineOrderable, made._status], ['tarte-test', 'taxable', false, true, 'published'])
    const again = await act(payload, 'product.create', { ...input, title: 'Tarte test' }, manager)
    assert.ok(again.ok)
    const second = payload.store.products.at(-1)
    assert.deepEqual([second.slug, second.taxClass], ['tarte-test-2', 'pending'])
  })
})

describe('Boutique', () => {
  const shop = { hours: [], ordering: { enabled: true, nextDayCutoff: '14:00', windowMinutes: 30, maxPerWindow: 4, maxDaysAhead: 60 } }
  const setup = () => fakePayload({ globals: { shop }, collections: { 'capacity-pools': [{ id: 1, productionCategory: 'gateaux', defaultPerDay: 8 }] } })
  const input = { enabled: 'on', cutoff: '15:00', windowMinutes: '15', maxPerWindow: '3', maxDaysAhead: '45', cap_gateaux: '6' }

  test('the reservation settings and each family’s capacity; « Annuler » restores both', async () => {
    const payload = setup()
    const r = await act(payload, 'shop.ordering', input)
    assert.ok(r.ok, r.message)
    const o = (await payload.findGlobal({ slug: 'shop' })).ordering
    assert.deepEqual([o.enabled, o.nextDayCutoff, o.windowMinutes, o.maxPerWindow, o.maxDaysAhead], [true, '15:00', 15, 3, 45])
    assert.equal(payload.store['capacity-pools'][0].defaultPerDay, 6)
    await undo(payload, { user: owner, id: r.undo.id })
    assert.equal((await payload.findGlobal({ slug: 'shop' })).ordering.nextDayCutoff, '14:00')
    assert.equal(payload.store['capacity-pools'][0].defaultPerDay, 8)
  })

  test('closing it, and refusing a bad setting', async () => {
    const payload = setup()
    assert.ok((await act(payload, 'shop.ordering', { ...input, enabled: undefined })).ok)
    assert.equal((await payload.findGlobal({ slug: 'shop' })).ordering.enabled, false)
    assert.equal((await act(payload, 'shop.ordering', { ...input, cutoff: '25:00' })).code, 'cutoff')
    assert.equal((await act(payload, 'shop.ordering', { ...input, windowMinutes: '20' })).code, 'window')
  })

  test('the Yule log dates', async () => {
    const payload = fakePayload({ collections: { seasons: [{ id: 2, key: 'noel', preorderOpensAt: '2026-11-03T12:00:00.000Z', preorderClosesAt: '2026-12-19T04:59:00.000Z', pickupDates: [] }] } })
    const r = await act(payload, 'shop.season', { key: 'noel', opens: '2026-11-10', closes: '2026-12-15', pickup: ['2026-12-20', '', '2026-12-19'] })
    assert.ok(r.ok, r.message)
    assert.deepEqual(payload.store.seasons[0].pickupDates.map((d) => d.date), ['2026-12-19T12:00:00.000Z', '2026-12-20T12:00:00.000Z'])
    assert.equal((await act(payload, 'shop.season', { key: 'noel', opens: '2026-12-20', closes: '2026-12-15', pickup: ['2026-12-20'] })).code, 'dates')
  })
})

describe('Demandes', () => {
  test('a price agreed by phone makes the order; the screen goes to it', async () => {
    const payload = confirmed()
    const r = await act(payload, 'request.confirm', { requestId: 7, price: '120', taxClass: 'zero' })
    assert.ok(r.ok, r.message)
    assert.match(r.message, /120,00.*à payer à la cueillette/)
    assert.equal(payload.store.requests[0].status, 'confirmed')
    assert.match(r.data.redirect, /^\/commandes\/\d+\/$/)
    assert.equal((await act(payload, 'request.confirm', { requestId: 7, price: '120', taxClass: 'zero' }, lea)).code, 'forbidden')
  })

  test('« Refuser » with no email or text service: noted, and Studio says to call', async () => {
    const before = process.env.SMS_PROVIDER
    process.env.SMS_PROVIDER = 'log'
    try {
      const r = await act(confirmed(), 'request.decline', { requestId: 7, message: 'Désolés, nous sommes complets ce jour-là.' })
      assert.ok(r.ok, r.message)
      assert.match(r.message, /appelez Julie.*aucun courriel ni texto/)
    } finally {
      if (before === undefined) delete process.env.SMS_PROVIDER
      else process.env.SMS_PROVIDER = before
    }
  })
})

describe('alerts', () => {
  test('the key pair comes from the secret: always the same, the size push services expect', () => {
    const a = vapidKeys({ PAYLOAD_SECRET: 'un-secret' })
    assert.deepEqual(a, vapidKeys({ PAYLOAD_SECRET: 'un-secret' }))
    assert.notDeepEqual(a, vapidKeys({ PAYLOAD_SECRET: 'un-autre' }))
    assert.equal(Buffer.from(a.publicKey, 'base64url').length, 65)
    assert.equal(Buffer.from(a.privateKey, 'base64url').length, 32)
    assert.equal(vapidKeys({}), null)
  })

  test('no device, no secret or a failing service: nothing sent, nothing thrown', async () => {
    const payload = fakePayload()
    assert.equal(await pushToTeam(payload, { title: 'x' }, { PAYLOAD_SECRET: 's' }), 0)
    assert.equal(await pushToTeam(payload, { title: 'x' }, {}), 0)
    assert.equal(await pushToTeam({ find: () => Promise.reject(new Error('down')) }, { title: 'x' }, { PAYLOAD_SECRET: 's' }), 0)
  })

  test('a device asks for alerts, once; stops them; the counter may, the agency may not', async () => {
    const payload = fakePayload()
    const input = { endpoint: 'https://fcm.googleapis.com/fcm/send/abc', p256dh: 'k', auth: 'a', label: 'Android' }
    assert.ok((await act(payload, 'push.subscribe', input, lea)).ok)
    assert.ok((await act(payload, 'push.subscribe', input, owner)).ok)
    assert.equal(payload.store['push-subscriptions'].length, 1)
    assert.equal((await act(payload, 'push.subscribe', { ...input, endpoint: 'http://nope' })).code, 'push_invalid')
    assert.equal((await act(payload, 'push.subscribe', input, { id: 4, role: 'agence', name: 'A', active: true })).code, 'forbidden')
    assert.ok((await act(payload, 'push.unsubscribe', { endpoint: input.endpoint })).ok)
    assert.equal(payload.store['push-subscriptions'].length, 0)
  })
})
