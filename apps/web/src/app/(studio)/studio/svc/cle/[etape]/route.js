import { studioAuth, studioPayload, issueSession, hasStepUp, stepUpCookie, sameOrigin, json, safeBack } from '@/lib/studio/session'
import { registrationOptions, verifyRegistration, authenticationOptions, verifyAuthentication, challengeCookie, readChallenge, clearChallenge, userHandleOf, storedCredentials, PASSKEY_ROLES } from '@/lib/studio/passkey'
import { newBackupCodes, hashSecret } from '@/lib/studio/pin'
import { roleOf, homeFor } from '@/lib/studio/roles'
import { writeAudit, ipOf, sentence } from '@/lib/studio/audit'
import { tooMany, failed } from '@/lib/studio/throttle'

// POST /svc/cle/<étape> (JSON): passkeys and backup codes.
//  options-inscription · inscription  add a passkey (signed in, step-up)       → { backupCodes } the first time
//  options-connexion · connexion      sign in with a passkey (no session)      → { redirect }
//  options-verif · verif              step-up with a passkey                   → step-up cookie
//  codes                              new backup codes (step-up), shown once
//  retirer                            remove a passkey (step-up)
export const dynamic = 'force-dynamic'

const SYS = { overrideAccess: true, depth: 0, showHiddenFields: true }
const full = (payload, id) => payload.findByID({ collection: 'users', id, ...SYS, disableErrors: true }).catch(() => null)
const save = (payload, id, data) => payload.update({ collection: 'users', id, data, ...SYS, context: { studioAudited: true } })

async function freshCodes(payload, user) {
  const codes = newBackupCodes()
  await save(payload, user.id, { backupCodes: await Promise.all(codes.map((c) => hashSecret(c))) })
  return codes
}

