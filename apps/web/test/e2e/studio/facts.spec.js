// « Faits du site » (Plus): one answer fills its sentences on the public site at once, in French and English; « C'est bon »
// keeps a proposal; an empty answer brings the agency's proposal back to check. Needs the seeds named in auth.spec.js.
import { test, expect } from '@playwright/test'
import { OWNER, login, sql } from './support.js'
import { PUBLIC_URL, raw } from '../support/site.js'

test.describe.configure({ mode: 'serial' })

// Whatever happens above, the shop's answer for this fact goes back to « not given ».
test.afterAll(async () => {
  await sql(`delete from site_facts where key = 'places'`)
})

const cardOf = (page) => page.locator('article.fact-card', { hasText: 'Combien de places assises?' })

test('the owner answers « places assises » once: Nous trouver says it in both languages, then the proposal comes back', async ({ page }) => {
  await login(page, OWNER, 'ordinateur')
  await page.goto('/plus/faits/')
  await expect(page.locator('h1')).toHaveText('Faits du site')
  const card = cardOf(page)
  await expect(card.getByText('Nous trouver')).toBeVisible()
  if (!(await card.locator('details[open]').count())) await card.locator('summary').click()
  await card.getByLabel('Réponse').fill('10 places')
  await card.getByLabel(/En anglais/).fill('10 seats')
  await card.getByRole('button', { name: 'Enregistrer' }).click()
  await expect(page.locator('.st-snack')).toContainText('Réponse enregistrée')

  const fr = (await raw(`${PUBLIC_URL}/nous-trouver/`)).body
  expect(fr).toMatch(/Nombre de places\s:\s10 places\./)
  expect((await raw(`${PUBLIC_URL}/en/visit/`)).body).toMatch(/Number of seats: 10 seats\./)

  // Checked facts leave the list unless « Voir aussi les réponses déjà vérifiées » is chosen.
  await page.goto('/plus/faits/?tout=1')
  const again = cardOf(page)
  await expect(again.locator('.tag')).toHaveText('Vérifié')
  await again.locator('summary').click()
  await again.getByLabel('Réponse').fill('')
  await again.getByLabel(/En anglais/).fill('')
  await again.getByRole('button', { name: 'Enregistrer' }).click()
  await expect(page.locator('.st-snack')).toContainText('Réponse retirée')
  expect((await raw(`${PUBLIC_URL}/nous-trouver/`)).body).toMatch(/Nombre de places\s:\sune dizaine\./)

  // The proposal is back to check; « C'est bon » keeps it as it is.
  await page.goto('/plus/faits/')
  const proposed = cardOf(page)
  await expect(proposed.locator('.tag')).toHaveText('À vérifier')
  await proposed.getByRole('button', { name: 'C’est bon' }).click()
  await expect(page.locator('.st-snack')).toContainText('Vérifié')
})

test('English alone is refused: the French answer comes first (Loi 96)', async ({ page }) => {
  await sql(`delete from site_facts where key = 'places'`)
  await login(page, OWNER, 'ordinateur')
  await page.goto('/plus/faits/')
  const card = cardOf(page)
  await card.getByLabel(/En anglais/).fill('10 seats')
  await card.getByRole('button', { name: 'Enregistrer' }).click()
  await expect(page.locator('.st-snack')).toContainText('Écrivez d’abord la réponse en français')
})
