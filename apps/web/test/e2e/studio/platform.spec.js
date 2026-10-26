// PWA (manifest, icons, shell-only service worker), offline outbox with idempotency keys, live updates (SSE),
// owner passkey with backup codes (16 §7, 16b §3–§4). Needs the demo seeds (see auth.spec.js).
import { test, expect } from '@playwright/test'
import { raw, ADMIN_URL } from '../support/site.js'
import { OWNER, LEA, login, sql, stepUp, demoOrder, signInTurn } from './support.js'

test.describe.configure({ mode: 'serial' })

test('manifest « Coco Studio », typographic icons, service worker: all noindex', async () => {
  const m = await raw(`${ADMIN_URL}/manifest.webmanifest`)
  expect(m.status).toBe(200)
  const manifest = JSON.parse(m.body)
  expect(manifest).toMatchObject({ name: 'Coco Studio', lang: 'fr-CA', start_url: '/', display: 'standalone' })
  for (const icon of manifest.icons) {
    const r = await raw(`${ADMIN_URL}${icon.src}`)
    expect(r.status, icon.src).toBe(200)
    expect(r.headers['content-type']).toMatch(/image\/png/)
  }
  const sw = await raw(`${ADMIN_URL}/sw.js`)
  expect(sw.status).toBe(200)
  expect(sw.headers['content-type']).toMatch(/javascript/)
  expect(sw.headers['x-robots-tag']).toMatch(/noindex/)
  expect((await raw(`${ADMIN_URL}/hors-ligne/`)).status).toBe(200)
})

test('the service worker caches the shell only, never a page with orders', async ({ page }) => {
  await login(page, LEA, 'tablette')
  await page.evaluate(() => navigator.serviceWorker.ready)
  await page.reload()
  await page.waitForFunction(async () => (await caches.keys()).length > 0)
  const cached = await page.evaluate(async () => {
    const out = []
    for (const k of await caches.keys()) for (const r of await (await caches.open(k)).keys()) out.push(new URL(r.url).pathname)
    return out
  })
  expect(cached).toContain('/hors-ligne/')
  for (const p of cached) expect(p === '/hors-ligne/' || /^\/(_next\/static\/|manifest|icone|apple-touch|favicon)/.test(p), p).toBe(true)
})

test('offline: « Épuisé » waits in the outbox, leaves once with its key when the network is back', async ({ page, context }) => {
  await login(page, LEA, 'tablette')
  await page.goto('/vitrine/')
  await context.setOffline(true)
  await page.getByRole('button', { name: 'Épuisé : Paris-Brest' }).click()
  await expect(page.locator('.st-snack')).toContainText('Hors ligne · gardé')
  await expect(page.locator('.st-top .st-chip').first()).toContainText('Hors ligne · 1 en attente')
  const queued = await page.evaluate(() => new Promise((resolve) => {
    const req = indexedDB.open('coco-studio', 1)
    req.onsuccess = () => {
      const r = req.result.transaction('outbox').objectStore('outbox').getAll()
      r.onsuccess = () => resolve(r.result.map((a) => ({ type: a.type, id: a.id })))
    }
  }))
  expect(queued).toHaveLength(1)
  expect(queued[0].type).toBe('product.soldout')
  const [before] = await sql(`select availability from products where id in (select _parent_id from products_locales where slug = 'paris-brest')`)
  expect(before.availability).toBe('instock')
  await context.setOffline(false)
  await expect(page.locator('.st-top .st-chip').first()).toContainText('À jour')
  await expect.poll(async () => (await sql(`select availability from products where id in (select _parent_id from products_locales where slug = 'paris-brest')`))[0].availability).toBe('soldout')
  const entries = await sql(`select count(*)::int as n from audit_log where key = $1`, [queued[0].id])
  expect(entries[0].n).toBe(1)
  // The same key again changes nothing (a replay after a dropped answer).
  const replay = await page.evaluate(async (key) => (await fetch('/svc/action/', { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify({ type: 'product.soldout', input: { productId: 0 }, key }) })).json(), queued[0].id)
  expect(replay.replay).toBe(true)
  await page.reload()
  await page.getByRole('button', { name: 'Remettre en vente : Paris-Brest' }).click()
  await expect(page.locator('.st-snack')).toContainText('de nouveau en vente')
})

