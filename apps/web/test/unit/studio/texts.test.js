// Studio textos: one GSM-7 segment in FR, EN and ES with realistic values, sender + STOP (AC12).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { studioSms, STUDIO_SMS, freeTextSms } from '../../../src/lib/studio/texts.js'
import { smsInfo } from '../../../src/lib/messaging/gsm.js'

const data = { number: 1042, day: '2026-12-24', phone: '450-372-7177', link: 'https://cocovanillegranby.com/commander/paiement/?commande=Zx8kPq2mL0aB7cD9eF1gH3jK' }

test('every Studio texto fits one GSM-7 segment and names the sender', () => {
  for (const t of STUDIO_SMS) {
    for (const l of ['fr', 'en', 'es']) {
      const body = studioSms(t, l, data)
      const info = smsInfo(body)
      assert.equal(info.encoding, 'GSM-7', `${t}/${l}`)
      assert.equal(info.segments, 1, `${t}/${l}: ${info.units} « ${body} »`)
      assert.match(body, /^Coco Vanille/)
      assert.match(body, /STOP/)
      assert.ok(body.includes('1042'))
    }
  }
})

test('no phone on file: « appelez la boutique », never a marker', () => {
  const body = studioSms('closure', 'fr', { ...data, phone: null })
  assert.match(body, /appelez la boutique/)
  assert.ok(!body.includes('FACT NEEDED'))
})

test('free text: segments counted after GSM-7 cleaning', () => {
  const r = freeTextSms('Désolés, nous sommes complets ce jour-là. Nous pouvons vous proposer le samedi 15 novembre.')
  assert.equal(r.encoding, 'GSM-7')
  assert.equal(r.segments, 1)
})
