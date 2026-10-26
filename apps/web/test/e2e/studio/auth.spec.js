// Studio login, roles and the shared-tablet PIN switch (16 §1.1, §2.2, §3.0; 16b §2, §4).
// Prerequisites (dev database): npm run seed, SEED_DEMO=true npm run seed:demo, then
//   SEED_DEMO=true PAYLOAD_CONFIG_PATH=src/payload.config.js npx payload run src/seed/studio-demo.js
// Run: npx playwright test --project=admin
import { test, expect } from '@playwright/test'
import { raw, PUBLIC_URL, ADMIN_URL } from '../support/site.js'
import { OWNER, LEA, MARC, AGENCY, login, action, stepUp, signInTurn } from './support.js'

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
