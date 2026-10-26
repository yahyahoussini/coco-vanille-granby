// DEMO DATA ONLY for Coco Studio (e2e tests, staging walkthroughs): demo staff with PINs, today's pickups,
// a cake request, reviews. Every name carries « (démo) »; nothing here is an owner fact. Run after the
// ordering demo (src/seed/demo.js), which supplies the demo hours, prices and capacity.
//
//   SEED_DEMO=true  npm run seed:studio-demo   → applies (idempotent: earlier Studio demo rows are replaced)
//   SEED_DEMO=clean npm run seed:studio-demo   → removes the demo staff, reviews, questions and the Studio audit rows
//
// Refuses to run against production.
import { getPayload } from 'payload'
import config from '../payload.config.js'
import { hashPin } from '../lib/studio/pin.js'
import { localParts, addDays, fromMinutes, toMinutes } from '../lib/studio/time.js'

const mode = process.env.SEED_DEMO
if (mode !== 'true' && mode !== 'clean') {
  console.error('src/seed/studio-demo.js runs only with SEED_DEMO=true (apply) or SEED_DEMO=clean (remove).')
  process.exit(1)
}
if (process.env.NODE_ENV === 'production' || /^https:\/\/(www\.)?cocovanillegranby\.com\/?$/.test(process.env.PUBLIC_ORIGIN || '')) {
  console.error('src/seed/studio-demo.js never runs against production.')
  process.exit(1)
}

const payload = await getPayload({ config })
const SYS = { overrideAccess: true, depth: 0, context: { studioAudited: true } }
const DEMO = '(démo)'

// Demo staff: PINs and passwords are demo values for tests, never real accounts.
const DEMO_STAFF = [
  { name: `Léa ${DEMO}`, email: 'lea.demo@comptoir.invalid', role: 'comptoir', pin: '1111', password: 'lea-demo-only' },
  { name: `Marc ${DEMO}`, email: 'marc.demo@comptoir.invalid', role: 'gerant', pin: '2222', password: 'marc-demo-only' },
  { name: `Agence ${DEMO}`, email: 'agence.demo@exemple.test', role: 'agence', password: 'agence-demo-only' },
]
const OWNER_PIN = '0000'

async function findUser(email) {
  const r = await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1, ...SYS })
  return r.docs[0] || null
}

async function removeDemoTraffic() {
  // Orders, requests and messages made for the Studio demo carry « (démo) » in the customer's last name.
  for (const collection of ['orders', 'requests']) {
    const r = await payload.find({ collection, where: { 'customer.lastName': { contains: DEMO } }, limit: 500, ...SYS })
    for (const d of r.docs) {
      await payload.delete({ collection: 'messages', where: { [collection === 'orders' ? 'order' : 'request']: { equals: d.id } }, ...SYS })
      await payload.delete({ collection, id: d.id, ...SYS })
    }
  }
  await payload.delete({ collection: 'reviews', where: { author: { contains: DEMO } }, ...SYS })
  await payload.delete({ collection: 'questions', where: { text: { contains: DEMO } }, ...SYS })
}

if (mode === 'clean') {
  await removeDemoTraffic()
  for (const s of DEMO_STAFF) {
    const u = await findUser(s.email)
    if (u) {
      await payload.delete({ collection: 'audit-log', where: { actor: { equals: u.id } }, ...SYS })
      await payload.delete({ collection: 'users', id: u.id, ...SYS })
    }
  }
  const owner = await findUser('proprio@exemple.test')
  if (owner) await payload.delete({ collection: 'audit-log', where: { actor: { equals: owner.id } }, ...SYS })
  if (owner) await payload.update({ collection: 'users', id: owner.id, data: { pinHash: null, passkeys: null, backupCodes: null, pinFailures: 0, pinLockedUntil: null }, ...SYS })
  const products = await payload.find({ collection: 'products', limit: 100, ...SYS })
  for (const p of products.docs) await payload.update({ collection: 'products', id: p.id, data: { vitrine: false, vitrinePlanned: null, soldOutUntil: null, availability: p.availability === 'soldout' ? 'instock' : p.availability }, ...SYS })
  const shop = await payload.findGlobal({ slug: 'shop', ...SYS })
  await payload.updateGlobal({ slug: 'shop', data: { closure: { active: false, reason: null, until: null }, busy: { extraMinutes: 0, until: null }, onlinePause: { active: false, until: null }, specialDays: (shop.specialDays || []).filter((d) => !String(d.label || '').includes(DEMO)) }, ...SYS })
  payload.logger.info('Studio demo data removed (SEED_DEMO=clean).')
  process.exit(0)
}

