// Boutique & heures actions (16 §3.6): busy mode, online pause, exceptional closure (effects preview, textos
// after a 60 s grace), regular hours, special days, capacity ± per day. Studio never closes the shop by itself.
import { capacityLimit } from '../../ordering/capacity.js'
import { enqueueMessage, cancelQueued } from '../../messaging/queue.js'
import { senderFacts } from '../../messaging/templates.js'
import { localParts, addDays, closingOf, zonedTime, toMinutes, dayOf, shortDay, clockFr, dayBounds, WEEKDAYS } from '../time.js'
import { whenFr } from '../format.js'
import { sentence } from '../audit.js'
import { studioSms } from '../texts.js'
import { closurePlan, affectedOrders, withPhone, CLOSURE_LABEL } from '../closure.js'
import { refuse, str, int, holdMessages } from './util.js'

const SYS = { overrideAccess: true, depth: 0 }
const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/
const REASON_FR = { tempete: 'tempête', maladie: 'maladie', bris: 'bris', autre: 'autre raison' }

const readShop = (ctx) => ctx.payload.findGlobal({ slug: 'shop', locale: 'fr', depth: 0, ...ctx.as })
const writeShop = (ctx, data) => ctx.payload.updateGlobal({ slug: 'shop', locale: 'fr', data, depth: 0, ...ctx.as, context: { studioAudited: true } })
const restoreShop = (ctx, data) => ctx.payload.updateGlobal({ slug: 'shop', locale: 'fr', data, ...SYS, context: { studioAudited: true } })

// Undoable shop toggles share one shape: write `next`, keep `before` for « Annuler ».
const toggle = (field, describe) => ({
  undoSeconds: 30,
  async run(ctx, input) {
    const shop = await readShop(ctx)
    const { next, message, what } = describe(shop, input, ctx)
    await writeShop(ctx, { [field]: next })
    return { entity: 'shop', entityId: field, before: { [field]: shop[field] || null }, after: { [field]: next }, summary: sentence(ctx.user, ctx.device, what, ctx.now), message }
  },
  async undo(ctx, entry) {
    await restoreShop(ctx, { [field]: entry.before?.[field] ?? null })
    return { message: 'Annulé · comme avant.' }
  },
})

