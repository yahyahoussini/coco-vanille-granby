// Vitrine (sold-out that resets by itself, « Reprendre hier », facts-only alt text), Avis (templates in the
// reviewer's language, signed, no staff names) and Demandes (refusal text, the channel that carries it).
import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { fakePayload } from '../ordering/fake-payload.js'
import { perform, undo } from '../../../src/lib/studio/actions/index.js'
import { soldOutUntilToday, soldOutUntilDay, backLabel, vitrineAlt, reservedToday, isSoldOut, INDEFINITE } from '../../../src/lib/studio/vitrine.js'
import { replyTemplate, kindFor, firstNameOf, namedProduct } from '../../../src/lib/studio/reviews.js'
import { declineText, otherDateText, answerMessage } from '../../../src/lib/studio/requests.js'

const hours = ['Thursday', 'Friday', 'Saturday'].map((day) => ({ day, opens: '09:00', closes: '15:00' }))
const sat = new Date('2026-10-31T11:00:00-04:00')
const lea = { id: 2, role: 'comptoir', name: 'Léa', active: true }
const owner = { id: 1, role: 'proprietaire', name: 'Proprio', active: true }

describe('sold-out « pour aujourd’hui » (16a P3)', () => {
  test('back at the next opening: Saturday → Thursday 9 h', () => {
    const until = soldOutUntilToday({ hours }, sat)
    assert.equal(until.toISOString(), new Date('2026-11-05T09:00:00-05:00').toISOString())
    assert.equal(backLabel(until, sat), 'revient jeu. 5 nov. 9 h')
  })
  test('hours unknown: never longer than tomorrow 00 h', () => {
    assert.equal(soldOutUntilToday({ hours: [] }, sat).toISOString(), new Date('2026-11-01T00:00:00-04:00').toISOString())
  })
  test('« Plusieurs jours… » and « jusqu’à nouvel ordre »', () => {
    assert.equal(soldOutUntilDay({ hours }, '2026-11-06').toISOString(), new Date('2026-11-07T09:00:00-05:00').toISOString())
    assert.equal(backLabel(INDEFINITE, sat), 'jusqu’à nouvel ordre')
    assert.equal(isSoldOut({ availability: 'soldout', soldOutUntil: '2026-10-31T10:00:00-04:00' }, sat), false)
  })
  test('T1 action: Épuisé in one tap, undo puts it back', async () => {
    const payload = fakePayload({ globals: { shop: { hours } }, collections: { products: [{ id: 5, title: 'Croissant aux amandes', availability: 'instock', vitrine: true, _status: 'published' }] } })
    const r = await perform(payload, { user: lea, type: 'product.soldout', input: { productId: 5 }, now: sat })
    assert.ok(r.ok, r.message)
    assert.equal(r.message, 'Croissant aux amandes : épuisé jusqu’à jeu. 5 nov. 9 h.')
    assert.equal(payload.store.products[0].availability, 'soldout')
    assert.equal(payload.store.products[0]._status, 'published')
    await undo(payload, { user: lea, id: r.undo.id, now: sat })
    assert.equal(payload.store.products[0].availability, 'instock')
  })
  test('« Jusqu’à nouvel ordre » is the owner’s', async () => {
    const payload = fakePayload({ collections: { products: [{ id: 5, title: 'Croissant', availability: 'instock' }] } })
    assert.equal((await perform(payload, { user: lea, type: 'product.soldoutIndefinite', input: { productId: 5 } })).status, 403)
    assert.ok((await perform(payload, { user: owner, type: 'product.soldoutIndefinite', input: { productId: 5 } })).ok)
  })
})

