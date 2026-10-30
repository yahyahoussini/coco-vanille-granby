// « Faits du site » (Plus): one answer fills its sentences on the public site at once, in French and English;
// an empty answer brings the marker back. Needs the seeds named in auth.spec.js.
import { test, expect } from '@playwright/test'
import { OWNER, login, sql } from './support.js'
import { PUBLIC_URL, raw } from '../support/site.js'

test.describe.configure({ mode: 'serial' })

// Whatever happens above, the shop's answer for this fact goes back to « not given ».
test.afterAll(async () => {
  await sql(`delete from site_facts where key = 'places'`)
})

test('the owner answers « places assises » once: Nous trouver says it in both languages, then the marker comes back', async ({ page }) => {
  await login(page, OWNER, 'ordinateur')
  await page.goto('/plus/faits/')
  await expect(page.locator('h1')).toHaveText('Faits du site')
  const card = page.locator('details.fact', { hasText: 'Combien de places assises?' })
  await expect(card.getByText('Nous trouver')).toBeVisible()
  await card.getByLabel('Réponse').fill('10 places')
  await card.getByLabel(/En anglais/).fill('10 seats')
  await card.getByRole('button', { name: 'Enregistrer' }).click()
  await expect(page.locator('.st-snack')).toContainText('Réponse enregistrée')

  const fr = (await raw(`${PUBLIC_URL}/nous-trouver/`)).body
  expect(fr).toMatch(/Nombre de places\s:\s10 places\./)
  expect(fr).not.toContain('nombre de places assises]]')
  expect((await raw(`${PUBLIC_URL}/en/visit/`)).body).toMatch(/Number of seats: 10 seats\./)

  // Answered facts leave the list unless « Voir aussi les faits déjà donnés » is chosen.
  await page.goto('/plus/faits/?tout=1')
  const again = page.locator('details.fact', { hasText: 'Combien de places assises?' })
  await again.locator('summary').click()
  await again.getByLabel('Réponse').fill('')
  await again.getByLabel(/En anglais/).fill('')
  await again.getByRole('button', { name: 'Enregistrer' }).click()
  await expect(page.locator('.st-snack')).toContainText('Réponse retirée')
  expect((await raw(`${PUBLIC_URL}/nous-trouver/`)).body).toContain('nombre de places assises]]')
})

test('English alone is refused: the French answer comes first (Loi 96)', async ({ page }) => {
  await login(page, OWNER, 'ordinateur')
  await page.goto('/plus/faits/')
  const card = page.locator('details.fact', { hasText: 'Combien de places assises?' })
  await card.getByLabel(/En anglais/).fill('10 seats')
  await card.getByRole('button', { name: 'Enregistrer' }).click()
  await expect(page.locator('.st-snack')).toContainText('Écrivez d’abord la réponse en français')
})
