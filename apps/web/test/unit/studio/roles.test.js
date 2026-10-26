// 16 §2.2 access matrix, enforced server-side: the same rules drive the tabs, the screens and every action.
import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { can, canSee, tabsFor, needsStepUp, redactOrder, redactRequest, homeFor, ACTIONS, OFFLINE_OK, PIN_ROLES } from '../../../src/lib/studio/roles.js'

const u = (role, extra = {}) => ({ id: role, role, name: role, active: true, ...extra })
const owner = u('proprietaire')
const manager = u('gerant')
const counter = u('comptoir')
const agency = u('agence')

describe('access matrix (16 §2.2)', () => {
  test('Comptoir cannot cancel, refund, or change prices, allergens or taxes', () => {
    for (const a of ['order.cancel', 'order.refund', 'product.price', 'product.allergens', 'product.tax', 'settings.deposit', 'request.quote', 'shop.hours', 'shop.pause', 'capacity.adjust']) {
      assert.equal(can(counter, a), false, a)
    }
  })

  test('Comptoir does the counter jobs', () => {
    for (const a of ['order.ready', 'order.pickup', 'order.bulkReady', 'order.phone', 'product.soldout', 'product.restock', 'vitrine.photo', 'shop.busy', 'question.create']) assert.ok(can(counter, a), a)
  })

  test('only the owner refunds, changes taxes, the deposit % and people', () => {
    for (const a of ['order.refund', 'product.tax', 'settings.deposit', 'users.create', 'users.pin', 'product.soldoutIndefinite']) {
      assert.ok(can(owner, a), a)
      assert.equal(can(manager, a), false, `gérant ${a}`)
    }
    assert.ok(can(manager, 'order.cancel'))
    assert.ok(can(manager, 'product.price'))
  })

  test('Fermeture for Comptoir only when the owner allows it', () => {
    assert.equal(can(counter, 'shop.closure'), false)
    assert.ok(can(u('comptoir', { mayClose: true }), 'shop.closure'))
    assert.ok(can(owner, 'shop.closure'))
  })

  test('Agence acts on nothing in the shop', () => {
    for (const a of Object.keys(ACTIONS)) {
      if (['question.create', 'device.mode'].includes(a)) continue
      assert.equal(can(agency, a), false, a)
    }
  })

  test('inactive or unknown roles can do nothing', () => {
    assert.equal(can(u('comptoir', { active: false }), 'order.ready'), false)
    assert.equal(can(u('integration'), 'order.ready'), false)
    assert.equal(can(null, 'order.ready'), false)
    assert.equal(canSee(u('integration'), 'plus'), false)
  })

  test('screens: Comptoir has no Demandes, Avis or Cette semaine; Agence no Aujourd’hui', () => {
    assert.equal(canSee(counter, 'demandes'), false)
    assert.equal(canSee(counter, 'avis'), false)
    assert.equal(canSee(counter, 'semaine'), false)
    assert.equal(canSee(agency, 'aujourdhui'), false)
    assert.ok(canSee(agency, 'agence'))
    assert.ok(canSee(owner, 'agence'))
  })

  test('step-up for money, prices, allergens, taxes and people', () => {
    for (const a of ['order.refund', 'product.price', 'product.allergens', 'product.tax', 'users.pin']) assert.ok(needsStepUp(a), a)
    assert.equal(needsStepUp('order.ready'), false)
  })

  test('offline policy: quotes, refunds, closure and hours never wait in the outbox', () => {
    for (const a of ['request.quote', 'order.refund', 'shop.closure', 'shop.hours', 'shop.pause', 'shop.busy']) assert.equal(OFFLINE_OK.has(a), false, a)
    for (const a of ['product.soldout', 'order.ready', 'order.pickup', 'vitrine.photo', 'question.create']) assert.ok(OFFLINE_OK.has(a), a)
  })
})

describe('tab bar per role (16 §2.1)', () => {
  const keys = (user) => tabsFor(user).map((t) => t.key)
  test('Comptoir: Aujourd’hui · Commandes · Vitrine · Plus', () => assert.deepEqual(keys(counter), ['aujourdhui', 'commandes', 'vitrine', 'plus']))
  test('Propriétaire: Aujourd’hui · Commandes · Demandes · Avis · Plus', () => assert.deepEqual(keys(owner), ['aujourdhui', 'commandes', 'demandes', 'avis', 'plus']))
  test('the first two tabs are the same for every bakery role', () => {
    for (const user of [owner, manager, counter]) assert.deepEqual(keys(user).slice(0, 2), ['aujourdhui', 'commandes'])
  })
  test('never more than 5 tabs', () => {
    for (const user of [owner, manager, counter, agency, u('traduction')]) assert.ok(tabsFor(user).length <= 5)
  })
  test('the tablet PIN is for staff; the owner never signs in with one (decision 4)', () => {
    assert.deepEqual(PIN_ROLES, ['gerant', 'comptoir'])
  })
  test('home per role', () => {
    assert.equal(homeFor(counter), '/')
    assert.equal(homeFor(agency), '/agence/')
  })
})

describe('Agence sees no customer names or phones (Loi 25)', () => {
  const order = { id: 1, number: 1042, customer: { firstName: 'Julie', phone: '+15145550000' }, allergyNote: 'noix', pickupCode: '4821', accessToken: 't', totals: { totalCents: 4800 }, timeline: [{ note: 'Annulée : client a rappelé' }], items: [{ title: 'Gâteau', qty: 1, message: 'Bonne fête Julie' }] }
  test('redacted for Agence', () => {
    const r = redactOrder(order, agency)
    assert.equal(r.customer, null)
    assert.equal(r.pickupCode, null)
    assert.equal(r.allergyNote, null)
    assert.equal(r.timeline, null)
    assert.equal(r.items[0].message, null)
    assert.equal(r.items[0].qty, 1)
    assert.equal(r.hasAllergy, true)
    assert.equal(r.totals.totalCents, 4800)
  })
  test('kept for the counter', () => assert.equal(redactOrder(order, counter).customer.firstName, 'Julie'))
  test('requests: only owner and manager see the customer', () => {
    const req = { id: 3, customer: { firstName: 'Mark' }, photos: [1] }
    assert.equal(redactRequest(req, counter).customer, null)
    assert.equal(redactRequest(req, manager).customer.firstName, 'Mark')
  })
})
