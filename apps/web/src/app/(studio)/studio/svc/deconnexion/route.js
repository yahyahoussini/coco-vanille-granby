import { studioAuth, revokeCurrent, expiredPayloadCookie, clearStepUp, sameOrigin, seeOther } from '@/lib/studio/session'
import { writeAudit, ipOf, sentence } from '@/lib/studio/audit'

// POST /svc/deconnexion: ends the session server-side. On the shop tablet, the next person picks their name.
export const dynamic = 'force-dynamic'

export async function POST(request) {
  if (!sameOrigin(request.headers)) return seeOther('/')
  const { payload, user, device } = await studioAuth(request.headers)
  if (user) {
    await revokeCurrent(payload, request.headers).catch(() => null)
    await writeAudit(payload, { user, device, ip: ipOf(request.headers), action: 'session.logout', entity: 'users', entityId: user.id, summary: sentence(user, device, 's’est déconnecté·e') }).catch(() => null)
  }
  return seeOther(device?.shared ? '/qui/' : '/connexion/', [expiredPayloadCookie(payload), clearStepUp()])
}
