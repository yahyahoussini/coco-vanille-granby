// Gets the live site ready for customers in one pass: reservation settings, the shop's own products, approximate prices and
// the proposed answers to every fact (operator's request of 2026-11-03). Safe to run again, and after the owner starts
// working: a setting already chosen, a product already priced and an answer already checked in Studio are never replaced;
// an answer still « À vérifier » follows the latest wording. Run it after the seed and seed:catalogue.
//
//   npm run seed:launch
import { getPayload } from 'payload'
import config from '../payload.config.js'
import { frTypo } from '../lib/typo.js'
import { PROPOSALS } from '../lib/facts-proposals.js'
import { NEW_PRODUCTS, EXISTING_PRODUCTS, OLD_TAILS } from './catalogue-data.js'
import { OFFERS, SHOP_PRODUCTS, ORDERING, POOLS, SEASON } from './launch-data.js'

const payload = await getPayload({ config })
const SYS = { overrideAccess: true, depth: 0 }
const hasPrice = (doc) => (doc.variants || []).some((v) => v.priceCents > 0)
const slugify = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/œ/g, 'oe').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const find = async (collection, where, opts = {}) => (await payload.find({ collection, where, limit: 1, ...SYS, ...opts })).docs[0] || null

// ---------- 1. Reservation settings
const shop = await payload.findGlobal({ slug: 'shop', ...SYS })
if (!shop.ordering?.nextDayCutoff) {
  await payload.updateGlobal({ slug: 'shop', data: { ordering: { ...shop.ordering, ...ORDERING } }, ...SYS })
  console.log('Reservation settings written.')
}
for (const pool of POOLS) {
  const found = await find('capacity-pools', { productionCategory: { equals: pool.productionCategory } })
  if (!found) await payload.create({ collection: 'capacity-pools', data: pool, ...SYS })
  else if (typeof found.defaultPerDay !== 'number') await payload.update({ collection: 'capacity-pools', id: found.id, data: { defaultPerDay: pool.defaultPerDay }, ...SYS })
}
let season = await find('seasons', { key: { equals: SEASON.key } })
if (!season) {
  const { name, ...rest } = SEASON
  season = await payload.create({ collection: 'seasons', locale: 'fr', data: { ...rest, name: name.fr }, ...SYS })
  for (const locale of ['en', 'es']) await payload.update({ collection: 'seasons', id: season.id, locale, data: { name: name[locale] }, ...SYS })
}

// ---------- 2. Proposed answers
let added = 0
let refreshed = 0
for (const [key, answer] of Object.entries(PROPOSALS)) {
  const found = await find('site-facts', { key: { equals: key } })
  if (!found) {
    await payload.create({ collection: 'site-facts', data: { key, ...answer, proposed: true }, ...SYS })
    added++
  } else if (found.proposed && !found.verifiedAt && (found.fr !== answer.fr || found.en !== answer.en)) {
    await payload.update({ collection: 'site-facts', id: found.id, data: { ...answer }, ...SYS })
    refreshed++
  }
}

// ---------- 3. Products: the shop's own, then a price wherever nobody has set one
const categories = new Map((await payload.find({ collection: 'categories', limit: 50, ...SYS })).docs.map((c) => [c.productionCategory, c.id]))
const summaryOf = (p, lang) => (lang === 'en' ? `${p.enText} ${p.tail.en}` : frTypo(`${p.fr} ${p.tail.fr}`))
let made = 0
for (const p of SHOP_PRODUCTS) {
  let doc = await find('products', { slug: { equals: p.slug } }, { locale: 'fr' })
  if (!doc) {
    doc = await payload.create({ collection: 'products', locale: 'fr', data: { title: p.title, slug: p.slug, summary: summaryOf(p, 'fr'), category: categories.get(p.family), productionCategory: p.family, variants: [{ label: 'À l’unité' }], availability: 'instock', _status: 'published' }, ...SYS })
    made++
  }
  const english = await payload.findByID({ collection: 'products', id: doc.id, locale: 'en', fallbackLocale: false, ...SYS })
  if (!english.title) await payload.update({ collection: 'products', id: doc.id, locale: 'en', data: { title: p.en, slug: p.enSlug, summary: summaryOf(p, 'en'), variants: (doc.variants || []).map((row) => ({ ...row, label: 'Each' })), _status: 'published' }, ...SYS })
}

