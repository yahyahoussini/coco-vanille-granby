// Studio e2e helpers. Needs the ordering demo and the Studio demo seeds (SEED_DEMO=true), see auth.spec.js.
import { expect } from '@playwright/test'

export const OWNER = { email: 'proprio@exemple.test', password: 'coco-dev-only', pin: '0000' }
export const LEA = { name: 'Léa (démo)', email: 'lea.demo@comptoir.invalid', password: 'lea-demo-only', pin: '1111' }
export const MARC = { name: 'Marc (démo)', email: 'marc.demo@comptoir.invalid', password: 'marc-demo-only', pin: '2222' }
export const AGENCY = { email: 'agence.demo@exemple.test', password: 'agence-demo-only' }

export async function login(page, who = OWNER, device = 'telephone') {
  await page.goto('/connexion/')
  await page.getByLabel('Courriel').fill(who.email)
  await page.getByLabel('Mot de passe').fill(who.password)
  await page.locator(`input[name="appareil"][value="${device}"]`).check({ force: true })
  await page.getByRole('button', { name: 'Se connecter' }).click()
  await expect(page.locator('h1')).not.toHaveText('Coco Studio')
}

// A Studio action from inside the page (same origin, the browser's own cookies and headers).
export function action(page, type, input = {}, key = null) {
  return page.evaluate(
    async ({ type, input, key }) => {
      const res = await fetch('/svc/action/', { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify({ type, input, key }) })
      return { status: res.status, body: await res.json() }
    },
    { type, input, key },
  )
}

export async function stepUp(page, password = OWNER.password) {
  await page.goto('/verifier/?retour=/plus/reglages/')
  await page.getByLabel(/Mot de passe/).fill(password)
  await page.getByRole('button', { name: 'Confirmer', exact: true }).click()
  await expect(page).toHaveURL(/\/plus\/reglages\//)
}
