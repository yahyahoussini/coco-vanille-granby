// « Écrivez-nous » (research/sessions/04 #10): what a visitor may send, the cookie secret, the facts the widget
// shows, the instant answers, the status line, the texto/courriel copy and the 90-day retention.
import test, { describe } from 'node:test'
import assert from 'node:assert/strict'
import { readVisitorPost, parseContact, cleanText, cleanPath, mergeProfile, sameSite, LIMITS } from '../../src/lib/chat/validate.js'
import { newVisitorSecret, verifySecret, hashSecret, cookieValue, parseCookieValue, readCookie } from '../../src/lib/chat/token.js'
import { chatFacts } from '../../src/lib/chat/facts.js'
import { quickAnswers } from '../../src/lib/chat/answers.js'
import { chatStatus, statusLine } from '../../src/lib/chat/schedule.js'
import { relayMessage } from '../../src/lib/chat/relay.js'
import { sortInbox, lastPreview, visitorName } from '../../src/lib/chat/inbox.js'
import { retentionCutoff, publicThread, RETENTION_DAYS } from '../../src/lib/chat/server.js'

// Placeholder data for tests only, never owner facts.
const business = {
  name: 'Pâtisserie Test',
  phone: '+15555550100',
  phoneDisplay: '555-555-0100',
  address: { street: '1, rue Test', city: 'Granby', region: 'QC', postalCode: 'J0J 0J0' },
  google: { cid: '123' },
  sameAs: [
    { url: 'https://www.facebook.com/exemple/', verified: true },
    { url: 'https://www.instagram.com/exemple/', verified: false },
  ],
}
const shop = {
  hours: [
    { day: 'Wednesday', opens: '09:00', closes: '17:00' },
    { day: 'Thursday', opens: '09:00', closes: '17:00' },
  ],
  ordering: { enabled: true },
}
const all = { fr: new Set(['commander', 'carte', 'nous-trouver', 'allergenes', 'confidentialite']), en: new Set(['carte']), es: new Set() }

describe('what a visitor may send', () => {
  test('a message is cleaned, measured after cleaning, and its page loses query and fragment', () => {
    const r = readVisitorPost({ text: '  Bonjour\u0007!\r\n\r\n\r\n\r\n\r\nMerci  ', page: '/merci/?commande=42&jeton=abc#x', locale: 'en', website: '' })
    assert.deepEqual(r.errors, [])
    assert.equal(r.spam, false)
    assert.equal(r.locale, 'en')
    assert.equal(r.value.text, 'Bonjour!\n\n\nMerci')
    assert.equal(r.value.page, '/merci/')
  })

  test('empty, too long, honeypot', () => {
    assert.deepEqual(readVisitorPost({ text: '   ' }).errors, ['empty'])
    assert.deepEqual(readVisitorPost({ text: 'x'.repeat(LIMITS.text + 1) }).errors, ['too_long'])
    assert.equal(readVisitorPost({ text: 'Allo', website: 'http://spam.example' }).spam, true)
  })

  test('contact: a 10-digit phone becomes E.164, an email is lower-cased, anything else is refused', () => {
    assert.deepEqual(parseContact('450 555-0199'), { value: '+14505550199', kind: 'phone' })
    assert.deepEqual(parseContact(' Moi@Exemple.CA '), { value: 'moi@exemple.ca', kind: 'email' })
    assert.equal(parseContact('pas un numéro').error, 'contact_invalid')
    assert.deepEqual(parseContact(''), { value: null, kind: null })
  })

  test('the reply-by-text consent needs a way to reach the visitor', () => {
    const post = readVisitorPost({ intent: 'profile', name: 'Léa', contact: '', replyByConsent: true })
    assert.equal(mergeProfile({}, post).error, 'contact_required')
    const ok = readVisitorPost({ intent: 'profile', name: 'Léa', contact: 'lea@exemple.ca', replyByConsent: 'on' })
    assert.deepEqual(mergeProfile({}, ok), { next: { name: 'Léa', contact: 'lea@exemple.ca', replyByConsent: true } })
  })

  test('paths: only this site, no protocol-relative URL', () => {
    assert.equal(cleanPath('//evil.example/x'), null)
    assert.equal(cleanPath('https://evil.example/'), null)
    assert.equal(cleanText('\u0000a'), 'a')
  })

  test('same-origin POST only (Origin, then Sec-Fetch-Site)', () => {
    assert.equal(sameSite(new Headers({ origin: 'https://cocovanillegranby.com', host: 'cocovanillegranby.com' })), true)
    assert.equal(sameSite(new Headers({ origin: 'https://evil.example', host: 'cocovanillegranby.com' })), false)
    assert.equal(sameSite(new Headers({ 'sec-fetch-site': 'cross-site' })), false)
  })
})

describe('the visitor cookie', () => {
  test('only the hash is stored; the secret checks against it', () => {
    const { secret, hash } = newVisitorSecret()
    assert.equal(hash, hashSecret(secret))
    assert.equal(verifySecret(secret, hash), true)
    assert.equal(verifySecret(`${secret}x`, hash), false)
    assert.equal(verifySecret(secret, 'not-a-hash'), false)
  })

  test('cookie value round trip, malformed values refused', () => {
    const { secret } = newVisitorSecret()
    assert.deepEqual(parseCookieValue(cookieValue(42, secret)), { id: 42, secret })
    assert.equal(parseCookieValue('42'), null)
    assert.equal(parseCookieValue('abc.def'), null)
    assert.equal(readCookie('a=1; cv_chat=1; b=2', 'cv_chat'), '1')
  })
})

