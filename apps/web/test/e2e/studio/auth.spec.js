// Studio login, roles and the shared-tablet PIN switch (16 §1.1, §2.2, §3.0; 16b §2, §4).
// Prerequisites (dev database): npm run seed, SEED_DEMO=true npm run seed:demo, then
//   SEED_DEMO=true npm run seed:studio-demo   (SEED_DEMO=clean for both demo seeds removes them)
// Run: npx playwright test --project=admin
import { test, expect } from '@playwright/test'
import { raw, PUBLIC_URL, ADMIN_URL } from '../support/site.js'
import { OWNER, LEA, MARC, AGENCY, login, action, stepUp, signInTurn, sql } from './support.js'

test.describe('admin host', () => {
  test('every Studio response is noindex and never cached, error pages included', async () => {
    const wrong = []
    for (const path of ['/', '/connexion/', '/qui/', '/verifier/', '/commandes/', '/svc/action/', '/manifest.webmanifest', '/sw.js', '/nexiste-pas/']) {
      const res = await raw(`${ADMIN_URL}${path}`)
      if (!/noindex/.test(res.headers['x-robots-tag'] || '')) wrong.push(`${path} ${res.status} x-robots-tag`)
      if (!/no-store/.test(res.headers['cache-control'] || '')) wrong.push(`${path} ${res.status} cache-control`)
    }
    expect(wrong, wrong.join('\n')).toEqual([])
  })

  test('the public host answers 404 for /studio and its endpoints', async () => {
    for (const path of ['/studio', '/studio/', '/studio/connexion/', '/studio/svc/action/', '/studio/qui/']) {
      const res = await raw(`${PUBLIC_URL}${path}`)
      expect(res.status, path).toBe(404)
    }
  })

  test('everything but the login screens needs a session', async () => {
    const res = await raw(`${ADMIN_URL}/plus/`)
    expect([302, 303, 307]).toContain(res.status)
    expect(res.headers.location).toMatch(/\/connexion\//)
  })
})

test.describe('login', () => {
  test('wrong password: a clear French error, no session', async ({ page }) => {
    await page.goto('/connexion/')
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr-CA')
    await page.locator('#email').fill(OWNER.email)
    await page.locator('#password').fill('pas-le-bon')
    await page.getByRole('button', { name: 'Se connecter', exact: true }).click()
    await expect(page.locator('.error-summary')).toContainText('Courriel ou mot de passe incorrect')
  })

  test('owner: Aujourd’hui with the owner tab bar', async ({ page }) => {
    await login(page, OWNER)
    await expect(page.locator('h1')).toHaveText('Aujourd’hui')
    const tabs = page.getByRole('navigation', { name: 'Écrans' }).getByRole('link')
    await expect(tabs).toHaveText([/Aujourd’hui/, /Commandes/, /Demandes/, /Avis/, /Plus/])
  })

  test('agency lands on Agence and cannot open the shop screens', async ({ page }) => {
    await login(page, AGENCY, 'ordinateur')
    await expect(page).toHaveURL(/\/agence\//)
    await page.goto('/')
    await expect(page).toHaveURL(/\/agence\//)
  })
})

test.describe('roles enforced on the server', () => {
  test('Comptoir cannot refund, cancel or change a price', async ({ page }) => {
    await login(page, LEA, 'telephone')
    await expect(page.getByRole('navigation', { name: 'Écrans' }).getByRole('link')).toHaveText([/Aujourd’hui/, /Commandes/, /Vitrine/, /Plus/])
    for (const type of ['order.refund', 'order.cancel', 'product.price', 'product.allergens', 'product.tax', 'request.quote']) {
      const r = await action(page, type, { orderId: 1, productId: 1 })
      expect(r.status, type).toBe(403)
      expect(r.body.code).toBe('forbidden')
    }
  })

  test('money and people actions need a fresh identity check', async ({ page }) => {
    await login(page, MARC)
    const r = await action(page, 'product.price', { productId: 1, variantIndex: 0, price: '9' })
    expect(r.status).toBe(401)
    expect(r.body.code).toBe('step_up')
  })
})

// Payload's REST API on the same host, with the page's own cookies (same origin, like « Avancé »).
const rest = (page, method, path, body) =>
  page.evaluate(
    async ({ method, path, body }) => {
      const res = await fetch(path, { method, headers: { 'content-type': 'application/json', accept: 'application/json' }, body: body ? JSON.stringify(body) : undefined })
      return { status: res.status, body: await res.json().catch(() => null) }
    },
    { method, path, body },
  )

test.describe('REST /api follows the same rules as Studio', () => {
  test('Comptoir: no product, order, message or shop write over REST', async ({ page }) => {
    const [product] = await sql('select id from products order by id limit 1')
    const [order] = await sql('select id from orders order by id limit 1')
    await login(page, LEA)
    const tries = [
      ['PATCH', `/api/products/${product.id}`, { allergens: [] }],
      ['PATCH', `/api/orders/${order.id}`, { status: 'picked_up', payment: { status: 'paid' }, totals: { balanceCents: 0 } }],
      ['POST', '/api/messages', { channel: 'sms', template: 'order_ready', to: '+15145550000', body: 'payez ici' }],
      ['POST', '/api/globals/shop', { closure: { active: true }, hours: [] }],
    ]
    for (const [method, path, body] of tries) expect((await rest(page, method, path, body)).status, `${method} ${path}`).toBe(403)
  })

  test('Gérant·e without a step-up: prices and allergens stay as they were', async ({ page }) => {
    const [product] = await sql('select id from products where id in (select _parent_id from products_variants where price_cents > 0) order by id limit 1')
    await login(page, MARC)
    const before = (await rest(page, 'GET', `/api/products/${product.id}?depth=0`)).body
    const variants = before.variants.map((v) => ({ ...v, priceCents: 100 }))
    await rest(page, 'PATCH', `/api/products/${product.id}`, { variants, allergens: [], allergensVerified: { by: 1, at: new Date().toISOString() } })
    const after = (await rest(page, 'GET', `/api/products/${product.id}?depth=0`)).body
    expect(after.variants.map((v) => v.priceCents)).toEqual(before.variants.map((v) => v.priceCents))
    expect(after.allergens).toEqual(before.allergens)
    expect(after.allergensVerified).toEqual(before.allergensVerified)
  })

  test('owner without a step-up: no new account, no deposit change', async ({ page }) => {
    await login(page, OWNER)
    const created = await rest(page, 'POST', '/api/users', { name: 'Intrus', email: 'intrus@exemple.test', password: 'pas-permis-123', role: 'proprietaire' })
    expect(created.status).toBe(403)
    const before = (await rest(page, 'GET', '/api/globals/shop?depth=0')).body
    await rest(page, 'POST', '/api/globals/shop', { ordering: { ...before.ordering, depositPercent: 100 } })
    const after = (await rest(page, 'GET', '/api/globals/shop?depth=0')).body
    expect(after.ordering.depositPercent ?? null).toBe(before.ordering.depositPercent ?? null)
  })

  test('agency: orders without pickup codes, cake messages or history', async ({ page }) => {
    await login(page, AGENCY, 'ordinateur')
    const r = await rest(page, 'GET', '/api/orders?limit=5&depth=0')
    expect(r.status).toBe(200)
    expect(r.body.docs.length).toBeGreaterThan(0)
    for (const doc of r.body.docs) {
      for (const key of ['pickupCode', 'timeline', 'customer', 'consent', 'boxToken', 'accessToken', 'allergyNote']) expect(doc[key], key).toBeUndefined()
      for (const it of doc.items || []) expect(it.message).toBeUndefined()
    }
  })
})

test.describe('shared tablet', () => {
  test('« Qui utilise la tablette? » → PIN → that person, audit-logged', async ({ page }) => {
    await login(page, OWNER, 'tablette')
    // The owner resets Léa's PIN (step-up first), then hands the tablet over.
    await stepUp(page)
    await page.goto('/plus/reglages/')
    const card = page.locator('.card', { has: page.getByRole('heading', { name: LEA.name }) })
    await card.getByLabel(`Nouveau NIP de ${LEA.name}`).fill(LEA.pin)
    await card.getByRole('button', { name: /NIP/ }).click()
    await expect(page.locator('.st-snack, .notice')).toContainText(`NIP de ${LEA.name} enregistré`)

    await page.goto('/qui/')
    await expect(page.locator('h1')).toHaveText('Qui utilise la tablette?')
    await page.getByRole('link', { name: LEA.name }).click()
    await page.getByLabel('NIP à 4 chiffres').fill('9999')
    await page.getByRole('button', { name: 'Valider' }).click()
    await expect(page.locator('.error-summary')).toContainText('NIP incorrect')
    await signInTurn(async () => {
      await page.getByLabel('NIP à 4 chiffres').fill(LEA.pin)
      await page.waitForURL((url) => !url.pathname.startsWith('/qui'))
    })
    await expect(page.locator('h1')).toHaveText('Aujourd’hui')
    await expect(page.locator('.st-top')).toContainText(LEA.name)
    await expect(page.getByRole('navigation', { name: 'Écrans' })).toContainText('Vitrine')
  })
})