export async function POST(request, { params }) {
  const { etape } = await params
  if (!sameOrigin(request.headers)) return json({ ok: false, code: 'origin' }, { status: 403 })
  const body = await request.json().catch(() => ({}))
  const ip = ipOf(request.headers) || 'local'

  if (etape === 'options-connexion') {
    const payload = await studioPayload()
    const options = await authenticationOptions()
    return json({ ok: true, options }, { cookies: [challengeCookie(payload, { challenge: options.challenge, purpose: 'connexion' })] })
  }

  if (etape === 'connexion') {
    const payload = await studioPayload()
    if (tooMany(`studio-cle:${ip}`)) return json({ ok: false, code: 'trop', message: 'Trop d’essais. Réessayez dans 10 minutes.' }, { status: 429 })
    const ch = readChallenge(payload, request.headers, 'connexion')
    const uid = userHandleOf(body.response)
    const user = ch && uid ? await full(payload, uid) : null
    const result = user && roleOf(user) && PASSKEY_ROLES.includes(user.role) ? await verifyAuthentication(body.response, ch.challenge, user) : { ok: false }
    if (!result.ok) {
      failed(`studio-cle:${ip}`)
      return json({ ok: false, code: 'cle', message: 'La clé d’accès n’a pas été acceptée.' }, { status: 401, cookies: [clearChallenge()] })
    }
    await save(payload, user.id, { passkeys: result.credentials })
    const { cookie } = await issueSession(payload, user.id)
    await writeAudit(payload, { user, ip, action: 'session.passkey', entity: 'users', entityId: user.id, summary: sentence(user, null, 's’est connecté·e avec une clé d’accès') }).catch(() => null)
    return json({ ok: true, redirect: safeBack(body.back, homeFor(user)) || homeFor(user) }, { cookies: [cookie, clearChallenge()] })
  }

  const { payload, user, device } = await studioAuth(request.headers)
  if (!user) return json({ ok: false, code: 'login', message: 'Session terminée · reconnectez-vous.' }, { status: 401 })
  if (!PASSKEY_ROLES.includes(user.role)) return json({ ok: false, code: 'forbidden', message: 'Les clés d’accès sont pour la propriétaire, la gérance et l’agence; l’équipe utilise le NIP.' }, { status: 403 })
  const me = await full(payload, user.id)

  if (etape === 'options-verif') {
    if (!storedCredentials(me).length) return json({ ok: false, code: 'none', message: 'Aucune clé d’accès enregistrée.' }, { status: 409 })
    const options = await authenticationOptions(me)
    return json({ ok: true, options }, { cookies: [challengeCookie(payload, { challenge: options.challenge, purpose: 'verif', uid: user.id })] })
  }

  if (etape === 'verif') {
    const ch = readChallenge(payload, request.headers, 'verif')
    const result = ch && String(ch.uid) === String(user.id) ? await verifyAuthentication(body.response, ch.challenge, me) : { ok: false }
    if (!result.ok) return json({ ok: false, code: 'cle', message: 'La clé d’accès n’a pas été acceptée.' }, { status: 401, cookies: [clearChallenge()] })
    await save(payload, user.id, { passkeys: result.credentials })
    await writeAudit(payload, { user, device, ip, action: 'session.step_up', entity: 'users', entityId: user.id, summary: sentence(user, device, 'a confirmé son identité (clé d’accès)') }).catch(() => null)
    return json({ ok: true, redirect: safeBack(body.back, '/') }, { cookies: [stepUpCookie(payload, user), clearChallenge()] })
  }

  // Adding or removing a way to sign in, or new backup codes: a fresh identity check first.
  if (!hasStepUp(payload, request.headers, user)) return json({ ok: false, code: 'step_up', message: 'Confirmez que c’est vous pour continuer.' }, { status: 401 })

  if (etape === 'options-inscription') {
    const options = await registrationOptions(me)
    return json({ ok: true, options }, { cookies: [challengeCookie(payload, { challenge: options.challenge, purpose: 'inscription', uid: user.id })] })
  }

  if (etape === 'inscription') {
    const ch = readChallenge(payload, request.headers, 'inscription')
    if (!ch || String(ch.uid) !== String(user.id)) return json({ ok: false, code: 'expired', message: 'Délai dépassé. Recommencez.' }, { status: 409 })
    const label = String(body.label || '').trim().slice(0, 60) || (device?.kind === 'tablette' ? 'Tablette' : device?.kind === 'ordinateur' ? 'Ordinateur' : 'Téléphone')
    const cred = await verifyRegistration(body.response, ch.challenge, { label }).catch(() => null)
    if (!cred) return json({ ok: false, code: 'cle', message: 'La clé d’accès n’a pas pu être enregistrée.' }, { status: 400, cookies: [clearChallenge()] })
    await save(payload, user.id, { passkeys: [...storedCredentials(me).filter((c) => c.id !== cred.id), cred] })
    const codes = Array.isArray(me.backupCodes) && me.backupCodes.length ? null : await freshCodes(payload, user)
    await writeAudit(payload, { user, device, ip, action: 'users.passkey_add', entity: 'users', entityId: user.id, after: { passkey: cred.label }, summary: sentence(user, device, `a ajouté une clé d’accès (${cred.label})`) })
    return json({ ok: true, message: 'Clé d’accès enregistrée.', backupCodes: codes }, { cookies: [clearChallenge()] })
  }

  if (etape === 'codes') {
    const codes = await freshCodes(payload, user)
    await writeAudit(payload, { user, device, ip, action: 'users.backup_codes', entity: 'users', entityId: user.id, summary: sentence(user, device, 'a créé de nouveaux codes de secours') })
    return json({ ok: true, backupCodes: codes })
  }

  if (etape === 'retirer') {
    const keep = storedCredentials(me).filter((c) => c.id !== body.id)
    await save(payload, user.id, { passkeys: keep })
    await writeAudit(payload, { user, device, ip, action: 'users.passkey_remove', entity: 'users', entityId: user.id, summary: sentence(user, device, 'a retiré une clé d’accès') })
    return json({ ok: true, message: 'Clé d’accès retirée.' })
  }

  return json({ ok: false, code: 'unknown' }, { status: 404 })
}
