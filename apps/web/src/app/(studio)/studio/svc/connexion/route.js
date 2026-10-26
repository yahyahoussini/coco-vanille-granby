import { generatePayloadCookie } from 'payload/shared'
import { studioPayload, deviceCookie, readDevice, revokeToken, issueSession, sameOrigin, safeBack, seeOther } from '@/lib/studio/session'
import { roleOf, homeFor } from '@/lib/studio/roles'
import { useBackupCode } from '@/lib/studio/pin'
import { PASSKEY_ROLES } from '@/lib/studio/passkey'
import { writeAudit, ipOf, sentence } from '@/lib/studio/audit'
import { tooMany, failed } from '@/lib/studio/throttle'

// POST /svc/connexion: email + password (Payload login, 12 h session, 5 attempts then a 15-minute lock), or
// email + a one-time backup code when the passkey is lost. Also records what this device is: own phone,
// computer, or the shop's shared tablet (PIN switch).
export const dynamic = 'force-dynamic'

async function withBackupCode(payload, email, code) {
  const r = await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1, depth: 0, overrideAccess: true, showHiddenFields: true })
  const user = r.docs[0]
  if (!user || !PASSKEY_ROLES.includes(roleOf(user)) || (user.lockUntil && new Date(user.lockUntil) > new Date())) return null
  const used = await useBackupCode(code, Array.isArray(user.backupCodes) ? user.backupCodes : [])
  if (!used.ok) return null
  await payload.update({ collection: 'users', id: user.id, data: { backupCodes: used.remaining }, overrideAccess: true, depth: 0, context: { studioAudited: true } })
  const { cookie } = await issueSession(payload, user.id)
  return { user, cookie, remaining: used.remaining.length }
}

export async function POST(request) {
  const form = await request.formData().catch(() => null)
  const get = (k) => (form && typeof form.get(k) === 'string' ? form.get(k).trim() : '')
  const back = safeBack(get('retour'), '')
  const kind = ['telephone', 'tablette', 'ordinateur'].includes(get('appareil')) ? get('appareil') : 'telephone'
  const fail = (code) => seeOther(`/connexion/?erreur=${code}${back ? `&retour=${encodeURIComponent(back)}` : ''}`)
  if (!form || !sameOrigin(request.headers)) return fail('origine')
  const ip = ipOf(request.headers) || 'local'
  if (tooMany(`studio-login:${ip}`)) return fail('trop')
  const email = get('email').toLowerCase()
  const password = form.get('password')
  const code = get('code')
  const payload = await studioPayload()
  const previous = readDevice(payload, request.headers)

  if (email && code && !password) {
    const r = await withBackupCode(payload, email, code)
    if (!r) {
      failed(`studio-login:${ip}`)
      return fail('code')
    }
    const device = { id: previous?.id, kind: previous?.kind || 'telephone', shared: Boolean(previous?.shared) }
    await writeAudit(payload, { user: r.user, device, ip, action: 'session.backup_code', entity: 'users', entityId: r.user.id, summary: sentence(r.user, device, `s’est connecté·e avec un code de secours (${r.remaining} restants)`) }).catch(() => null)
    return seeOther('/plus/reglages/#cles', [r.cookie, deviceCookie(payload, device)])
  }

  if (!email || typeof password !== 'string' || !password) return fail('vide')
  let result
  try {
    result = await payload.login({ collection: 'users', data: { email, password } })
  } catch (e) {
    failed(`studio-login:${ip}`)
    return fail(e?.name === 'LockedAuth' ? 'verrouille' : 'identifiants')
  }
  const user = result.user
  if (!roleOf(user)) {
    await revokeToken(payload, result.token).catch(() => null)
    return fail(user?.active === false ? 'inactif' : 'role')
  }

  const collectionAuthConfig = payload.collections.users.config.auth
  const cookies = [generatePayloadCookie({ collectionAuthConfig, cookiePrefix: payload.config.cookiePrefix || 'payload', token: result.token })]
  const device = { id: previous?.id, kind, shared: kind === 'tablette' }
  cookies.push(deviceCookie(payload, device))
  await writeAudit(payload, { user, device, ip, action: 'session.login', entity: 'users', entityId: user.id, summary: sentence(user, device, 's’est connecté·e') }).catch(() => null)
  return seeOther(back || homeFor(user), cookies)
}
