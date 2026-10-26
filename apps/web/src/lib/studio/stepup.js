// Step-up proof (16b §4 #4): a signed 5-minute cookie for one person, set by /svc/verifier or the passkey
// check. Pure module (no Payload config import) so the collection access rules can check it on REST writes.
import { sign, unsign } from './pin.js'

export const STEPUP_COOKIE = 'cv_verif'
export const STEPUP_MINUTES = 5

export function readCookie(headers, name) {
  const raw = (typeof headers?.get === 'function' ? headers.get('cookie') : headers?.cookie) || ''
  for (const part of raw.split(';')) {
    const i = part.indexOf('=')
    if (i > 0 && part.slice(0, i).trim() === name) return decodeURIComponent(part.slice(i + 1).trim())
  }
  return null
}

export const stepSecret = (payload) => `${payload.secret}:verif`

export const stepUpValue = (payload, user, now = Date.now()) => sign({ uid: user.id, exp: now + STEPUP_MINUTES * 60 * 1000 }, stepSecret(payload))

export function hasStepUp(payload, headers, user, now = Date.now()) {
  if (!payload?.secret || !user) return false
  const v = unsign(readCookie(headers, STEPUP_COOKIE), stepSecret(payload))
  return Boolean(v && String(v.uid) === String(user.id) && v.exp > now)
}