// « Jusqu'à : la fermeture · 14 h · … » for busy mode and pause.
function untilFrom(shop, input, now) {
  const today = localParts(now).iso
  const v = str(input.until, 16)
  if (v === 'fermeture' || !v) {
    // Today's closing; once it has passed, the closing of the next open day.
    for (let i = 0; i < 14; i++) {
      const d = addDays(today, i)
      const closes = closingOf({ ...shop, closure: null }, d)
      if (closes && zonedTime(d, closes).getTime() > now.getTime()) return zonedTime(d, closes)
    }
    return zonedTime(addDays(today, 1), '00:00')
  }
  if (v === '1h') return new Date(now.getTime() + 3600000)
  if (v === 'demain') return zonedTime(addDays(today, 1), '00:00')
  if (HHMM.test(v)) {
    const at = zonedTime(today, v)
    if (at.getTime() <= now.getTime()) refuse('time_past', 'Cette heure est déjà passée.', 422)
    return at
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return zonedTime(addDays(v, 1), '00:00')
  refuse('until', 'Choisissez jusqu’à quand.', 422)
}

async function facts(payload) {
  return senderFacts(await payload.findGlobal({ slug: 'business', locale: 'fr', ...SYS }))
}

async function ordersIn(ctx, fromISO, toISO) {
  const res = await ctx.payload.find({
    collection: 'orders',
    where: { and: [{ pickupDate: { greater_than_equal: dayBounds(fromISO).from } }, { pickupDate: { less_than: dayBounds(toISO).to } }, { status: { in: ['paid', 'ready'] } }] },
    limit: 500,
    depth: 0,
    ...ctx.as,
  })
  return res.docs
}

export const shopActions = {
  // « Délai allongé »: +30 min · +1 h · Pour demain, until closing / a time (16a P7). Paid orders untouched.
  'shop.busy': toggle('busy', (shop, input, ctx) => {
    const now = ctx.now
    let minutes = int(input.minutes)
    let until = untilFrom(shop, input, now)
    if (input.minutes === 'demain') {
      // Nothing more today online: the next slots start tomorrow.
      until = zonedTime(addDays(localParts(now).iso, 1), '00:00')
      minutes = Math.ceil((until.getTime() - now.getTime()) / 60000)
    }
    if (!(minutes > 0 && minutes <= 24 * 60)) refuse('minutes', 'Choisissez le délai.', 422)
    const label = input.minutes === 'demain' ? 'commandes en ligne pour demain' : minutes % 60 === 0 ? `${minutes / 60} h` : `${minutes} min`
    return {
      next: { extraMinutes: minutes, until: until.toISOString() },
      what: `a allongé le délai (${label}) jusqu’à ${whenFr(until, now)}`,
      message: input.minutes === 'demain' ? `En ligne : prochaines cueillettes demain · jusqu’à ${whenFr(until, now)}` : `Délai allongé de ${label} jusqu’à ${whenFr(until, now)}`,
    }
  }),

  'shop.busyStop': toggle('busy', () => ({ next: { extraMinutes: 0, until: null }, what: 'a arrêté le délai allongé', message: 'Délai normal rétabli.' })),

  // « Pause en ligne »: 1 h · Reste de la journée · Jusqu'à… Paid orders stay planned (10 §13).
  'shop.pause': toggle('onlinePause', (shop, input, ctx) => {
    const until = untilFrom(shop, input, ctx.now)
    return { next: { active: true, until: until.toISOString() }, what: `a mis les commandes en ligne en pause jusqu’à ${whenFr(until, ctx.now)}`, message: `Commandes en ligne en pause jusqu’à ${whenFr(until, ctx.now)} · les commandes déjà payées restent prévues` }
  }),

  'shop.resume': toggle('onlinePause', () => ({ next: { active: false, until: null }, what: 'a repris les commandes en ligne', message: 'Commandes en ligne reprises.' })),

  'shop.reopen': {
    undoSeconds: 30,
    async run(ctx) {
      const shop = await readShop(ctx)
      if (!shop.closure?.active) refuse('not_closed', 'La boutique n’est pas en fermeture exceptionnelle.', 409)
      await writeShop(ctx, { closure: { active: false, reason: null, until: null } })
      return { entity: 'shop', entityId: 'closure', before: { closure: shop.closure }, after: { closure: { active: false } }, summary: sentence(ctx.user, ctx.device, 'a rouvert la boutique', ctx.now), message: 'Boutique rouverte · commandes en ligne selon les heures habituelles.' }
    },
    async undo(ctx, entry) {
      await restoreShop(ctx, { closure: entry.before.closure })
      return { message: 'Annulé · la fermeture reste en place.' }
    },
  },

  // F8: reason + duration, effects preview on the screen, then: banner, online off, Google task, textos after 60 s.
  'shop.closure': {
    undoSeconds: 60,
    async run(ctx, input) {
      const reason = ['tempete', 'maladie', 'bris', 'autre'].includes(input.reason) ? input.reason : null
      if (!reason) refuse('reason_required', 'Choisissez pourquoi.', 422)
      const shop = await readShop(ctx)
      const plan = closurePlan(shop, input.duree, { now: ctx.now, date: str(input.date, 10) })
      if (plan.error) refuse(plan.error, { date_required: 'Choisissez la date de réouverture.', date_past: 'Cette date est passée.', date_far: 'Plus de 60 jours : passez par l’agence.', duration_required: 'Choisissez combien de temps.' }[plan.error], 422)
      const orders = affectedOrders(await ordersIn(ctx, plan.firstDay, plan.lastDay), plan, ctx.now)
      const before = { closure: shop.closure || null, specialDays: shop.specialDays || [] }
      if (plan.mode === 'special') {
        const rows = (shop.specialDays || []).filter((d) => dayOf(d.date) !== plan.firstDay)
        rows.push({ date: `${plan.firstDay}T12:00:00.000Z`, label: CLOSURE_LABEL, state: 'closed', opens: null, closes: null })
        await writeShop(ctx, { specialDays: rows })
      } else {
        await writeShop(ctx, { closure: { active: true, reason, until: plan.until.toISOString(), message: null } })
      }
      const f = await facts(ctx.payload)
      const messages = []
      for (const o of withPhone(orders)) {
        const m = await enqueueMessage(ctx.payload, { channel: 'sms', template: 'closure', to: o.customer.phone, language: o.locale || o.customer.language, orderId: o.id, body: studioSms('closure', o.locale || o.customer?.language, { number: o.number, day: dayOf(o.pickupDate), phone: f.phone }) })
        if (m) messages.push(m)
      }
      await holdMessages(ctx.payload, messages, ctx.undoUntil)
      const span = plan.mode === 'special' ? `le ${shortDay(plan.firstDay)}` : `jusqu’à ${whenFr(plan.until, ctx.now)}`
      return {
        entity: 'shop',
        entityId: 'closure',
        before,
        after: { mode: plan.mode, reason, firstDay: plan.firstDay, lastDay: plan.lastDay, until: plan.until.toISOString(), orders: orders.map((o) => o.number), texted: messages.length },
        summary: sentence(ctx.user, ctx.device, `a fermé la boutique ${span} (${REASON_FR[reason]}), ${messages.length} textos`, ctx.now),
        message: `Boutique fermée ${span} · ${messages.length ? `les textos partent dans 60 s (${messages.length} ${messages.length > 1 ? 'clients' : 'client'})` : 'aucun client à prévenir'} · Google : à faire à la main (1 min)`,
        data: { texted: messages.length, orders: orders.length },
      }
    },
    async undo(ctx, entry) {
      for (const number of entry.after?.orders || []) {
        const r = await ctx.payload.find({ collection: 'orders', where: { number: { equals: number } }, limit: 1, ...SYS })
        if (r.docs[0]) await cancelQueued(ctx.payload, { orderId: r.docs[0].id, template: 'closure' })
      }
      await restoreShop(ctx, entry.after?.mode === 'special' ? { specialDays: entry.before.specialDays } : { closure: entry.before.closure || { active: false, reason: null, until: null } })
      return { message: 'Annulé · la boutique reste ouverte, aucun texto n’est parti.' }
    },
  },

  // Regular hours (one form with the sticky save bar). Empty week = hours unknown ([[FACT NEEDED]]).
  'shop.hours': {
    undoSeconds: 30,
    async run(ctx, input) {
      const shop = await readShop(ctx)
      const hours = []
      for (const day of WEEKDAYS) {
        if (!input[`open_${day}`]) continue
        const opens = str(input[`opens_${day}`], 5)
        const closes = str(input[`closes_${day}`], 5)
        if (!HHMM.test(opens) || !HHMM.test(closes) || toMinutes(opens) >= toMinutes(closes)) refuse('hours_invalid', `Heures invalides le ${dayFr(day)} : l’ouverture doit précéder la fermeture.`, 422)
        hours.push({ day, opens, closes })
      }
      await writeShop(ctx, { hours })
      return {
        entity: 'shop',
        entityId: 'hours',
        before: { hours: (shop.hours || []).map(({ day, opens, closes }) => ({ day, opens, closes })) },
        after: { hours },
        summary: sentence(ctx.user, ctx.device, 'a modifié les heures habituelles', ctx.now),
        message: hours.length ? 'Heures enregistrées · le site et ses données sont à jour · Google : à faire à la main' : 'Heures retirées · le site affiche « à confirmer »',
      }
    },
    async undo(ctx, entry) {
      await restoreShop(ctx, { hours: entry.before.hours })
      return { message: 'Annulé · les heures d’avant sont remises.' }
    },
  },

  // One special day: Ouvert (regular hours) · Fermé · Heures spéciales. Holidays stay « à confirmer » until tapped (G18).
  'shop.special': {
    undoSeconds: 30,
    async run(ctx, input) {
      const date = str(input.date, 10)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) refuse('date', 'Date invalide.', 422)
      const state = ['open', 'closed', 'special', 'remove'].includes(input.state) ? input.state : null
      if (!state) refuse('state', 'Choisissez Ouvert, Fermé ou Heures spéciales.', 422)
      const opens = str(input.opens, 5)
      const closes = str(input.closes, 5)
      if (state === 'special' && (!HHMM.test(opens) || !HHMM.test(closes) || toMinutes(opens) >= toMinutes(closes))) refuse('hours_invalid', 'Indiquez l’heure d’ouverture et de fermeture.', 422)
      const shop = await readShop(ctx)
      const existing = (shop.specialDays || []).find((d) => dayOf(d.date) === date)
      const rows = (shop.specialDays || []).filter((d) => dayOf(d.date) !== date)
      if (state !== 'remove') rows.push({ ...(existing?.id ? { id: existing.id } : {}), date: `${date}T12:00:00.000Z`, label: existing?.label || str(input.label, 80) || null, state, opens: state === 'special' ? opens : null, closes: state === 'special' ? closes : null })
      rows.sort((a, b) => String(a.date).localeCompare(String(b.date)))
      await writeShop(ctx, { specialDays: rows })
      const word = { open: 'ouvert (heures habituelles)', closed: 'fermé', special: `ouvert ${clockFr(opens)} – ${clockFr(closes)}`, remove: 'retiré des jours spéciaux' }[state]
      return {
        entity: 'shop',
        entityId: `special:${date}`,
        before: { specialDays: shop.specialDays || [] },
        after: { date, state, opens: opens || null, closes: closes || null },
        summary: sentence(ctx.user, ctx.device, `a mis le ${shortDay(date)} : ${word}`, ctx.now),
        message: `${shortDay(date)} : ${word} · le site est à jour · Google : à faire à la main`,
      }
    },
    async undo(ctx, entry) {
      await restoreShop(ctx, { specialDays: entry.before.specialDays })
      return { message: 'Annulé.' }
    },
  },

  // Capacity ± for one day: a date override on the category's pool (the default stays in « Avancé »).
  'capacity.adjust': {
    undoSeconds: 30,
    async run(ctx, input) {
      const category = str(input.category, 40)
      const date = str(input.date, 10)
      const delta = int(input.delta)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || ![1, -1].includes(delta)) refuse('input', 'Choix invalide.', 422)
      const res = await ctx.payload.find({ collection: 'capacity-pools', where: { productionCategory: { equals: category } }, limit: 1, depth: 0, ...ctx.as })
      const pool = res.docs[0]
      const limit = pool ? capacityLimit([pool], category, date) : null
      if (limit === null) refuse('capacity_missing', 'La capacité par jour n’est pas réglée pour cette catégorie : à régler dans « Avancé ».', 409)
      const next = Math.max(0, limit + delta)
      const overrides = (pool.overrides || []).filter((o) => dayOf(o.date) !== date).map(({ id, date: d, capacity }) => ({ id, date: d, capacity }))
      overrides.push({ date: `${date}T12:00:00.000Z`, capacity: next })
      await ctx.payload.update({ collection: 'capacity-pools', id: pool.id, data: { overrides }, depth: 0, ...ctx.as, context: { studioAudited: true } })
      return {
        entity: 'capacity-pools',
        entityId: pool.id,
        before: { overrides: pool.overrides || [] },
        after: { date, capacity: next },
        summary: sentence(ctx.user, ctx.device, `a mis la capacité ${category} du ${shortDay(date)} à ${next}`, ctx.now),
        message: `${shortDay(date)} : ${next} par jour`,
      }
    },
    async undo(ctx, entry) {
      await ctx.payload.update({ collection: 'capacity-pools', id: entry.entityId, data: { overrides: entry.before.overrides }, ...SYS, context: { studioAudited: true } })
      return { message: 'Annulé.' }
    },
  },
}

const DAY_FR = { Monday: 'lundi', Tuesday: 'mardi', Wednesday: 'mercredi', Thursday: 'jeudi', Friday: 'vendredi', Saturday: 'samedi', Sunday: 'dimanche' }
export const dayFr = (d) => DAY_FR[d] || d
