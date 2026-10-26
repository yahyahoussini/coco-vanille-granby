// Step-up password check without opening another session: the same PBKDF2 check as Payload's local strategy
// (payload/dist/auth/strategies/local: 'pbkdf2-sha256-v1:' 600 000 iterations, or the legacy 25 000 × 512 bytes).
import { pbkdf2 as pbkdf2Cb, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

const pbkdf2 = promisify(pbkdf2Cb)
const PREFIX = 'pbkdf2-sha256-v1:'

export async function passwordMatches(password, { hash, salt } = {}) {
  if (typeof password !== 'string' || !password || typeof hash !== 'string' || typeof salt !== 'string') return false
  const current = hash.startsWith(PREFIX)
  const stored = Buffer.from(current ? hash.slice(PREFIX.length) : hash, 'hex')
  const key = await pbkdf2(password, salt, current ? 600000 : 25000, current ? 32 : 512, 'sha256')
  return key.length === stored.length && timingSafeEqual(key, stored)
}

export async function checkPassword(payload, userId, password) {
  const raw = await payload.db.findOne({ collection: 'users', where: { id: { equals: userId } }, req: {} })
  if (!raw || (raw.lockUntil && new Date(raw.lockUntil).getTime() > Date.now())) return false
  return passwordMatches(password, raw)
}
