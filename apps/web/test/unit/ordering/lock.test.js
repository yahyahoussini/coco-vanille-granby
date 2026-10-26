// The booking lock under a burst (10 §3.3): bookings queue for the advisory lock without holding every pool
// connection, so the holder can always run its own queries (a pool of 10 used to hang at 9 bookings).
import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { withCapacityLock } from '../../../src/lib/ordering/context.js'

// A pg-like pool of `max` connections with one advisory lock: connect() waits when all are taken, and
// pg_advisory_lock waits while another connection holds it (as Postgres does).
function fakePool(max) {
  let used = 0
  const waiting = []
  let holder = null
  const lockQueue = []
  const stats = { peak: 0, lockWaiters: 0, peakLockWaiters: 0, settings: [] }
  const pool = {
    stats,
    async connect() {
      if (used >= max) await new Promise((resolve) => waiting.push(resolve))
      used += 1
      stats.peak = Math.max(stats.peak, used)
      const client = {
        async query(sql) {
          if (/set lock_timeout|reset lock_timeout/.test(sql)) stats.settings.push(sql)
          if (/pg_advisory_lock/.test(sql)) {
            while (holder && holder !== client) {
              stats.lockWaiters += 1
              stats.peakLockWaiters = Math.max(stats.peakLockWaiters, stats.lockWaiters)
              await new Promise((resolve) => lockQueue.push(resolve))
              stats.lockWaiters -= 1
            }
            holder = client
          }
          if (/pg_advisory_unlock/.test(sql) && holder === client) {
            holder = null
            lockQueue.shift()?.()
          }
          return { rows: [] }
        },
        release() {
          used -= 1
          waiting.shift()?.()
        },
      }
      return client
    },
  }
  return pool
}

// What a booking does while it holds the lock: a few queries, each on a pool connection.
const booking = (pool, out, i) => async () => {
  for (let q = 0; q < 3; q++) {
    const c = await pool.connect()
    await new Promise((r) => setTimeout(r, 1))
    c.release()
  }
  out.push(i)
  return i
}

const within = (ms, p) => Promise.race([p, new Promise((_, reject) => setTimeout(() => reject(new Error(`stuck after ${ms} ms`)), ms))])

describe('withCapacityLock', () => {
  test('30 bookings at once on a pool of 10: all finish, one at a time', async () => {
    const pool = fakePool(10)
    const payload = { db: { pool } }
    const out = []
    const results = await within(5000, Promise.all(Array.from({ length: 30 }, (_, i) => withCapacityLock(payload, booking(pool, out, i)))))
    assert.deepEqual(results, Array.from({ length: 30 }, (_, i) => i))
    assert.equal(out.length, 30)
    assert.ok(pool.stats.peak <= 2, `at most the lock connection and one query connection (peak ${pool.stats.peak})`)
  })

  test('a pool of 2 is enough, and the wait for the lock is bounded', async () => {
    const pool = fakePool(2)
    const out = []
    await within(5000, Promise.all(Array.from({ length: 9 }, (_, i) => withCapacityLock({ db: { pool } }, booking(pool, out, i)))))
    assert.equal(out.length, 9)
    assert.ok(pool.stats.settings.some((s) => /set lock_timeout/.test(s)))
  })

  test('a call made while holding the lock runs at once (no self-deadlock)', async () => {
    const pool = fakePool(3)
    const payload = { db: { pool } }
    const r = await within(2000, withCapacityLock(payload, async () => withCapacityLock(payload, async () => 'nested')))
    assert.equal(r, 'nested')
  })

  test('a failing booking releases the lock for the next one', async () => {
    const pool = fakePool(3)
    const payload = { db: { pool } }
    const first = withCapacityLock(payload, async () => {
      throw new Error('boom')
    })
    const second = withCapacityLock(payload, async () => 'next')
    await assert.rejects(first, /boom/)
    assert.equal(await within(2000, second), 'next')
  })

  test('without a database pool, runs as is', async () => {
    assert.equal(await withCapacityLock({}, async () => 7), 7)
  })
})
