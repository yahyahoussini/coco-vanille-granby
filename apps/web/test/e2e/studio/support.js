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
  await page.waitForURL((url) => !url.pathname.startsWith('/connexion'))
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

// Read-only checks in the dev database (DATABASE_URI from .env), e.g. « the texto is queued ».
export async function sql(text, params = []) {
  const { default: pg } = await import('pg')
  const client = new pg.Client({ connectionString: process.env.DATABASE_URI || 'postgres://cv:cv@127.0.0.1:5432/coco_vanille' })
  await client.connect()
  try {
    return (await client.query(text, params)).rows
  } finally {
    await client.end()
  }
}

// The demo order of a customer (Studio demo seed), by first name.
export async function demoOrder(firstName) {
  const rows = await sql(`select id, number, status from orders where customer_first_name = $1 and customer_last_name like '%(démo)%' order by id desc limit 1`, [firstName])
  return rows[0]
}

export const card = (page, name) => page.locator('article.card', { hasText: name })
