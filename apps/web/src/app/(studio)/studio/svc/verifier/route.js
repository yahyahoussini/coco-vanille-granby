import { studioAuth, stepUpCookie, sameOrigin, safeBack, seeOther } from '@/lib/studio/session'
import { checkPassword } from '@/lib/studio/password'
import { useBackupCode } from '@/lib/studio/pin'
import { writeAudit, ipOf, sentence } from '@/lib/studio/audit'
import { tooMany, failed } from '@/lib/studio/throttle'

// POST /svc/verifier: step-up before money, prices, allergens, taxes and people (16b §4 #4).
// Password (Payload's own PBKDF2 hash, no extra session) or a one-time backup code.
// The passkey check posts to /svc/cle/verifier instead.
export const dynamic = 'force-dynamic'

const SYS = { overrideAccess: true, depth: 0, showHiddenFields: true }

export async function POST(request) {
  const form = await request.formData().catch(() => null)
  const get = (k) => (form && typeof form.get(k) === 'string' ? form.get(k).trim() : '')
  const back = safeBack(get('retour'), '/')
  const again = (code) => seeOther(`/verifier/?retour=${encodeURIComponent(back)}&erreur=${code}`)
  if (!form || !sameOrigin(request.headers)) return again('origine')
  const { payload, user, device } = await studioAuth(request.headers)
  if (!user) return seeOther(`/connexion/?retour=${encodeURIComponent(back)}`)
  const ip = ipOf(request.headers) || 'local'
  if (tooMany(`studio-verif:${user.id}`, { max: 10 })) return again('trop')

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
    ok = await checkPassword(payload, user.id, password)
  }
  await writeAudit(payload, { user, device, ip, action: ok ? 'session.step_up' : 'session.step_up_failed', entity: 'users', entityId: user.id, summary: sentence(user, device, ok ? `a confirmé son identité (${how})` : `a échoué la vérification (${how})`) }).catch(() => null)
  if (!ok) {
    failed(`studio-verif:${user.id}`)
    return again(code ? 'code' : 'mot-de-passe')
  }
  return seeOther(back, [stepUpCookie(payload, user)])
}
