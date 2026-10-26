// Vitrine (16 §3.3): sold-out with a duration that resets by itself (16a P3), the photo of the day,
// « Reprendre hier ». Pure helpers + small reads. Times are America/Toronto.
import { nextOpening, zonedTime, addDays, localParts, longDay, clockOf, shortDay } from './time.js'
import { dayWord } from './format.js'

export const VITRINE_CREDIT = 'Vitrine du jour'
// « Jusqu'à nouvel ordre » (owner only): a far date, so the product page never resets it by itself.
export const INDEFINITE = '2999-12-31T05:00:00.000Z'

// « Pour aujourd'hui » = until the next opening; hours unknown → until tomorrow 00 h (never longer).
export function soldOutUntilToday(shop, now = new Date()) {
  return nextOpening(shop, now) || zonedTime(addDays(localParts(now).iso, 1), '00:00')
}

// « Plusieurs jours… »: back at the first opening after the chosen day.
export function soldOutUntilDay(shop, iso) {
  const end = zonedTime(addDays(iso, 1), '00:00')
  return nextOpening(shop, end) || end
}

export const isIndefinite = (until) => Boolean(until) && new Date(until).getUTCFullYear() >= 2999

export function isSoldOut(product, now = new Date()) {
  if (product?.availability !== 'soldout') return false
  if (!product.soldOutUntil) return true
  return new Date(product.soldOutUntil).getTime() > new Date(now).getTime()
}

// « revient jeudi à l'ouverture » · « revient demain 9 h » · « jusqu'à nouvel ordre »
export function backLabel(until, now = new Date()) {
  if (!until) return 'jusqu’à la prochaine ouverture'
  if (isIndefinite(until)) return 'jusqu’à nouvel ordre'
  const d = new Date(until)
  return `revient ${dayWord(localParts(d).iso, now)} ${clockOf(d)}`
}

// « jusqu'à jeudi 9 h »
export function untilLabel(until, now = new Date()) {
  if (isIndefinite(until)) return 'jusqu’à nouvel ordre'
  const d = new Date(until)
  return `jusqu’à ${dayWord(localParts(d).iso, now)} ${clockOf(d)}`
}

// Alt text from visible facts only, never AI (16 §3.3): « Vitrine de Pâtisserie Coco Vanille, samedi 31 octobre : croissants aux amandes, Paris-Brest »
export function vitrineAlt(name, iso, products = []) {
  const items = products.map((p) => p.title).filter(Boolean)
  return `Vitrine de ${name || 'la pâtisserie'}, ${longDay(iso)}${items.length ? ` : ${items.join(', ')}` : ''}`
}

export const vitrineCaption = (iso) => `Vitrine du ${longDay(iso)}`

// Today's (or a day's) photo: the newest Media row tagged « Vitrine du jour » taken that local day.
export async function vitrinePhotoOf(payload, iso, { user = null } = {}) {
  const from = zonedTime(iso, '00:00').toISOString()
  const to = zonedTime(addDays(iso, 1), '00:00').toISOString()
  const res = await payload.find({
    collection: 'media',
    where: { and: [{ credit: { equals: VITRINE_CREDIT } }, { takenAt: { greater_than_equal: from } }, { takenAt: { less_than: to } }] },
    sort: '-takenAt',
    limit: 1,
    depth: 0,
    locale: 'fr',
    ...(user ? { user, overrideAccess: false } : { overrideAccess: true }),
  })
  return res.docs[0] || null
}

// Planned vs reserved: « 20 prévus · 8 réservés » (reserved = today's committed order lines for that product).
export function reservedToday(orders = [], productId) {
  let n = 0
  for (const o of orders) {
    if (!['paid', 'ready', 'picked_up'].includes(o.status)) continue
    for (const it of o.items || []) if (String(typeof it.product === 'object' ? it.product?.id : it.product) === String(productId)) n += it.qty
  }
  return n
}

export const dayLabel = (iso, now) => (iso === localParts(now).iso ? 'aujourd’hui' : shortDay(iso))
