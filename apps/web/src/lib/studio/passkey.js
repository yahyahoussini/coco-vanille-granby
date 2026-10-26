// Owner passkey (16b §4 #5): Face ID / Touch ID / a security key instead of a typed password, with one-time
// backup codes. SimpleWebAuthn on both sides; credentials live hashed-free (public keys only) in users.passkeys.
// The challenge waits 5 minutes in a signed, host-only cookie.
import { generateRegistrationOptions, verifyRegistrationResponse, generateAuthenticationOptions, verifyAuthenticationResponse } from '@simplewebauthn/server'
import { sign, unsign } from './pin.js'
import { cookieString, readCookie } from './session.js'

export const CHALLENGE_COOKIE = 'cv_cle'
const TTL = 5 * 60 * 1000
export const PASSKEY_ROLES = ['proprietaire', 'gerant', 'agence']

export function relyingParty(env = process.env) {
  const origin = (env.ADMIN_ORIGIN || 'http://admin.localhost:3000').replace(/\/$/, '')
  return { origin, rpID: new URL(origin).hostname, rpName: 'Coco Studio' }
}

const secret = (payload) => `${payload.secret}:cle`

export function challengeCookie(payload, { challenge, purpose, uid = null }, now = Date.now()) {
  return cookieString(CHALLENGE_COOKIE, sign({ challenge, purpose, uid, exp: now + TTL }, secret(payload)), { maxAge: TTL / 1000 })
}

export function readChallenge(payload, headers, purpose, now = Date.now()) {
  const v = unsign(readCookie(headers, CHALLENGE_COOKIE), secret(payload))
  return v && v.purpose === purpose && v.exp > now ? v : null
}

export const clearChallenge = () => cookieString(CHALLENGE_COOKIE, '', { maxAge: 0 })

export const storedCredentials = (user) => (Array.isArray(user?.passkeys) ? user.passkeys : [])

export async function registrationOptions(user, { rp = relyingParty() } = {}) {
  return generateRegistrationOptions({
    rpName: rp.rpName,
    rpID: rp.rpID,
    userName: user.email,
    userDisplayName: user.name,
    userID: new TextEncoder().encode(String(user.id)),
    attestationType: 'none',
    excludeCredentials: storedCredentials(user).map((c) => ({ id: c.id, transports: c.transports || undefined })),
    authenticatorSelection: { residentKey: 'preferred', userVerification: 'preferred' },
  })
}

// → the credential row to store, or null.
export async function verifyRegistration(response, expectedChallenge, { rp = relyingParty(), label = 'Clé d’accès', now = new Date() } = {}) {
  const r = await verifyRegistrationResponse({ response, expectedChallenge, expectedOrigin: rp.origin, expectedRPID: rp.rpID, requireUserVerification: false })
  if (!r.verified) return null
  const c = r.registrationInfo.credential
  return { id: c.id, publicKey: Buffer.from(c.publicKey).toString('base64url'), counter: c.counter, transports: c.transports || [], backedUp: r.registrationInfo.credentialBackedUp, label, createdAt: now.toISOString(), lastUsedAt: null }
}

export const authenticationOptions = (user = null, { rp = relyingParty() } = {}) =>
  generateAuthenticationOptions({ rpID: rp.rpID, userVerification: 'preferred', allowCredentials: user ? storedCredentials(user).map((c) => ({ id: c.id, transports: c.transports || undefined })) : [] })

// The user ID the browser sends back with a discoverable credential (our userID = the user's id as text).
export function userHandleOf(response) {
  try {
    return response?.response?.userHandle ? Buffer.from(response.response.userHandle, 'base64url').toString('utf8') : null
  } catch {
    return null
  }
}

// → { ok, credentials (with the new counter) }
export async function verifyAuthentication(response, expectedChallenge, user, { rp = relyingParty(), now = new Date() } = {}) {
  const creds = storedCredentials(user)
  const cred = creds.find((c) => c.id === response?.id)
  if (!cred) return { ok: false }
  const r = await verifyAuthenticationResponse({
    response,
    expectedChallenge,
    expectedOrigin: rp.origin,
    expectedRPID: rp.rpID,
    credential: { id: cred.id, publicKey: new Uint8Array(Buffer.from(cred.publicKey, 'base64url')), counter: cred.counter || 0, transports: cred.transports || undefined },
    requireUserVerification: false,
  }).catch(() => ({ verified: false }))
  if (!r.verified) return { ok: false }
  return { ok: true, credentials: creds.map((c) => (c.id === cred.id ? { ...c, counter: r.authenticationInfo.newCounter, lastUsedAt: now.toISOString() } : c)) }
}
