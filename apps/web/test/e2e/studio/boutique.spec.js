// Boutique & heures (16 §3.6, §8.3 T4): closure with the effects preview and the 60 s grace, busy mode,
// hours editor with the sticky save bar. Needs the demo seeds (see auth.spec.js).
import { test, expect } from '@playwright/test'
import { OWNER, LEA, login, sql, demoOrder } from './support.js'
import { PUBLIC_URL, raw } from '../support/site.js'

test.describe.configure({ mode: 'serial' })

test('T4 « Tempête demain. Fermez la boutique toute la journée et prévenez les clients. » in 5 taps', async ({ page }) => {
  await login(page, OWNER)
  let taps = 0
  const tap = async (locator) => {
    taps += 1
    await locator.click()
  }
  await tap(page.locator('a.st-status'))
  await expect(page.locator('h1')).toHaveText('Boutique & heures')
  await tap(page.getByText('Fermeture exceptionnelle', { exact: true }))
  await tap(page.locator('label.choice', { hasText: 'Tempête' }))
  await tap(page.locator('label.choice', { hasText: /^Demain$/ }))
  const fx = page.locator('.fx[data-duree="demain"]')
  await expect(fx).toBeVisible()
  await expect(fx).toContainText('texter 1 client')
  await expect(page.locator('.fx[data-duree="jour"]')).toBeHidden()
  await tap(page.getByRole('button', { name: 'Fermer la boutique' }))
  await expect(page.locator('.st-snack')).toContainText('les textos partent dans 60 s')
  expect(taps).toBeLessThanOrEqual(5)
  const nadia = await demoOrder('Nadia')
  const [sms] = await sql(`select status, body from messages where order_id = $1 and template = 'closure'`, [nadia.id])
  expect(sms.status).toBe('queued')
  expect(sms.body).toMatch(/^Coco Vanille : fermé le/)
  // The public site says it on its next request (the write refreshed its ISR pages), in French and English,
  // and tomorrow is closed in the hours table.
  const banner = /<p class="closure-banner is-notice"[^>]*>Fermeture exceptionnelle le [^<]+\./
  expect((await raw(`${PUBLIC_URL}/`)).body).toMatch(banner)
  expect((await raw(`${PUBLIC_URL}/carte/`)).body).toMatch(banner)
  expect((await raw(`${PUBLIC_URL}/en/`)).body).toMatch(/Closed on [^<]+ \(exceptional closure\)\./)
  expect((await raw(`${PUBLIC_URL}/nous-trouver/`)).body).toMatch(/<tr class="special-closed">/)
  // « Annuler » inside the 60 s: nothing leaves, tomorrow is open again.
  await page.locator('.st-snack').getByRole('button', { name: 'Annuler' }).click()
  await expect(page.locator('.st-snack')).toContainText('aucun texto n’est parti')
  const [after] = await sql(`select status from messages where order_id = $1 and template = 'closure'`, [nadia.id])
  expect(after.status).toBe('cancelled')
  expect((await raw(`${PUBLIC_URL}/`)).body).not.toMatch(/closure-banner/)
})

test('Comptoir: « Délai allongé +1 h » with undo; no closure button', async ({ page }) => {
  await login(page, LEA, 'tablette')
  await page.goto('/boutique/')
  await expect(page.getByText('Fermeture exceptionnelle', { exact: true })).toHaveCount(0)
  await page.getByText('Délai allongé', { exact: true }).click()
  await page.getByRole('button', { name: 'Allonger le délai' }).click()
  await expect(page.locator('.st-snack')).toContainText('Délai allongé de 1 h')
  await expect(page.locator('.st-banner')).toContainText('Délai allongé de 1 h')
  await page.locator('.st-snack').getByRole('button', { name: 'Annuler' }).click()
  await expect(page.locator('.st-banner', { hasText: 'Délai allongé' })).toHaveCount(0)
})

test('hours editor: the save bar appears on the first change, « Ignorer » resets', async ({ page }) => {
  await login(page, OWNER)
  await page.goto('/boutique/')
  const bar = page.locator('.savebar')
  await expect(bar).toBeHidden()
  await page.getByLabel('Fermeture lundi').fill('17:00')
  await expect(bar).toBeVisible()
  await expect(bar).toContainText('Modifications non enregistrées')
  await bar.getByRole('button', { name: 'Ignorer' }).click()
  await expect(bar).toBeHidden()
})
