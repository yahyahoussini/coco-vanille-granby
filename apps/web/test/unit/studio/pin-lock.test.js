// Wrong-PIN lock and sign-in throttles under parallel requests (16b §4 #7): a burst of guesses gets five tries
// in all, never one per request. The database part runs when DATABASE_URI points to a Postgres (CI, dev).
import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { attempt, forgive } from '../../../src/lib/studio/throttle.js'
import { claimPinAttempt, clearPinFailures } from '../../../src/lib/studio/pin-lock.js'
import { PIN_MAX_FAILURES } from '../../../src/lib/studio/pin.js'

describe('throttle', () => {
  test('each attempt is counted before the slow check, so a burst stops at the limit', async () => {
    const key = `burst-${Math.random()}`
    const results = await Promise.all(Array.from({ length: 40 }, async () => {
      if (!attempt(key, { max: 30 })) return 'trop'
      await new Promise((r) => setTimeout(r, 5))
      return 'checked'
    }))
    assert.equal(results.filter((r) => r === 'checked').length, 30)
    assert.equal(results.filter((r) => r === 'trop').length, 10)
  })

  test('a success gives its slot back (a busy tablet is never locked out)', () => {
    const key = `ok-${Math.random()}`
    for (let i = 0; i < 100; i++) {
      assert.ok(attempt(key, { max: 3 }))
      forgive(key)
    }
  })
})

async function database() {
  if (!process.env.DATABASE_URI) return null
  try {
    const { default: pg } = await import('pg')
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URI, max: 10, connectionTimeoutMillis: 3000 })
    await pool.query('select 1')
    return pool
  } catch {
    return null
  }
}

describe('PIN lock in the database', async () => {
  const pool = await database()
  const table = `pin_lock_test_${process.pid}`

  test('40 parallel wrong guesses: 5 reach the PIN check, then the person is locked', { skip: !pool && 'no database' }, async () => {
    await pool.query(`create table ${table} (id integer primary key, pin_failures numeric default 0, pin_locked_until timestamp(3) with time zone)`)
    try {
      await pool.query(`insert into ${table} (id) values (1)`)
      const query = (text, params) => pool.query(text, params)
      const claims = await Promise.all(Array.from({ length: 40 }, () => claimPinAttempt(query, 1, { table })))
      assert.equal(claims.filter((c) => c.ok).length, PIN_MAX_FAILURES)
      assert.equal(claims.filter((c) => c.ok && c.lastTry).length, 1, 'the fifth guess is told it locks')
      const [row] = (await pool.query(`select pin_failures, pin_locked_until from ${table} where id = 1`)).rows
      assert.ok(new Date(row.pin_locked_until).getTime() > Date.now() + 14 * 60 * 1000)
      assert.equal((await claimPinAttempt(query, 1, { table })).ok, false, 'still locked')
      assert.equal((await claimPinAttempt(query, 1, { table, now: new Date(Date.now() + 16 * 60 * 1000) })).ok, true, 'free again after 15 minutes')
      await clearPinFailures(query, 1, { table })
      const [clean] = (await pool.query(`select pin_failures, pin_locked_until from ${table} where id = 1`)).rows
      assert.equal(Number(clean.pin_failures), 0)
      assert.equal(clean.pin_locked_until, null)
    } finally {
      await pool.query(`drop table if exists ${table}`)
      await pool.end()
    }
  })
})

describe('client address', async () => {
  const { ipOf } = await import('../../../src/lib/studio/audit.js')
  const { clientIp } = await import('../../../src/lib/ordering/rate-limit.js')
  test('X-Real-IP (nginx $remote_addr), never the X-Forwarded-For a client typed', () => {
    const headers = new Headers({ 'x-forwarded-for': '6.6.6.6, 203.0.113.9', 'x-real-ip': '203.0.113.9' })
    assert.equal(ipOf(headers), '203.0.113.9')
    assert.equal(clientIp({ headers }), '203.0.113.9')
    const spoofOnly = new Headers({ 'x-forwarded-for': '6.6.6.6' })
    assert.equal(ipOf(spoofOnly), null)
    assert.equal(clientIp({ headers: spoofOnly }), 'local')
  })
})
