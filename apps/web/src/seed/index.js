// Seed: only facts verified by research (data/facts.json, research/01) — everything else stays empty,
// so the site shows [[FACT NEEDED]] markers until the owner answers (research/14).
// Run: npm run seed   (idempotent: updates globals, upserts by key/code/slug)
import { getPayload } from 'payload'
import config from '../payload.config.js'
import { PRIORITY_ALLERGENS } from '../collections/Catalog.js'
import { pages as pageContent, HOURS, PARKING } from './content.js'

const payload = await getPayload({ config })

async function upsert(collection, where, data, { locale = 'fr', draft = false } = {}) {
  const found = await payload.find({ collection, where, limit: 1, locale, depth: 0, draft: true })
  if (found.docs[0]) return payload.update({ collection, id: found.docs[0].id, data, locale, draft, depth: 0 })
  return payload.create({ collection, data, locale, draft, depth: 0 })
}

// 1. Entity (address and phone are consistent across all sources, 01 §2.2; name spelling pending the sign photo).
// The mobile number is owner-published (Google listing / Facebook, relayed by Yahya on 2026-10-27, 01 « Update
// 2026-10-27 »). It books the creative workshops (the shop's reel of 2026-10-22, research/20b S-19), so the JSON-LD names it
// as that contact point only; whether it takes texts is not confirmed (14 H7).
await payload.updateGlobal({
  slug: 'business',
  locale: 'fr',
  data: {
    name: 'Pâtisserie Coco Vanille',
    alternateName: ['Pâtisserie Cocovanille'],
    legalName: 'Pâtisserie Coco Vanille inc.',
    neq: '1177082220',
    categorySentence: 'Pâtisserie Coco Vanille est une pâtisserie-boulangerie du centre-ville de Granby : viennoiseries, pains et gâteaux sur commande.',
    phone: '+14503727177',
    phoneDisplay: '450-372-7177',
    mobile: '+14385287818',
    mobileDisplay: '438-528-7818',
    address: { street: '3, rue Court', city: 'Granby', region: 'QC', postalCode: 'J2G 4Y6', country: 'CA' },
    geo: { lat: 45.3995807, lng: -72.7250821 },
    google: { cid: '10789122976114705165', kgmid: '/g/11s3b_3rsh' },
    sameAs: [
      { url: 'https://www.facebook.com/PatisserieCocoVanille/', verified: true },
      // Found and confirmed on 2026-10-29: public, active, same bio and phones as Facebook (research/20b §0.1).
      { url: 'https://www.instagram.com/coco_vanillegranby/', verified: true },
    ],
    languagesServed: ['fr'],
    // Agency decisions of 2026-10-29 (research/21, mandate from Yahya): both mailboxes are created on the domain at
    // launch (docs/13). Loi 25 s. 3.2 asks for the title and contact of the person in charge, not the name; by
    // default that person is the one with the highest authority in the business (s. 3.1).
    email: 'bonjour@cocovanillegranby.com',
    privacyOfficer: { title: 'Propriétaire', email: 'confidentialite@cocovanillegranby.com' },
    // The Visit page's parking row: public facts of research/20c (the City's by-law; distances computed), applied on
    // 2026-10-29 (research/21 §6). The page copy (content.js) gives the time limits and the second lot.
    parking: PARKING.fr,
  },
})
await payload.updateGlobal({
  slug: 'business',
  locale: 'en',
  data: { categorySentence: 'Pâtisserie Coco Vanille is a pastry shop and bakery in downtown Granby: viennoiseries, bread and cakes to order.', parking: PARKING.en },
})
await payload.updateGlobal({
  slug: 'business',
  locale: 'es',
  data: { categorySentence: 'Pâtisserie Coco Vanille es una pastelería y panadería en el centro de Granby: bollería, pan y pasteles por encargo.' },
})

// 2. Shop: regular hours from the shop's Google listing, supplied by the operator on 2026-10-27 (01 « Update
// 2026-10-27 » and §3; 15 D26). They replace the empty record kept while 6 directory schedules conflicted. The page
// copy (content.js) is written from the same HOURS record. Holiday hours stay unknown: no special days are seeded.
await payload.updateGlobal({
  slug: 'shop',
  data: { hours: HOURS, ordering: { enabled: false, windowMinutes: 15, maxPerWindow: 4, maxDaysAhead: 30, quoteValidHours: 72 } },
})

