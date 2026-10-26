// Custom-cake request form: validation, private photos, answerBy = +24 h, "request received" queued.
import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { cleanRequest, checkPhotos, submitRequest } from '../../../src/lib/ordering/requests.js'
import { notifyRequestReceived } from '../../../src/lib/messaging/notify.js'
import { normalizePhone } from '../../../src/lib/ordering/customer.js'
import { fakePayload } from './fake-payload.js'
import { local } from './fixtures.js'

const NOW = local('2026-10-27', '10:00')
const input = (over = {}) => ({ occasion: 'Anniversaire', guests: '20', eventDate: '2026-11-14', flavour: 'Vanille', cakeMessage: 'Bonne fête Léo', details: 'Rose', hasAllergy: 'on', firstName: 'Léa', phone: '450 555-0123', email: 'lea@example.test', ...over })
const file = (type, size) => ({ type, size, name: 'x', arrayBuffer: async () => new ArrayBuffer(size) })

describe('request form', () => {
  test('a complete request is clean', () => {
    const { values, errors } = cleanRequest(input(), { now: NOW })
    assert.deepEqual(errors, [])
    assert.equal(values.guests, 20)
    assert.equal(values.hasAllergy, true)
    assert.equal(values.customer.phone, '+14505550123')
  })

  test('required fields, dates from tomorrow to 12 months, phone required', () => {
    const codes = (over) => cleanRequest(input(over), { now: NOW }).errors.map((e) => e.code)
    assert.deepEqual(codes({ occasion: ' ' }), ['occasion_required'])
    assert.deepEqual(codes({ guests: '0' }), ['guests_invalid'])
    assert.deepEqual(codes({ guests: 'beaucoup' }), ['guests_invalid'])
    assert.deepEqual(codes({ eventDate: '2026-10-27' }), ['date_too_soon'])
    assert.deepEqual(codes({ eventDate: '2027-12-01' }), ['date_too_far'])
    assert.deepEqual(codes({ phone: '' }), ['phone_required'])
    assert.deepEqual(codes({ email: 'x@' }), ['email_invalid'])
  })

  test('photos: three at most, JPEG/PNG/WebP, 10 MB each', () => {
    assert.deepEqual(checkPhotos([file('image/jpeg', 100)]).errors, [])
    assert.equal(checkPhotos([1, 2, 3, 4].map(() => file('image/png', 10))).errors[0].code, 'photos_too_many')
    assert.equal(checkPhotos([file('image/heic', 10)]).errors[0].code, 'photo_type')
    assert.equal(checkPhotos([file('image/jpeg', 11 * 1024 * 1024)]).errors[0].code, 'photo_too_big')
    assert.deepEqual(checkPhotos([{ size: 0 }]).photos, [])
  })

  test('phone numbers become E.164', () => {
    assert.equal(normalizePhone('450-372-7177'), '+14503727177')
    assert.equal(normalizePhone('1 (450) 372-7177'), '+14503727177')
    assert.equal(normalizePhone('+33 1 23 45 67 89'), '+33123456789')
    assert.equal(normalizePhone('123'), null)
  })

  test('stored with answerBy = +24 h and private photos; the confirmation is queued (email first)', async () => {
    const payload = fakePayload({ globals: { business: { phoneDisplay: '450-372-7177', address: { street: '3, rue Court', city: 'Granby' } } } })
    const { request, errors } = await submitRequest(payload, { input: input(), files: [file('image/jpeg', 2048)], now: NOW })
    assert.deepEqual(errors, [])
    assert.equal(request.status, 'new')
    assert.equal(new Date(request.answerBy).getTime() - NOW.getTime(), 24 * 3600 * 1000)
    assert.equal(request.eventDate, '2026-11-14T12:00:00.000Z')
    assert.equal(request.photos.length, 1)
    assert.equal(payload.store['request-photos'].length, 1)
    assert.match(request.accessToken, /^[\w-]{12}$/)
    const [message] = await notifyRequestReceived(payload, request)
    assert.equal(message.channel, 'email')
    assert.equal(message.template, 'request_received')
    assert.equal(message.status, 'queued')
    assert.match(message.body, /nous vous appellerons/)
  })

  test('without email the confirmation is a one-segment SMS', async () => {
    const payload = fakePayload({ globals: { business: {} } })
    const { request } = await submitRequest(payload, { input: input({ email: '' }), now: NOW })
    const [message] = await notifyRequestReceived(payload, request)
    assert.equal(message.channel, 'sms')
    assert.equal(message.segments, 1)
  })
})
