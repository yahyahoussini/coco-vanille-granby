// WCAG 2.2 AA on the Studio screens (16 AC3): axe with the 2.2 rules, target size included, at phone width.
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { OWNER, login, sql } from './support.js'

const SCREENS = ['/', '/commandes/', '/commandes/?onglet=production', '/commandes/telephone/', '/vitrine/', '/demandes/', '/avis/', '/boutique/', '/semaine/', '/plus/', '/plus/produits/', '/plus/reglages/', '/plus/question/', '/agence/']

test.use({ viewport: { width: 390, height: 844 } })

test('login and PIN screens have no WCAG 2.2 AA violations', async ({ page }) => {
  for (const path of ['/connexion/', '/qui/', '/hors-ligne/']) {
    await page.goto(path)
    const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()
    expect(r.violations.map((v) => `${path} ${v.id}: ${v.nodes.length}`), path).toEqual([])
  }
})

test('every daily screen has no WCAG 2.2 AA violations (one h1, labels, contrast, 24 px targets)', async ({ page }) => {
  await login(page, OWNER)
  const found = []
  for (const path of SCREENS) {
    await page.goto(path)
    await expect(page.locator('h1')).toHaveCount(1)
    const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()
    for (const v of r.violations) found.push(`${path} ${v.id} (${v.nodes.length}): ${v.nodes[0]?.target?.join(' ')}`)
  }
  expect(found, found.join('\n')).toEqual([])
})

test('targets: buttons and tabs ≥ 48 × 48 px, primary buttons ≥ 64 px tall (16 §3.0)', async ({ page }) => {
  await login(page, OWNER)
  const small = []
  for (const path of ['/', '/vitrine/', '/boutique/', '/commandes/']) {
    await page.goto(path)
    const r = await page.evaluate(() =>
      [...document.querySelectorAll('.btn, .st-tabs a, .st-chip, .choice span, summary.btn')]
        .filter((el) => el.offsetParent !== null)
        .map((el) => {
          const b = el.getBoundingClientRect()
          return { text: (el.textContent || '').trim().slice(0, 30), w: b.width, h: b.height, primary: el.classList.contains('btn-primary') }
        }),
    )
    for (const t of r) {
      if (t.w < 47.5 || t.h < 47.5) small.push(`${path} « ${t.text} » ${Math.round(t.w)}×${Math.round(t.h)}`)
      if (t.primary && t.h < 63.5) small.push(`${path} primary « ${t.text} » ${Math.round(t.h)} px tall`)
    }
  }
  expect(small, small.join('\n')).toEqual([])
})

// WCAG 1.4.10 Reflow: 320 CSS px (a small phone, or 400 % zoom) never scrolls sideways, with a long name too.
test.describe('reflow at 320 px', () => {
  test.use({ viewport: { width: 320, height: 640 } })
  test('no screen scrolls horizontally', async ({ page }) => {
    await login(page, OWNER)
    const [product] = await sql('select id from products order by id limit 1')
    const wide = []
    for (const path of [...SCREENS, `/plus/produits/${product.id}/`]) {
      await page.goto(path)
      const r = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }))
      if (r.scroll > r.client) wide.push(`${path} ${r.scroll} > ${r.client}`)
    }
    expect(wide, wide.join('\n')).toEqual([])
  })
})
