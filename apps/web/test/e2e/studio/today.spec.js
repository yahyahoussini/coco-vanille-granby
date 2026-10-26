// Aujourd'hui and Commandes (16 §3.1–§3.2, §8.3 T2): one forward button per order, undo, hand-over,
// phone order, production list. Needs the demo seeds (see auth.spec.js); re-run the Studio demo seed between runs.
import { test, expect } from '@playwright/test'
import { OWNER, LEA, login, sql, demoOrder, card } from './support.js'

test.describe.configure({ mode: 'serial' })

test('T2 « La commande de Julie est prête. Prévenez-la. »: 1 tap, texto queued after the undo window', async ({ page }) => {
  await login(page, LEA, 'tablette')
  const julie = card(page, 'Julie T.')
  const started = Date.now()
  await julie.getByRole('button', { name: 'Marquer prête' }).click()
  await expect(page.locator('.st-snack')).toContainText('texto à Julie T.')
  await expect(julie).toContainText('Prête')
  expect(Date.now() - started).toBeLessThan(10_000)
  const order = await demoOrder('Julie')
  expect(order.status).toBe('ready')
  const [sms] = await sql(`select template, status, send_after from messages where order_id = $1 and template = 'order_ready'`, [order.id])
  expect(sms.status).toBe('queued')
  expect(new Date(sms.send_after).getTime()).toBeGreaterThan(started + 25_000)
})

test('« Annuler » inside the window: back to Payée, the texto never leaves', async ({ page }) => {
  await login(page, LEA, 'tablette')
  const mark = card(page, 'Mark S.')
  await mark.getByRole('button', { name: 'Marquer prête' }).click()
  const snack = page.locator('.st-snack')
  await expect(snack).toContainText('prête')
  await snack.getByRole('button', { name: 'Annuler' }).click()
  await expect(snack).toContainText('le texto ne part pas')
  await expect(mark.getByRole('button', { name: 'Marquer prête' })).toBeVisible()
  const order = await demoOrder('Mark')
  expect(order.status).toBe('paid')
  const msgs = await sql(`select status from messages where order_id = $1 and template = 'order_ready'`, [order.id])
  expect(msgs.every((m) => m.status === 'cancelled')).toBe(true)
})

test('« Remettre la commande »: wrong code refused, « Client reconnu » → Récupérée', async ({ page }) => {
  await login(page, LEA, 'tablette')
  const leo = card(page, 'Léo B.')
  await leo.getByText('Remettre la commande').click()
  await leo.getByLabel('Code du client').fill('0000')
  await leo.getByRole('button', { name: /Valider le code/ }).click()
  await expect(page.locator('.st-snack')).toContainText('Code incorrect')
  await leo.getByRole('button', { name: /Client reconnu/ }).click()
  await expect(page.locator('.st-snack')).toContainText('récupérée')
  expect((await demoOrder('Léo')).status).toBe('picked_up')
})

test('without JavaScript: the form posts, the screen comes back with the notice and « Annuler »', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, locale: 'fr-CA', timezoneId: 'America/Toronto' })
  const page = await context.newPage()
  await login(page, OWNER)
  const sofia = card(page, 'Sofía R.')
  await sofia.getByRole('button', { name: 'Marquer prête' }).click()
  const notice = page.locator('.notice')
  await expect(notice).toContainText('Commande')
  await notice.getByRole('button', { name: 'Annuler' }).click()
  await expect(page.locator('.notice')).toContainText('Annulé')
  expect((await demoOrder('Sofía')).status).toBe('paid')
  await context.close()
})

test('phone order: products → day → window → customer → « Créer la commande »', async ({ page }) => {
  await login(page, LEA, 'tablette')
  await page.getByRole('link', { name: /Tél\./ }).click()
  await expect(page.locator('h1')).toHaveText('Commande téléphone')
  await page.getByRole('button', { name: /Un de plus : Paris-Brest/ }).click()
  await page.getByRole('button', { name: 'Choisir la cueillette' }).click()
  await page.getByRole('navigation', { name: 'Jour de cueillette' }).getByRole('link').first().click()
  await page.getByLabel('Prénom').fill('Gabriel')
  await page.getByLabel('Nom (facultatif)').fill('P. (démo)')
  await page.getByLabel('Tél.').fill('514 555 0199')
  await page.getByRole('button', { name: 'Créer la commande' }).click()
  await expect(page.locator('h1')).toHaveText(/Commande \d+/)
  await expect(page.locator('.st-snack, .notice')).toContainText('à payer au comptoir')
  const [o] = await sql(`select status, source, payment_provider from orders where customer_first_name = 'Gabriel' order by id desc limit 1`)
  expect(o).toEqual({ status: 'paid', source: 'phone', payment_provider: 'counter' })
})

test('production list: grouped quantities, printed snapshot', async ({ page }) => {
  await login(page, OWNER)
  await page.goto('/commandes/?onglet=production')
  await expect(page.getByRole('heading', { name: /Production/ })).toBeVisible()
  await page.evaluate(() => (window.print = () => {}))
  await page.getByRole('button', { name: 'Imprimer' }).click()
  await expect(page.getByText(/Imprimée à/)).toBeVisible()
})