describe('chatFacts: the widget knows only published facts', () => {
  test('links only to served pages, the visitor’s language first, then French', () => {
    const f = chatFacts({ business, shop, locale: 'en', served: all })
    assert.equal(f.links.menu, '/en/menu/')
    assert.equal(f.links.order, '/commander/')
    assert.equal(f.links.cake, '/commander/#demande')
    assert.equal(f.facebook, 'https://www.facebook.com/exemple/')
    assert.equal(f.maps, 'https://maps.google.com/?cid=123')
    assert.equal(f.mobile, null)
  })

  test('missing facts are null, never guessed; the switch defaults to on', () => {
    const f = chatFacts({ business: {}, shop: {}, locale: 'fr', served: { fr: new Set(), en: new Set(), es: new Set() } })
    assert.equal(f.hours, null)
    assert.equal(f.address, null)
    assert.equal(f.phone, null)
    assert.equal(f.links.order, null)
    assert.equal(f.enabled, true)
    assert.equal(chatFacts({ shop: { chat: { enabled: false } } }).enabled, false)
  })
})

describe('instant answers', () => {
  test('the allergy answer is always there and always sends people to the phone', () => {
    const none = quickAnswers(chatFacts({ business: {}, shop: {} }), 'fr')
    assert.ok(none.find((a) => a.key === 'allergy'))
    assert.equal(none.find((a) => a.key === 'hours'), undefined)
    const full = quickAnswers(chatFacts({ business, shop, locale: 'fr', served: all }), 'fr')
    const allergy = full.find((a) => a.key === 'allergy')
    assert.match(allergy.text, /555-555-0100/)
    assert.ok(allergy.links.some((l) => l.href === 'tel:+15555550100'))
  })

  test('online ordering is offered only while it is open', () => {
    const open = quickAnswers(chatFacts({ business, shop, served: all }), 'fr').find((a) => a.key === 'order')
    assert.ok(open.links.some((l) => l.href === '/commander/'))
    const closed = quickAnswers(chatFacts({ business, shop: { ...shop, ordering: { enabled: false } }, served: all }), 'fr').find((a) => a.key === 'order')
    assert.ok(!closed.links.some((l) => l.href === '/commander/'))
  })
})

describe('status line: opening hours, never a promised delay', () => {
  // 2026-10-28 is a Wednesday; Granby is UTC−4 in October.
  const wed = (hhmm) => new Date(`2026-10-28T${hhmm}:00-04:00`)
  const schedule = { hours: shop.hours, specialDays: [], closure: null }

  test('open, closed with the next opening, unknown without hours', () => {
    assert.equal(chatStatus(schedule, wed('10:00')).state, 'open')
    const closed = chatStatus(schedule, wed('18:00'))
    assert.equal(closed.state, 'closed')
    assert.ok(closed.reopen instanceof Date)
    assert.equal(chatStatus({ hours: [] }, wed('10:00')).state, 'unknown')
  })

  test('the words never promise minutes', () => {
    for (const now of [wed('10:00'), wed('18:00')]) {
      const line = statusLine(schedule, 'fr', now)
      assert.doesNotMatch(line.text, /minute/i)
    }
    assert.match(statusLine(schedule, 'fr', wed('18:00')).text, /^Fermé · réouverture demain 9 h/)
  })
})

describe('a reply by texto or courriel', () => {
  const conv = { language: 'fr', name: 'Léa', contact: 'lea@exemple.ca', replyByConsent: true }

  test('only when the visitor asked for it and left a contact', () => {
    assert.equal(relayMessage({ ...conv, replyByConsent: false }, 'Oui!'), null)
    assert.equal(relayMessage({ ...conv, contact: null }, 'Oui!'), null)
    const email = relayMessage(conv, 'Oui, pour samedi!', { phone: '555-555-0100' })
    assert.equal(email.channel, 'email')
    assert.match(email.body, /Bonjour Léa,/)
    assert.match(email.html, /Oui, pour samedi!/)
    const sms = relayMessage({ ...conv, contact: '+14505550199' }, 'Oui!')
    assert.equal(sms.channel, 'sms')
    assert.match(sms.body, /STOP/)
  })
})

describe('Studio inbox and retention', () => {
  test('unread first, then the most recent; the shop’s own last word is « Vous : »', () => {
    const list = sortInbox([
      { id: 1, unreadForShop: 0, lastMessageAt: '2026-10-28T12:00:00Z' },
      { id: 2, unreadForShop: 2, lastMessageAt: '2026-10-27T12:00:00Z' },
      { id: 3, unreadForShop: 0, lastMessageAt: '2026-10-28T13:00:00Z' },
    ])
    assert.deepEqual(list.map((c) => c.id), [2, 3, 1])
    assert.equal(lastPreview({ messages: [{ from: 'shop', text: 'Merci!' }] }), 'Vous : Merci!')
    assert.equal(visitorName({}), 'Internaute')
  })

  test('conversations are deleted 90 days after their last message', () => {
    assert.equal(RETENTION_DAYS, 90)
    const now = new Date('2026-10-28T12:00:00Z')
    assert.equal(retentionCutoff(now).toISOString(), '2026-07-30T12:00:00.000Z')
  })

  test('the public thread exposes no contact detail', () => {
    const t = publicThread({ status: 'open', messages: [{ id: 'a', from: 'client', text: 'Allo', at: '2026-10-28T12:00:00Z' }], name: 'Léa', contact: 'lea@exemple.ca', replyByConsent: true, unreadForVisitor: 1 })
    assert.deepEqual(t.profile, { name: 'Léa', hasContact: true, replyByConsent: true })
    assert.doesNotMatch(JSON.stringify(t), /lea@exemple\.ca/)
  })
})