describe('display case', () => {
  test('« Reprendre hier » restores yesterday’s list', async () => {
    const payload = fakePayload({ collections: { products: [{ id: 1, title: 'A', vitrine: true }, { id: 2, title: 'B', vitrine: false }, { id: 3, title: 'C', vitrine: false }] } })
    const friday = new Date('2026-10-30T10:00:00-04:00')
    await perform(payload, { user: lea, type: 'vitrine.add', input: { productId: 2 }, now: friday })
    await perform(payload, { user: lea, type: 'vitrine.remove', input: { productId: 1 }, now: sat })
    await perform(payload, { user: lea, type: 'vitrine.remove', input: { productId: 2 }, now: sat })
    assert.deepEqual(payload.store.products.filter((p) => p.vitrine).map((p) => p.id), [])
    const r = await perform(payload, { user: lea, type: 'vitrine.copyYesterday', input: {}, now: sat })
    assert.ok(r.ok, r.message)
    assert.deepEqual(payload.store.products.filter((p) => p.vitrine).map((p) => p.id), [1, 2])
  })
  test('alt text from visible facts only', () => {
    assert.equal(vitrineAlt('Pâtisserie Coco Vanille', '2026-10-31', [{ title: 'Croissant aux amandes' }, { title: 'Paris-Brest' }]), 'Vitrine de Pâtisserie Coco Vanille, samedi 31 octobre : Croissant aux amandes, Paris-Brest')
  })
  test('reserved = today’s committed lines', () => {
    const orders = [{ status: 'paid', items: [{ product: 5, qty: 6 }] }, { status: 'cancelled', items: [{ product: 5, qty: 9 }] }, { status: 'ready', items: [{ product: { id: 5 }, qty: 2 }] }]
    assert.equal(reservedToday(orders, 5), 8)
  })
})

describe('review replies (11 §4.5)', () => {
  test('positive FR names the product from the catalogue, signed, no staff name', () => {
    const t = replyTemplate('positive', 'fr', { author: 'Julie T.', text: 'Le Paris-Brest était parfait', titles: ['Paris-Brest', 'Baguette'] })
    assert.equal(t, 'Merci beaucoup, Julie! On est contents que le Paris-Brest vous ait plu. Au plaisir de vous revoir rue Court. — L’équipe Coco Vanille')
  })
  test('negative EN uses the shop phone; a missing email is left out, never invented', () => {
    const t = replyTemplate('negative', 'en', { author: 'Peter K.', phone: '450-372-7177' })
    assert.match(t, /reach us at 450-372-7177 with your order number/)
    assert.ok(!t.includes('FACT NEEDED') && !t.includes('['))
    assert.match(t, /— The Coco Vanille team$/)
  })
  test('ES stars only; kinds by rating and text', () => {
    assert.match(replyTemplate('stars', 'es', { author: 'Sofía R.' }), /^Gracias por su calificación, Sofía\./)
    assert.equal(kindFor({ rating: 2, text: 'bof' }), 'negative')
    assert.equal(kindFor({ rating: 5, text: '' }), 'stars')
    assert.equal(kindFor({ rating: 4, text: 'bon' }), 'positive')
    assert.equal(firstNameOf('Julie T. (démo)'), 'Julie')
    assert.equal(namedProduct('rien de spécial', ['Paris-Brest']), null)
  })
  test('« J’ai répondu » records the reply; Comptoir cannot', async () => {
    const payload = fakePayload({ collections: { reviews: [{ id: 9, author: 'Julie', rating: 5, receivedAt: '2026-10-31T08:00:00-04:00', status: 'unanswered' }] } })
    assert.equal((await perform(payload, { user: lea, type: 'review.answered', input: { reviewId: 9, reply: 'Merci!' } })).status, 403)
    const r = await perform(payload, { user: owner, type: 'review.answered', input: { reviewId: 9, reply: 'Merci beaucoup!' }, now: sat })
    assert.ok(r.ok)
    assert.equal(payload.store.reviews[0].status, 'answered')
    assert.equal(payload.store.reviews[0].reply, 'Merci beaucoup!')
  })
})

describe('request answers', () => {
  test('refusal and other date in the customer’s language', () => {
    assert.match(declineText('fr', { date: '2026-11-08' }), /complets le dimanche 8 novembre/)
    assert.match(otherDateText('en', { date: '2026-11-08', alt: '2026-11-15', phone: '450-372-7177' }), /offer Sunday, November 15 instead\. Reply to this message or call us at 450-372-7177\./)
  })
  test('email when there is one, otherwise one texto', () => {
    const withEmail = answerMessage({ customer: { email: 'a@exemple.test', phone: '+1514', language: 'fr' } }, 'Bonjour', { phone: '450-372-7177' })
    assert.equal(withEmail.channel, 'email')
    assert.match(withEmail.html, /<p>Bonjour<\/p>/)
    const sms = answerMessage({ customer: { phone: '+15145550000', language: 'fr' } }, 'Désolés, complets.')
    assert.equal(sms.channel, 'sms')
    assert.match(sms.body, /^Coco Vanille : Désolés, complets\./)
    assert.equal(answerMessage({ customer: {} }, 'x'), null)
  })
})
