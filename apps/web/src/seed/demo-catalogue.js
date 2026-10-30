// TEST PRODUCTS WITH PHOTOS (demo only): six test products that do not exist at the shop, demo prices and a photo
// on the shop's own products, so the site can be seen as it will look with real pictures and a full menu.
// Photos: Unsplash License (src/seed/demo-photos/credits.json, src/lib/photos.js); every media credit starts with
// « Photo de démonstration », every test product slug ends in « -demo », every price is labelled « (démo) ».
// Online ordering is switched on (with capacity) but the shop's real hours are kept. Refuses to run in production.
//
//   SEED_DEMO=true  npm run seed:demo-catalogue   → adds them (after `npm run seed`)
//   SEED_DEMO=clean npm run seed:demo-catalogue   → removes them, the media they use and the demo traffic;
//                                                   then `npm run seed` restores the verified facts
import path from 'node:path'
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../payload.config.js'
import { PHOTOS } from '../lib/photos.js'
import { PRODUCTS, POOLS, TEST_PRODUCTS, PRODUCT_PHOTOS, VITRINE } from './demo-data.js'

const mode = process.env.SEED_DEMO
if (mode !== 'true' && mode !== 'clean') {
  console.error('src/seed/demo-catalogue.js runs only with SEED_DEMO=true (apply) or SEED_DEMO=clean (remove).')
  process.exit(1)
}
if (process.env.NODE_ENV === 'production' || /^https:\/\/(www\.)?cocovanillegranby\.com\/?$/.test(process.env.PUBLIC_ORIGIN || '')) {
  console.error('src/seed/demo-catalogue.js never runs against production.')
  process.exit(1)
}

const payload = await getPayload({ config })
const SYS = { overrideAccess: true, depth: 0 }
const here = path.dirname(fileURLToPath(import.meta.url))
const CREDIT = 'Photo de démonstration'
const credits = JSON.parse(readFileSync(path.join(here, 'demo-photos', 'credits.json'), 'utf8'))

const SUMMARY = {
  'croissant-au-beurre-demo': ['un croissant doré et feuilleté.', 'a golden, flaky croissant.'],
  'chocolatine-demo': ['une viennoiserie feuilletée garnie de chocolat.', 'a flaky pastry filled with chocolate.'],
  'eclair-au-chocolat-demo': ['une pâte à choux garnie de crème au chocolat, glaçage brillant.', 'choux pastry filled with chocolate cream, glossy icing.'],
  'tartelette-aux-fruits-demo': ['une pâte sablée, une crème et des fruits frais.', 'shortcrust pastry, cream and fresh fruit.'],
  'macarons-demo': ['des macarons de couleurs variées, en boîte.', 'macarons in assorted colours, in a box.'],
  'gateau-au-chocolat-demo': ['un gâteau étagé au chocolat et à la ganache.', 'a chocolate layer cake with ganache.'],
}

// « public:<key> » → the ambiance photo public/photos/<key>-1200.webp; otherwise src/seed/demo-photos/<ref>.jpg.
function photoSource(ref) {
  if (ref.startsWith('public:')) {
    const key = ref.slice('public:'.length)
    return { file: path.resolve(here, '../../public/photos', `${key}-1200.webp`), alt: PHOTOS[key]?.alt, author: PHOTOS[key]?.credit?.author }
  }
  return { file: path.join(here, 'demo-photos', `${ref}.jpg`), alt: credits[ref]?.alt, author: credits[ref]?.author }
}

async function uploadPhoto(ref) {
  const { file, alt, author } = photoSource(ref)
  if (!existsSync(file) || !alt) {
    payload.logger.warn(`Demo photo missing, skipped: ${ref}`)
    return null
  }
  const media = await payload.create({
    collection: 'media',
    locale: 'fr',
    data: { alt: `${alt.fr} (photo de démonstration)`, credit: `${CREDIT} · Unsplash · ${author || 'auteur non confirmé'}` },
    filePath: file,
    ...SYS,
  })
  await payload.update({ collection: 'media', id: media.id, locale: 'en', data: { alt: `${alt.en} (demo photo)` }, ...SYS })
  return media.id
}

async function bySlug(slug) {
  const res = await payload.find({ collection: 'products', where: { slug: { equals: slug } }, locale: 'fr', limit: 1, ...SYS })
  return res.docs[0] || null
}

async function categoryId(productionCategory) {
  const res = await payload.find({ collection: 'categories', where: { productionCategory: { equals: productionCategory } }, limit: 1, ...SYS })
  return res.docs[0]?.id ?? null
}

async function remove() {
  await payload.delete({ collection: 'products', where: { slug: { like: '-demo' } }, locale: 'fr', ...SYS })
  for (const slug of Object.keys(PRODUCT_PHOTOS)) {
    const doc = await bySlug(slug)
    if (doc) await payload.update({ collection: 'products', id: doc.id, data: { photos: [], vitrine: false }, ...SYS })
  }
  await payload.delete({ collection: 'media', where: { credit: { like: CREDIT } }, ...SYS })
}