// ---------- apply ----------
for (const s of DEMO_STAFF) {
  const existing = await findUser(s.email)
  const data = { name: s.name, role: s.role, active: true, pinFailures: 0, pinLockedUntil: null, mayClose: false, ...(s.pin ? { pinHash: await hashPin(s.pin) } : {}) }
  if (existing) await payload.update({ collection: 'users', id: existing.id, data: { ...data, password: s.password }, ...SYS })
  else await payload.create({ collection: 'users', data: { ...data, email: s.email, password: s.password }, ...SYS })
}
const owner = await findUser('proprio@exemple.test')
if (owner) await payload.update({ collection: 'users', id: owner.id, data: { pinHash: await hashPin(OWNER_PIN), pinFailures: 0, pinLockedUntil: null, loginAttempts: 0, lockUntil: null }, ...SYS })

await removeDemoTraffic()
// Fresh undo windows and idempotency keys for the demo accounts (all dev-only accounts).
for (const email of [...DEMO_STAFF.map((s) => s.email), 'proprio@exemple.test']) {
  const u = await findUser(email)
  if (u) await payload.delete({ collection: 'audit-log', where: { actor: { equals: u.id } }, ...SYS })
}

const shop = await payload.findGlobal({ slug: 'shop', ...SYS })
await payload.updateGlobal({ slug: 'shop', data: { closure: { active: false, reason: null, until: null }, busy: { extraMinutes: 0, until: null }, onlinePause: { active: false, until: null } }, ...SYS })

const bySlug = async (slug) => (await payload.find({ collection: 'products', where: { slug: { equals: slug } }, limit: 1, locale: 'fr', ...SYS })).docs[0] || null
const croissant = await bySlug('croissant-aux-amandes')
const parisBrest = await bySlug('paris-brest')
const raspberry = await bySlug('gateau-aux-framboises')
const volauvent = await bySlug('vol-au-vent')

// Vitrine du jour (demo quantities).
for (const [p, planned] of [
  [croissant, 20],
  [parisBrest, 8],
  [volauvent, null],
]) {
  if (p) await payload.update({ collection: 'products', id: p.id, data: { vitrine: true, vitrinePlanned: planned, availability: 'instock', soldOutUntil: null }, ...SYS })
}

// Today's pickups around now, in the demo opening hours (9 h – 18 h, src/seed/demo.js).
const now = new Date()
const here = localParts(now)
const today = here.iso
const stored = (iso) => `${iso}T12:00:00.000Z`
const slot = (offsetMin) => {
  const m = Math.min(Math.max(toMinutes('09:00'), Math.floor((here.minutes + offsetMin) / 15) * 15), toMinutes('17:45'))
  return [fromMinutes(m), fromMinutes(m + 15)]
}
const lastNumber = (await payload.find({ collection: 'orders', sort: '-number', limit: 1, ...SYS })).docs[0]?.number
let number = Number.isInteger(lastNumber) && lastNumber >= 1001 ? lastNumber + 1 : 1001
const line = (p, qty, cents, extra = {}) => ({ product: p?.id, variantIndex: 0, title: p?.title || 'Produit', variantLabel: p?.variants?.[0]?.label || '', qty, unitPriceCents: cents, taxClass: 'rule', productionCategory: p?.productionCategory || 'patisseries', units: qty, productionDate: today, ...extra })

