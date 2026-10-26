// Cette semaine, Plus › Produits (price behind a step-up, human allergen check), Noter une question, Agence.
// Needs the demo seeds (see auth.spec.js).
import { test, expect } from '@playwright/test'
import { OWNER, MARC, AGENCY, LEA, login, sql } from './support.js'

test.describe.configure({ mode: 'serial' })

test('Cette semaine: 5 numbers, at most 3 cards, the Système tile', async ({ page }) => {
  await login(page, OWNER)
  await page.goto('/semaine/')
  await expect(page.locator('.numbers li')).toHaveCount(5)
  expect(await page.locator('section[aria-labelledby="actions-semaine"] .card').count()).toBeLessThanOrEqual(3)
  await expect(page.locator('.st-banner')).toContainText(/Système|textos/)
})

test('price change: step-up first, then applied with « Annuler », history kept', async ({ page }) => {
  await login(page, MARC)
  await page.goto('/plus/produits/')
  await page.getByRole('link', { name: /Paris-Brest/ }).click()
  await expect(page.locator('h1')).toHaveText('Paris-Brest')
  const field = page.getByLabel(/Nouveau prix/).first()
  await field.fill('7,25')
  await page.getByRole('button', { name: 'Changer le prix' }).first().click()
  await expect(page).toHaveURL(/\/verifier\//)
  await page.getByLabel(/Mot de passe/).fill(MARC.password)
  await page.getByRole('button', { name: 'Confirmer', exact: true }).click()
  await expect(page.locator('h1')).toHaveText('Paris-Brest')
  await page.getByLabel(/Nouveau prix/).first().fill('7,25')
  await page.getByRole('button', { name: 'Changer le prix' }).first().click()
  await expect(page.locator('.st-snack')).toContainText('7,25')
  await page.locator('.st-snack').getByRole('button', { name: 'Annuler' }).click()
  await expect(page.locator('.st-snack')).toContainText('ancien prix remis')
  const rows = await sql(`select action from audit_log where action like 'product.price%' order by id desc limit 2`)
  expect(rows.map((r) => r.action).sort()).toEqual(['product.price', 'product.price.undo'])
})

test('allergens: checked by a person, with a dated stamp', async ({ page }) => {
  await login(page, OWNER)
  await page.goto('/verifier/?retour=/plus/produits/')
  await page.getByLabel(/Mot de passe/).fill(OWNER.password)
  await page.getByRole('button', { name: 'Confirmer', exact: true }).click()
  await page.getByRole('link', { name: /Baguette/ }).click()
  await page.getByLabel('Contient : Blé et triticale').check()
  await page.getByRole('button', { name: 'Enregistrer la vérification' }).click()
  // The « J'ai vérifié » box is required: nothing is saved without it.
  expect(await page.getByLabel(/J’ai vérifié la recette/).evaluate((el) => el.validity.valueMissing)).toBe(true)
  await page.getByLabel(/J’ai vérifié la recette/).check()
  await page.getByRole('button', { name: 'Enregistrer la vérification' }).click()
  await expect(page.locator('.st-snack')).toContainText('vérifiés le')
  await expect(page.getByText(/^Vérifié le/)).toBeVisible()
})

test('Comptoir has no Produits screen; Noter une question works from the counter', async ({ page }) => {
  await login(page, LEA)
  await page.goto('/plus/produits/')
  await expect(page).toHaveURL(/\/$/)
  await page.goto('/plus/question/')
  await page.getByLabel(/La question/).fill('Avez-vous des gâteaux sans lactose? (démo)')
  await page.getByRole('button', { name: 'Noter la question' }).click()
  await expect(page.locator('.st-snack')).toContainText('Question notée')
})

test('Agence: read-only reports with empty states, no customer names', async ({ page }) => {
  await login(page, AGENCY, 'ordinateur')
  await expect(page.locator('h1')).toHaveText('Agence')
  await expect(page.getByRole('heading', { name: 'Gates' })).toBeVisible()
  await expect(page.getByText(/Aucun rapport de gates/)).toBeVisible()
  await expect(page.getByText(/Pas encore de scoreboard/)).toBeVisible()
  await page.goto('/commandes/')
  await expect(page.getByText(/des chiffres seulement/)).toBeVisible()
  const html = await page.content()
  for (const name of ['Julie', 'Mark S.', 'Camille', '+1514']) expect(html).not.toContain(name)
})
