// src/proxy.js: host routing per process role (web, studio, all). The role is read when the module loads,
// so each role gets its own copy of the module (a query string makes a new ESM instance).
import test, { describe } from 'node:test'
import assert from 'node:assert/strict'
import { register, createRequire } from 'node:module'

// next has no "exports" map: plain Node ESM needs 'next/server.js'. Next resolves 'next/server' itself.
register(`data:text/javascript,${encodeURIComponent("export async function resolve(s, c, n) { return n(s === 'next/server' ? 'next/server.js' : s, c) }")}`, import.meta.url)
const { NextRequest } = createRequire(import.meta.url)('next/server')

async function proxyFor(role) {
  const before = process.env.APP_ROLE
  process.env.APP_ROLE = role
  try {
    return (await import(`../../src/proxy.js?role=${role}`)).proxy
  } finally {
    if (before === undefined) delete process.env.APP_ROLE
    else process.env.APP_ROLE = before
  }
}

const call = (proxy, host, path) => proxy(new NextRequest(`http://${host}${path}`, { headers: { host } }))
const rewrite = (res) => res.headers.get('x-middleware-rewrite')
const passes = (res) => res.headers.get('x-middleware-next') === '1'

describe('/svc/health/ answers on every host and role (17 §12.2)', () => {
  for (const role of ['web', 'studio', 'all']) {
    for (const host of ['cocovanillegranby.com', 'admin.cocovanillegranby.com', '127.0.0.1:3000']) {
      test(`${role} · ${host}`, async () => {
        const proxy = await proxyFor(role)
        for (const path of ['/svc/health/', '/svc/health']) {
          const res = call(proxy, host, path)
          assert.ok(passes(res), `${path} goes to the route itself`)
          assert.equal(rewrite(res), null)
          assert.notEqual(res.status, 404)
        }
      })
    }
  }

  test('on the admin host it keeps the noindex and no-store headers', async () => {
    const res = call(await proxyFor('studio'), 'admin.cocovanillegranby.com', '/svc/health/')
    assert.match(res.headers.get('x-robots-tag'), /noindex/)
    assert.match(res.headers.get('cache-control'), /no-store/)
  })
})

describe('host and role isolation', () => {
  test('a web process sends the admin host to 404', async () => {
    const res = call(await proxyFor('web'), 'admin.cocovanillegranby.com', '/')
    assert.equal(res.status, 404)
    assert.match(rewrite(res), /\/__introuvable\/?$/)
  })

  test('a studio process sends the public host to 404', async () => {
    const res = call(await proxyFor('studio'), 'cocovanillegranby.com', '/carte/')
    assert.equal(res.status, 404)
  })

  test('the admin host rewrites screens into the Studio tree, but not /admin or /api', async () => {
    const proxy = await proxyFor('all')
    assert.match(rewrite(call(proxy, 'admin.cocovanillegranby.com', '/commandes/')), /\/studio\/commandes\/?$/)
    assert.match(rewrite(call(proxy, 'admin.cocovanillegranby.com', '/svc/evenements/')), /\/studio\/svc\/evenements\/?$/)
    assert.ok(passes(call(proxy, 'admin.cocovanillegranby.com', '/api/users/me')))
  })

  test('the public host: private paths 404, trailing slash enforced', async () => {
    const proxy = await proxyFor('all')
    for (const path of ['/admin', '/api/users', '/studio/']) assert.equal(call(proxy, 'cocovanillegranby.com', path).status, 404, path)
    const res = call(proxy, 'cocovanillegranby.com', '/carte')
    assert.equal(res.status, 301)
    assert.equal(res.headers.get('location'), 'http://cocovanillegranby.com/carte/')
  })
})
