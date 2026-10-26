// Boutique & heures (16 §3.6, F8–F10): closure plan and effects, textos after the 60 s grace and « Annuler »,
// busy mode, special days, hours validation, capacity ±. Placeholder hours only.
import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { fakePayload } from '../ordering/fake-payload.js'
import { closurePlan, affectedOrders } from '../../../src/lib/studio/closure.js'
import { perform, undo } from '../../../src/lib/studio/actions/index.js'
import { statusLine, shopBanners } from '../../../src/lib/studio/shop.js'

const hours = ['Thursday', 'Friday', 'Saturday'].map((day) => ({ day, opens: '09:00', closes: day === 'Saturday' ? '15:00' : '16:30' }))
const shop = (over = {}) => ({ hours, specialDays: [], closure: { active: false }, busy: { extraMinutes: 0 }, onlinePause: { active: false }, ...over })
const fri = new Date('2026-10-30T10:00:00-04:00') // Friday 10 h
const owner = { id: 1, role: 'proprietaire', name: 'Proprio', active: true }
const lea = { id: 2, role: 'comptoir', name: 'Léa', active: true }
const order = (id, iso, start, extra = {}) => ({ id, number: 1000 + id, status: 'paid', locale: 'fr', customer: { firstName: 'C', phone: `+1514555${String(id).padStart(4, '0')}` }, pickupDate: `${iso}T12:00:00.000Z`, pickupWindowStart: start, pickupWindowEnd: start.replace(/:00$/, ':15'), ...extra })

describe('closure plan', () => {
  test('« Reste de la journée »: closure until the next opening (Saturday 9 h)', () => {
    const p = closurePlan(shop(), 'jour', { now: fri })
    assert.equal(p.mode, 'closure')
    assert.equal(p.until.toISOString(), new Date('2026-10-31T09:00:00-04:00').toISOString())
  })
  test('« Demain »: tomorrow as a closed special day, today stays open; back Thursday', () => {
    const p = closurePlan(shop(), 'demain', { now: fri })
    assert.equal(p.mode, 'special')
    assert.equal(p.firstDay, '2026-10-31')
    assert.equal(p.until.toISOString(), new Date('2026-11-05T09:00:00-05:00').toISOString())
  })
  test('« Jusqu’au… » needs a date, not in the past', () => {
    assert.equal(closurePlan(shop(), 'jusqua', { now: fri }).error, 'date_required')
    assert.equal(closurePlan(shop(), 'jusqua', { now: fri, date: '2026-10-01' }).error, 'date_past')
  })
  test('affected: paid or ready orders of the closed days whose window is still ahead', () => {
    const p = closurePlan(shop(), 'jour', { now: fri })
    const list = [order(1, '2026-10-30', '09:00'), order(2, '2026-10-30', '11:00'), order(3, '2026-10-30', '12:00', { status: 'picked_up' }), order(4, '2026-10-31', '10:00')]
    assert.deepEqual(affectedOrders(list, p, fri).map((o) => o.id), [2])
  })
})

describe('closure action', () => {
  const setup = () =>
    fakePayload({
      globals: { shop: shop(), business: { name: 'Pâtisserie Coco Vanille', phoneDisplay: '450-372-7177' } },
      collections: { orders: [order(1, '2026-10-31', '10:00'), order(2, '2026-10-31', '11:00', { customer: { firstName: 'Sans tel' } }), order(3, '2026-11-05', '10:00')] },
    })

  test('Comptoir cannot close unless the owner allows it', async () => {
    const payload = setup()
    assert.equal((await perform(payload, { user: lea, type: 'shop.closure', input: { reason: 'tempete', duree: 'demain' }, now: fri })).status, 403)
    const allowed = await perform(payload, { user: { ...lea, mayClose: true }, type: 'shop.closure', input: { reason: 'tempete', duree: 'demain' }, now: fri })
    assert.ok(allowed.ok, allowed.message)
  })

  test('T4 storm tomorrow: Saturday closed, texto to the customer with a phone, 60 s grace, « Annuler » restores', async () => {
    const payload = setup()
    const r = await perform(payload, { user: owner, type: 'shop.closure', input: { reason: 'tempete', duree: 'demain' }, now: fri })
    assert.ok(r.ok, r.message)
    const sat = (await payload.findGlobal({ slug: 'shop' })).specialDays.find((d) => d.date.startsWith('2026-10-31'))
    assert.equal(sat.state, 'closed')
    assert.equal(payload.store.messages.length, 1)
    const sms = payload.store.messages[0]
    assert.equal(sms.template, 'closure')
    assert.match(sms.body, /^Coco Vanille : fermé le sam\. 31 oct\. Commande 1001 : appelez le 450-372-7177/)
    assert.ok(new Date(sms.sendAfter).getTime() - fri.getTime() >= 60_000)
    assert.match(r.message, /les textos partent dans 60 s/)
    const u = await undo(payload, { user: owner, id: r.undo.id, now: new Date(fri.getTime() + 30_000) })
    assert.ok(u.ok, u.message)
    assert.equal(payload.store.messages[0].status, 'cancelled')
    assert.equal((await payload.findGlobal({ slug: 'shop' })).specialDays.length, 0)
  })

  test('« Reste de la journée » switches the closure on, the status line says so', async () => {
    const payload = setup()
    const r = await perform(payload, { user: owner, type: 'shop.closure', input: { reason: 'maladie', duree: 'jour' }, now: fri })
    assert.ok(r.ok)
    const s = await payload.findGlobal({ slug: 'shop' })
    assert.equal(s.closure.active, true)
    assert.match(statusLine(s, fri).text, /^Fermeture exceptionnelle jusqu’à demain 9 h/)
    assert.equal(shopBanners(s, fri)[0].action, 'shop.reopen')
  })
})

