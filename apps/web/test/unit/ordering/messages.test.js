// Every SMS template, in every language, with worst-case data: one GSM-7 segment, sender named, STOP present.
// Emails: French first, contract-copy content, never the allergy note. Calendar file shape.
import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { smsInfo, toGsm, isGsm } from '../../../src/lib/messaging/gsm.js'
import { SMS_TEMPLATES, renderSms, smsData, senderFacts, orderConfirmedEmail, requestReceivedEmail, quoteSentEmail, orderReadyEmail } from '../../../src/lib/messaging/templates.js'
import { pickupIcs } from '../../../src/lib/ordering/ics.js'

const business = {
  name: 'Pâtisserie Coco Vanille',
  legalName: 'Pâtisserie Coco Vanille inc.',
  neq: '1177082220',
  phoneDisplay: '450-372-7177',
  address: { street: '3, rue Court', city: 'Granby', region: 'QC', postalCode: 'J2G 4Y6' },
  google: { cid: '10789122976114705165' },
}
const facts = senderFacts(business, { origin: 'https://cocovanillegranby.com' })

// Longest realistic values: 5-digit order number, longest French day/month abbreviations, 4-digit prices.
const order = (locale) => ({
  id: 1,
  number: 10428,
  locale,
  pickupDate: '2026-12-30T12:00:00.000Z',
  pickupWindowStart: '16:15',
  pickupWindowEnd: '16:30',
  pickupCode: '4821',
  accessToken: 'AbCdEfGhIjKlMnOpQrStUvWx',
  customer: { firstName: 'Marie-Ève', email: 'marie@example.test', phone: '+14505550101', language: locale },
  items: [{ title: 'Gâteau aux framboises', variantLabel: '8 po', qty: 1, unitPriceCents: 5200, message: 'Bonne fête Léo' }],
  totals: { subtotalCents: 5200, gstCents: 0, qstCents: 0, totalCents: 5200, depositCents: null, balanceCents: 0 },
  payment: { provider: 'stripe', paidAt: '2026-12-01T15:00:00.000Z' },
  consent: { termsAcceptedAt: '2026-12-01T15:00:00.000Z', termsVersion: '2026-10-25' },
  allergyNote: 'Allergie sévère aux noix',
})
const request = (language) => ({
  id: 2,
  occasion: 'Anniversaire',
  guests: 40,
  eventDate: '2026-12-30T12:00:00.000Z',
  cakeMessage: 'Joyeux 40e Marie',
  answerBy: '2026-12-31T19:45:00.000Z',
  hasAllergy: true,
  customer: { firstName: 'Léa', email: 'lea@example.test', phone: '+14505550123', language },
  quote: { subtotalCents: 125000, gstCents: 0, qstCents: 0, totalCents: 125000, depositCents: 37500, balanceCents: 87500, validUntil: '2026-12-31T23:00:00.000Z', paymentLink: 'https://cocovanillegranby.com/svc/p/AbCdEfGhIjKl/' },
})

describe('SMS templates (10 §6)', () => {
  for (const locale of ['fr', 'en', 'es']) {
    for (const template of SMS_TEMPLATES) {
      test(`${template} · ${locale}: one GSM-7 segment, sender + STOP`, () => {
        const isRequest = template.startsWith('request') || template.startsWith('quote')
        const data = smsData(template, isRequest ? { request: request(locale), facts } : { order: order(locale), facts, closes: '16:30' })
        const body = renderSms(template, locale, data)
        const info = smsInfo(body)
        assert.equal(info.encoding, 'GSM-7', body)
        assert.equal(info.segments, 1, `${info.units} chars: ${body}`)
        assert.ok(info.units <= 160)
        assert.match(body, /^Coco Vanille ?:/)
        assert.match(body, /STOP/)
        assert.doesNotMatch(body, /noix|Allergie/i)
      })
    }
  }

  test('the encoder catches the 07 §7 trap (« n° », « prête », guillemets) and the cleaner fixes it', () => {
    const trap = 'Coco Vanille : votre commande n° 1042 est prête ! 3, rue Court, Granby. STOP pour ne plus recevoir de textos.'
    assert.equal(smsInfo(trap).encoding, 'UCS-2')
    assert.equal(smsInfo(trap).segments, 2)
    assert.equal(isGsm(toGsm(trap)), true)
    assert.equal(toGsm('Benoît · août « ça »'), 'Benoit - aout " ca "')
    assert.equal(smsInfo('€').units, 2)
  })
})

describe('emails', () => {
  test('order confirmation = contract copy, French first, never the allergy note', () => {
    const mail = orderConfirmedEmail(order('en'), facts)
    assert.match(mail.subject, /^Commande 10428 confirmée · cueillette mercredi 30 décembre, 16 h 15 à 16 h 30 \/ Order 10428 confirmed/)
    const fr = mail.text.indexOf('Merci! Votre commande 10428 est confirmée')
    const en = mail.text.indexOf('Thank you! Your order 10428 is confirmed')
    assert.ok(fr >= 0 && en > fr, 'French block first')
    for (const piece of ['Code de cueillette : 4821', 'TPS (5 %)', 'TVQ (9,975 %)', 'NEQ 1177082220', '3, rue Court, Granby (Québec) J2G 4Y6', '15 jours', 'https://cocovanillegranby.com/conditions-de-vente/', 'Bonne fête Léo', 'dollars canadiens']) {
      assert.ok(mail.text.includes(piece), piece)
    }
    assert.doesNotMatch(mail.text + mail.html, /noix/)
    assert.match(mail.html, /<div lang="fr-CA"/)
    assert.equal(orderConfirmedEmail(order('fr'), facts).text.includes('Thank you'), false)
  })

  test('request received, quote and ready', () => {
    const r = requestReceivedEmail(request('fr'), facts)
    assert.match(r.subject, /^Demande de gâteau reçue/)
    assert.match(r.text, /nous vous appellerons/)
    const q = quoteSentEmail(request('fr'), facts)
    assert.ok(q.text.includes('https://cocovanillegranby.com/svc/p/AbCdEfGhIjKl/'))
    assert.match(q.text.replace(/[  ]/g, ' '), /Acompte aujourd’hui · 375,00 \$/)
    assert.match(orderReadyEmail(order('fr'), facts, { closes: '17:00' }).text, /vous attend au comptoir jusqu’à 17 h/)
  })
})

describe('calendar file (.ics)', () => {
  test('UTC window, UID, location, reminder, CRLF and folding', () => {
    const ics = pickupIcs(order('fr'), { location: 'Pâtisserie Coco Vanille, 3, rue Court, Granby (Québec) J2G 4Y6', url: 'https://cocovanillegranby.com/commander/merci/?commande=x', now: new Date('2026-12-01T15:00:00Z') })
    assert.ok(ics.includes('UID:10428@cocovanillegranby.com\r\n'))
    assert.ok(ics.includes('DTSTART:20261230T211500Z\r\n'))
    assert.ok(ics.includes('DTEND:20261230T213000Z\r\n'))
    assert.ok(ics.includes('TRIGGER:-PT1H'))
    assert.ok(ics.includes('LOCATION:Pâtisserie Coco Vanille\\, 3\\, rue Court'))
    for (const line of ics.split('\r\n')) assert.ok(Buffer.byteLength(line) <= 75, line)
  })
})
