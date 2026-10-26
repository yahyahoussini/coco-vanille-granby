// DEMO DATA ONLY: invented hours, prices, portions, capacity and cut-off so the ordering flow can be
// exercised end to end (e2e tests, staging walkthroughs). Never imported by the real seed (src/seed/index.js),
// never true facts: every demo variant is labelled « (démo) ». Refuses to run against production.
//
//   SEED_DEMO=true  npm run seed:demo   → applies the demo values (after `npm run seed`)
//   SEED_DEMO=clean npm run seed:demo   → removes them, plus the orders, requests and messages made with them
//
// Re-seeding without demo = `SEED_DEMO=clean npm run seed:demo && npm run seed`.
import { getPayload } from 'payload'
import config from '../payload.config.js'

const mode = process.env.SEED_DEMO
if (mode !== 'true' && mode !== 'clean') {
  console.error('src/seed/demo.js runs only with SEED_DEMO=true (apply) or SEED_DEMO=clean (remove).')
  process.exit(1)
}

if (process.env.NODE_ENV === 'production' || /^https:\/\/(www\.)?cocovanillegranby\.com\/?$/.test(process.env.PUBLIC_ORIGIN || '')) {
  console.error('src/seed/demo.js never runs against production.')
  process.exit(1)
}

const payload = await getPayload({ config })
const SYS = { overrideAccess: true, depth: 0 }
const DEMO = '(démo)'
const DEMO_EN = '(demo)'

const everyDay = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

// Demo catalogue facts, by French slug. Prices in cents before taxes; weights per serving for the tax rule.
const PRODUCTS = {
  'gateau-aux-framboises': {
    taxClass: 'rule',
    leadTimeHours: 48,
    cakeMessageMax: 30,
    everSold: true,
    variants: [
      { fr: `6 po ${DEMO}`, en: `6-inch ${DEMO_EN}`, sizeInches: 6, portionsMin: 8, portionsMax: 10, priceCents: 3800, unitWeightGrams: 1100 },
      { fr: `8 po ${DEMO}`, en: `8-inch ${DEMO_EN}`, sizeInches: 8, portionsMin: 12, portionsMax: 16, priceCents: 5200, unitWeightGrams: 1700 },
    ],
  },
  'shortcake-aux-fraises': {
    taxClass: 'rule',
    leadTimeHours: 48,
    cakeMessageMax: 30,
    variants: [{ fr: `8 po ${DEMO}`, en: `8-inch ${DEMO_EN}`, sizeInches: 8, portionsMin: 12, portionsMax: 14, priceCents: 4800, unitWeightGrams: 1500 }],
  },
  'paris-brest': {
    taxClass: 'rule',
    leadTimeHours: 24,
    variants: [{ fr: `Individuel ${DEMO}`, en: `Single ${DEMO_EN}`, portionsMin: 1, priceCents: 650, unitWeightGrams: 180 }],
  },
  'croissant-aux-amandes': {
    taxClass: 'rule',
    leadTimeHours: 24,
    variants: [{ fr: `À l’unité ${DEMO}`, en: `Each ${DEMO_EN}`, portionsMin: 1, priceCents: 425, unitWeightGrams: 110 }],
  },
  baguette: {
    taxClass: 'zero',
    leadTimeHours: 24,
    variants: [{ fr: `Baguette ${DEMO}`, en: `Baguette ${DEMO_EN}`, priceCents: 400, unitWeightGrams: 250 }],
  },
  // Vol-au-vent stays out of online sale on purpose: heated food is 07 §6 row 9 (ASK the accountant).
}

const POOLS = { gateaux: 6, viennoiseries: 120, pains: 80, patisseries: 40 }

async function bySlug(slug) {
  const res = await payload.find({ collection: 'products', where: { slug: { equals: slug } }, locale: 'fr', limit: 1, ...SYS })
  return res.docs[0] || null
}

if (mode === 'true') {
  const shop = await payload.findGlobal({ slug: 'shop', ...SYS })
  await payload.updateGlobal({
    slug: 'shop',
    data: {
      hours: everyDay.map((day) => ({ day, opens: '09:00', closes: '18:00' })),
      ordering: { ...(shop.ordering || {}), enabled: true, nextDayCutoff: '14:00', windowMinutes: 15, maxPerWindow: 4, maxDaysAhead: 30, depositPercent: 30, quoteValidHours: 72, termsVersion: 'demo-2026-10-26' },
    },
    ...SYS,
  })

  for (const [category, defaultPerDay] of Object.entries(POOLS)) {
    const found = await payload.find({ collection: 'capacity-pools', where: { productionCategory: { equals: category } }, limit: 1, ...SYS })
    const data = { productionCategory: category, unit: category === 'gateaux' ? 'cakes' : 'items', defaultPerDay }
    if (found.docs[0]) await payload.update({ collection: 'capacity-pools', id: found.docs[0].id, data, ...SYS })
    else await payload.create({ collection: 'capacity-pools', data, ...SYS })
  }

  for (const [slug, facts] of Object.entries(PRODUCTS)) {
    const doc = await bySlug(slug)
    if (!doc) continue
    const variants = facts.variants.map(({ fr, en, ...v }) => ({ ...v, label: fr }))
    const updated = await payload.update({
      collection: 'products',
      id: doc.id,
      locale: 'fr',
      data: { taxClass: facts.taxClass, leadTimeHours: facts.leadTimeHours, cakeMessageMax: facts.cakeMessageMax ?? null, everSold: Boolean(facts.everSold), onlineOrderable: true, variants, _status: 'published' },
      ...SYS,
    })
    await payload.update({
      collection: 'products',
      id: doc.id,
      locale: 'en',
      data: { variants: updated.variants.map((v, i) => ({ id: v.id, label: facts.variants[i].en })), _status: 'published' },
      ...SYS,
    })
  }
  payload.logger.info('Demo data applied (SEED_DEMO=true). Remove it with SEED_DEMO=clean before shipping.')
} else {
  // Undo: ordering off, hours empty again, no capacity, products back to « to confirm », demo traffic removed.
  const shop = await payload.findGlobal({ slug: 'shop', ...SYS })
  await payload.updateGlobal({
    slug: 'shop',
    data: {
      hours: [],
      ordering: { ...(shop.ordering || {}), enabled: false, nextDayCutoff: null, depositPercent: null, termsVersion: null },
    },
    ...SYS,
  })
  await payload.delete({ collection: 'capacity-pools', where: { id: { exists: true } }, ...SYS })
  for (const slug of Object.keys(PRODUCTS)) {
    const doc = await bySlug(slug)
    if (!doc) continue
    await payload.update({
      collection: 'products',
      id: doc.id,
      locale: 'fr',
      data: { taxClass: 'pending', leadTimeHours: 0, cakeMessageMax: null, everSold: false, onlineOrderable: false, _status: 'published' },
      ...SYS,
    })
  }
  for (const collection of ['messages', 'orders', 'requests', 'request-photos']) {
    await payload.delete({ collection, where: { id: { exists: true } }, ...SYS })
  }
  payload.logger.info('Demo data removed (SEED_DEMO=clean). Run `npm run seed` to restore the verified facts.')
}

process.exit(0)