describe('busy mode, special days, hours, capacity', () => {
  test('« Délai allongé +1 h jusqu’à la fermeture » and back', async () => {
    const payload = fakePayload({ globals: { shop: shop() } })
    const r = await perform(payload, { user: lea, type: 'shop.busy', input: { minutes: '60', until: 'fermeture' }, now: fri })
    assert.ok(r.ok, r.message)
    const s = await payload.findGlobal({ slug: 'shop' })
    assert.equal(s.busy.extraMinutes, 60)
    assert.equal(s.busy.until, new Date('2026-10-30T16:30:00-04:00').toISOString())
    assert.match(shopBanners(s, fri)[0].text, /^Délai allongé de 1 h jusqu’à 16 h 30/)
    await undo(payload, { user: lea, id: r.undo.id, now: fri })
    assert.equal((await payload.findGlobal({ slug: 'shop' })).busy.extraMinutes, 0)
  })

  test('a holiday « à confirmer » becomes Fermé with one tap; Comptoir cannot', async () => {
    const payload = fakePayload({ globals: { shop: shop() } })
    assert.equal((await perform(payload, { user: lea, type: 'shop.special', input: { date: '2026-12-25', state: 'closed' }, now: fri })).status, 403)
    const r = await perform(payload, { user: owner, type: 'shop.special', input: { date: '2026-12-25', state: 'closed', label: 'Noël' }, now: fri })
    assert.ok(r.ok)
    assert.deepEqual((await payload.findGlobal({ slug: 'shop' })).specialDays.map((d) => [d.date.slice(0, 10), d.state, d.label]), [['2026-12-25', 'closed', 'Noël']])
  })

  test('hours: opening must come before closing', async () => {
    const payload = fakePayload({ globals: { shop: shop() } })
    const bad = await perform(payload, { user: owner, type: 'shop.hours', input: { open_Monday: 'on', opens_Monday: '16:00', closes_Monday: '09:00' }, now: fri })
    assert.equal(bad.code, 'hours_invalid')
    const ok = await perform(payload, { user: owner, type: 'shop.hours', input: { open_Monday: 'on', opens_Monday: '08:00', closes_Monday: '12:00' }, now: fri })
    assert.ok(ok.ok)
    assert.deepEqual((await payload.findGlobal({ slug: 'shop' })).hours, [{ day: 'Monday', opens: '08:00', closes: '12:00' }])
  })

  test('capacity ± writes a date override; no default set → refused, never invented', async () => {
    const payload = fakePayload({ collections: { 'capacity-pools': [{ id: 1, productionCategory: 'gateaux', defaultPerDay: 6, overrides: [] }, { id: 2, productionCategory: 'pains', defaultPerDay: null, overrides: [] }] } })
    const r = await perform(payload, { user: owner, type: 'capacity.adjust', input: { category: 'gateaux', date: '2026-10-31', delta: '1' }, now: fri })
    assert.ok(r.ok)
    assert.equal(payload.store['capacity-pools'][0].overrides[0].capacity, 7)
    const none = await perform(payload, { user: owner, type: 'capacity.adjust', input: { category: 'pains', date: '2026-10-31', delta: '1' }, now: fri })
    assert.equal(none.code, 'capacity_missing')
  })
})

describe('public closure notice (FR/EN/ES)', async () => {
  const { closureNotice } = await import('../../../src/lib/studio/closure.js')
  test('active closure: when it reopens, in each language', () => {
    const s = shop({ closure: { active: true, until: new Date('2026-10-31T09:00:00-04:00').toISOString() } })
    assert.equal(closureNotice(s, 'fr', fri).text, 'Fermeture exceptionnelle : la boutique rouvre le samedi 31 octobre à 9 h.')
    assert.match(closureNotice(s, 'en', fri).text, /^Temporarily closed: the shop reopens on Saturday, October 31 at 9/)
    assert.equal(closureNotice(s, 'es', fri).text, 'Cierre excepcional: la tienda reabre el sábado, 31 de octubre a las 09:00.')
  })
  test('« Demain » closure: the closed day within a week; nothing otherwise', () => {
    const s = shop({ specialDays: [{ date: '2026-10-31T12:00:00.000Z', state: 'closed', label: 'Fermeture exceptionnelle' }] })
    assert.equal(closureNotice(s, 'fr', fri).text, 'Fermeture exceptionnelle le samedi 31 octobre.')
    assert.equal(closureNotice(shop(), 'fr', fri), null)
  })
})
