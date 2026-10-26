// Public-site content module: OG cards, /llms.txt, the serving calculator without JavaScript, home blocks,
// legal translations and visit link-outs. Runs against the seeded database (markers allowed: PUBLISH_GUARD=show).
import { test, expect } from '@playwright/test'
import { PUBLIC_URL, SITE_ORIGIN, raw, local, inspect, ldNodes, hasType, sitemapLocs } from './support/site.js'

const png = (buf) => ({ signature: buf.subarray(1, 4).toString('latin1'), width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) })

test.describe('Open Graph cards', () => {
  test('every page points to a 1200×630 PNG card of its own', async ({ page, request }) => {
    for (const path of ['/', '/en/', '/carte/', '/en/menu/', '/conditions-de-vente/']) {
      const res = await raw(`${PUBLIC_URL}${path}`)
      expect(res.status, path).toBe(200)
      const ogImage = await page.evaluate((html) => new DOMParser().parseFromString(html, 'text/html').querySelector('meta[property="og:image"]')?.getAttribute('content'), res.body)
      expect(ogImage, `${path} og:image`).toMatch(new RegExp(`^${SITE_ORIGIN}(/en)?/og/[a-z-]+\\.png$`))
      const card = await request.get(local(ogImage))
      expect(card.status(), ogImage).toBe(200)
      expect(card.headers()['content-type']).toBe('image/png')
      const info = png(await card.body())
      expect(info).toEqual({ signature: 'PNG', width: 1200, height: 630 })
    }
  })

  test('an unknown card is a 404', async ({ request }) => {
    expect((await request.get(`${PUBLIC_URL}/og/page-inconnue.png`)).status()).toBe(404)
  })
})

test.describe('/llms.txt', () => {
  test('carries the JSON-LD facts and only links the sitemap lists', async ({ page }) => {
    const res = await raw(`${PUBLIC_URL}/llms.txt`)
    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toMatch(/^text\/plain/)
    expect(res.body.split('\n')[0]).toBe('# Pâtisserie Coco Vanille')
    expect(res.body).not.toMatch(/\[\[FACT NEEDED/)

    const home = await inspect(page, (await raw(`${PUBLIC_URL}/`)).body)
    const bakery = ldNodes(home.jsonld.map((j) => JSON.parse(j))).find((n) => hasType(n, 'Bakery'))
    expect(res.body).toContain(bakery.name)
    expect(res.body).toContain(bakery.telephone)
    expect(res.body).toContain(bakery.address.streetAddress)

    const locs = new Set(sitemapLocs((await raw(`${PUBLIC_URL}/sitemap.xml`)).body))
    const links = [...res.body.matchAll(/\]\((https:\/\/[^)]+)\)/g)].map((m) => m[1])
    expect(links.length).toBeGreaterThan(10)
    for (const href of links) expect(locs.has(href), `${href} is in the sitemap`).toBe(true)
  })
})

test.describe('serving calculator, JavaScript off', () => {
  test.use({ javaScriptEnabled: false })

  test('the GET form is answered by the server', async ({ page }) => {
    await page.goto(`${PUBLIC_URL}/calculateur-portions-gateau/`)
    await page.getByLabel('Nombre d’invités').fill('12')
    await page.getByRole('button', { name: 'Calculer' }).click()
    await expect(page).toHaveURL(/\/calculateur-portions-gateau\/\?invites=12$/)
    // With the owner's portions: a results heading. Without them: a visible marker, never a guess.
    const answered = page.locator('#calc-results, [data-fact="portions"]')
    await expect(answered.first()).toBeVisible()
    expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toBe(`${SITE_ORIGIN}/calculateur-portions-gateau/`)
  })

  test('an invalid number is refused in text', async ({ page }) => {
    await page.goto(`${PUBLIC_URL}/calculateur-portions-gateau/?invites=abc`)
    await expect(page.getByRole('alert')).toContainText('entre 1 et 1000')
    await expect(page.locator('#invites')).toHaveAttribute('aria-invalid', 'true')
  })
})

test.describe('templates', () => {
  test('home: one h1, vitrine du jour, « Coco Vanille en bref » with the brand on every line', async ({ page }) => {
    const res = await raw(`${PUBLIC_URL}/`)
    await page.setContent(res.body)
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.locator('#home-vitrine')).toHaveText('Qu’y a-t-il dans la vitrine aujourd’hui?')
    await expect(page.locator('#key-facts-title')).toHaveText('Coco Vanille en bref')
    for (const text of await page.locator('.key-facts li').allTextContents()) expect(text).toMatch(/Coco Vanille|FACT NEEDED/)
    // The rating strip exists only with a rating AND its date (never review markup).
    if (!res.body.includes('google.rating')) await expect(page.locator('.rating-strip')).toHaveCount(0)
  })

  test('visit: Google Maps (CID) and Apple Maps link-outs, no map tiles', async ({ page }) => {
    await page.setContent((await raw(`${PUBLIC_URL}/nous-trouver/`)).body)
    await expect(page.locator('a[href^="https://maps.google.com/?cid="]').first()).toBeVisible()
    await expect(page.locator('a[href^="https://maps.apple.com/?address="]')).toHaveCount(1)
    await expect(page.locator('iframe')).toHaveCount(0)
  })

  test('legal translations say the French version prevails and link to it', async ({ page }) => {
    await page.setContent((await raw(`${PUBLIC_URL}/en/terms-of-sale/`)).body)
    await expect(page.locator('.translation-notice')).toContainText('the French version prevails')
    await expect(page.locator('.translation-notice a')).toHaveAttribute('href', '/conditions-de-vente/')
    await expect(page.locator('#legal-merchant')).toBeVisible()
  })

  test('product: sizes table, verified-allergens block and readiness line', async ({ page }) => {
    await page.setContent((await raw(`${PUBLIC_URL}/viennoiseries/croissant-aux-amandes/`)).body)
    await expect(page.locator('table.sizes')).toHaveCount(1)
    await expect(page.locator('#product-allergens')).toBeVisible()
    await expect(page.locator('#product-ready')).toBeVisible()
  })

  test('product: the card, the page and the Offer JSON-LD give the same engine answer (06 k)', async ({ page }) => {
    const card = await inspect(page, (await raw(`${PUBLIC_URL}/gateaux/`)).body)
    const path = card.links.find((h) => /^\/gateaux\/[a-z0-9-]+\/$/.test(h))
    expect(path, 'a product link on /gateaux/').toBeTruthy()
    const html = (await raw(`${PUBLIC_URL}${path}`)).body
    const product = ldNodes((await inspect(page, html)).jsonld.map((j) => JSON.parse(j))).find((n) => hasType(n, 'Product'))
    expect(product, `${path} Product node`).toBeTruthy()
    await page.setContent(html)
    const ready = await page.locator('#product-ready .badge-ready').count()
    const soldOut = await page.locator('.badge-soldout').count()
    for (const offer of product.offers || []) {
      if (ready) expect(offer.availability).toBe('https://schema.org/InStock')
      if (soldOut) expect(offer.availability).toBe('https://schema.org/SoldOut')
      if (/BackOrder|PreOrder/.test(offer.availability)) expect(offer.availabilityStarts).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
    if (ready) {
      // « Prête dès … » on the card too: same words as the page.
      await page.setContent((await raw(`${PUBLIC_URL}/gateaux/`)).body)
      const text = (await page.locator(`li.product-card:has(a[href="${path}"]) .badge`).first().textContent()) || ''
      expect(text).toMatch(/^Prête dès /)
    }
  })
})