test('offline: a quote or a closure says it needs the network and sends nothing', async ({ page, context }) => {
  await login(page, OWNER)
  await page.goto('/boutique/')
  await page.getByText('Fermeture exceptionnelle', { exact: true }).click()
  await page.locator('label.choice', { hasText: 'Tempête' }).click()
  await page.locator('label.choice', { hasText: /^Demain$/ }).click()
  await context.setOffline(true)
  await page.getByRole('button', { name: 'Fermer la boutique' }).click()
  await expect(page.locator('.st-snack')).toContainText('a besoin du réseau')
  // Nothing waits in the outbox either: it is not replayed later.
  const waiting = await page.evaluate(() => new Promise((resolve) => {
    const req = indexedDB.open('coco-studio', 1)
    req.onupgradeneeded = () => req.result.createObjectStore('outbox', { keyPath: 'id' })
    req.onsuccess = () => {
      const r = req.result.transaction('outbox').objectStore('outbox').count()
      r.onsuccess = () => resolve(r.result)
    }
  }))
  expect(waiting).toBe(0)
  await context.setOffline(false)
})

test('live: another device marks an order ready, the open tablet updates without a tap', async ({ browser }) => {
  const tablet = await browser.newContext({ locale: 'fr-CA', timezoneId: 'America/Toronto' })
  const phone = await browser.newContext({ locale: 'fr-CA', timezoneId: 'America/Toronto' })
  const a = await tablet.newPage()
  const b = await phone.newPage()
  await login(a, LEA, 'tablette')
  await login(b, OWNER)
  const sofia = await demoOrder('Sofía')
  expect(sofia.status).toBe('paid')
  const card = a.locator('article.card', { hasText: 'Sofía R.' })
  await expect(card.getByRole('button', { name: 'Marquer prête' })).toBeVisible()
  await b.locator('article.card', { hasText: 'Sofía R.' }).getByRole('button', { name: 'Marquer prête' }).click()
  await expect(b.locator('.st-snack')).toContainText('prête')
  await expect(card.getByText('Remettre la commande')).toBeVisible({ timeout: 15_000 })
  await b.locator('.st-snack').getByRole('button', { name: 'Annuler' }).click()
  await tablet.close()
  await phone.close()
})

test('owner passkey: added after a step-up with backup codes, then sign-in with Face ID; a backup code works once', async ({ page, context }) => {
  const cdp = await context.newCDPSession(page)
  await cdp.send('WebAuthn.enable')
  await cdp.send('WebAuthn.addVirtualAuthenticator', { options: { protocol: 'ctap2', transport: 'internal', hasResidentKey: true, hasUserVerification: true, isUserVerified: true, automaticPresenceSimulation: true } })
  await login(page, OWNER)
  await stepUp(page)
  await page.goto('/plus/reglages/#cles')
  await page.getByRole('button', { name: 'Ajouter une clé d’accès sur cet appareil' }).click()
  await expect(page.getByText('Codes de secours : notez-les maintenant')).toBeVisible()
  const codes = await page.locator('.effects li').allInnerTexts()
  expect(codes).toHaveLength(8)
  const [u] = await sql(`select jsonb_array_length(passkeys) as n, jsonb_array_length(backup_codes) as c from users where email = $1`, [OWNER.email])
  expect(u).toEqual({ n: 1, c: 8 })

  await page.goto('/plus/reglages/')
  await page.getByRole('button', { name: 'Se déconnecter' }).click()
  await expect(page).toHaveURL(/\/connexion\//)
  await signInTurn(async () => {
    await page.getByRole('button', { name: 'Se connecter avec une clé d’accès' }).click()
    await page.waitForURL((url) => !url.pathname.startsWith('/connexion'))
  })
  await expect(page.locator('h1')).toHaveText('Aujourd’hui')

  await page.goto('/plus/reglages/')
  await page.getByRole('button', { name: 'Se déconnecter' }).click()
  await page.getByText('Clé d’accès perdue').click()
  await page.locator('#email-code').fill(OWNER.email)
  await page.locator('#code').fill(codes[0])
  await signInTurn(async () => {
    await page.getByRole('button', { name: 'Se connecter avec le code' }).click()
    await page.waitForURL((url) => !url.pathname.startsWith('/connexion'))
  })
  await expect(page.locator('h1')).toHaveText('Réglages')
  await page.getByRole('button', { name: 'Se déconnecter' }).click()
  await page.getByText('Clé d’accès perdue').click()
  await page.locator('#email-code').fill(OWNER.email)
  await page.locator('#code').fill(codes[0])
  await page.getByRole('button', { name: 'Se connecter avec le code' }).click()
  await expect(page.locator('.error-summary')).toContainText('Code de secours incorrect ou déjà utilisé')
})
