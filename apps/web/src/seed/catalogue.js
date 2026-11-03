// Puts the shop's cakes on the site from the owner's photos, without prices (seed/launch.js adds them). Safe to run again:
// a photo already uploaded is reused, and nothing typed in Studio (a price, a summary, a photo) is replaced.
// A product is made only when at least one of its photos is in src/seed/client-photos/ (a cake with no picture of
// its own would show a stock illustration under the name of a real cake). The photos are cut out on a transparent 4:5
// canvas (.webp, or .png, or .jpg). Allergens stay unchecked: a person of the shop confirms them in Studio › Plus › Produits.
//
//   npm run seed:catalogue                          adds the products whose photos are there, completes the others
//   CATALOGUE_MODE=clear npm run seed:catalogue     starts the series over: takes these photos off the site and out of the
//                                                   media folder, and deletes the cakes the seed made that nobody has
//                                                   priced (« Prix sur demande », still a draft or in the list); a cake
//                                                   with a price is kept, as a draft, without its photos
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
const slugOf = (p) => p.slug || slugify(p.title)
const idOf = (m) => (m && typeof m === 'object' ? m.id : m)
const findBySlug = async (slug) => (await payload.find({ collection: 'products', where: { slug: { equals: slug } }, locale: 'fr', limit: 1, ...SYS })).docs[0]

// The processed pictures (nimages/ → scratchpad → here), a PNG or WebP with a transparent background, or a JPEG.
const photoPath = (name) => ['.png', '.webp', '.jpg'].map((ext) => path.join(here, 'client-photos', name + ext)).find((file) => existsSync(file)) || null

if (process.env.CATALOGUE_MODE === 'clear') {
  const all = [...NEW_PRODUCTS, ...EXISTING_PRODUCTS]
  const media = (await payload.find({ collection: 'media', where: { filename: { in: all.flatMap((p) => p.photos).map((name) => `${name}.avif`) } }, limit: 500, ...SYS })).docs
  const gone = new Set(media.map((m) => m.id))
  const unpriced = (doc) => !hasPrice(doc)
  let deleted = 0
  let kept = 0
  const seedMade = (await payload.find({ collection: 'products', where: { priceOnRequest: { equals: true } }, locale: 'fr', limit: 1000, draft: true, ...SYS })).docs
  const newSlugs = new Set(NEW_PRODUCTS.map(slugOf))
  for (const doc of seedMade) {
    const isSeedCake = newSlugs.has(doc.slug) || doc._status === 'draft'
    if (isSeedCake && unpriced(doc)) {
      await payload.delete({ collection: 'products', id: doc.id, ...SYS })
      deleted++
    } else {
      const left = (doc.photos || []).map(idOf).filter((id) => !gone.has(id))
      const priced = isSeedCake
      if (left.length !== (doc.photos || []).length || (priced && doc._status === 'published')) {
        await payload.update({ collection: 'products', id: doc.id, data: { photos: left, ...(priced ? { _status: 'draft' } : {}) }, ...SYS })
        if (priced) kept++
      }
    }
  }
  for (const m of media) await payload.delete({ collection: 'media', id: m.id, ...SYS })
  const { totalDocs: published } = await payload.count({ collection: 'products', where: { _status: { equals: 'published' } }, ...SYS })
  console.log(`Catalogue cleared: ${media.length} photo(s) removed, ${deleted} unpriced cake(s) deleted, ${kept} priced cake(s) kept as drafts, ${published} product(s) still published.`)
  process.exit(0)
}

async function photo(name, alt, altEn) {
  const filePath = photoPath(name)
  const found = await payload.find({ collection: 'media', where: { filename: { equals: `${name}.avif` } }, limit: 1, ...SYS })
  if (found.docs[0]) return found.docs[0].id
  const media = await payload.create({ collection: 'media', locale: 'fr', data: { alt: frTypo(alt), credit: CREDIT }, filePath, ...SYS })
  await payload.update({ collection: 'media', id: media.id, locale: 'en', data: { alt: altEn }, ...SYS })
  return media.id
}
const photos = (p) => Promise.all(p.photos.filter(photoPath).map((name) => photo(name, p.fr, p.enText)))

const categories = new Map((await payload.find({ collection: 'categories', limit: 50, ...SYS })).docs.map((c) => [c.productionCategory, c.id]))

let created = 0
let waiting = 0
for (const p of NEW_PRODUCTS) {
  if (!p.photos.some(photoPath)) {
    waiting++
    continue
  }
  const slug = slugOf(p)
  const found = await findBySlug(slug)
  if (found) {
    // Already there: only what is still empty (its photos), and its place on the site after a clear, with its
    // description from this file again (nobody has typed in a draft the seed made).
    const back = found._status !== 'published'
    const data = { ...(found.photos?.length ? {} : { photos: await photos(p) }), ...(back ? { _status: 'published', summary: summaryOf(p, 'fr') } : {}) }
    if (Object.keys(data).length) await payload.update({ collection: 'products', id: found.id, locale: 'fr', data, ...SYS })
    if (back) await payload.update({ collection: 'products', id: found.id, locale: 'en', data: { summary: summaryOf(p, 'en') }, ...SYS })
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
  const found = await findBySlug(p.slug)
  if (!found) continue
  const data = { ...(hasPrice(found) ? {} : { priceOnRequest: true }), ...(found.photos?.length || !p.photos.some(photoPath) ? {} : { photos: await photos(p) }), ...(found.summary ? {} : { summary: summaryOf(p, 'fr') }) }
  await payload.update({ collection: 'products', id: found.id, locale: 'fr', data, ...SYS })
  const en = await payload.findByID({ collection: 'products', id: found.id, locale: 'en', fallbackLocale: false, ...SYS })
  if (!en.summary) await payload.update({ collection: 'products', id: found.id, locale: 'en', data: { summary: summaryOf(p, 'en') }, ...SYS })
}

const { totalDocs } = await payload.count({ collection: 'products', where: { _status: { equals: 'published' } }, ...SYS })
console.log(`Catalogue: ${created} product(s) added, ${waiting} waiting for a photo, ${totalDocs} published. Prices: npm run seed:launch. Allergens: checked in Studio › Plus › Produits.`)
process.exit(0)
