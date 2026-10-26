import { studioAuth, hasStepUp, sameOrigin, safeBack, seeOther, json, wantsJson } from '@/lib/studio/session'
import { ipOf } from '@/lib/studio/audit'
import { perform } from '@/lib/studio/actions'
import { readAction, withParams } from '@/lib/studio/request'

// POST /svc/action (admin host): every Studio tap. JSON from the outbox (Idempotency-Key), or a plain form
// that comes back to the screen with a notice and an « Annuler » button (works with JavaScript off).
export const dynamic = 'force-dynamic'

export async function POST(request) {
  const asJson = wantsJson(request)
  const { type, key, back, input } = await readAction(request)
  const to = safeBack(back, '/')
  if (!sameOrigin(request.headers)) return asJson ? json({ ok: false, code: 'origin', message: 'Origine refusée.' }, { status: 403 }) : seeOther(withParams(to, { erreur: 'origin' }))
  const { payload, user, device } = await studioAuth(request.headers)
  if (!user) return asJson ? json({ ok: false, code: 'login', message: 'Session terminée · reconnectez-vous.' }, { status: 401 }) : seeOther(`/connexion/?retour=${encodeURIComponent(to)}`)

  const result = await perform(payload, { user, device, ip: ipOf(request.headers), stepUp: hasStepUp(payload, request.headers, user), type, input, key })
  if (asJson) return json(result, { status: result.ok ? 200 : result.status || 409 })
  if (result.ok) return seeOther(withParams(to, { fait: result.auditId || 'ok' }))
  if (result.code === 'step_up') return seeOther(`/verifier/?retour=${encodeURIComponent(to)}`)
  return seeOther(withParams(to, { erreur: result.code, msg: result.message }))
}
