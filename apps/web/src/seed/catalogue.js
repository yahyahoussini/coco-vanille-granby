// Puts the shop's cakes on the site from the owner's photos, without prices (« Prix sur demande »). Safe to run again:
// a photo already uploaded is reused, and nothing typed in Studio (a price, a summary, a photo) is replaced.
// Allergens stay unchecked: a person of the shop confirms them in Studio › Plus › Produits.
//
//   npm run seed:catalogue      (after `npm run seed`)
import path from 'node:path'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../payload.config.js'
import { frTypo } from '../lib/typo.js'
import { NEW_PRODUCTS, EXISTING_PRODUCTS } from './catalogue-data.js'

const payload = await getPayload({ config })
const SYS = { overrideAccess: true, depth: 0 }
const here = path.dirname(fileURLToPath(import.meta.url))
const CREDIT = 'Pâtisserie Coco Vanille'
const slugify = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/œ/g, 'oe').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const hasPrice = (doc) => (doc.variants || []).some((v) => v.priceCents > 0)
const summaryOf = (p, lang) => (lang === 'en' ? `${p.enText} ${p.tail.en}` : frTypo(`${p.fr} ${p.tail.fr}`))

async function photo(name, alt, altEn) {
  const filePath = path.join(here, 'client-photos', `${name}.jpg`)
  if (!existsSync(filePath)) throw new Error(`photo missing: ${filePath}`)
  const found = await payload.find({ collection: 'media', where: { filename: { equals: `${name}.avif` } }, limit: 1, ...SYS })
  if (found.docs[0]) return found.docs[0].id
  const media = await payload.create({ collection: 'media', locale: 'fr', data: { alt: frTypo(alt), credit: CREDIT }, filePath, ...SYS })
  await payload.update({ collection: 'media', id: media.id, locale: 'en', data: { alt: altEn }, ...SYS })
  return media.id
}
const photos = (p) => Promise.all(p.photos.map((name) => photo(name, p.fr, p.enText)))

const categories = new Map((await payload.find({ collection: 'categories', limit: 50, ...SYS })).docs.map((c) => [c.productionCategory, c.id]))

let created = 0
for (const p of NEW_PRODUCTS) {
  const slug = slugify(p.title)
  const found = (await payload.find({ collection: 'products', where: { slug: { equals: slug } }, locale: 'fr', limit: 1, ...SYS })).docs[0]
  if (found) {
    // Already there: only what is still empty.
    if (!found.photos?.length) await payload.update({ collection: 'products', id: found.id, data: { photos: await photos(p) }, ...SYS })
    continue
  }
  const doc = await payload.create({
    collection: 'products',
    locale: 'fr',
    data: { title: p.title, slug, summary: summaryOf(p, 'fr'), category: categories.get(p.family), productionCategory: p.family, photos: await photos(p), priceOnRequest: true, variants: [{ label: 'Sur commande' }], availability: 'instock', _status: 'published' },
    ...SYS,
  })
  await payload.update({ collection: 'products', id: doc.id, locale: 'en', data: { title: p.en, slug: slugify(p.en), summary: summaryOf(p, 'en'), variants: [{ id: doc.variants?.[0]?.id, label: 'Made to order' }], _status: 'published' }, ...SYS })
  created++
}

for (const p of EXISTING_PRODUCTS) {
  const found = (await payload.find({ collection: 'products', where: { slug: { equals: p.slug } }, locale: 'fr', limit: 1, ...SYS })).docs[0]
  if (!found) continue
  const data = { ...(hasPrice(found) ? {} : { priceOnRequest: true }), ...(found.photos?.length || !p.photos.length ? {} : { photos: await photos(p) }), ...(found.summary ? {} : { summary: summaryOf(p, 'fr') }) }
  await payload.update({ collection: 'products', id: found.id, locale: 'fr', data, ...SYS })
  const en = await payload.findByID({ collection: 'products', id: found.id, locale: 'en', fallbackLocale: false, ...SYS })
  if (!en.summary) await payload.update({ collection: 'products', id: found.id, locale: 'en', data: { summary: summaryOf(p, 'en') }, ...SYS })
}

const { totalDocs } = await payload.count({ collection: 'products', ...SYS })
console.log(`Catalogue: ${created} product(s) added, ${totalDocs} on the site. Allergens: to confirm in Studio › Plus › Produits. Prices: « Prix sur demande » until set.`)
process.exit(0)
