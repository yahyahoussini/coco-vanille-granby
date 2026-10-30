import { getPayload } from 'payload'
import config from '@payload-config'
import { allow, clientIp } from '@/lib/ordering/rate-limit'
import { setCookie, clearCookie } from '@/lib/ordering/cookies'
import { readVisitorPost, sameSite, LIMITS } from '@/lib/chat/validate'
import { errorText } from '@/lib/chat/copy'
import { TOKEN_COOKIE, FLAG_COOKIE, COOKIE_MAX_AGE, cookieValue, readCookie } from '@/lib/chat/token'
import { conversationFromCookie, publicThread, startConversation, appendVisitorMessage, saveProfile, markVisitorRead, shopOpenNow, notifyShop } from '@/lib/chat/server'

// /svc/clavardage/ (public host): « Écrivez-nous », the site's own chat.
//   GET            → the visitor's thread { conversation, status, messages, unread, shopOpen, profile }; ?read=1
//                    (panel open) sets their unread count to 0. No conversation → conversation: false.
//   POST (JSON)    → { text, name?, contact?, replyByConsent?, page, website, locale } a message: the first one
//                    creates the conversation and its cookies; { intent: 'profile', name, contact,
//                    replyByConsent } « Comment vous répondre? ». `website` is a honeypot.
// Errors: { ok: false, code, message: { fr, en, es } }. Limits: 20 posts per address in 10 minutes (in memory,
// nginx in front), 1000 characters, 30 visitor messages a day per conversation. Never mounted on checkout pages.
export const dynamic = 'force-dynamic'

const HEADERS = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store, private', 'X-Robots-Tag': 'noindex' }

function json(data, { status = 200, cookies = [] } = {}) {
  const headers = new Headers(HEADERS)
  for (const c of cookies) headers.append('Set-Cookie', c)
  return new Response(JSON.stringify(data), { status, headers })
}

const fail = (code, status, cookies = []) => json({ ok: false, code, message: errorText(code) }, { status, cookies })

// The secret cookie (HttpOnly) and the flag the widget reads; both renewed for 90 days at each message.
const keepCookies = (value) => [setCookie(TOKEN_COOKIE, value, { maxAge: COOKIE_MAX_AGE }), setCookie(FLAG_COOKIE, '1', { maxAge: COOKIE_MAX_AGE, httpOnly: false })]
const forgetCookies = () => [clearCookie(TOKEN_COOKIE), setCookie(FLAG_COOKIE, '', { maxAge: 0, httpOnly: false })]

// « Ouvert / Fermé » for the answer and the chat switch (Shop › chat.enabled): read at most once a minute.
let shopCache = { at: 0, shop: null }
async function currentShop(payload) {
  if (Date.now() - shopCache.at < 60_000) return shopCache.shop
  const shop = await payload.findGlobal({ slug: 'shop', depth: 0, overrideAccess: true }).catch(() => null)
  shopCache = { at: Date.now(), shop }
  return shop
}

export async function GET(request) {
  if (!allow(`clavardage-lire:${clientIp(request)}`, { max: 300 })) return fail('rate_limited', 429)
  const payload = await getPayload({ config })
  const shopOpen = shopOpenNow(await currentShop(payload))
  const value = readCookie(request.headers, TOKEN_COOKIE)
  const conversation = value ? await conversationFromCookie(payload, value) : null
  if (!conversation) {
    const stale = value || readCookie(request.headers, FLAG_COOKIE)
    return json(publicThread(null, { shopOpen }), { cookies: stale ? forgetCookies() : [] })
  }
  const read = new URL(request.url).searchParams.get('read') === '1'
  return json(publicThread(read ? await markVisitorRead(payload, conversation) : conversation, { shopOpen }))
}

export async function POST(request) {
  if (!sameSite(request.headers)) return fail('origin', 403)
  if (!/application\/json/i.test(request.headers.get('content-type') || '')) return fail('invalid', 415)
  const raw = await request.text().catch(() => '')
  if (raw.length > LIMITS.body) return fail('too_long', 413)
  let body
  try {
    body = JSON.parse(raw)
  } catch {
    return fail('invalid', 400)
  }
  const input = readVisitorPost(body)
  // Honeypot filled: answer as if it worked, store nothing, set no cookie.
  if (input.spam) return json(publicThread(null))
  if (!allow(`clavardage:${clientIp(request)}`, { max: 20 })) return fail('rate_limited', 429)
  if (input.errors.length) return fail(input.errors[0], 422)

  const payload = await getPayload({ config })
  const shop = await currentShop(payload)
  const shopOpen = shopOpenNow(shop)
  const value = readCookie(request.headers, TOKEN_COOKIE)
  const current = value ? await conversationFromCookie(payload, value) : null

  if (input.intent === 'profile') {
    if (!current) return fail('no_conversation', 404, value ? forgetCookies() : [])
    const r = await saveProfile(payload, current, { input })
    if (r.error) return fail(r.error, r.error === 'no_conversation' ? 404 : 422)
    return json(publicThread(r.conversation, { shopOpen }), { cookies: keepCookies(value) })
  }

  let r
  let cookies
  if (current) {
    r = await appendVisitorMessage(payload, current, { input })
    cookies = keepCookies(value)
  } else {
    // The owner can pause the chat (Shop › chat): no new conversation then; open ones still get answers.
    if (shop?.chat?.enabled === false) return fail('disabled', 403)
    r = await startConversation(payload, { input })
    if (r.conversation) cookies = keepCookies(cookieValue(r.conversation.id, r.secret))
  }
  if (r.error) return fail(r.error, r.error === 'daily_limit' ? 429 : r.error === 'no_conversation' ? 404 : 422)
  await notifyShop(payload, r.conversation.id)
  return json(publicThread(r.conversation, { shopOpen }), { status: current ? 200 : 201, cookies })
}
