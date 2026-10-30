// The visitor's key to their own conversation: an HttpOnly cookie « <conversation id>.<random secret> »; the
// database keeps only the SHA-256 of the secret (never the secret itself), compared in constant time. A second,
// non-secret cookie (cv_chat=1, readable by the page) only tells the widget that a conversation exists, so it
// asks the server for news only then. No IP address is stored anywhere. Pure (node:crypto), node --test.
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto'

export const TOKEN_COOKIE = 'cv_clavardage'
export const FLAG_COOKIE = 'cv_chat'
export const COOKIE_DAYS = 90
export const COOKIE_MAX_AGE = COOKIE_DAYS * 24 * 60 * 60

const HEX64 = /^[0-9a-f]{64}$/

export const hashSecret = (secret) => createHash('sha256').update(String(secret), 'utf8').digest('hex')

// 192 random bits: nobody guesses it, so a plain hash is enough (no pepper needed).
export function newVisitorSecret() {
  const secret = randomBytes(24).toString('base64url')
  return { secret, hash: hashSecret(secret) }
}

export function verifySecret(secret, hash) {
  if (typeof secret !== 'string' || !secret || typeof hash !== 'string' || !HEX64.test(hash)) return false
  const a = Buffer.from(hashSecret(secret), 'hex')
  const b = Buffer.from(hash, 'hex')
  return a.length === b.length && timingSafeEqual(a, b)
}

export const cookieValue = (id, secret) => `${id}.${secret}`

export function parseCookieValue(value) {
  const m = /^(\d{1,12})\.([A-Za-z0-9_-]{16,128})$/.exec(String(value ?? ''))
  return m ? { id: Number(m[1]), secret: m[2] } : null
}

// One cookie from a Cookie header (or a Headers object).
export function readCookie(source, name) {
  const header = typeof source?.get === 'function' ? source.get('cookie') : String(source ?? '')
  for (const part of String(header || '').split(';')) {
    const i = part.indexOf('=')
    if (i > 0 && part.slice(0, i).trim() === name) return part.slice(i + 1).trim()
  }
  return null
}
