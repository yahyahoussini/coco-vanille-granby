// lib/indexnow: nothing is announced without a key or from a temporary address; only page URLs are sent.
import test from 'node:test'
import assert from 'node:assert/strict'
import { indexNowHost, indexNowBody, pingIndexNow } from '../../src/lib/indexnow.js'

const live = { INDEXNOW_KEY: 'a1b2c3d4e5f6a7b8', PUBLIC_ORIGIN: 'https://cocovanillegranby.com' }

test('no key, a malformed key or a temporary address: nothing to announce', () => {
  assert.equal(indexNowHost({ PUBLIC_ORIGIN: 'https://cocovanillegranby.com' }), null)
  assert.equal(indexNowHost({ ...live, INDEXNOW_KEY: 'short' }), null)
  for (const origin of ['http://localhost:3000', 'https://cocovanille.72-60-92-29.sslip.io', 'https://cocovanille.1-2-3-4.nip.io']) {
    assert.equal(indexNowHost({ ...live, PUBLIC_ORIGIN: origin }), null, origin)
  }
  assert.equal(indexNowHost(live), 'cocovanillegranby.com')
})

test('the body lists page URLs only, once each, on the key host', () => {
  const body = indexNowBody(['/carte/', '/en/menu/', '/carte/', '/og/carte.png', '/sitemap.xml', '/svc/health/'], live)
  assert.deepEqual(body, {
    host: 'cocovanillegranby.com',
    key: live.INDEXNOW_KEY,
    keyLocation: `https://cocovanillegranby.com/${live.INDEXNOW_KEY}.txt`,
    urlList: ['https://cocovanillegranby.com/carte/', 'https://cocovanillegranby.com/en/menu/'],
  })
  assert.equal(indexNowBody(['/og/carte.png'], live), null)
})

test('the ping posts to api.indexnow.org and treats 200 and 202 as accepted', async () => {
  const calls = []
  const fetchImpl = async (url, init) => (calls.push({ url, body: JSON.parse(init.body) }), { status: 202 })
  assert.deepEqual(await pingIndexNow(['/faq/'], { env: live, fetchImpl }), { ok: true, status: 202, count: 1 })
  assert.equal(calls[0].url, 'https://api.indexnow.org/indexnow')
  assert.deepEqual(await pingIndexNow(['/faq/'], { env: { PUBLIC_ORIGIN: live.PUBLIC_ORIGIN }, fetchImpl }), { ok: false, skipped: true })
  assert.equal(calls.length, 1)
})
