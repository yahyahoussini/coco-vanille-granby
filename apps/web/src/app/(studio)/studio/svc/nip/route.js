import { studioAuth, issueSession, revokeCurrent, clearStepUp, sameOrigin, seeOther } from '@/lib/studio/session'
import { verifyPin, pinLocked, afterPinFailure, validPin } from '@/lib/studio/pin'
import { roleOf, homeFor, BAKERY_ROLES } from '@/lib/studio/roles'
import { writeAudit, ipOf, sentence } from '@/lib/studio/audit'
import { tooMany, failed } from '@/lib/studio/throttle'

// POST /svc/nip: « Qui utilise la tablette? » → 4-digit PIN → a fresh 12 h session for that person.
// Only on a device marked as the shop's shared tablet; 5 wrong PINs lock that person for 15 minutes.
export const dynamic = 'force-dynamic'

const SYS = { overrideAccess: true, depth: 0, showHiddenFields: true }

export async function POST(request) {
  const form = await request.formData().catch(() => null)
  const get = (k) => (form && typeof form.get(k) === 'string' ? form.get(k).trim() : '')
  const id = get('personne')
  const pin = get('nip')
  const back = (code) => seeOther(`/qui/?personne=${encodeURIComponent(id)}&erreur=${code}`)
  if (!form || !sameOrigin(request.headers)) return seeOther('/qui/')
  const { payload, user: current, device } = await studioAuth(request.headers)
  if (!device?.shared) return seeOther('/connexion/?erreur=appareil')
  const ip = ipOf(request.headers) || 'local'
  if (tooMany(`studio-pin:${ip}`, { max: 30 })) return back('trop')
  if (!validPin(pin)) return back('format')

  const person = await payload.findByID({ collection: 'users', id, ...SYS, disableErrors: true }).catch(() => null)
  if (!person || !BAKERY_ROLES.includes(roleOf(person)) || !person.pinHash) return seeOther('/qui/?erreur=personne')
  if (pinLocked(person)) return back('verrouille')
  if (!(await verifyPin(pin, person.pinHash))) {
    failed(`studio-pin:${ip}`)
    const next = afterPinFailure(person)
    await payload.update({ collection: 'users', id: person.id, data: next, ...SYS, context: { studioAudited: true } })
    await writeAudit(payload, { user: person, device, ip, action: 'session.pin_failed', entity: 'users', entityId: person.id, summary: sentence(person, device, 'a entré un mauvais NIP') }).catch(() => null)
    return back(next.pinLockedUntil ? 'verrouille' : 'nip')
  }
  if (person.pinFailures) await payload.update({ collection: 'users', id: person.id, data: { pinFailures: 0, pinLockedUntil: null }, ...SYS, context: { studioAudited: true } })
  // The previous person's session ends: one person per tablet at a time, so the audit log names the right one.
  if (current) await revokeCurrent(payload, request.headers).catch(() => null)
  const { cookie } = await issueSession(payload, person.id)
  await writeAudit(payload, { user: person, device, ip, action: 'session.pin', entity: 'users', entityId: person.id, summary: sentence(person, device, 'a pris la tablette') }).catch(() => null)
  return seeOther(homeFor(person), [cookie, clearStepUp()])
}