const allOffers = { ...OFFERS, ...Object.fromEntries(SHOP_PRODUCTS.map((p) => [p.slug, p.offer])) }
let priced = 0
let kept = 0
const missing = []
for (const [slug, offer] of Object.entries(allOffers)) {
  const found = await find('products', { slug: { equals: slug } }, { locale: 'fr' })
  if (!found) {
    missing.push(slug)
    continue
  }
  if (hasPrice(found)) {
    kept++
    continue
  }
  const { variants, season: seasonKey, ...facts } = offer
  const doc = await payload.update({
    collection: 'products',
    id: found.id,
    locale: 'fr',
    data: { ...facts, variants: variants.map(({ en, ...v }) => v), priceOnRequest: false, priceEstimated: true, onlineOrderable: true, ...(seasonKey ? { season: season.id } : {}), _status: 'published' },
    ...SYS,
  })
  await payload.update({
    collection: 'products',
    id: doc.id,
    locale: 'en',
    data: { variants: doc.variants.map((row, i) => ({ ...row, label: variants[i].en })), _status: 'published' },
    ...SYS,
  })
  priced++
}

// The sentence the seed added to a description while prices were not set is replaced; the rest of the description stays.
let reworded = 0
for (const p of [...NEW_PRODUCTS, ...EXISTING_PRODUCTS]) {
  const slug = p.slug || slugify(p.title)
  const found = await find('products', { slug: { equals: slug } }, { locale: 'fr' })
  if (!found) continue
  const oldTail = OLD_TAILS.find((t) => t.fr === p.tail.old)
  if (!oldTail) continue
  const oldFr = frTypo(oldTail.fr)
  if (found.summary?.includes(oldFr)) {
    await payload.update({ collection: 'products', id: found.id, locale: 'fr', data: { summary: found.summary.replace(oldFr, frTypo(p.tail.fr)) }, ...SYS })
    reworded++
  }
  const en = await payload.findByID({ collection: 'products', id: found.id, locale: 'en', fallbackLocale: false, ...SYS })
  if (en.summary?.includes(oldTail.en)) await payload.update({ collection: 'products', id: found.id, locale: 'en', data: { summary: en.summary.replace(oldTail.en, p.tail.en) }, ...SYS })
}

// « réserver » became « commander » on the site: the descriptions already stored follow, word for word.
const OLD_WORDS = { fr: ['à réserver en ligne', 'à commander en ligne'], en: ['to reserve online', 'to order online'] }
for (const locale of ['fr', 'en']) {
  const [from, to] = OLD_WORDS[locale]
  const all = await payload.find({ collection: 'products', locale, fallbackLocale: false, limit: 500, pagination: false, ...SYS })
  for (const doc of all.docs) {
    if (!doc.summary?.includes(from)) continue
    await payload.update({ collection: 'products', id: doc.id, locale, data: { summary: doc.summary.split(from).join(to) }, ...SYS })
    if (locale === 'fr') reworded++
  }
}

const { totalDocs } = await payload.count({ collection: 'products', where: { _status: { equals: 'published' } }, ...SYS })
console.log(`Answers: ${added} added, ${refreshed} refreshed. Products: ${made} added, ${priced} priced (« Prix à vérifier »), ${kept} already priced, ${reworded} descriptions reworded, ${totalDocs} published.`)
if (missing.length) console.log(`No product for these offers (seed:catalogue not run, or a photo missing): ${missing.join(', ')}`)
process.exit(0)