if (mode === 'true') {
  await remove()
  const shop = await payload.findGlobal({ slug: 'shop', ...SYS })
  await payload.updateGlobal({
    slug: 'shop',
    data: { ordering: { ...(shop.ordering || {}), enabled: true, nextDayCutoff: '14:00', windowMinutes: 15, maxPerWindow: 4, maxDaysAhead: 30, depositPercent: 30, quoteValidHours: 72, termsVersion: 'demo-2026-10-26' } },
    ...SYS,
  })
  for (const [category, defaultPerDay] of Object.entries(POOLS)) {
    const found = await payload.find({ collection: 'capacity-pools', where: { productionCategory: { equals: category } }, limit: 1, ...SYS })
    const data = { productionCategory: category, unit: category === 'gateaux' ? 'cakes' : 'items', defaultPerDay }
    if (found.docs[0]) await payload.update({ collection: 'capacity-pools', id: found.docs[0].id, data, ...SYS })
    else await payload.create({ collection: 'capacity-pools', data, ...SYS })
  }

  // The shop's own products: demo prices (when they have some) and a photo.
  for (const [slug, ref] of Object.entries(PRODUCT_PHOTOS)) {
    const doc = await bySlug(slug)
    if (!doc) continue
    const facts = PRODUCTS[slug]
    const photo = await uploadPhoto(ref)
    const data = { photos: photo ? [photo] : [], vitrine: VITRINE.includes(slug), _status: 'published' }
    if (facts) {
      Object.assign(data, { taxClass: facts.taxClass, leadTimeHours: facts.leadTimeHours, cakeMessageMax: facts.cakeMessageMax ?? null, everSold: Boolean(facts.everSold), onlineOrderable: true, variants: facts.variants.map(({ fr, en, ...v }) => ({ ...v, label: fr })) })
    }
    const updated = await payload.update({ collection: 'products', id: doc.id, locale: 'fr', data, ...SYS })
    if (facts) {
      await payload.update({ collection: 'products', id: doc.id, locale: 'en', data: { variants: updated.variants.map((v, i) => ({ id: v.id, label: facts.variants[i].en })), _status: 'published' }, ...SYS })
    }
  }

  // Test products (not sold by the shop): titles stay plain, the summary and every price say « démo ».
  for (const p of TEST_PRODUCTS) {
    const category = await categoryId(p.category)
    if (!category) continue
    const photo = await uploadPhoto(p.photo)
    const [descFr, descEn] = SUMMARY[p.slug[0]] || ['', '']
    const doc = await payload.create({
      collection: 'products',
      locale: 'fr',
      data: {
        title: p.title[0],
        slug: p.slug[0],
        category,
        productionCategory: p.category,
        summary: `Produit de démonstration pour essayer le site, pas un produit de la boutique : ${descFr}`,
        photos: photo ? [photo] : [],
        variants: p.variants.map(({ fr, en, ...v }) => ({ ...v, label: fr })),
        taxClass: p.taxClass,
        leadTimeHours: p.leadTimeHours,
        cakeMessageMax: p.cakeMessageMax ?? null,
        availability: 'instock',
        onlineOrderable: true,
        vitrine: Boolean(p.vitrine),
        _status: 'published',
      },
      ...SYS,
    })
    await payload.update({
      collection: 'products',
      id: doc.id,
      locale: 'en',
      data: {
        title: p.title[1],
        slug: p.slug[1],
        summary: `Demonstration product to try the website, not a product of the shop: ${descEn}`,
        variants: doc.variants.map((v, i) => ({ id: v.id, label: p.variants[i].en })),
        _status: 'published',
      },
      ...SYS,
    })
  }
  payload.logger.info('Demo catalogue applied (SEED_DEMO=true): 6 test products, photos on the shop’s products, ordering on. Remove it with SEED_DEMO=clean, then `npm run seed`.')
} else {
  await remove()
  const shop = await payload.findGlobal({ slug: 'shop', ...SYS })
  await payload.updateGlobal({ slug: 'shop', data: { ordering: { ...(shop.ordering || {}), enabled: false, nextDayCutoff: null, depositPercent: null, termsVersion: null } }, ...SYS })
  await payload.delete({ collection: 'capacity-pools', where: { id: { exists: true } }, ...SYS })
  for (const collection of ['messages', 'orders', 'requests', 'request-photos']) {
    await payload.delete({ collection, where: { id: { exists: true } }, ...SYS })
  }
  payload.logger.info('Demo catalogue removed (SEED_DEMO=clean). Run `npm run seed` to restore the verified facts and prices.')
}

process.exit(0)
