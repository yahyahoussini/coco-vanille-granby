import { getPayload } from 'payload'
import config from '@payload-config'
import { createOrder } from '@/lib/ordering/create-order'
import { decodeBox } from '@/lib/ordering/box'
import { checkoutPath, Q } from '@/lib/ordering/paths'
import { inAppBrowser } from '@/lib/ordering/iab'
import { setCookie, clearCookie, draftValue, seeOther } from '@/lib/ordering/cookies'
import { allow, clientIp } from '@/lib/ordering/rate-limit'
import { termsVersionOf } from '@/lib/payments/consent'

// POST /svc/commande/: « Confirmer et payer » on the review step. Creates the order (10-minute hold on its
// window and capacity), then 303 to the payment page. Errors → back to the review step with a draft cookie
// (the allergy note is never kept in it).
export const dynamic = 'force-dynamic'

const DRAFT = 'cv_caisse'
const KEEP = ['firstName', 'lastName', 'email', 'phone', 'marketing', 'birthdayReminder', 'reviewRequest']

export async function POST(request) {
  let form
  try {
    form = await request.formData()
  } catch {
    return seeOther(checkoutPath('fr'))
  }
  const get = (k) => (typeof form.get(k) === 'string' ? form.get(k).trim() : '')
  const checked = (k) => ['on', '1', 'true'].includes(get(k))
  const locale = ['fr', 'en', 'es'].includes(get('locale')) ? get('locale') : 'fr'
  const box = get('boite')
  const day = get('jour')
  const start = get('plage')
  const backTo = `${checkoutPath(locale)}?boite=${encodeURIComponent(box)}&${Q.day}=${encodeURIComponent(day)}&${Q.window}=${encodeURIComponent(start)}#erreurs`
  const values = Object.fromEntries(KEEP.map((k) => [k, get(k)]))
  const back = (errors) => seeOther(backTo, [setCookie(DRAFT, draftValue({ v: values, e: errors, a: Boolean(get('allergyNote')) }), { maxAge: 600 })])

  if (!allow(`commande:${clientIp(request)}`, { max: 20 })) return back([{ code: 'rate_limited' }])
  const payload = await getPayload({ config })
  const result = await createOrder(payload, {
    source: 'web',
    locale,
    items: decodeBox(box),
    pickup: { date: day, windowStart: start },
    customer: { firstName: get('firstName'), lastName: get('lastName'), email: get('email'), phone: get('phone'), language: locale },
    consent: {
      terms: checked('terms'),
      frenchFirst: checked('frenchFirst'),
      termsVersion: await termsVersionOf(payload),
      marketing: checked('marketing'),
      birthdayReminder: checked('birthdayReminder'),
      reviewRequest: checked('reviewRequest'),
      textVersion: 'consentements-2026-10-26',
    },
    allergyNote: get('allergyNote'),
    boxToken: box,
    attribution: { language: locale, inAppBrowser: inAppBrowser(request.headers.get('user-agent') || '') },
  })
  if (result.errors.length) return back(result.errors.map(({ code, field, alternatives, nextDay }) => ({ code, field, alternatives, nextDay })))
  return seeOther(`${checkoutPath(locale)}?${Q.order}=${result.order.accessToken}`, [clearCookie(DRAFT)])
}
