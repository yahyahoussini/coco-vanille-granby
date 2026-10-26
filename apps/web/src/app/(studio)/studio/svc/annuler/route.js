import { studioAuth, sameOrigin, safeBack, seeOther, json, wantsJson } from '@/lib/studio/session'
import { ipOf } from '@/lib/studio/audit'
import { undo } from '@/lib/studio/actions'
import { readAction, withParams } from '@/lib/studio/request'

// POST /svc/annuler: « Annuler » on the snackbar. Reverts the change and cancels what has not left yet.
export const dynamic = 'force-dynamic'

export async function POST(request) {
  const asJson = wantsJson(request)
  const { back, input } = await readAction(request)
  const to = safeBack(back, '/')
  if (!sameOrigin(request.headers)) return json({ ok: false, code: 'origin' }, { status: 403 })
  const { payload, user, device } = await studioAuth(request.headers)
  if (!user) return asJson ? json({ ok: false, code: 'login', message: 'Session terminée · reconnectez-vous.' }, { status: 401 }) : seeOther('/connexion/')
  const result = await undo(payload, { user, device, ip: ipOf(request.headers), id: input.id })
  if (asJson) return json(result, { status: result.ok ? 200 : result.status || 409 })
  return seeOther(withParams(to, result.ok ? { annule: '1' } : { erreur: result.code, msg: result.message }))
}
