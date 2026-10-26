// REST and « Avancé » follow the same matrix as Studio (16 §2.2, 16b §4 #4): orders, requests and messages are
// written server-side only; prices, allergens, taxes, the deposit and people need the owner or manager and a
// fresh step-up; Comptoir never writes over REST; the agency never reads pickup codes or the history.
import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { Products, Categories } from '../../../src/collections/Catalog.js'
import { Orders } from '../../../src/collections/Orders.js'
import { Requests } from '../../../src/collections/Requests.js'
import { Messages } from '../../../src/collections/Messages.js'
import { Users } from '../../../src/collections/Users.js'
import { Media } from '../../../src/collections/Media.js'
import { Shop, globals } from '../../../src/globals/index.js'
import { stepUpValue, STEPUP_COOKIE } from '../../../src/lib/studio/stepup.js'
import { enqueueMessage, kindOf } from '../../../src/lib/messaging/queue.js'
import { fakePayload } from '../ordering/fake-payload.js'

const payload = { secret: 'test-secret' }
const people = {
  owner: { id: 1, role: 'proprietaire', name: 'Proprio' },
  manager: { id: 2, role: 'gerant', name: 'Marc' },
  counter: { id: 3, role: 'comptoir', name: 'Léa' },
  agency: { id: 4, role: 'agence', name: 'Agence' },
}
const reqFor = (user, { stepUp = false, now = Date.now() } = {}) => {
  const cookie = stepUp ? `${STEPUP_COOKIE}=${encodeURIComponent(stepUpValue(payload, user, now))}` : ''
  return { user, payload, headers: new Headers(cookie ? { cookie } : {}) }
}
const field = (fields, path) => {
  const [head, ...rest] = path.split('.')
  const f = fields.find((x) => x.name === head)
  return rest.length ? field(f.fields, rest.join('.')) : f
}
const allow = (fn, user, opts = {}, extra = {}) => Boolean(fn({ req: reqFor(user, opts), ...extra }))

describe('orders, requests and messages: server code only', () => {
  for (const [name, c] of [['orders', Orders], ['requests', Requests], ['messages', Messages]]) {
    test(`${name}: no role creates or updates over REST`, () => {
      for (const user of Object.values(people)) {
        assert.equal(allow(c.access.create, user, { stepUp: true }), false, `${name} create ${user.role}`)
        assert.equal(allow(c.access.update, user, { stepUp: true }), false, `${name} update ${user.role}`)
      }
    })
  }

  test('orders and requests are audit-logged when written with a person', () => {
    for (const c of [Orders, Requests, Products]) assert.ok(c.hooks?.afterChange?.length, c.slug)
  })

  test('the agency reads no pickup code, cake message, history, consent or box token', () => {
    for (const path of ['pickupCode', 'timeline', 'consent', 'boxToken', 'items.message', 'customer', 'allergyNote', 'accessToken']) {
      const read = field(Orders.fields, path).access?.read
      assert.ok(read, path)
      assert.equal(allow(read, people.agency), false, path)
      assert.equal(allow(read, people.counter), true, path)
    }
  })

  test('the message kind comes from the template, never from the caller', async () => {
    assert.equal(kindOf('order_ready'), 'transactional')
    assert.equal(kindOf('promo-automne'), 'commercial')
    const fake = fakePayload()
    const m = await enqueueMessage(fake, { channel: 'sms', template: 'pay-here', kind: 'transactional', to: '+15145550000', body: 'x' })
    assert.equal(m.kind, 'commercial')
  })
})

