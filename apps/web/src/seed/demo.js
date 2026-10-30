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
import { PRODUCTS, POOLS } from './demo-data.js'

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
const everyDay = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

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
