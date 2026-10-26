import { BOX_COOKIE, decodeBox, encodeBox, applyBoxAction } from '@/lib/ordering/box'
import { boxPath } from '@/lib/ordering/paths'
import { setCookie, clearCookie, seeOther } from '@/lib/ordering/cookies'

// POST /svc/boite/: « Ma boîte » edits (add, set quantity or message, remove, clear) from plain forms.
// The box is its token (products, sizes, quantities, messages); the cookie keeps it for 30 days.
export const dynamic = 'force-dynamic'

const readCookie = (request, name) => {
  const m = (request.headers.get('cookie') || '').match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`))
  return m ? m[1] : null
}

export async function POST(request) {
  let form
  try {
    form = await request.formData()
  } catch {
    return seeOther(boxPath('fr'))
  }
  const get = (k) => (typeof form.get(k) === 'string' ? form.get(k) : '')
  const locale = ['fr', 'en', 'es'].includes(get('locale')) ? get('locale') : 'fr'
  const current = get('token') || readCookie(request, BOX_COOKIE)
  const items = applyBoxAction(decodeBox(current), {
    type: get('action'),
    productId: get('productId'),
    variantIndex: get('variantIndex'),
    qty: get('qty'),
    line: get('line'),
    message: form.has('message') ? get('message') : undefined,
  })
  const token = encodeBox(items)
  if (!token) return seeOther(boxPath(locale), [clearCookie(BOX_COOKIE)])
  const day = /^\d{4}-\d{2}-\d{2}$/.test(get('jour')) ? `?jour=${get('jour')}` : ''
  return seeOther(`${boxPath(locale, token)}${day}`, [setCookie(BOX_COOKIE, token)])
}
