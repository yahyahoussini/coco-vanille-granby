// Long lists and price tables: the price note said once above a list, the rest of a long family one tap away with its
// links still in the HTML, a name printed once on /prix/, no overprint, a request form that can be reached in one tap
// (the phone list used to shrink by 1357 px once the page woke up, after the browser had scrolled to #demande).
import { test, expect } from '@playwright/test'
import { PUBLIC_URL, raw } from './support/site.js'

test.describe.configure({ timeout: 180_000 })

const PHONE = { width: 390, height: 844 }
const COMPUTER = { width: 1280, height: 800 }
const mainOf = (html) => /<main[\s\S]*<\/main>/.exec(html)?.[0] || ''

for (const [name, viewport] of [['phone', PHONE], ['computer', COMPUTER]]) {
  test.describe(`lists, ${name}`, () => {
    test.use({ viewport })

    test('/commander/: the first family open, the others closed with their count, one price note', async ({ page }) => {
      await page.goto('/commander/')
      const families = page.locator('.order-group > details')
      test.skip((await families.count()) === 0, 'needs the demo data: ordering on and several families')
      await expect(families.first()).toHaveAttribute('open', '')
      for (let i = 1; i < (await families.count()); i++) await expect(families.nth(i)).not.toHaveAttribute('open', '')
      await expect(page.locator('.order-group .fold-summary').first()).toContainText(/\d+ produits?|1 produit/)
      await expect(page.locator('.order-products .price-note')).toHaveCount(1)
      await expect(page.locator('.order-card .price-tax')).toHaveCount(0)
      await expect(page.locator('.order-jump a[href="#commande-en-ligne"]')).toHaveText('Choisir des produits')
      await expect(page.locator('.order-jump a[href="#demande"]')).toHaveText('Demander un gâteau')
    })

    test('/commander/: an anchor to a closed family opens it, and « Demander un gâteau » lands on the form', async ({ page }) => {
      await page.goto('/commander/')
      const closed = page.locator('.order-group > details:not([open]) .order-group-title').first()
      test.skip((await closed.count()) === 0, 'needs the demo data: ordering on and several families')
      const id = await closed.getAttribute('id')
      await page.goto(`/commander/#${id}`)
      await expect(page.locator(`.order-group:has(#${id}) details`)).toHaveAttribute('open', '')

      await page.goto('/')
      await page.locator('main a[href="/commander/#demande"]').first().click()
      await page.waitForURL('**/commander/#demande')
      await page.waitForLoadState('load')
      await page.waitForTimeout(2000)
      const top = await page.locator('#demande').evaluate((el) => el.getBoundingClientRect().top)
      expect(top).toBeGreaterThanOrEqual(0)
      expect(top).toBeLessThan(viewport.height / 2)
    })

    test('/carte/: a long family folds after 8 products, its links stay in the HTML', async ({ page }) => {
      const html = mainOf((await raw(`${PUBLIC_URL}/carte/`, { timeout: 170_000 })).body)
      await page.goto('/carte/')
      await expect(page.locator('.product-card .price-tax')).toHaveCount(0)
      const families = page.locator('.menu-family:has(> details)')
      test.skip((await families.count()) === 0, 'no family long enough to fold')
      for (let i = 0; i < (await families.count()); i++) {
        const family = families.nth(i)
        const fold = family.locator('> details')
        await expect(family.locator('> ul .product-card')).toHaveCount(8)
        await expect(fold).not.toHaveAttribute('open', '')
        const others = await fold.locator('.product-card').count()
        expect(others).toBeGreaterThanOrEqual(4)
        await expect(fold.locator('summary')).toHaveText(`Voir les ${others} autres`)
        const href = await fold.locator('.product-card-title a').first().getAttribute('href')
        expect(html).toContain(`href="${href}"`)
        await fold.locator('summary').click()
        await expect(fold.locator('.product-card-title a').first()).toBeVisible()
      }
    })

    test('/prix/: a name printed once per product, the notes above the tables, never over the next line', async ({ page }) => {
      await page.goto('/prix/')
      await expect(page.locator('.sizes-tax')).toHaveCount(0)
      const firstTable = await page.locator('.prices table').first().boundingBox()
      const asOf = await page.locator('.prices-as-of').boundingBox()
      expect(asOf.y).toBeLessThan(firstTable.y)
      const groups = await page.locator('.price-table tbody').evaluateAll((list) =>
        list.map((tbody) => ({
          names: tbody.querySelectorAll('.price-name').length,
          scope: tbody.querySelector('.price-name')?.getAttribute('scope'),
          span: Number(tbody.querySelector('.price-name')?.getAttribute('rowspan') || 1),
          rows: tbody.rows.length,
        })),
      )
      expect(groups.length).toBeGreaterThan(0)
      for (const g of groups) {
        expect(g.names).toBe(1)
        expect(g.span).toBe(g.rows)
        expect(g.scope).toBe(g.rows > 1 ? 'rowgroup' : 'row')
      }
      // In view (the folds stay closed): the text of a name never meets the line under it.
      const overprints = await page.locator('.price-table tbody').evaluateAll((list) => {
        // The text itself: a name's link has a tall tap target that may reach under the next line without touching it.
        const textBox = (el) => {
          const range = document.createRange()
          const text = document.createTreeWalker(el, NodeFilter.SHOW_TEXT).nextNode()
          if (!text) return { left: 0, right: 0, top: 0, bottom: 0 }
          range.selectNodeContents(text)
          return range.getBoundingClientRect()
        }
        return list
          .filter((tbody) => tbody.getBoundingClientRect().width > 0)
          .filter((tbody) => {
            const name = textBox(tbody.querySelector('.price-name'))
            return [...tbody.querySelectorAll('.price-size, .price-portions')].some((cell) => {
              const box = textBox(cell)
              return box.left < name.right - 1 && box.right > name.left + 1 && box.top < name.bottom - 1 && box.bottom > name.top + 1
            })
          })
          .map((tbody) => tbody.querySelector('.price-name').textContent)
      })
      expect(overprints).toEqual([])
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
    })

    test('/allergenes/: a product nobody checked never shows a dash, and its name is one tap away', async ({ page }) => {
      await page.goto('/allergenes/')
      const fold = page.locator('.allergen-lists details')
      test.skip((await fold.count()) === 0, 'every product has its allergens checked')
      await expect(page.locator('.allergen-ask')).toBeVisible()
      const n = await fold.locator('.allergen-ask-list li').count()
      await expect(fold.locator('summary')).toContainText(`${n} produit`)
      await expect(fold.locator('.allergen-ask-list')).not.toBeVisible()
      await fold.locator('summary').click()
      await expect(fold.locator('.allergen-ask-list')).toBeVisible()
      expect(await fold.locator('.allergen-ask-list').textContent()).not.toContain('—')
    })
  })
}

test.describe('order rows on a phone', () => {
  test.use({ viewport: PHONE })

  test('a row keeps its height when the page wakes up', async ({ browser, page }) => {
    await page.goto('/commander/')
    await page.waitForFunction(() => document.querySelector('.qty.is-ready'))
    const measure = () =>
      [...document.querySelectorAll('.order-card')].filter((c) => c.getBoundingClientRect().height > 0).map((c) => Math.round(c.getBoundingClientRect().height))
    const awake = await page.evaluate(measure)
    test.skip(!awake.length, 'needs the demo data: ordering on')
    const context = await browser.newContext({ viewport: PHONE, javaScriptEnabled: false, baseURL: PUBLIC_URL, locale: 'fr-CA' })
    const off = await context.newPage()
    await off.goto('/commander/')
    expect(await off.evaluate(measure)).toEqual(awake)
    await context.close()
  })
})

test('the custom-cake page sends its button to the request form', async ({ page }) => {
  await page.goto('/gateaux-personnalises-granby/')
  const button = page.locator('.conversion-band .btn-primary')
  await expect(button).toHaveAttribute('href', '/commander/#demande')
  await expect(button).toContainText('Demander un gâteau')
})
