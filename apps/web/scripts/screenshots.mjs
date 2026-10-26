// Screenshots of the public site and Coco Studio for a quick visual review.
//   node scripts/screenshots.mjs [outDir]
// Needs a running server (PUBLIC_URL / ADMIN_URL, default :3300) seeded with the demo seeds
// (npm run seed:demo + npm run seed:studio-demo with SEED_DEMO=true): demo values are labelled « (démo) ».
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { chromium } from '@playwright/test'

const PUBLIC_URL = process.env.PUBLIC_URL || 'http://localhost:3300'
const ADMIN_URL = process.env.ADMIN_URL || 'http://admin.localhost:3300'
const OWNER = { email: process.env.SHOT_EMAIL || 'proprio@exemple.test', password: process.env.SHOT_PASSWORD || 'coco-dev-only' }
const out = process.argv[2] || 'reports/screenshots'
mkdirSync(out, { recursive: true })

const PUBLIC_PAGES = [
  ['01-accueil', '/'],
  ['02-carte', '/carte/'],
  ['03-produit', '/viennoiseries/croissant-aux-amandes/'],
  ['04-commander', '/commander/'],
  ['05-nous-trouver', '/nous-trouver/'],
  ['06-calculateur', '/calculateur-portions-gateau/?invites=20'],
  ['07-home-en', '/en/'],
]
const STUDIO_PAGES = [
  ['11-studio-aujourdhui', '/'],
  ['12-studio-commandes', '/commandes/'],
  ['13-studio-demandes', '/demandes/'],
  ['14-studio-boutique', '/boutique/'],
  ['15-studio-vitrine', '/vitrine/'],
  ['16-studio-avis', '/avis/'],
  ['17-studio-semaine', '/semaine/'],
]

const browser = await chromium.launch()
const phone = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, locale: 'fr-CA', timezoneId: 'America/Toronto' }

const site = await browser.newContext(phone)
for (const [name, path] of PUBLIC_PAGES) {
  const page = await site.newPage()
  await page.goto(PUBLIC_URL + path, { waitUntil: 'networkidle' })
  await page.screenshot({ path: join(out, `${name}.png`), fullPage: true })
  await page.close()
}
const desktop = await browser.newContext({ ...phone, viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 })
const wide = await desktop.newPage()
await wide.goto(PUBLIC_URL + '/', { waitUntil: 'networkidle' })
await wide.screenshot({ path: join(out, '08-accueil-ordinateur.png'), fullPage: true })

const studio = await browser.newContext(phone)
const login = await studio.newPage()
await login.goto(ADMIN_URL + '/connexion/', { waitUntil: 'networkidle' })
await login.screenshot({ path: join(out, '10-studio-connexion.png'), fullPage: true })
await login.locator('#email').fill(OWNER.email)
await login.locator('#password').fill(OWNER.password)
await Promise.all([login.waitForLoadState('networkidle'), login.locator('button[type="submit"]').first().click()])
for (const [name, path] of STUDIO_PAGES) {
  await login.goto(ADMIN_URL + path, { waitUntil: 'networkidle' })
  await login.screenshot({ path: join(out, `${name}.png`), fullPage: true })
}

await browser.close()
console.log(`Screenshots written to ${out}`)
