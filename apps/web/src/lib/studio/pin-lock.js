// Wrong-PIN lock (5 guesses, then 15 minutes) counted in the database in one statement, before the PIN is
// checked: parallel guesses each get their own count, and the 6th never reaches scrypt (16b §4 #7).
// A right PIN clears the count.
import { PIN_MAX_FAILURES, PIN_LOCK_MINUTES } from './pin.js'

export const claimSql = (table = 'users') => `update ${table} set
  pin_failures = case when coalesce(pin_failures, 0) + 1 >= $2 then 0 else coalesce(pin_failures, 0) + 1 end,
  pin_locked_until = case when coalesce(pin_failures, 0) + 1 >= $2 then $3::timestamptz else null end
where id = $1 and (pin_locked_until is null or pin_locked_until <= $4::timestamptz)
returning pin_locked_until`

// → { ok: false } while locked; { ok: true, lastTry } otherwise (lastTry: a wrong PIN now means « verrouillé »).
export async function claimPinAttempt(query, id, { now = new Date(), table = 'users' } = {}) {
  const t = new Date(now)
  const until = new Date(t.getTime() + PIN_LOCK_MINUTES * 60 * 1000)
  const r = await query(claimSql(table), [id, PIN_MAX_FAILURES, until.toISOString(), t.toISOString()])
  const row = r?.rows?.[0]
  if (!row) return { ok: false }
  return { ok: true, lastTry: Boolean(row.pin_locked_until) }
}

export const clearPinFailures = (query, id, { table = 'users' } = {}) => query(`update ${table} set pin_failures = 0, pin_locked_until = null where id = $1`, [id])

// The Postgres pool behind Payload (payload.db.pool).
export const poolQuery = (payload) => (text, params) => payload.db.pool.query(text, params)
