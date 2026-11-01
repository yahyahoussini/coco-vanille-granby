// Studio « Journal » end to end: the agency writes a post, it stays private while it is a draft, « Publier » puts
// it on the public site (local APP_ROLE=all clears its own cache), « Retirer du site » takes it off; one post a
// week for the agency; Comptoir has no Journal. Traduction's English-only rights are covered by the unit tests
// (test/unit/studio/journal-actions.test.js): the demo seeds have no Traduction account. Needs the seeds named in
// auth.spec.js.
import { test, expect } from '@playwright/test'
import { OWNER, AGENCY, LEA, login, action, sql } from './support.js'
import { PUBLIC_URL, raw } from '../support/site.js'

test.describe.configure({ mode: 'serial' })

const TOKEN = `e2e${Date.now().toString(36)}`
// Yesterday in Granby: never refused as a past date, and already public at 6 h whatever the hour of the run.
const yesterday = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Toronto' }).format(new Date(Date.now() - 86_400_000))
const words = (n, lead) => `${lead} ${Array.from({ length: n - lead.split(' ').length }, (_, i) => `mot${i}`).join(' ')}.`

function form(n) {
  const f = {
    category: 'conseils',
    photo: 'viennoiseries',
    related: ['viennoiseries', 'nous-trouver'],
    publishedAt: yesterday,
    src0_label: 'MAPAQ, Thermoguide',
    src0_url: 'https://www.mapaq.gouv.qc.ca/thermoguide',
    src0_date: yesterday,
    slug: `${TOKEN}-billet-${n}`,
    title: `Billet de test ${TOKEN} numéro ${n}`,
    description: `Billet de test ${TOKEN} numéro ${n} : il vérifie que Studio publie, programme et retire un billet du Journal de Pâtisserie Coco Vanille.`.padEnd(150, '.'),
    h1: `Billet de test ${TOKEN} numéro ${n}`,
    answer: words(50, `Pâtisserie Coco Vanille à Granby en 2026, test ${TOKEN}`),
    changeNote: 'Billet de test.',
  }
  for (const i of [0, 1, 2]) Object.assign(f, { [`s${i}_heading`]: `Question ${TOKEN} ${n}.${i}?`, [`s${i}_answer`]: words(30, `Réponse ${i} de Pâtisserie Coco Vanille`) })
  for (const i of [0, 1, 2, 3, 4]) Object.assign(f, { [`f${i}_q`]: `Question fréquente ${TOKEN} ${n}.${i}?`, [`f${i}_a`]: words(60, `Réponse ${i}`) })
  return f
}

test.afterAll(async () => {
  await sql(`delete from posts where key like $1`, [`${TOKEN}%`])
})

let id
test('the agency writes a draft: the public address answers 404', async ({ page }) => {
  await login(page, AGENCY, 'ordinateur')
  await page.goto('/plus/journal/')
  await expect(page.locator('h1')).toHaveText('Journal')
  const r = await action(page, 'post.saveFr', form(1))
  expect(r.body.ok, r.body.message).toBe(true)
  id = r.body.data.id
  expect((await raw(`${PUBLIC_URL}/journal/${TOKEN}-billet-1/`)).status).toBe(404)
  await page.goto(`/plus/journal/${id}/`)
  await expect(page.locator('.tag', { hasText: 'Brouillon' }).first()).toBeVisible()
})

test('« Publier » without the box is refused; with it the post is public, then « Retirer du site » takes it off', async ({ page }) => {
  await login(page, OWNER, 'ordinateur')
  expect((await action(page, 'post.publish', { id, publishedAt: yesterday })).body.code).toBe('verify')
  const ok = await action(page, 'post.publish', { id, publishedAt: yesterday, verified: 'on', override: '1' })
  expect(ok.body.ok, ok.body.message).toBe(true)
  const live = await raw(`${PUBLIC_URL}/journal/${TOKEN}-billet-1/`)
  expect(live.status).toBe(200)
  expect(live.body).toContain(`Billet de test ${TOKEN} numéro 1`)
  const off = await action(page, 'post.unpublish', { id, reason: 'Fin du test.' })
  expect(off.body.ok, off.body.message).toBe(true)
  expect((await raw(`${PUBLIC_URL}/journal/${TOKEN}-billet-1/`)).status).toBe(404)
  // Back on for the next case (the week is taken).
  expect((await action(page, 'post.publish', { id, publishedAt: yesterday, verified: 'on', override: '1' })).body.ok).toBe(true)
})

test('a second post the same week is refused for the agency', async ({ page }) => {
  await login(page, AGENCY, 'ordinateur')
  const second = await action(page, 'post.saveFr', form(2))
  expect(second.body.ok, second.body.message).toBe(true)
  const r = await action(page, 'post.publish', { id: second.body.data.id, publishedAt: yesterday, verified: 'on', override: '1' })
  expect(r.body.code).toBe('one_per_week')
})

test('Comptoir has no Journal', async ({ page }) => {
  await login(page, LEA)
  await page.goto('/plus/journal/')
  await expect(page).not.toHaveURL(/\/plus\/journal\//)
})