describe('products', () => {
  test('Comptoir does not write products, categories or media over REST (Studio does it server-side)', () => {
    for (const fn of [Products.access.update, Categories.access.update, Media.access.create, Media.access.update, Media.access.delete]) assert.equal(allow(fn, people.counter), false)
    assert.equal(allow(Products.access.update, people.agency), true, 'the agency still edits the copy')
  })

  test('allergens and prices: owner or manager, with a fresh step-up', () => {
    for (const path of ['allergens', 'mayContain', 'variants.priceCents']) {
      const f = field(Products.fields, path)
      for (const op of ['create', 'update']) {
        assert.equal(allow(f.access[op], people.manager), false, `${path} ${op} without step-up`)
        assert.equal(allow(f.access[op], people.manager, { stepUp: true }), true, `${path} ${op} with step-up`)
        assert.equal(allow(f.access[op], people.agency, { stepUp: true }), false, `${path} ${op} agency`)
        assert.equal(allow(f.access[op], people.counter, { stepUp: true }), false, `${path} ${op} counter`)
      }
    }
  })

  test('a step-up proof is for one person and five minutes only', () => {
    const f = field(Products.fields, 'allergens').access.update
    const theirs = reqFor(people.owner, { stepUp: true })
    assert.equal(Boolean(f({ req: { ...theirs, user: people.manager } })), false, 'another person’s cookie')
    assert.equal(allow(f, people.manager, { stepUp: true, now: Date.now() - 6 * 60 * 1000 }), false, 'expired')
  })

  test('tax class: the owner with a step-up; « vérifié par » is never written by a client', () => {
    const tax = field(Products.fields, 'taxClass').access.update
    assert.equal(allow(tax, people.manager, { stepUp: true }), false)
    assert.equal(allow(tax, people.owner), false)
    assert.equal(allow(tax, people.owner, { stepUp: true }), true)
    const verified = field(Products.fields, 'allergensVerified').access
    for (const user of Object.values(people)) for (const op of ['create', 'update']) assert.equal(allow(verified[op], user, { stepUp: true }), false)
  })

  test('availability over REST: owner and manager only', () => {
    for (const path of ['availability', 'soldOutUntil', 'vitrine', 'onlineOrderable']) {
      const f = field(Products.fields, path).access.update
      assert.equal(allow(f, people.agency), false, path)
      assert.equal(allow(f, people.manager), true, path)
    }
  })

  test('changing the allergen lists stamps « vérifié par » with the session’s person', () => {
    const [stamp] = Products.hooks.beforeChange
    const req = reqFor(people.manager)
    const data = stamp({ data: { allergens: [10, 11], allergensVerified: { by: 1, at: '2020-01-01' } }, originalDoc: { allergens: [{ id: 10 }] }, req, operation: 'update' })
    assert.equal(data.allergensVerified.by, 2)
    assert.notEqual(data.allergensVerified.at, '2020-01-01')
    const same = stamp({ data: { allergens: [10], title: 'x' }, originalDoc: { allergens: [{ id: 10 }], allergensVerified: { by: 1 } }, req, operation: 'update' })
    assert.equal(same.allergensVerified, undefined, 'no change, no new stamp')
  })
})

describe('shop and business', () => {
  test('Comptoir does not close the shop or change the hours over REST', () => {
    assert.equal(allow(Shop.access.update, people.counter), false)
    assert.equal(allow(Shop.access.update, people.agency), false)
    assert.equal(allow(Shop.access.update, people.manager), true)
    for (const g of globals) assert.ok(g.hooks.afterChange.length >= 2, `${g.slug}: audit + revalidation`)
  })

  test('the deposit %: the owner, with a step-up', () => {
    const f = field(Shop.fields, 'ordering.depositPercent').access.update
    assert.equal(allow(f, people.owner), false)
    assert.equal(allow(f, people.manager, { stepUp: true }), false)
    assert.equal(allow(f, people.owner, { stepUp: true }), true)
  })
})

describe('users', () => {
  test('a new account needs the owner and a step-up (a tablet session is not enough)', () => {
    assert.equal(allow(Users.access.create, people.owner), false)
    assert.equal(allow(Users.access.create, people.manager, { stepUp: true }), false)
    assert.equal(allow(Users.access.create, people.owner, { stepUp: true }), true)
  })

  test('role and active: owner with a step-up; a password change needs the step-up too', () => {
    for (const name of ['role', 'active']) {
      const f = field(Users.fields, name).access.update
      assert.equal(allow(f, people.owner), false, name)
      assert.equal(allow(f, people.owner, { stepUp: true }), true, name)
    }
    assert.equal(allow(Users.access.update, people.owner, {}, { data: { password: 'nouveau-mot-de-passe' } }), false)
    assert.equal(allow(Users.access.update, people.owner, { stepUp: true }, { data: { password: 'nouveau-mot-de-passe' } }), true)
    assert.equal(allow(Users.access.update, people.owner, {}, { data: { name: 'Proprio' } }), true)
    assert.deepEqual(Users.access.update({ req: reqFor(people.manager), data: { uiLanguage: 'en' } }), { id: { equals: 2 } })
  })
})
