// Staff PIN and owner backup codes: scrypt hashes only, never the secret itself (16b §4).
// Format: scrypt$N$r$p$<salt base64url>$<key base64url>
import { scrypt as scryptCb, randomBytes, timingSafeEqual, createHmac, randomInt } from 'node:crypto'
import { promisify } from 'node:util'

const scrypt = promisify(scryptCb)
const N = 16384
const R = 8
const PAR = 1
const KEYLEN = 32

export const PIN_RE = /^\d{4}$/
export const PIN_MAX_FAILURES = 5
export const PIN_LOCK_MINUTES = 15

export const validPin = (pin) => typeof pin === 'string' && PIN_RE.test(pin)

export async function hashSecret(secret) {
  const salt = randomBytes(16)
  const key = await scrypt(String(secret), salt, KEYLEN, { N, r: R, p: PAR })
  return `scrypt$${N}$${R}$${PAR}$${salt.toString('base64url')}$${key.toString('base64url')}`
}

export async function verifySecret(secret, stored) {
  if (typeof stored !== 'string') return false
  const parts = stored.split('$')
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false
  const [, n, r, p, saltB64, keyB64] = parts
  const expected = Buffer.from(keyB64, 'base64url')
  const key = await scrypt(String(secret), Buffer.from(saltB64, 'base64url'), expected.length, { N: Number(n), r: Number(r), p: Number(p) })
  return key.length === expected.length && timingSafeEqual(key, expected)
}

export const hashPin = (pin) => {
  if (!validPin(pin)) throw new Error('Le NIP doit avoir 4 chiffres.')
  return hashSecret(pin)
}

export const verifyPin = (pin, stored) => (validPin(pin) ? verifySecret(pin, stored) : Promise.resolve(false))

// Lock after 5 wrong PINs in a row, for 15 minutes.
export function pinLocked(user, now = new Date()) {
  return Boolean(user?.pinLockedUntil && new Date(user.pinLockedUntil).getTime() > new Date(now).getTime())
}

export function afterPinFailure(user, now = new Date()) {
  const failures = (user?.pinFailures || 0) + 1
  if (failures >= PIN_MAX_FAILURES) return { pinFailures: 0, pinLockedUntil: new Date(new Date(now).getTime() + PIN_LOCK_MINUTES * 60 * 1000).toISOString() }
  return { pinFailures: failures, pinLockedUntil: null }
}

// Owner backup codes (passkey lost): 8 codes of 10 characters, shown once, stored hashed, each usable once.
const ALPHABET = 'abcdefghjkmnpqrstuvwxyz23456789'
export function newBackupCodes(count = 8) {
  return Array.from({ length: count }, () => {
    const s = Array.from({ length: 10 }, () => ALPHABET[randomInt(0, ALPHABET.length)]).join('')
    return `${s.slice(0, 5)}-${s.slice(5)}`
  })
}

export const normalizeBackupCode = (code) => String(code || '').toLowerCase().replace(/[^a-z0-9]/g, '').replace(/^(.{5})(.{5})$/, '$1-$2')

export async function useBackupCode(code, hashes = []) {
  const clean = normalizeBackupCode(code)
  if (!/^[a-z0-9]{5}-[a-z0-9]{5}$/.test(clean)) return { ok: false, remaining: hashes }
  for (let i = 0; i < hashes.length; i++) {
    if (await verifySecret(clean, hashes[i])) return { ok: true, remaining: hashes.filter((_, j) => j !== i) }
  }
  return { ok: false, remaining: hashes }
}

// Signed small values (device cookie, step-up cookie, undo tokens): base64url(JSON).hmac
export function sign(value, secret) {
  const body = Buffer.from(JSON.stringify(value)).toString('base64url')
  const mac = createHmac('sha256', String(secret)).update(body).digest('base64url')
  return `${body}.${mac}`
}

export function unsign(token, secret) {
  if (typeof token !== 'string' || !token.includes('.')) return null
  const [body, mac] = token.split('.')
  const expected = createHmac('sha256', String(secret)).update(body).digest('base64url')
  const a = Buffer.from(mac)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  try {
    return JSON.parse(Buffer.from(body, 'base64url').toString('utf8'))
  } catch {
    return null
  }
}
