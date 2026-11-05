// Pictures: nothing written on any of them (owner's decision, research/sessions/04 #14), the credits the licences require
// still under the two that need them, and a stock picture never in a product's structured data.
import { test, expect } from '@playwright/test'

test.describe('pictures', () => {
  for (const path of ['/', '/carte/', '/commander/', '/gateaux/', '/faq/']) {
    test(`${path}: no notice on a picture`, async ({ page }) => {
      await page.goto(path)
      await expect(page.locator('.stock-photo-label')).toHaveCount(0)
      expect(await page.locator('main .stock-photo:not(figure)').allInnerTexts().then((t) => t.join('').trim())).toBe('')
    })
  }

  test('the Zoo photo keeps its CC BY-SA credit and its modification note', async ({ page }) => {
    await page.goto('/nous-trouver/zoo-de-granby/')
    const caption = page.locator('main .stock-caption').first()
    await expect(caption).toContainText('CC BY-SA 4.0')
    await expect(caption).toContainText('recadrée')
    await expect(caption.locator('a[rel~="license"]')).toHaveCount(1)
  })

  test('the map keeps its OpenStreetMap attribution', async ({ page }) => {
    await page.goto('/nous-trouver/')
    await expect(page.locator('main').getByText('OpenStreetMap').first()).toBeVisible()
  })

  test('a product’s structured data lists only the shop’s own photos', async ({ page }) => {
    await page.goto('/carte/')
    const hrefs = await page.locator('.product-card-title a').evaluateAll((links) => links.map((a) => a.getAttribute('href')))
    test.skip(!hrefs.length, 'no product on the menu')
    for (const href of hrefs.slice(0, 6)) {
      await page.goto(href)
      const json = await page.locator('script[type="application/ld+json"]').first().textContent()
      expect(json, href).not.toMatch(/"image":\s*\[?[^\]]*\/photos\//)
    }
  })
})
