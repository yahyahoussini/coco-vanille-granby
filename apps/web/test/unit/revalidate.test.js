// lib/revalidate: which pages a change refreshes, and how the refresh reaches the live public process.
import test, { describe } from 'node:test'
import assert from 'node:assert/strict'
import { affected, revalidatePublic, revalidateUrl, withRevalidation, FILES } from '../../src/lib/revalidate.js'

describe('what a change touches', () => {
  test('shop, business and the catalogue refresh the whole site, sitemap and llms.txt included', () => {
    for (const kind of ['shop', 'business', 'products', 'categories', 'media', 'seasons', 'allergens']) {
      assert.deepEqual(affected(kind, { id: 1 }), { all: true, paths: FILES }, kind)
    }
  })

  test('a page copy refreshes its URLs in every language and its cards', () => {
    const job = affected('pages', { key: 'carte' })
    assert.equal(job.all, false)
    for (const p of ['/carte/', '/en/menu/', '/og/carte.png', '/en/og/carte.png', '/sitemap.xml', '/llms.txt']) assert.ok(job.paths.includes(p), p)
  })

  test('an unknown page key refreshes everything', () => {
    assert.equal(affected('pages', { key: 'nope' }).all, true)
  })
})

describe('how the refresh travels', () => {
  const calls = []
  const fakeFetch = async (url, init) => {
    calls.push({ url, init })
    return { ok: true, status: 200 }
  }

  test('a public process (web, all) clears its own cache and sends nothing', async () => {
    calls.length = 0
    let cleared = null
    for (const role of ['web', 'all']) {
      const r = await revalidatePublic({ all: true, paths: [] }, { env: { APP_ROLE: role, REVALIDATE_SECRET: 's' }, fetchImpl: fakeFetch, clear: async (job) => (cleared = job) })
      assert.deepEqual(r, { ok: true, local: true })
    }
    assert.deepEqual(cleared, { all: true, paths: [] })
    assert.equal(calls.length, 0)
  })

  test('studio, the worker and a script outside Next POST to the public host with the secret', async () => {
    calls.length = 0
    const outside = async () => {
      throw new Error('Invariant: static generation store missing')
    }
    for (const role of ['studio', 'worker', 'all']) {
      const r = await revalidatePublic({ all: false, paths: ['/carte/'] }, { env: { APP_ROLE: role, REVALIDATE_SECRET: 'secret', PUBLIC_ORIGIN: 'https://staging.cocovanillegranby.com/' }, fetchImpl: fakeFetch, clear: outside })
      assert.equal(r.ok, true, role)
    }
    assert.equal(calls.length, 3)
    assert.equal(calls[0].url, 'https://staging.cocovanillegranby.com/svc/revalidate/')
    assert.equal(calls[0].init.method, 'POST')
    assert.equal(calls[0].init.headers['x-revalidate-secret'], 'secret')
    assert.deepEqual(JSON.parse(calls[0].init.body), { all: false, paths: ['/carte/'] })
  })

  test('no secret: nothing is sent, the write still goes through', async () => {
    calls.length = 0
    const r = await revalidatePublic({ all: true, paths: [] }, { env: { APP_ROLE: 'studio' }, fetchImpl: fakeFetch })
    assert.equal(r.ok, false)
    assert.match(r.skipped, /REVALIDATE_SECRET/)
    assert.equal(calls.length, 0)
  })

  test('a network error is reported, never thrown', async () => {
    const r = await revalidatePublic({ all: true, paths: [] }, { env: { APP_ROLE: 'studio', REVALIDATE_SECRET: 's' }, fetchImpl: async () => { throw new Error('ECONNREFUSED') } })
    assert.deepEqual(r, { ok: false, error: 'ECONNREFUSED' })
  })

  test('REVALIDATE_URL overrides the public origin', () => {
    assert.equal(revalidateUrl({ REVALIDATE_URL: 'http://127.0.0.1:3001/svc/revalidate/' }), 'http://127.0.0.1:3001/svc/revalidate/')
    assert.equal(revalidateUrl({}), 'https://cocovanillegranby.com/svc/revalidate/')
  })
})

describe('hooks', () => {
  test('withRevalidation keeps the hooks a collection already has', () => {
    const own = () => {}
    const c = withRevalidation({ slug: 'products', hooks: { afterChange: [own] } })
    assert.equal(c.hooks.afterChange.length, 2)
    assert.equal(c.hooks.afterChange[0], own)
    assert.equal(c.hooks.afterDelete.length, 1)
    const g = withRevalidation({ slug: 'shop' }, { global: true })
    assert.equal(g.hooks.afterChange.length, 1)
    assert.equal(g.hooks.afterDelete, undefined)
  })
})
