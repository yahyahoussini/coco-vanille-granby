// Database side of the engine: shop settings, capacity pools, bookings, the capacity lock, tokens.
// Every read uses the Local API with overrideAccess (callers check who may act before calling).
import { randomBytes, randomInt } from 'node:crypto'
import { addDays, localParts, dayBounds } from '../studio/time.js'
import { COMMITTED_STATUSES, usageFrom } from './capacity.js'
import { windowSettings } from './slots.js'

const SYS = { overrideAccess: true, depth: 0 }

export const getShopSettings = (payload) => payload.findGlobal({ slug: 'shop', locale: 'fr', ...SYS })
export const getBusinessSettings = (payload, locale = 'fr') => payload.findGlobal({ slug: 'business', locale, ...SYS })

export async function getPools(payload) {
  const res = await payload.find({ collection: 'capacity-pools', limit: 100, pagination: false, ...SYS })
  return res.docs
}

// Bookings that can touch the pools and windows between two calendar days (production offsets included).
export async function getUsage(payload, { now = new Date(), fromISO, toISO, excludeOrderId = null, excludeRequestId = null } = {}) {
  const from = dayBounds(addDays(fromISO, -3)).from
  const to = dayBounds(addDays(toISO, 7)).from
  const [orders, requests] = await Promise.all([
    payload.find({
      collection: 'orders',
      where: { and: [{ pickupDate: { greater_than_equal: from } }, { pickupDate: { less_than: to } }, { status: { in: ['pending_payment', ...COMMITTED_STATUSES] } }] },
      limit: 0,
      pagination: false,
      ...SYS,
    }),
    payload.find({
      collection: 'requests',
      where: { and: [{ eventDate: { greater_than_equal: from } }, { eventDate: { less_than: to } }, { status: { in: ['quoted', 'deposit_paid', 'confirmed'] } }] },
      limit: 0,
      pagination: false,
      ...SYS,
    }),
  ])
  return { usage: usageFrom({ orders: orders.docs, requests: requests.docs, now, excludeOrderId, excludeRequestId }), orders: orders.docs, requests: requests.docs }
}

// Shop + pools + usage over the whole booking horizon.
export async function engineContext(payload, { now = new Date(), shop } = {}) {
  const s = shop || (await getShopSettings(payload))
  const today = localParts(now).iso
  const [pools, booked] = await Promise.all([getPools(payload), getUsage(payload, { now, fromISO: today, toISO: addDays(today, windowSettings(s).maxDaysAhead) })])
  return { shop: s, pools, usage: booked.usage, orders: booked.orders, requests: booked.requests, today }
}

// One writer at a time for bookings (web checkout, Studio phone orders, quotes, payment webhooks):
// a Postgres advisory lock, so a window or a pool can never be sold twice. No database pool → runs as is.
const LOCK_KEY = 4503727177
export async function withCapacityLock(payload, fn) {
  const pool = payload?.db?.pool
  if (!pool?.connect) return fn()
  const client = await pool.connect()
  try {
    await client.query('select pg_advisory_lock($1)', [LOCK_KEY])
    return await fn()
  } finally {
    await client.query('select pg_advisory_unlock($1)', [LOCK_KEY]).catch(() => {})
    client.release()
  }
}

export const newToken = (bytes = 18) => randomBytes(bytes).toString('base64url')
export const newPickupCode = () => String(randomInt(0, 10000)).padStart(4, '0')

// Order numbers count up from 1001; the unique index on `number` is the last guard.
export async function nextOrderNumber(payload) {
  const res = await payload.find({ collection: 'orders', sort: '-number', limit: 1, ...SYS })
  const last = res.docs[0]?.number
  return Number.isInteger(last) && last >= 1001 ? last + 1 : 1001
}

// Stored pickup dates keep the local calendar day in their UTC date part (studio/time.js convention).
export const storedDay = (iso) => `${iso}T12:00:00.000Z`

export const publicOrigin = () => (process.env.PUBLIC_ORIGIN || 'https://cocovanillegranby.com').replace(/\/$/, '')
