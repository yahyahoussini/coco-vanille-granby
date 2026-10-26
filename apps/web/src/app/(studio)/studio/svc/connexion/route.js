import { generatePayloadCookie } from 'payload/shared'
import { studioPayload, deviceCookie, readDevice, sameOrigin, safeBack, seeOther } from '@/lib/studio/session'
import { roleOf, homeFor } from '@/lib/studio/roles'
import { writeAudit, ipOf, sentence } from '@/lib/studio/audit'
import { allow } from '@/lib/ordering/rate-limit'

// POST /svc/connexion: email + password (Payload login, 12 h session, 5 attempts then a 15-minute lock).
// Also records what this device is: own phone, computer, or the shop's shared tablet (PIN switch).
export const dynamic = 'force-dynamic'

export async function POST(request) {
  const form = await request.formData().catch(() => null)
  const get = (k) => (form && typeof form.get(k) === 'string' ? form.get(k).trim() : '')
  const back = safeBack(get('retour'), '')
  const kind = ['telephone', 'tablette', 'ordinateur'].includes(get('appareil')) ? get('appareil') : 'telephone'
  const fail = (code) => seeOther(`/connexion/?erreur=${code}${back ? `&retour=${encodeURIComponent(back)}` : ''}`)
  if (!form || !sameOrigin(request.headers)) return fail('origine')
  const ip = ipOf(request.headers) || 'local'
  if (!allow(`studio-login:${ip}`, { max: 20, windowMs: 10 * 60 * 1000 })) return fail('trop')
  const email = get('email').toLowerCase()
  const password = form.get('password')
  if (!email || typeof password !== 'string' || !password) return fail('vide')

  const payload = await studioPayload()
  let result
  try {
    result = await payload.login({ collection: 'users', data: { email, password } })
  } catch (e) {
    return fail(e?.name === 'LockedAuth' ? 'verrouille' : 'identifiants')
  }
  const user = result.user
  if (!roleOf(user)) return fail(user?.active === false ? 'inactif' : 'role')

  const collectionAuthConfig = payload.collections.users.config.auth
  const cookies = [generatePayloadCookie({ collectionAuthConfig, cookiePrefix: payload.config.cookiePrefix || 'payload', token: result.token })]
  const previous = readDevice(payload, request.headers)
  const device = { id: previous?.id, kind, shared: kind === 'tablette' }
  cookies.push(deviceCookie(payload, device))
  await writeAudit(payload, { user, device, ip, action: 'session.login', entity: 'users', entityId: user.id, summary: sentence(user, device, 's’est connecté·e') }).catch(() => null)
  return seeOther(back || homeFor(user), cookies)
}
