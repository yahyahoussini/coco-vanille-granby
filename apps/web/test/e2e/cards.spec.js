// Product cards on a phone, a narrow phone, a tablet and a computer: the whole picture inside its frame (the shop's
// photos are 4:5 canvases, most frames are not), the frame clear of the name and the price, the price clear of the
// round button and inside the card, the « Illustration » notice never cut off.
import { test, expect } from '@playwright/test'

const SCREENS = [
  ['phone', 390, 844],
  ['narrow phone', 360, 740],
  ['tablet', 820, 1100],
  ['computer', 1280, 800],
]

// Runs in the page; one sentence per problem found.
function auditCards() {
  const problems = []
  const textBox = (el) => {
    const range = document.createRange()
    range.selectNodeContents(el)
    return range.getBoundingClientRect()
  }
  const meets = (a, b) => a.width > 0 && b.width > 0 && a.left < b.right - 1 && a.right > b.left + 1 && a.top < b.bottom - 1 && a.bottom > b.top + 1
  const outside = (inner, outer) => inner.top < outer.top - 1 || inner.bottom > outer.bottom + 1 || inner.left < outer.left - 1 || inner.right > outer.right + 1
  for (const frame of document.querySelectorAll('.card-media, .product-media')) {
    const f = frame.getBoundingClientRect()
    if (!f.width) continue
    const card = frame.closest('.product-card, .order-card')
    const name = card?.querySelector('.product-card-title, .order-card-title')?.textContent.trim() || document.querySelector('h1')?.textContent.trim()
    const img = frame.querySelector('img')
    if (img && outside(img.getBoundingClientRect(), f)) problems.push(`${name}: the picture runs past its frame`)
    const label = frame.querySelector('.stock-photo-label')
    if (label && label.scrollWidth > label.clientWidth + 1) problems.push(`${name}: the notice on the picture is cut off`)
    if (!card) continue
    for (const el of card.querySelectorAll('.product-card-title a, .order-card-title a, .price, .order-ready')) {
      if (meets(textBox(el), f)) problems.push(`${name}: the frame covers « ${el.textContent.trim().slice(0, 20)} »`)
    }
    const price = card.querySelector('.price')
    if (price) {
      const p = textBox(price)
      if (p.right > card.getBoundingClientRect().right + 1) problems.push(`${name}: the price runs past the card`)
      for (const button of card.querySelectorAll('.card-add, .card-go')) {
        if (meets(p, button.getBoundingClientRect())) problems.push(`${name}: the price runs under the round button`)
      }
    }
  }
  return problems
}

for (const [screen, width, height] of SCREENS) {
  test.describe(`product cards, ${screen}`, () => {
    test.use({ viewport: { width, height } })

    for (const path of ['/carte/', '/commander/']) {
      test(`${path} shows every picture whole and every price clear`, async ({ page }) => {
        expect((await page.goto(path)).status()).toBe(200)
        await page.waitForLoadState('load')
        expect(await page.evaluate(auditCards)).toEqual([])
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
      })
    }

    test('a product page shows its picture whole', async ({ page }) => {
      await page.goto('/carte/')
      const href = await page.locator('.product-card-title a').first().getAttribute('href')
      test.skip(!href, 'no product on the menu')
      expect((await page.goto(href)).status()).toBe(200)
      expect(await page.evaluate(auditCards)).toEqual([])
    })
  })
}
