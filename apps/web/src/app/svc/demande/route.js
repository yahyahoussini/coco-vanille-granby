import { getPayload } from 'payload'
import config from '@payload-config'
import { submitRequest } from '@/lib/ordering/requests'
import { notifyRequestReceived } from '@/lib/messaging/notify'
import { orderPath, thanksPath, Q } from '@/lib/ordering/paths'
import { setCookie, clearCookie, draftValue, seeOther } from '@/lib/ordering/cookies'
import { allow, clientIp } from '@/lib/ordering/rate-limit'

// POST /svc/demande/: the custom-cake request form (multipart, works with JavaScript off).
// Success → 303 to the thanks page; errors → 303 back to the form with a 10-minute draft cookie.
export const dynamic = 'force-dynamic'

const DRAFT = 'cv_demande'
const FIELDS = ['occasion', 'guests', 'eventDate', 'flavour', 'cakeMessage', 'details', 'hasAllergy', 'firstName', 'lastName', 'phone', 'email']

const back = (locale, draft) => seeOther(`${orderPath(locale)}?${Q.error}=1#demande`, [setCookie(DRAFT, draftValue(draft), { maxAge: 600 })])

export async function POST(request) {
  let form
  try {
    form = await request.formData()
  } catch {
    return seeOther(`${orderPath('fr')}?${Q.error}=1#demande`, [setCookie(DRAFT, draftValue({ v: {}, e: [{ code: 'invalid' }] }), { maxAge: 600 })])
  }
  const locale = ['fr', 'en', 'es'].includes(form.get('locale')) ? form.get('locale') : 'fr'
  const input = Object.fromEntries(FIELDS.map((f) => [f, typeof form.get(f) === 'string' ? form.get(f) : '']))
  input.language = locale
  // Draft kept small: the details are cut so the cookie stays under 4 KB.
  const draftValues = { ...input, details: String(input.details || '').slice(0, 1200) }

  // Honeypot filled → pretend it worked, store nothing.
  if (String(form.get('site_web') || '').trim()) return seeOther(`${thanksPath(locale)}?${Q.request}=envoyee`)
  if (!allow(`demande:${clientIp(request)}`)) return back(locale, { v: draftValues, e: [{ code: 'rate_limited' }] })

  const payload = await getPayload({ config })
  const files = form.getAll('photos').filter((f) => f && typeof f === 'object' && 'arrayBuffer' in f)
  const { request: saved, errors } = await submitRequest(payload, { input, files, locale })
  if (errors.length) return back(locale, { v: draftValues, e: errors.map(({ code, field }) => ({ code, field })) })

  await notifyRequestReceived(payload, saved).catch((e) => payload.logger.error({ err: e }, 'request_received not queued'))
  return seeOther(`${thanksPath(locale)}?${Q.request}=${saved.accessToken}`, [clearCookie(DRAFT)])
}
