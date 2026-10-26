import { studioAuth, stepUpCookie, sameOrigin, safeBack, seeOther } from '@/lib/studio/session'
import { useBackupCode } from '@/lib/studio/pin'
import { writeAudit, ipOf, sentence } from '@/lib/studio/audit'
import { allow } from '@/lib/ordering/rate-limit'

// POST /svc/verifier: step-up before money, prices, allergens, taxes and people (16b §4 #4).
// Password (checked by Payload's own login, then that extra session is revoked) or a one-time backup code.
// The passkey check posts to /svc/cle/verifier instead.
export const dynamic = 'force-dynamic'

const SYS = { overrideAccess: true, depth: 0, showHiddenFields: true }

async function passwordOk(payload, user, password) {
  try {
    const r = await payload.login({ collection: 'users', data: { email: user.email, password } })
    const sid = JSON.parse(Buffer.from(r.token.split('.')[1], 'base64url').toString('utf8')).sid
    const raw = await payload.db.findOne({ collection: 'users', where: { id: { equals: user.id } }, req: {} })
    if (sid && raw?.sessions?.length) {
      raw.sessions = raw.sessions.filter((s) => s.id !== sid)
      raw.updatedAt = null
      await payload.db.updateOne({ id: raw.id, collection: 'users', data: raw, req: {}, returning: false })
    }
    return true
  } catch {
    return false
  }
}

export async function POST(request) {
  const form = await request.formData().catch(() => null)
  const get = (k) => (form && typeof form.get(k) === 'string' ? form.get(k).trim() : '')
  const back = safeBack(get('retour'), '/')
  const again = (code) => seeOther(`/verifier/?retour=${encodeURIComponent(back)}&erreur=${code}`)
  if (!form || !sameOrigin(request.headers)) return again('origine')
  const { payload, user, device } = await studioAuth(request.headers)
  if (!user) return seeOther(`/connexion/?retour=${encodeURIComponent(back)}`)
  const ip = ipOf(request.headers) || 'local'
  if (!allow(`studio-verif:${user.id}`, { max: 10, windowMs: 10 * 60 * 1000 })) return again('trop')

  let ok = false
  let how = 'mot de passe'
  const code = get('code')
  if (code) {
    how = 'code de secours'
    const full = await payload.findByID({ collection: 'users', id: user.id, ...SYS })
    const r = await useBackupCode(code, Array.isArray(full.backupCodes) ? full.backupCodes : [])
    if (r.ok) {
      ok = true
      await payload.update({ collection: 'users', id: user.id, data: { backupCodes: r.remaining }, ...SYS, context: { studioAudited: true } })
    }
  } else {
    const password = form.get('password')
    ok = typeof password === 'string' && password.length > 0 && (await passwordOk(payload, user, password))
  }
  await writeAudit(payload, { user, device, ip, action: ok ? 'session.step_up' : 'session.step_up_failed', entity: 'users', entityId: user.id, summary: sentence(user, device, ok ? `a confirmé son identité (${how})` : `a échoué la vérification (${how})`) }).catch(() => null)
  if (!ok) return again(code ? 'code' : 'mot-de-passe')
  return seeOther(back, [stepUpCookie(payload, user)])
}
