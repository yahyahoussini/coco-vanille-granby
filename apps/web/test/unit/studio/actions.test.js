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

  // One tap posted twice at the same instant (act() and flush() after the call screen): the key is
  // reserved before the action runs, so the second request waits for the first result.
  test('two requests with the same key at the same time: the action runs once', async () => {
    const payload = fakePayload()
    const create = payload.create.bind(payload)
    payload.create = async (args) => {
      if (args.collection === 'questions') await new Promise((r) => setTimeout(r, 50))
      return create(args)
    }
    const tap = () => perform(payload, { user: lea, device, type: 'question.create', input: { text: 'Avez-vous du sans gluten?' }, key: 'twice' })
    const [a, b] = await Promise.all([tap(), tap()])
    assert.ok(a.ok && b.ok)
    assert.equal([a, b].filter((r) => r.replay).length, 1)
    assert.equal(payload.store.questions.length, 1)
    assert.equal(payload.store['audit-log'].length, 1)
    assert.ok(payload.store['audit-log'][0].result.ok)
  })

  test('a refusal frees the key; a crash half-way keeps it, so a replay never runs the action again', async () => {
    const payload = fakePayload()
    const refused = await perform(payload, { user: lea, device, type: 'question.create', input: { text: '' }, key: 'k-r' })
    assert.equal(refused.code, 'text_required')
    assert.equal((payload.store['audit-log'] || []).length, 0)
    assert.ok((await perform(payload, { user: lea, device, type: 'question.create', input: { text: 'Une vraie question' }, key: 'k-r' })).ok)

    const create = payload.create.bind(payload)
    payload.create = async (args) => {
      if (args.collection === 'questions') {
        await create(args)
        throw new Error('texto: réseau')
      }
      return create(args)
    }
    await assert.rejects(perform(payload, { user: lea, device, type: 'question.create', input: { text: 'Question deux' }, key: 'k-x' }))
    payload.create = create
    const replay = await perform(payload, { user: lea, device, type: 'question.create', input: { text: 'Question deux' }, key: 'k-x' })
    assert.equal(replay.ok, false)
    assert.equal(replay.code, 'interrupted')
    assert.equal(payload.store.questions.filter((q) => q.text === 'Question deux').length, 1)
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