const ORDERS = [
  { first: 'Julie', last: `T. ${DEMO}`, phone: '+15145550101', lang: 'fr', at: 15, status: 'paid', items: [line(parisBrest, 1, 650)], code: '4821' },
  { first: 'Léo', last: `B. ${DEMO}`, phone: '+15145550102', lang: 'fr', at: -30, status: 'ready', items: [line(croissant, 6, 425)], code: '1039' },
  { first: 'Mark', last: `S. ${DEMO}`, phone: '+15145550103', lang: 'en', at: 45, status: 'paid', items: [line(raspberry, 1, 3800, { message: 'Happy birthday Mia', productionCategory: 'gateaux' })], code: '7310', allergy: 'Allergie aux noix (démo)', counter: true },
  { first: 'Sofía', last: `R. ${DEMO}`, phone: '+15145550104', lang: 'es', at: 90, status: 'paid', items: [line(croissant, 2, 425), line(parisBrest, 2, 650)], code: '2290' },
]
for (const o of ORDERS) {
  const [start, end] = slot(o.at)
  const subtotal = o.items.reduce((s, i) => s + i.qty * i.unitPriceCents, 0)
  await payload.create({
    collection: 'orders',
    data: {
      number: number++,
      status: o.status,
      source: o.counter ? 'phone' : 'web',
      locale: o.lang,
      customer: { firstName: o.first, lastName: o.last, phone: o.phone, language: o.lang },
      items: o.items,
      pickupDate: stored(today),
      pickupWindowStart: start,
      pickupWindowEnd: end,
      pickupCode: o.code,
      accessToken: `demo-${number}-${Math.random().toString(36).slice(2)}`,
      totals: { subtotalCents: subtotal, gstCents: 0, qstCents: 0, totalCents: subtotal, depositCents: null, balanceCents: o.counter ? subtotal : 0 },
      payment: o.counter ? { provider: 'counter', kind: 'full', status: 'pending', amountCents: subtotal } : { provider: 'mock', kind: 'full', status: 'paid', amountCents: subtotal, paidAt: now.toISOString() },
      allergyNote: o.allergy || null,
      timeline: [{ at: now.toISOString(), status: o.status, by: null, source: 'demo', note: 'Commande de démonstration' }],
    },
    ...SYS,
  })
}

// Tomorrow: one order for the Demain tab and the production list.
await payload.create({
  collection: 'orders',
  data: {
    number: number++,
    status: 'paid',
    source: 'web',
    locale: 'fr',
    customer: { firstName: 'Nadia', lastName: `L. ${DEMO}`, phone: '+15145550105', language: 'fr' },
    items: [line(raspberry, 1, 5200, { productionCategory: 'gateaux', productionDate: today, message: 'Joyeux 40e Marie' })],
    pickupDate: stored(addDays(today, 1)),
    pickupWindowStart: '10:00',
    pickupWindowEnd: '10:15',
    pickupCode: '5512',
    accessToken: `demo-${number}-${Math.random().toString(36).slice(2)}`,
    totals: { subtotalCents: 5200, gstCents: 0, qstCents: 0, totalCents: 5200, balanceCents: 0 },
    payment: { provider: 'mock', kind: 'full', status: 'paid', amountCents: 5200, paidAt: now.toISOString() },
    timeline: [{ at: now.toISOString(), status: 'paid', by: null, source: 'demo', note: 'Commande de démonstration' }],
  },
  ...SYS,
})

// A cake request for 20 people, received an hour ago (T3), with a demo tax class for the quote.
const eventDay = addDays(today, 9)
await payload.create({
  collection: 'requests',
  data: {
    status: 'new',
    source: 'web',
    occasion: 'Anniversaire',
    guests: 20,
    eventDate: stored(eventDay),
    flavour: 'Vanille-framboise',
    cakeMessage: 'Bonne fête Léo',
    details: 'Gâteau rond, crème fouettée (démo).',
    customer: { firstName: 'Camille', lastName: `D. ${DEMO}`, phone: '+15145550106', email: 'camille.demo@exemple.test', language: 'fr' },
    answerBy: new Date(now.getTime() + 23 * 3600 * 1000).toISOString(),
    productionCategory: 'gateaux',
    capacityUnits: 1,
    quote: { taxClass: 'zero' },
    accessToken: `demo-req-${Math.random().toString(36).slice(2)}`,
    timeline: [{ at: new Date(now.getTime() - 3600 * 1000).toISOString(), status: 'new', by: null, source: 'demo', note: 'Demande de démonstration' }],
  },
  ...SYS,
})

// Reviews: a 5-star from this morning (T5) and a 2-star (negative template).
await payload.create({ collection: 'reviews', data: { platform: 'google', author: `Julie T. ${DEMO}`, rating: 5, text: 'Le Paris-Brest était parfait, merci! (démo)', language: 'fr', receivedAt: new Date(now.getTime() - 3 * 3600 * 1000).toISOString(), status: 'unanswered' }, ...SYS })
await payload.create({ collection: 'reviews', data: { platform: 'google', author: `Peter K. ${DEMO}`, rating: 2, text: 'The cake was not what I ordered. (demo)', language: 'en', receivedAt: new Date(now.getTime() - 20 * 3600 * 1000).toISOString(), status: 'unanswered' }, ...SYS })

payload.logger.info(`Studio demo data applied (SEED_DEMO=true): staff PINs Léa 1111, Marc 2222, owner ${OWNER_PIN}. Remove with SEED_DEMO=clean.`)
process.exit(0)
