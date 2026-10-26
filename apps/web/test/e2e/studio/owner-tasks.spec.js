// Ease-of-use tasks with the owner (16 §8.3): T1 sold out, T3 quote with deposit, T5 review reply.
// T2 (Marquer prête) is in today.spec.js and T4 (storm closure) in boutique.spec.js. Taps are counted from
// Aujourd'hui against the daily targets. Needs the demo seeds (see auth.spec.js).
import { test, expect } from '@playwright/test'
import sharp from 'sharp'
import { OWNER, login, sql } from './support.js'

test.describe.configure({ mode: 'serial' })

function counter(page) {
  const state = { taps: 0 }
  state.tap = async (locator) => {
    state.taps += 1
    await locator.click()
  }
  return state
}

test('T1 « Il n’y a plus de croissants aux amandes. Faites-le savoir sur le site. » in 2 taps', async ({ page }) => {
  await login(page, OWNER)
  const t = counter(page)
  const started = Date.now()
  await t.tap(page.getByRole('link', { name: /Épuisé/ }))
  await expect(page.locator('h1')).toHaveText('Vitrine')
  await t.tap(page.getByRole('button', { name: 'Épuisé : Croissant aux amandes' }))
  await expect(page.locator('.st-snack')).toContainText('Croissant aux amandes : épuisé jusqu’à')
  expect(t.taps).toBe(2)
  expect(Date.now() - started).toBeLessThan(15_000)
  const [p] = await sql(`select availability, sold_out_until from products where id in (select _parent_id from products_locales where slug = 'croissant-aux-amandes') limit 1`)
  expect(p.availability).toBe('soldout')
  expect(new Date(p.sold_out_until).getTime()).toBeGreaterThan(Date.now())
  // The snackbar offers « Changer la durée »; put it back for the next run.
  await expect(page.locator('.st-snack').getByRole('link', { name: 'Changer la durée' })).toBeVisible()
  await page.getByRole('button', { name: 'Remettre en vente : Croissant aux amandes' }).click()
  await expect(page.locator('.st-snack')).toContainText('de nouveau en vente')
})

test('T3 « Envoyez un prix de 120 $ avec l’acompte. » in 3 taps + the amount', async ({ page }) => {
  await login(page, OWNER)
  const t = counter(page)
  const started = Date.now()
  await t.tap(page.locator('.card', { hasText: 'Demande · Anniversaire · 20 pers.' }).getByRole('link', { name: 'Ouvrir' }))
  await t.tap(page.locator('article', { hasText: 'Anniversaire · 20 pers.' }).getByRole('link', { name: 'Chiffrer et envoyer' }))
  await expect(page.locator('h1')).toHaveText('Chiffrer')
  await page.getByLabel('Prix total, avant taxes').fill('120')
  await expect(page.locator('.numbers')).toContainText('36,00')
  await t.tap(page.getByRole('button', { name: 'Envoyer le lien d’acompte' }))
  await expect(page.locator('.st-snack')).toContainText('Soumission envoyée · acompte 36,00')
  await expect(page).toHaveURL(/\/demandes\/(#.*)?$/)
  expect(t.taps).toBe(3)
  expect(Date.now() - started).toBeLessThan(90_000)
  const [r] = await sql(`select id, status, quote_total_cents::int as total, quote_deposit_cents::int as deposit from requests where customer_first_name = 'Camille' order by id desc limit 1`)
  expect(r).toMatchObject({ status: 'quoted', total: 12000, deposit: 3600 })
  const msgs = await sql(`select channel, status, send_after from messages where request_id = $1 order by channel`, [r.id])
  expect(msgs.map((m) => m.channel).sort()).toEqual(['email', 'sms'])
  expect(msgs.every((m) => m.status === 'queued' && new Date(m.send_after).getTime() > Date.now())).toBe(true)
})

test('T5 « Répondez à l’avis 5 étoiles de ce matin. » without the Google API: copy, open Google, « J’ai répondu »', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await login(page, OWNER)
  const t = counter(page)
  await t.tap(page.getByRole('navigation', { name: 'Écrans' }).getByRole('link', { name: /Avis/ }))
  const card = page.locator('article', { hasText: 'Julie T. (démo)' })
  const draft = card.getByRole('textbox')
  await expect(draft).toHaveValue(/^Merci beaucoup, Julie! On est contents que le Paris-Brest vous ait plu\./)
  await expect(draft).toHaveValue(/— L’équipe Coco Vanille$/)
  await t.tap(card.getByRole('button', { name: 'Copier la réponse' }))
  await expect(card.getByRole('button', { name: 'Copié ✓' })).toBeVisible()
  await expect(card.getByRole('link', { name: 'Ouvrir Google' })).toHaveAttribute('href', /google\.com/)
  await t.tap(card.getByRole('button', { name: 'J’ai répondu' }))
  await expect(page.locator('.st-snack')).toContainText('Réponse notée')
  expect(t.taps).toBeLessThanOrEqual(4)
  const [rev] = await sql(`select status, reply from reviews where author like 'Julie T.%' order by id desc limit 1`)
  expect(rev.status).toBe('answered')
  expect(rev.reply).toMatch(/Paris-Brest/)
})

test('photo of the day: compressed on the phone, published with facts-only alt text', async ({ page }) => {
  await login(page, OWNER)
  await page.goto('/vitrine/')
  const jpeg = await sharp({ create: { width: 3000, height: 2000, channels: 3, background: '#c8915a' } }).jpeg().toBuffer()
  await page.locator('#photo-vitrine').setInputFiles({ name: 'vitrine.jpg', mimeType: 'image/jpeg', buffer: jpeg })
  await page.getByRole('button', { name: 'Publier' }).click()
  await expect(page.locator('.st-snack')).toContainText('Photo publiée sur le site')
  await expect(page.getByText(/Sur le site depuis/)).toBeVisible()
  const img = page.locator('.photo-day img').first()
  await expect(img).toHaveAttribute('alt', /^Vitrine de Pâtisserie Coco Vanille, /)
  await expect(img).toHaveAttribute('width', /\d+/)
})
