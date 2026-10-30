// Demo data stays recognisable as demo (src/seed/demo-data.js): test products are « -demo », every demo price is
// labelled « (démo) » / « (demo) », and every demo photo has a credit and alt text in both languages.
import test, { describe } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { PRODUCTS, TEST_PRODUCTS, PRODUCT_PHOTOS, DEMO, DEMO_EN } from '../../src/seed/demo-data.js'
import { PHOTOS } from '../../src/lib/photos.js'

const dir = fileURLToPath(new URL('../../src/seed/demo-photos/', import.meta.url))
const credits = JSON.parse(readFileSync(`${dir}credits.json`, 'utf8'))

describe('demo catalogue', () => {
  test('test products are marked « -demo » and every price says « démo »', () => {
    for (const p of TEST_PRODUCTS) {
      assert.match(p.slug[0], /-demo$/, p.slug[0])
      assert.match(p.slug[1], /-demo$/, p.slug[1])
      for (const v of p.variants) {
        assert.ok(v.fr.includes(DEMO), `${p.slug[0]}: ${v.fr}`)
        assert.ok(v.en.includes(DEMO_EN), `${p.slug[0]}: ${v.en}`)
      }
    }
    for (const [slug, facts] of Object.entries(PRODUCTS)) for (const v of facts.variants) assert.ok(v.fr.includes(DEMO), `${slug}: ${v.fr}`)
  })

  test('every demo photo exists, with a credit and alt text in French and English', () => {
    const refs = [...TEST_PRODUCTS.map((p) => p.photo), ...Object.values(PRODUCT_PHOTOS)]
    for (const ref of refs) {
      if (ref.startsWith('public:')) {
        const key = ref.slice('public:'.length)
        assert.ok(PHOTOS[key]?.alt?.fr && PHOTOS[key]?.alt?.en && PHOTOS[key]?.credit?.license, ref)
        continue
      }
      assert.ok(existsSync(`${dir}${ref}.jpg`), `${ref}.jpg`)
      const c = credits[ref]
      assert.ok(c?.alt?.fr && c?.alt?.en, `${ref} alt`)
      assert.equal(c.license, 'Unsplash License', `${ref} license`)
      assert.match(c.source, /^https:\/\/unsplash\.com\/photos\//, `${ref} source`)
    }
  })
})
