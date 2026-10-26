import 'server-only'
import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { engineContext } from '@/lib/ordering/context'
import { productOfferState } from '@/lib/ordering/availability'

export const payloadClient = cache(async () => getPayload({ config }))

export const getBusiness = cache(async (locale = 'fr') => {
  const payload = await payloadClient()
  return payload.findGlobal({ slug: 'business', locale, depth: 0 })
})

export const getShop = cache(async (locale = 'fr') => {
  const payload = await payloadClient()
  return payload.findGlobal({ slug: 'shop', locale, depth: 0 })
})

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
  return res.docs[0] || null
})

export const getCategories = cache(async (locale = 'fr') => {
  const payload = await payloadClient()
  const res = await payload.find({ collection: 'categories', locale, sort: 'order', limit: 50, depth: 0 })
  return res.docs
})

export const getProducts = cache(async ({ locale = 'fr', productionCategory, categoryId } = {}) => {
  const payload = await payloadClient()
  const where = { _status: { equals: 'published' }, availability: { not_equals: 'discontinued' } }
  if (productionCategory) where.productionCategory = { equals: productionCategory }
  if (categoryId) where.category = { equals: categoryId }
  const res = await payload.find({ collection: 'products', where, locale, limit: 200, depth: 1, sort: 'title' })
  return res.docs
})

export const getProductBySlugs = cache(async (locale, categorySlug, productSlug) => {
  const payload = await payloadClient()
  const res = await payload.find({
    collection: 'products',
    where: { slug: { equals: productSlug }, _status: { equals: 'published' } },
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
