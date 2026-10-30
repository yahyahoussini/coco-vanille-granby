import 'server-only'
import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { engineContext } from '@/lib/ordering/context'
import { productOfferState } from '@/lib/ordering/availability'
import { LOCALES } from '@/lib/routes'
import { publishGuard, answerMap, resolveFacts } from '@/lib/facts'
import { factIdFor } from '@/lib/facts-catalog'
import { servedByLocale, productReady } from '@/lib/publish'

export const payloadClient = cache(async () => getPayload({ config }))

export const getBusiness = cache(async (locale = 'fr') => {
  const payload = await payloadClient()
  return payload.findGlobal({ slug: 'business', locale, depth: 0 })
})

export const getShop = cache(async (locale = 'fr') => {
  const payload = await payloadClient()
  return payload.findGlobal({ slug: 'shop', locale, depth: 0 })
})

// The owner's answers (Studio › « Faits du site »), read once per render. A missing table (a database not yet
// migrated) means no answers: the markers stay, as before.
export const getFactAnswers = cache(async (locale = 'fr') => {
  const payload = await payloadClient()
  const res = await payload.find({ collection: 'site-facts', limit: 1000, depth: 0, pagination: false }).catch(() => ({ docs: [] }))
  return answerMap(res.docs, locale)
})

// Page copy with its answered [[FACT NEEDED]] slots filled (lib/facts.js resolveFacts).
const withFacts = async (doc, locale) => (doc ? resolveFacts(doc, await getFactAnswers(locale), (label) => factIdFor(locale, label)) : doc)

// Published page copy for a registry key. Drafts never reach the public site.
export const getPageDoc = cache(async (key, locale = 'fr') => {
  const payload = await payloadClient()
  const res = await payload.find({
    collection: 'pages',
    where: { key: { equals: key }, _status: { equals: 'published' } },
    locale,
    limit: 1,
    depth: 1,
  })
  return withFacts(res.docs[0] || null, locale)
})

// Published page copy of every registry page, in one language (one query per render and language).
export const getPagesIn = cache(async (locale = 'fr') => {
  const payload = await payloadClient()
  const res = await payload.find({ collection: 'pages', where: { _status: { equals: 'published' } }, locale, limit: 500, depth: 0, pagination: false })
  return Promise.all(res.docs.map((d) => withFacts(d, locale)))
})

// Registry keys the site answers, per language (lib/publish.js): links and hreflang point only at these.
export const getServed = cache(async () => {
  const strict = publishGuard() === 'strict'
  const docs = Object.fromEntries(await Promise.all(LOCALES.map(async (l) => [l, await getPagesIn(l)])))
  return servedByLocale(docs, { strict })
})

export const getCategories = cache(async (locale = 'fr') => {
  const payload = await payloadClient()
  const res = await payload.find({ collection: 'categories', locale, sort: 'order', limit: 50, depth: 0 })
  return res.docs
})

// Under strict, an English or Spanish product page also needs its French version ready (lib/publish.js):
// each product carries `frenchReady` so cards and tables never link to a page that would answer 404.
export const getProducts = cache(async ({ locale = 'fr', productionCategory, categoryId } = {}) => {
  const payload = await payloadClient()
  const where = { _status: { equals: 'published' }, availability: { not_equals: 'discontinued' } }
  if (productionCategory) where.productionCategory = { equals: productionCategory }
  if (categoryId) where.category = { equals: categoryId }
  const res = await payload.find({ collection: 'products', where, locale, limit: 200, depth: 1, sort: 'title' })
  if (locale === 'fr' || publishGuard() !== 'strict' || !res.docs.length) return res.docs
  const fr = await payload.find({ collection: 'products', where: { id: { in: res.docs.map((d) => d.id) } }, locale: 'fr', limit: 200, depth: 0 })
  const ready = new Set(fr.docs.filter(productReady).map((d) => d.id))
  return res.docs.map((d) => ({ ...d, frenchReady: ready.has(d.id) }))
})

// A product taken off the menu (« Retiré ») has no page, like in the listings and the sitemap: 404.
export const getProductBySlugs = cache(async (locale, categorySlug, productSlug) => {
  const payload = await payloadClient()
  const res = await payload.find({
    collection: 'products',
    where: { slug: { equals: productSlug }, _status: { equals: 'published' }, availability: { not_equals: 'discontinued' } },
    locale,
    limit: 5,
    depth: 2,
  })
  return res.docs.find((p) => p.category && p.category.slug === categorySlug) || null
})

export const getAllergens = cache(async (locale = 'fr') => {
  const payload = await payloadClient()
  const res = await payload.find({ collection: 'allergens', locale, limit: 50, depth: 0, sort: 'code' })
  return res.docs
})

// Shop, capacity pools and bookings read once per render, so every card, the product page and its JSON-LD
// get the same engine answer (06 k). Checkout checks capacity again under the lock.
const getEngine = cache(async () => engineContext(await payloadClient()))

export async function getOfferStates(products = [], locale = 'fr') {
  if (!products.length) return new Map()
  const { shop, pools, usage } = await getEngine()
  const now = new Date()
  return new Map(products.map((p) => [p.id, productOfferState(p, shop, now, { locale, pools, usage })]))
}
