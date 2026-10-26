// Studio sessions on the admin host. The base is Payload's own login cookie (email + password, 12 h,
// revocable sessions); a PIN switch or a passkey mints the same kind of session for the chosen person.
// Extra cookies, all host-only, HttpOnly, SameSite=Lax: the device (shared tablet or own phone) and a
// 5-minute step-up proof for money, prices, allergens, taxes and people (16b §4 #3–#5).
import { getPayload, jwtSign, getFieldsToSign } from 'payload'
import { addSessionToUser, generatePayloadCookie } from 'payload/shared'
import config from '@payload-config'
import { randomBytes } from 'node:crypto'
import { sign, unsign } from './pin.js'
import { roleOf } from './roles.js'
import { STEPUP_COOKIE, STEPUP_MINUTES, readCookie, stepUpValue, hasStepUp } from './stepup.js'

export { STEPUP_COOKIE, STEPUP_MINUTES, readCookie, hasStepUp }
export const DEVICE_COOKIE = 'cv_appareil'
export const DEVICE_KINDS = ['telephone', 'tablette', 'ordinateur']

export const studioPayload = () => getPayload({ config })

const secure = () => /^https:/.test(process.env.ADMIN_ORIGIN || '') || process.env.NODE_ENV === 'production'

export function cookieString(name, value, { maxAge = 60 * 60 * 24 * 365, httpOnly = true } = {}) {
  const parts = [`${name}=${value}`, 'Path=/', `Max-Age=${maxAge}`, 'SameSite=Lax']
  if (httpOnly) parts.push('HttpOnly')
  if (secure()) parts.push('Secure')
  return parts.join('; ')
}

const deviceSecret = (payload) => `${payload.secret}:appareil`

// { id, kind: 'telephone'|'tablette'|'ordinateur', shared: boolean }
export function readDevice(payload, headers) {
  const d = unsign(readCookie(headers, DEVICE_COOKIE), deviceSecret(payload))
  if (!d || !DEVICE_KINDS.includes(d.kind)) return null
  return { id: String(d.id || ''), kind: d.kind, shared: Boolean(d.shared) }
}

export function deviceCookie(payload, { id, kind, shared }) {
  const value = sign({ id: id || randomBytes(6).toString('base64url'), kind: DEVICE_KINDS.includes(kind) ? kind : 'telephone', shared: Boolean(shared) }, deviceSecret(payload))
  return cookieString(DEVICE_COOKIE, value)
}

export const payloadCookieName = (payload) => `${payload.config.cookiePrefix || 'payload'}-token`

// The signed-in person for a request (route handler or server component headers).
export async function studioAuth(headers, payload) {
  const p = payload || (await studioPayload())
  let user = null
  try {
    user = (await p.auth({ headers })).user || null
  } catch {
    user = null
  }
  if (user && !roleOf(user)) user = null
  return { payload: p, user, device: readDevice(p, headers) }
}

// Mint a Payload session for a user (PIN switch, passkey, backup code). Same token and cookie as /api/users/login.
export async function issueSession(payload, userId) {
  const collectionConfig = payload.collections.users.config
  const user = await payload.db.findOne({ collection: 'users', where: { id: { equals: userId } }, req: {} })
  if (!user) throw new Error('user missing')
  const { sid } = await addSessionToUser({ collectionConfig, payload, req: {}, user })
  const fieldsToSign = getFieldsToSign({ collectionConfig, email: user.email, user: { ...user, collection: 'users' }, sid })
  const { token, exp } = await jwtSign({ fieldsToSign, secret: payload.secret, tokenExpiration: collectionConfig.auth.tokenExpiration })
  const cookie = generatePayloadCookie({ collectionAuthConfig: collectionConfig.auth, cookiePrefix: payload.config.cookiePrefix || 'payload', token })
  return { token, exp, cookie }
}

export function expiredPayloadCookie(payload) {
  return `${payloadCookieName(payload)}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${secure() ? '; Secure' : ''}`
}

// Claims of a token Payload already verified (id + sid), without re-checking the signature.
function claims(token) {
  try {
    return JSON.parse(Buffer.from(String(token).split('.')[1], 'base64url').toString('utf8'))
  } catch {
    return null
  }
}

// Ends the current session server-side too (sessions are revocable, unlike bare JWTs).
export const revokeCurrent = (payload, headers) => revokeToken(payload, readCookie(headers, payloadCookieName(payload)))

export async function revokeToken(payload, token) {
  const c = token ? claims(token) : null
  if (!c?.id || !c?.sid) return
  const user = await payload.db.findOne({ collection: 'users', where: { id: { equals: c.id } }, req: {} })
  if (!user?.sessions?.length) return
  user.sessions = user.sessions.filter((s) => s.id !== c.sid)
  user.updatedAt = null
  await payload.db.updateOne({ id: user.id, collection: 'users', data: user, req: {}, returning: false })
}

// Step-up: a fresh password, passkey or backup-code check, valid 5 minutes for this person only (stepup.js).
export const stepUpCookie = (payload, user, now = Date.now()) => cookieString(STEPUP_COOKIE, stepUpValue(payload, user, now), { maxAge: STEPUP_MINUTES * 60 })

export const clearStepUp = () => cookieString(STEPUP_COOKIE, '', { maxAge: 0 })

// Same-origin check for cookie-authenticated POSTs (SameSite=Lax already blocks cross-site cookies).
export function sameOrigin(headers) {
  const origin = headers.get('origin')
  if (!origin) return true
  try {
    return new URL(origin).host === headers.get('host')
  } catch {
    return false
  }
}

// Only relative paths inside Studio as a return target.
export const safeBack = (value, fallback = '/') => (typeof value === 'string' && /^\/(?!\/)[\w\-./?=&%#:+,~]*$/.test(value) ? value : fallback)

export function seeOther(location, cookies = []) {
  const headers = new Headers({ Location: location, 'Cache-Control': 'no-store, private', 'X-Robots-Tag': 'noindex, nofollow, noarchive' })
  for (const c of cookies) headers.append('Set-Cookie', c)
  return new Response(null, { status: 303, headers })
}

export function json(data, { status = 200, cookies = [] } = {}) {
  const headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store, private', 'X-Robots-Tag': 'noindex, nofollow, noarchive' })
  for (const c of cookies) headers.append('Set-Cookie', c)
  return new Response(JSON.stringify(data), { status, headers })
}

export const wantsJson = (request) => /application\/json/.test(request.headers.get('accept') || '') || /application\/json/.test(request.headers.get('content-type') || '')
