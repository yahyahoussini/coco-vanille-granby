// « Écrivez-nous »: what a visitor may send to /svc/clavardage/ (pure, node --test). Lengths are counted after
// cleaning, as the textarea's maxLength counts them. Nothing here touches the database.
import { normalizePhone, phoneDisplay } from '../ordering/customer.js'

export const LIMITS = { text: 1000, name: 60, contact: 120, perDay: 30, body: 8000 }

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const LOCALES = ['fr', 'en', 'es']

// Text as typed, minus control characters (line breaks kept, at most two blank lines in a row).
export function cleanText(value) {
  return String(value ?? '')
    .replace(/\r\n?/g, '\n')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/\n{4,}/g, '\n\n\n')
    .trim()
}

// One line (a first name): inner spaces collapsed.
export const cleanLine = (value) => cleanText(value).replace(/\s+/g, ' ')

// Phone (North American, or +country) → E.164; email → lower case. Empty → { value: null }.
export function parseContact(raw) {
  const text = cleanLine(raw)
  if (!text) return { value: null, kind: null }
  if (text.length > LIMITS.contact) return { error: 'contact_invalid' }
  if (text.includes('@')) {
    const email = text.toLowerCase()
    return EMAIL.test(email) ? { value: email, kind: 'email' } : { error: 'contact_invalid' }
  }
  const phone = normalizePhone(text)
  return phone ? { value: phone, kind: 'phone' } : { error: 'contact_invalid' }
}

export const contactKind = (value) => (!value ? null : String(value).includes('@') ? 'email' : 'phone')
export const contactDisplay = (value) => (contactKind(value) === 'phone' ? phoneDisplay(value) : value || '')

// The page the visitor wrote from: a path on this site, without its query string or fragment (a thank-you
// page's query carries the order's access token, which must never be stored).
export function cleanPath(value) {
  const s = String(value ?? '').trim()
  if (!s.startsWith('/') || s.startsWith('//')) return null
  const path = s.split(/[?#]/)[0]
  return path.length <= 200 && /^\/[\w\-./%~]*$/.test(path) ? path : null
}

const yes = (v) => v === true || v === 'true' || v === 'on' || v === '1'
const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k)

// The JSON body of a POST → { spam, intent, locale, errors: [code], value, present: Set of profile fields given }.
//   intent 'message' (default): a new message; name, contact and the consent update only when given.
//   intent 'profile': « Comment vous répondre? » — the three fields are set exactly as sent (empty clears).
// `website` is the honeypot: a filled one marks the post as spam (the route answers as if it worked).
export function readVisitorPost(body) {
  const b = body && typeof body === 'object' && !Array.isArray(body) ? body : {}
  const intent = b.intent === 'profile' ? 'profile' : 'message'
  const locale = LOCALES.includes(b.locale) ? b.locale : 'fr'
  const spam = cleanLine(b.website) !== ''
  const text = intent === 'message' ? cleanText(b.text) : ''
  const name = cleanLine(b.name)
  const contact = parseContact(b.contact)
  const present = new Set(['name', 'contact', 'replyByConsent'].filter((k) => intent === 'profile' || has(b, k)))
  const errors = []
  if (intent === 'message') {
    if (!text) errors.push('empty')
    else if (text.length > LIMITS.text) errors.push('too_long')
  }
  if (name.length > LIMITS.name) errors.push('name_too_long')
  if (contact.error) errors.push(contact.error)
  return {
    spam,
    intent,
    locale,
    errors,
    present,
    value: { text, name: name || null, contact: contact.value || null, replyByConsent: yes(b.replyByConsent), page: cleanPath(b.page) },
  }
}

// Profile fields after a post: what was given replaces what was there. The consent needs a way to reach the
// visitor: without one it is refused ('contact_required').
export function mergeProfile(current = {}, { present = new Set(), value = {} } = {}) {
  const next = {
    name: present.has('name') ? value.name || null : current.name || null,
    contact: present.has('contact') ? value.contact || null : current.contact || null,
    replyByConsent: present.has('replyByConsent') ? Boolean(value.replyByConsent) : Boolean(current.replyByConsent),
  }
  if (next.replyByConsent && !next.contact) return { error: 'contact_required', next }
  return { next }
}

// Same-origin check for the JSON POST (with SameSite=Lax cookies and the JSON content type, a third layer):
// a browser always sends Origin on a fetch POST; Sec-Fetch-Site as a fallback; neither (curl, tests) is allowed.
export function sameSite(headers) {
  const get = (k) => (typeof headers?.get === 'function' ? headers.get(k) : headers?.[k]) || ''
  const origin = get('origin')
  if (origin) {
    try {
      return new URL(origin).host === get('host')
    } catch {
      return false
    }
  }
  const site = get('sec-fetch-site')
  return !site || site === 'same-origin' || site === 'none'
}