// 3. Priority allergens (07 A-3)
for (const [code, fr, en, es] of PRIORITY_ALLERGENS) {
  const doc = await upsert('allergens', { code: { equals: code } }, { code, label: fr })
  await payload.update({ collection: 'allergens', id: doc.id, locale: 'en', data: { label: en } })
  await payload.update({ collection: 'allergens', id: doc.id, locale: 'es', data: { label: es } })
}

// 4. Categories (00 §5.2 slugs)
const CATS = [
  { key: 'viennoiseries', order: 1, fr: ['Viennoiseries', 'viennoiseries'], en: ['Viennoiseries', 'viennoiseries'], es: ['Bollería', 'bolleria'] },
  { key: 'pains', order: 2, fr: ['Pains et baguettes', 'pains-baguettes'], en: ['Bread', 'bread'], es: ['Pan', 'panaderia'] },
  { key: 'gateaux', order: 3, fr: ['Gâteaux', 'gateaux'], en: ['Cakes', 'cakes'], es: ['Pasteles', 'pasteles'] },
  { key: 'patisseries', order: 4, fr: ['Pâtisseries', 'patisseries'], en: ['Pastries', 'pastries'], es: ['Postres', 'postres'] },
]
const catIds = {}
for (const c of CATS) {
  const doc = await upsert('categories', { productionCategory: { equals: c.key } }, { title: c.fr[0], slug: c.fr[1], productionCategory: c.key, order: c.order })
  await payload.update({ collection: 'categories', id: doc.id, locale: 'en', data: { title: c.en[0], slug: c.en[1] } })
  await payload.update({ collection: 'categories', id: doc.id, locale: 'es', data: { title: c.es[0], slug: c.es[1] } })
  catIds[c.key] = doc.id
}

// 5. Products evidenced in public sources (01 §5). No prices, portions or allergens: owner facts.
const PRODUCTS = [
  { cat: 'viennoiseries', fr: ['Croissant aux amandes', 'croissant-aux-amandes'], en: ['Almond croissant', 'almond-croissant'] },
  { cat: 'pains', fr: ['Baguette', 'baguette'], en: ['Baguette', 'baguette'] },
  { cat: 'patisseries', fr: ['Paris-Brest', 'paris-brest'], en: ['Paris-Brest', 'paris-brest'] },
  { cat: 'patisseries', fr: ['Vol-au-vent', 'vol-au-vent'], en: ['Vol-au-vent', 'vol-au-vent'] },
  { cat: 'gateaux', fr: ['Gâteau aux framboises', 'gateau-aux-framboises'], en: ['Raspberry cake', 'raspberry-cake'] },
  { cat: 'gateaux', fr: ['Shortcake aux fraises', 'shortcake-aux-fraises'], en: ['Strawberry shortcake', 'strawberry-shortcake'] },
]
for (const p of PRODUCTS) {
  const data = {
    title: p.fr[0],
    slug: p.fr[1],
    category: catIds[p.cat],
    productionCategory: p.cat,
    variants: [{ label: 'Format standard' }],
    availability: 'instock',
    _status: 'published',
  }
  const doc = await upsert('products', { slug: { equals: p.fr[1] } }, data)
  await payload.update({ collection: 'products', id: doc.id, locale: 'en', data: { title: p.en[0], slug: p.en[1], variants: [{ id: doc.variants?.[0]?.id, label: 'Standard size' }], _status: 'published' } })
}

// 6. Page copy (src/seed/content.js), published per locale.
for (const page of pageContent) {
  const { key, status, condition, locales } = page
  let doc = null
  for (const [locale, fields] of Object.entries(locales)) {
    const data = { key, tier: status, condition, ...fields, _status: 'published' }
    if (!doc) doc = await upsert('pages', { key: { equals: key } }, data, { locale })
    else doc = await payload.update({ collection: 'pages', id: doc.id, data, locale, depth: 0 })
  }
}

// 7. Dev owner account (never in production; the real owner registers with a passkey).
if (process.env.NODE_ENV !== 'production' && process.env.SEED_DEV_USER !== 'false') {
  const existing = await payload.find({ collection: 'users', where: { email: { equals: 'proprio@exemple.test' } }, limit: 1 })
  if (!existing.docs[0]) {
    await payload.create({ collection: 'users', data: { email: 'proprio@exemple.test', password: 'coco-dev-only', name: 'Propriétaire (dev)', role: 'proprietaire' } })
  }
}

payload.logger.info('Seed done.')
process.exit(0)
