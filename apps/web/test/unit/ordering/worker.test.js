// Worker jobs: send after the undo window (sendAfter), retries, holds and quotes expiry, not picked up
// after closing, nightly allergy-note retention; plus the senders (log, MIME, SigV4).
import { test, describe, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { sendDueMessages, expireHolds, expireQuotes, markNotPickedUp, retention, tick, MAX_ATTEMPTS } from '../../../src/worker/tasks.js'
import { smsSender, emailSender, mailFrom } from '../../../src/lib/messaging/senders.js'
import { buildMime } from '../../../src/lib/messaging/mime.js'
import { signRequest } from '../../../src/lib/messaging/sigv4.js'
import { perform } from '../../../src/lib/studio/actions/index.js'
import { fakePayload } from './fake-payload.js'
import { shop, local } from './fixtures.js'

const NOW = local('2026-10-31', '16:00')
const recorder = (fail = false) => {
  const sent = []
  return { sent, sms: { name: 'test', send: async (m) => { if (fail) throw new Error('boom'); sent.push(m); return { providerId: `p${sent.length}` } } }, email: { name: 'test', send: async (m) => { sent.push(m); return { providerId: `e${sent.length}` } } } }
}

let payload
beforeEach(() => {
  payload = fakePayload({ globals: { shop: shop(), business: { phoneDisplay: '450-372-7177' } }, collections: { messages: [], orders: [], requests: [] } })
})

describe('message sending', () => {
  test('only after sendAfter; sent once; the order records its contract copy', async () => {
    payload.store.orders.push({ id: 1, status: 'paid' })
    payload.store.messages.push(
      { id: 1, channel: 'email', template: 'order_confirmed', to: 'a@example.test', subject: 'S', body: 'B', status: 'queued', order: 1, sendAfter: new Date(NOW.getTime() - 1000).toISOString() },
      { id: 2, channel: 'sms', template: 'order_reminder', to: '+14505550101', body: 'Rappel', status: 'queued', order: 1, sendAfter: new Date(NOW.getTime() + 60e3).toISOString() },
    )
    const s = recorder()
    assert.deepEqual(await sendDueMessages(payload, { now: NOW, senders: s }), { sent: 1, failed: 0, cancelled: 0, retried: 0 })
    assert.equal(payload.store.messages[0].status, 'sent')
    assert.equal(payload.store.messages[0].providerId, 'e1')
    assert.equal(payload.store.messages[1].status, 'queued')
    assert.ok(payload.store.orders[0].contractSentAt)
    assert.equal((await sendDueMessages(payload, { now: NOW, senders: s })).sent, 0)
  })

  test('« Annuler » inside the window: a cancelled message never leaves; follow-ups of a cancelled order are dropped', async () => {
    payload.store.orders.push({ id: 2, status: 'cancelled' })
    payload.store.messages.push(
      { id: 3, channel: 'sms', template: 'order_ready', to: '+1', body: 'x', status: 'cancelled', sendAfter: NOW.toISOString() },
      { id: 4, channel: 'sms', template: 'order_reminder', to: '+1', body: 'x', status: 'queued', order: 2, sendAfter: NOW.toISOString() },
    )
    const s = recorder()
    const r = await sendDueMessages(payload, { now: NOW, senders: s })
    assert.equal(s.sent.length, 0)
    assert.equal(r.cancelled, 1)
    assert.equal(payload.store.messages[1].status, 'cancelled')
  })

  test('a provider error is retried with backoff, then marked failed', async () => {
    payload.store.messages.push({ id: 5, channel: 'sms', template: 'quote_sent', to: '+1', body: 'x', status: 'queued', attempts: 0, sendAfter: NOW.toISOString() })
    const s = recorder(true)
    assert.equal((await sendDueMessages(payload, { now: NOW, senders: s })).retried, 1)
    const m = payload.store.messages[0]
    assert.equal(m.status, 'queued')
    assert.equal(new Date(m.sendAfter).getTime() - NOW.getTime(), 60e3)
    m.attempts = MAX_ATTEMPTS - 1
    m.sendAfter = NOW.toISOString()
    assert.equal((await sendDueMessages(payload, { now: NOW, senders: s })).failed, 1)
    assert.equal(payload.store.messages[0].status, 'failed')
  })

  test('commercial messages are never sent without a checked consent', async () => {
    payload.store.messages.push({ id: 6, channel: 'email', kind: 'commercial', template: 'promo', to: 'a@example.test', body: 'x', status: 'queued', sendAfter: NOW.toISOString() })
    const s = recorder()
    await sendDueMessages(payload, { now: NOW, senders: s })
    assert.equal(s.sent.length, 0)
  })
})

describe('expiry and pickup jobs', () => {
  test('holds past 10 minutes are cancelled; live ones stay', async () => {
    payload.store.orders.push({ id: 1, status: 'pending_payment', holdExpiresAt: new Date(NOW.getTime() - 1).toISOString() }, { id: 2, status: 'pending_payment', holdExpiresAt: new Date(NOW.getTime() + 60e3).toISOString() })
    assert.equal((await expireHolds(payload, { now: NOW })).holdsExpired, 1)
    assert.deepEqual(payload.store.orders.map((o) => o.status), ['cancelled', 'pending_payment'])
  })

  test('quotes past their validity expire', async () => {
    payload.store.requests.push({ id: 1, status: 'quoted', quote: { validUntil: new Date(NOW.getTime() - 1).toISOString() } }, { id: 2, status: 'quoted', quote: { validUntil: new Date(NOW.getTime() + 1e6).toISOString() } })
    await expireQuotes(payload, { now: NOW })
    assert.deepEqual(payload.store.requests.map((r) => r.status), ['expired', 'quoted'])
  })

  test('not picked up: after closing on the day (Sat closes 15 h), and any earlier day; never before closing', async () => {
    payload.store.orders.push(
      { id: 1, status: 'ready', pickupDate: '2026-10-31T12:00:00.000Z', customer: { phone: '+14505550101' }, number: 1042 },
      { id: 2, status: 'paid', pickupDate: '2026-10-30T12:00:00.000Z', number: 1043 },
      { id: 3, status: 'picked_up', pickupDate: '2026-10-31T12:00:00.000Z' },
    )
    assert.equal((await markNotPickedUp(payload, { now: local('2026-10-31', '14:59') })).notPickedUp, 1)
    assert.equal(payload.store.orders[0].status, 'ready')
    assert.equal((await markNotPickedUp(payload, { now: NOW })).notPickedUp, 1)
    assert.deepEqual(payload.store.orders.map((o) => o.status), ['not_picked_up', 'not_picked_up', 'picked_up'])
    const sms = payload.store.messages.find((m) => m.template === 'order_not_picked_up')
    assert.match(sms.body, /1042/)
  })

  test('never « non récupérée » when the shop itself was closed: the closure, a day set to « Fermé », even after reopening', async () => {
    const day = (iso, extra = {}) => ({ status: 'paid', pickupDate: `${iso}T12:00:00.000Z`, pickupWindowStart: '10:00', pickupWindowEnd: '10:15', customer: { phone: '+14505550101' }, ...extra })
    payload.store.orders.push(
      { id: 1, number: 1050, ...day('2026-10-31') },
      { id: 2, number: 1051, ...day('2026-10-30') },
      { id: 3, number: 1053, ...day('2026-10-28', { timeline: [{ status: 'paid', reason: 'closure' }, { status: 'paid', reason: 'closure_undone' }] }) },
    )
    const globals = payload.store
    const manager = { id: 2, role: 'gerant', name: 'Marc', active: true }
    await payload.updateGlobal({ slug: 'shop', data: { specialDays: [{ date: '2026-10-30T12:00:00.000Z', state: 'closed', label: 'Fermé' }] } })
    // Storm at 7 h: « Reste de la journée ». Order 1050 is affected and texted.
    const closed = await perform(payload, { user: manager, type: 'shop.closure', input: { reason: 'tempete', duree: 'jour' }, now: local('2026-10-31', '07:00') })
    assert.ok(closed.ok, closed.message)
    assert.equal(globals.orders[0].timeline.at(-1).reason, 'closure')
    assert.equal((await markNotPickedUp(payload, { now: NOW })).notPickedUp, 1)
    assert.deepEqual(globals.orders.map((o) => o.status), ['paid', 'paid', 'not_picked_up'])
    await perform(payload, { user: manager, type: 'shop.reopen', input: {}, now: local('2026-11-01', '08:00') })
    await markNotPickedUp(payload, { now: local('2026-11-06', '18:00') })
    assert.deepEqual(globals.orders.map((o) => o.status), ['paid', 'paid', 'not_picked_up'])
    assert.deepEqual(globals.messages.filter((m) => m.template === 'order_not_picked_up').map((m) => m.order), [3])
  })

  test('« vous attend au comptoir » and « pas été récupérée » never leave once the order is handed over', async () => {
    payload.store.orders.push({ id: 1, status: 'picked_up' }, { id: 2, status: 'ready' })
    const due = new Date(NOW.getTime() - 1000).toISOString()
    payload.store.messages.push(
      { id: 1, channel: 'sms', template: 'order_ready', to: '+14505550101', body: 'vous attend', status: 'queued', order: 1, sendAfter: due },
      { id: 2, channel: 'sms', template: 'order_not_picked_up', to: '+14505550101', body: 'pas récupérée', status: 'queued', order: 1, sendAfter: due },
      { id: 3, channel: 'sms', template: 'order_ready', to: '+14505550102', body: 'vous attend', status: 'queued', order: 2, sendAfter: due },
    )
    const s = recorder()
    const out = await sendDueMessages(payload, { now: NOW, senders: s })
    assert.deepEqual([out.sent, out.cancelled], [1, 2])
    assert.equal(s.sent[0].to, '+14505550102')
  })

  test('nightly retention deletes allergy notes 30 days after pickup, not before', async () => {
    payload.store.orders.push(
      { id: 1, status: 'picked_up', pickupDate: '2026-10-01T12:00:00.000Z', allergyNote: 'Noix' },
      { id: 2, status: 'picked_up', pickupDate: '2026-10-02T12:00:00.000Z', allergyNote: 'Lait' },
    )
    assert.equal((await retention(payload, { now: NOW })).allergyNotesDeleted, 1)
    assert.deepEqual(payload.store.orders.map((o) => o.allergyNote), [null, 'Lait'])
    assert.match(payload.store.orders[0].timeline.at(-1).note, /effacée/)
  })

  // Nightly also purges « Écrivez-nous » conversations 90 days after their last message (lib/chat/server.js).
  test('one tick runs everything', async () => {
    const summary = await tick(payload, { now: NOW, senders: recorder(), nightly: true })
    assert.deepEqual(Object.keys(summary).sort(), ['allergyNotesDeleted', 'cancelled', 'conversationsPurged', 'failed', 'holdsExpired', 'notPickedUp', 'quotesExpired', 'retried', 'sent'])
  })
})

describe('senders', () => {
  test('log by default (development); Twilio and SES when their keys are set', () => {
    assert.equal(smsSender({}).name, 'log')
    assert.equal(emailSender({}).name, 'log')
    assert.equal(smsSender({ TWILIO_ACCOUNT_SID: 'AC1', TWILIO_AUTH_TOKEN: 't', TWILIO_FROM: '+1' }).name, 'twilio')
    assert.equal(emailSender({ AWS_ACCESS_KEY_ID: 'a', AWS_SECRET_ACCESS_KEY: 'b' }).name, 'log')
    assert.equal(emailSender({ EMAIL_PROVIDER: 'ses', AWS_ACCESS_KEY_ID: 'a', AWS_SECRET_ACCESS_KEY: 'b' }).name, 'ses')
    assert.deepEqual(mailFrom({ MAIL_FROM: 'Coco Vanille <commandes@example.test>' }), { name: 'Coco Vanille', email: 'commandes@example.test' })
    assert.equal(mailFrom({}).email, 'commandes@cocovanillegranby.com')
  })

  test('MIME: encoded subject, text + HTML, calendar attachment', () => {
    const raw = buildMime({ from: 'a@example.test', to: 'b@example.test', subject: 'Commande confirmée', text: 'Bonjour', html: '<p>Bonjour</p>', attachments: [{ filename: 'c.ics', contentType: 'text/calendar; charset=utf-8', content: 'BEGIN:VCALENDAR' }] })
    assert.match(raw, /^Subject: =\?UTF-8\?B\?/m)
    assert.match(raw, /Content-Type: multipart\/alternative/)
    assert.match(raw, /filename="c\.ics"/)
    assert.ok(raw.includes(Buffer.from('BEGIN:VCALENDAR').toString('base64')))
  })

  test('SigV4 matches the AWS test suite (get-vanilla)', () => {
    const h = signRequest({ method: 'GET', url: 'https://example.amazonaws.com/', region: 'us-east-1', service: 'service', accessKeyId: 'AKIDEXAMPLE', secretAccessKey: 'wJalrXUtnFEMI/K7MDENG+bPxRfiCYEXAMPLEKEY', now: new Date('2015-08-30T12:36:00Z') })
    assert.equal(h.authorization, 'AWS4-HMAC-SHA256 Credential=AKIDEXAMPLE/20150830/us-east-1/service/aws4_request, SignedHeaders=host;x-amz-date, Signature=5fa00fa31553b73ebf1942676e86291e8372ff2a2260956d9b8aae1d763fbf31')
  })
})
