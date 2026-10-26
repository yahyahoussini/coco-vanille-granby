// Database side of the engine: shop settings, capacity pools, bookings, the capacity lock, tokens.
// Every read uses the Local API with overrideAccess (callers check who may act before calling).
import { randomBytes, randomInt } from 'node:crypto'
import { AsyncLocalStorage } from 'node:async_hooks'
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
// Inside one process the callers queue in memory first, so at most one pool connection per process waits
// on the lock: a burst of bookings can never hold every connection while the holder needs one for its own
// queries (pool exhaustion). Across processes (web, studio, worker) each waits with a single connection,
// and never longer than LOCK_WAIT. A call made while already holding the lock runs at once.
export const LOCK_KEY = 4503727177
const LOCK_WAIT = '20s'
const holding = new AsyncLocalStorage()
const queues = new WeakMap()

export function withCapacityLock(payload, fn) {
  const pool = payload?.db?.pool
  if (!pool?.connect) return fn()
  if (holding.getStore() === pool) return fn()
  const run = (queues.get(pool) || Promise.resolve()).then(() => lockedRun(pool, fn))
  queues.set(pool, run.catch(() => {}))
  return run
}

async function lockedRun(pool, fn) {
  const client = await pool.connect()
  let locked = false
  let broken = false
  try {
    await client.query(`set lock_timeout = '${LOCK_WAIT}'`)
    await client.query('select pg_advisory_lock($1)', [LOCK_KEY])
    locked = true
    return await holding.run(pool, fn)
  } finally {
    if (locked) await client.query('select pg_advisory_unlock($1)', [LOCK_KEY]).catch(() => (broken = true))
    await client.query('reset lock_timeout').catch(() => (broken = true))
    // A connection that could not unlock is closed, which frees the lock in Postgres.
    client.release(broken || undefined)
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
