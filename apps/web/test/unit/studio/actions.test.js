// The Studio action engine: role guard first, step-up, idempotent replays (offline outbox), audit log with
// before/after, and « Annuler » inside the window only.
import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { fakePayload } from '../ordering/fake-payload.js'
import { perform, undo, UNDO_SECONDS } from '../../../src/lib/studio/actions/index.js'

const owner = { id: 1, role: 'proprietaire', name: 'Proprio', active: true }
const lea = { id: 2, role: 'comptoir', name: 'Léa', active: true }
const device = { id: 'tab1', kind: 'tablette', shared: true }

describe('perform', () => {
  test('a refused role changes nothing and writes nothing', async () => {
    const payload = fakePayload()
    const r = await perform(payload, { user: lea, device, type: 'order.refund', input: { orderId: 9 } })
    assert.equal(r.ok, false)
    assert.equal(r.status, 403)
    assert.equal((payload.store['audit-log'] || []).length, 0)
  })

  test('step-up actions need the fresh check', async () => {
    const payload = fakePayload({ collections: { users: [{ ...lea }] } })
    const r = await perform(payload, { user: owner, device, type: 'users.pin', input: { userId: 2, pin: '1234' } })
    assert.equal(r.code, 'step_up')
    const ok = await perform(payload, { user: owner, device, stepUp: true, type: 'users.pin', input: { userId: 2, pin: '1234' } })
    assert.ok(ok.ok)
    assert.match(payload.store.users[0].pinHash, /^scrypt\$/)
    const entry = payload.store['audit-log'].at(-1)
    assert.ok(!JSON.stringify(entry).includes('1234'), 'the PIN never reaches the log')
  })

  test('every change is logged with person, device, before, after and a French sentence', async () => {
    const payload = fakePayload()
    const now = new Date('2026-10-31T14:42:00Z')
    const r = await perform(payload, { user: lea, device, ip: '10.0.0.5', type: 'question.create', input: { text: 'Avez-vous des gâteaux sans lactose?', language: 'fr' }, key: 'k-1', now })
    assert.ok(r.ok)
    const [entry] = payload.store['audit-log']
    assert.equal(entry.actor, 2)
    assert.equal(entry.device, 'tablette · tab1')
    assert.equal(entry.ip, '10.0.0.5')
    assert.equal(entry.action, 'question.create')
    assert.equal(entry.after.text, 'Avez-vous des gâteaux sans lactose?')
    assert.match(entry.summary, /^Léa \(tablette\) a noté une question de client à 10 h 42$/)
    assert.equal(new Date(entry.undoUntil).getTime() - now.getTime(), UNDO_SECONDS * 1000)
  })

  test('the same idempotency key never applies twice', async () => {
    const payload = fakePayload()
    const a = await perform(payload, { user: lea, device, type: 'question.create', input: { text: 'Question une' }, key: 'same' })
    const b = await perform(payload, { user: lea, device, type: 'question.create', input: { text: 'Question une' }, key: 'same' })
    assert.ok(a.ok && b.ok)
    assert.equal(b.replay, true)
    assert.equal(payload.store.questions.length, 1)
    assert.equal(payload.store['audit-log'].length, 1)
  })
})

describe('undo', () => {
  test('inside the window: reverted and logged; twice: harmless', async () => {
    const payload = fakePayload()
    const r = await perform(payload, { user: lea, device, type: 'question.create', input: { text: 'Une question' } })
    const u = await undo(payload, { user: lea, device, id: r.undo.id })
    assert.ok(u.ok)
    assert.equal(payload.store.questions.length, 0)
    assert.ok(payload.store['audit-log'][0].undoneAt)
    assert.equal(payload.store['audit-log'][1].action, 'question.create.undo')
    const again = await undo(payload, { user: lea, device, id: r.undo.id })
    assert.equal(again.replay, true)
  })

  test('too late, or someone else: refused', async () => {
    const payload = fakePayload()
    const r = await perform(payload, { user: lea, device, type: 'question.create', input: { text: 'Une question' } })
    const other = await undo(payload, { user: { id: 7, role: 'comptoir', name: 'Marc' }, id: r.undo.id })
    assert.equal(other.status, 403)
    const late = await undo(payload, { user: lea, id: r.undo.id, now: new Date(Date.now() + (UNDO_SECONDS + 5) * 1000) })
    assert.equal(late.code, 'undo_late')
    assert.equal(payload.store.questions.length, 1)
  })
})
