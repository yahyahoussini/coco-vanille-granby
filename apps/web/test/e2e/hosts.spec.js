// Host isolation (16b §2): the public host never exposes the admin areas; every admin-host response is noindex.
import { test, expect } from '@playwright/test'
import { PUBLIC_URL, ADMIN_URL, raw } from './support/site.js'

const PRIVATE_ON_PUBLIC = ['/admin', '/admin/', '/admin/login', '/api', '/api/', '/api/users', '/api/users/me', '/api/graphql', '/studio', '/studio/', '/studio/commandes/']

test.describe('public host', () => {
  test('/admin, /api and /studio answer 404', async () => {
    const wrong = []
    for (const path of PRIVATE_ON_PUBLIC) {
      const res = await raw(`${PUBLIC_URL}${path}`)
      if (res.status !== 404) wrong.push(`${path}: ${res.status}`)
    }
    expect(wrong, wrong.join('\n')).toEqual([])
  })

  test('baseline security headers', async () => {
    const res = await raw(`${PUBLIC_URL}/`)
    expect(res.status).toBe(200)
    expect(res.headers['x-content-type-options']).toBe('nosniff')
    expect(res.headers['referrer-policy']).toBe('strict-origin-when-cross-origin')
    expect(res.headers['x-powered-by'], 'no framework banner').toBeUndefined()
  })
})

test.describe('admin host', () => {
  const paths = ['/', '/admin', '/admin/login', '/api/users/me', '/robots.txt', '/page-qui-nexiste-pas/']

  test('every response carries X-Robots-Tag noindex and no-store', async () => {
    const wrong = []
    for (const path of paths) {
      const res = await raw(`${ADMIN_URL}${path}`)
      const tag = res.headers['x-robots-tag'] || ''
      if (!/noindex/i.test(tag) || !/nofollow/i.test(tag)) wrong.push(`${path} (${res.status}): X-Robots-Tag "${tag}"`)
      if (!/no-store/i.test(res.headers['cache-control'] || '')) wrong.push(`${path} (${res.status}): Cache-Control "${res.headers['cache-control']}"`)
    }
    expect(wrong, wrong.join('\n')).toEqual([])
  })

  test('robots.txt stays crawlable so Google can read the noindex', async () => {
    const res = await raw(`${ADMIN_URL}/robots.txt`)
    expect(res.status).toBe(200)
    const lines = res.body.split('\n').map((l) => l.trim())
    expect(lines).toContain('User-agent: *')
    expect(lines).not.toContain('Disallow: /')
    expect(res.body).not.toMatch(/Sitemap:/i)
  })

  test('the public sitemap is not served on the admin host', async () => {
    const res = await raw(`${ADMIN_URL}/sitemap.xml`)
    expect(res.body).not.toMatch(/<urlset/)
  })
})

test.describe('health check on both hosts (17 §12.2)', () => {
  for (const [name, base] of [['public', PUBLIC_URL], ['admin', ADMIN_URL]]) {
    test(`${name} host: /svc/health/ answers 200 with the database, ?shallow=1 without it`, async () => {
      const deep = await raw(`${base}/svc/health/`)
      expect(deep.status).toBe(200)
      expect(JSON.parse(deep.body)).toMatchObject({ ok: true, db: 'up' })
      const shallow = await raw(`${base}/svc/health/?shallow=1`)
      expect(shallow.status).toBe(200)
      expect(JSON.parse(shallow.body)).toMatchObject({ ok: true, db: 'skipped' })
      expect(shallow.headers['cache-control']).toMatch(/no-store/)
    })
  }
})

test.describe('uploads on the public host (/media/)', () => {
  test('request photos and anything outside the media folder answer 404', async () => {
    for (const path of ['/media/demandes/demande-1.jpg', '/media/%2e%2e/.env', '/media/..%2fpackage.json', '/media/.cache.png', '/media/notes.txt']) {
      const res = await raw(`${PUBLIC_URL}${path}`)
      expect(res.status, path).toBe(404)
    }
  })

  // Uploads are /media/<file>; the only other images are static files: the logo (public/brand/) and the
  // labelled ambiance photos (public/photos/, src/lib/photos.js).
  test('public pages reference uploads as /media/<file>, never through /api', async () => {
    for (const path of ['/', '/carte/', '/gateaux/']) {
      const res = await raw(`${PUBLIC_URL}${path}`)
      expect(res.body, path).not.toMatch(/\/api\/media\//)
      for (const m of res.body.matchAll(/<img[^>]+src="([^"]+)"/g)) expect(m[1], path).toMatch(/^\/(media\/[^/]+|brand\/logo-badge-\d+\.(webp|avif|png)|photos\/[a-z]+-\d+\.(webp|avif))$/)
    }
  })
})
