import 'server-only'
import { cookies, headers } from 'next/headers'
import { BOX_COOKIE, decodeBox } from '@/lib/ordering/box'
import { inAppBrowser } from '@/lib/ordering/iab'

export const DRAFT_COOKIE = 'cv_demande'
export const CHECKOUT_COOKIE = 'cv_caisse'

// Short-lived form drafts (values + error codes) so a failed POST shows its errors without JavaScript.
export function readDraftCookie(store, name) {
  const raw = store.get(name)?.value
  if (!raw) return null
  try {
    const data = JSON.parse(Buffer.from(raw, 'base64url').toString('utf8'))
    return data && typeof data === 'object' ? data : null
  } catch {
    return null
  }
}

export async function requestContext() {
  const [store, h] = await Promise.all([cookies(), headers()])
  const ua = h.get('user-agent') || ''
  const boxToken = store.get(BOX_COOKIE)?.value || null
  return {
    store,
    ua,
    iab: inAppBrowser(ua),
    boxToken,
    boxItems: decodeBox(boxToken),
    draft: readDraftCookie(store, DRAFT_COOKIE),
    checkoutDraft: readDraftCookie(store, CHECKOUT_COOKIE),
  }
}
