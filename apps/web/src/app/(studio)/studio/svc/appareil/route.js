import { studioAuth, deviceCookie, sameOrigin, safeBack, seeOther } from '@/lib/studio/session'
import { writeAudit, ipOf, sentence, DEVICE_LABELS } from '@/lib/studio/audit'
import { withParams } from '@/lib/studio/request'

// POST /svc/appareil (Réglages): « Cet appareil est… » own phone, computer, or the shop's shared tablet.
export const dynamic = 'force-dynamic'

export async function POST(request) {
  const form = await request.formData().catch(() => null)
  const get = (k) => (form && typeof form.get(k) === 'string' ? form.get(k).trim() : '')
  const back = safeBack(get('back'), '/plus/reglages/')
  if (!form || !sameOrigin(request.headers)) return seeOther(back)
  const { payload, user, device } = await studioAuth(request.headers)
  if (!user) return seeOther('/connexion/')
  const kind = ['telephone', 'tablette', 'ordinateur'].includes(get('appareil')) ? get('appareil') : 'telephone'
  const next = { id: device?.id, kind, shared: kind === 'tablette' }
  const entry = await writeAudit(payload, { user, device: next, ip: ipOf(request.headers), action: 'device.mode', entity: 'device', entityId: device?.id || null, before: device, after: next, summary: sentence(user, next, `a défini cet appareil : ${DEVICE_LABELS[kind]}`) })
  return seeOther(withParams(back, { fait: entry.id }), [deviceCookie(payload, next)])
}
