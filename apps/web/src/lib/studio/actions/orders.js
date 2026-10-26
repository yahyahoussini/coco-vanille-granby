// Order actions (16 §3.1–§3.2): « Marquer prête » (+ bulk), « Remettre la commande », phone orders,
// another slot, cancel and refund. Status changes go through the shared state machine; textos are held until
// the undo window closes; money actions are owner-only with an effects preview and a step-up.
import { assertTransition, canTransition } from '../../ordering/state.js'
import { createOrder } from '../../ordering/create-order.js'
import { notifyReady } from '../../messaging/notify.js'
import { cancelQueued, enqueueMessage } from '../../messaging/queue.js'
import { recordCounterPayment } from '../../payments/settle.js'
import { stripeClient, cancelIntent } from '../../payments/stripe.js'
import { senderFacts } from '../../messaging/templates.js'
import { customerName, money } from '../format.js'
import { clockFr, shortDay } from '../time.js'
import { sentence } from '../audit.js'
import { studioSms } from '../texts.js'
import { refuse, load, timelineEntry, pushTimeline, holdMessages, str, bool, int } from './util.js'

const SYS = { overrideAccess: true, depth: 0 }
const REFUND_DAYS = 15

const snapshot = (o) => ({ status: o.status, timeline: o.timeline || [], totals: o.totals || {}, payment: o.payment || {} })

const WHY = { cancelled: 'a été annulée', refunded: 'a été remboursée', picked_up: 'est déjà récupérée', ready: 'est déjà prête', pending_payment: 'attend son paiement', not_picked_up: 'n’a pas été récupérée' }
const refuseState = (order) => refuse('transition', `la commande ${order.number} ${WHY[order.status] || `est « ${order.status} »`}.`, 409)

function moveOrFail(order, to, role) {
  try {
    assertTransition(order.status, to, role)
  } catch {
    refuseState(order)
  }
}

// « Prête » moves a paid order forward only (picked_up → ready exists for the undo window, not for this button).
async function markReady(ctx, order) {
  if (order.status !== 'paid') refuseState(order)
  moveOrFail(order, 'ready', ctx.user.role)
  const updated = await ctx.payload.update({ collection: 'orders', id: order.id, data: { status: 'ready', timeline: pushTimeline(order, timelineEntry(ctx, 'ready', 'Marquée prête')) }, ...ctx.write, depth: 0 })
  const messages = await notifyReady(ctx.payload, updated).catch(() => [])
  await holdMessages(ctx.payload, messages, ctx.undoUntil)
  return { updated, messages }
}

async function revert(ctx, id, before, note) {
  const order = await ctx.payload.findByID({ collection: 'orders', id, ...SYS })
  await ctx.payload.update({
    collection: 'orders',
    id,
    data: { status: before.status, totals: before.totals, payment: before.payment, timeline: pushTimeline(order, timelineEntry(ctx, before.status, note)) },
    ...SYS,
  })
  return order
}

async function facts(payload) {
  return senderFacts(await payload.findGlobal({ slug: 'business', locale: 'fr', ...SYS }))
}

export const orderActions = {
  'order.ready': {
    async run(ctx, input) {
      const order = await load(ctx, 'orders', input.orderId)
      const { messages } = await markReady(ctx, order)
      const who = customerName(order.customer)
      return {
        entity: 'orders',
        entityId: order.id,
        before: snapshot(order),
        after: { status: 'ready' },
        summary: sentence(ctx.user, ctx.device, `a marqué la commande ${order.number} prête`, ctx.now),
        message: messages.length ? `Commande ${order.number} prête · texto à ${who} dans 30 s` : `Commande ${order.number} prête · pas de téléphone ni de courriel au dossier`,
        data: { orderId: order.id, status: 'ready', messages: messages.map((m) => m.id) },
      }
    },
    async undo(ctx, entry) {
      const order = await ctx.payload.findByID({ collection: 'orders', id: entry.entityId, ...SYS })
      if (order.status !== 'ready') refuse('undo_state', `la commande ${order.number} a changé depuis.`)
      await cancelQueued(ctx.payload, { orderId: order.id, template: 'order_ready' })
      await revert(ctx, order.id, entry.before, 'Annulé : pas encore prête')
      return { message: `Commande ${order.number} : retour à « Payée », le texto ne part pas.` }
    },
  },

  'order.bulkReady': {
    async run(ctx, input) {
      const ids = [].concat(input.orderIds || []).map(String).filter(Boolean).slice(0, 50)
      if (!ids.length) refuse('none', 'Cochez au moins une commande.', 422)
      const done = []
      const skipped = []
      for (const id of ids) {
        const order = await ctx.payload.findByID({ collection: 'orders', id, ...ctx.as, depth: 0, disableErrors: true }).catch(() => null)
        if (!order || order.status !== 'paid' || !canTransition(order.status, 'ready', ctx.user.role)) {
          if (order) skipped.push(order.number)
          continue
        }
        await markReady(ctx, order)
        done.push({ id: order.id, number: order.number, before: snapshot(order) })
      }
      if (!done.length) refuse('none', 'Aucune des commandes cochées ne peut être marquée prête.', 409)
      return {
        entity: 'orders',
        entityId: done.map((d) => d.id).join(','),
        before: { orders: done.map((d) => ({ id: d.id, ...d.before })) },
        after: { status: 'ready', orders: done.map((d) => d.number) },
        summary: sentence(ctx.user, ctx.device, `a marqué ${done.length} commandes prêtes (${done.map((d) => d.number).join(', ')})`, ctx.now),
        message: `${done.length} ${done.length > 1 ? 'commandes prêtes' : 'commande prête'} · textos dans 30 s${skipped.length ? ` · ${skipped.length} ignorée(s)` : ''}`,
        data: { orderIds: done.map((d) => d.id) },
      }
    },
    async undo(ctx, entry) {
      for (const b of entry.before?.orders || []) {
        const order = await ctx.payload.findByID({ collection: 'orders', id: b.id, ...SYS, disableErrors: true }).catch(() => null)
        if (!order || order.status !== 'ready') continue
        await cancelQueued(ctx.payload, { orderId: order.id, template: 'order_ready' })
        await revert(ctx, order.id, b, 'Annulé : pas encore prête')
      }
      return { message: 'Annulé · les textos ne partent pas.' }
    },
  },

  // « Remettre la commande »: the customer's 4-digit code, or « Client reconnu ». A balance due is recorded
  // as paid at the counter (POS) at the same time.
  'order.pickup': {
    async run(ctx, input) {
      const order = await load(ctx, 'orders', input.orderId)
      const recognized = bool(input.recognized)
      const code = str(input.code, 8).replace(/\D/g, '')
      if (!recognized) {
        if (!code) refuse('code_required', 'Tapez le code du client, ou choisissez « Client reconnu ».', 422)
        if (code !== String(order.pickupCode || '')) refuse('code', 'Code incorrect · vérifiez avec le client, ou choisissez « Client reconnu ».', 422)
      }
      moveOrFail(order, 'picked_up', ctx.user.role)
      const balance = order.totals?.balanceCents > 0 ? order.totals.balanceCents : 0
      if (balance) await recordCounterPayment(ctx.payload, { orderId: order.id, by: ctx.user.id, now: ctx.now })
      const fresh = await ctx.payload.findByID({ collection: 'orders', id: order.id, ...SYS })
      await ctx.payload.update({ collection: 'orders', id: order.id, data: { status: 'picked_up', timeline: pushTimeline(fresh, timelineEntry(ctx, 'picked_up', recognized ? 'Remise · client reconnu' : 'Remise · code vérifié')) }, ...ctx.write, depth: 0 })
      // The customer has it: « vous attend au comptoir » or « pas été récupérée » must not follow.
      for (const template of ['order_ready', 'order_not_picked_up']) await cancelQueued(ctx.payload, { orderId: order.id, template })
      return {
        entity: 'orders',
        entityId: order.id,
        before: snapshot(order),
        after: { status: 'picked_up', balancePaidCents: balance || null, how: recognized ? 'reconnu' : 'code' },
        summary: sentence(ctx.user, ctx.device, `a remis la commande ${order.number}${recognized ? ' (client reconnu)' : ''}${balance ? `, solde ${money(balance)} encaissé` : ''}`, ctx.now),
        message: `Commande ${order.number} récupérée${balance ? ` · solde ${money(balance)} encaissé` : ''}`,
        data: { orderId: order.id, status: 'picked_up' },
      }
    },
    async undo(ctx, entry) {
      const order = await ctx.payload.findByID({ collection: 'orders', id: entry.entityId, ...SYS })
      if (order.status !== 'picked_up') refuse('undo_state', `la commande ${order.number} a changé depuis.`)
      await revert(ctx, order.id, entry.before, 'Annulé : pas encore remise')
      return { message: `Commande ${order.number} : retour à « ${{ ready: 'Prête', paid: 'Payée' }[entry.before.status] || 'Non récupérée'} ».` }
    },
  },

  // Commande téléphone: the same queue and pools as the web (16 §3.2, 10 §3.3) through createOrder.
  'order.phone': {
    async run(ctx, input) {
      const items = []
      for (const raw of [].concat(input.items || [])) {
        const [productId, variantIndex, qty] = String(raw).split('.')
        if (int(qty) > 0) items.push({ productId: int(productId), variantIndex: int(variantIndex) || 0, qty: int(qty), message: str(input[`message_${productId}_${variantIndex}`], 80) })
      }
      const byLink = input.payment === 'lien'
      const result = await createOrder(ctx.payload, {
        source: 'phone',
        items,
        pickup: { date: str(input.date, 10), windowStart: str(input.windowStart, 5) },
        customer: { firstName: str(input.firstName, 60), lastName: str(input.lastName, 60), phone: str(input.phone, 30), email: str(input.email, 120), language: ['fr', 'en', 'es'].includes(input.language) ? input.language : 'fr' },
        payment: { provider: byLink ? 'stripe' : 'counter' },
        allergyNote: str(input.allergyNote, 500),
        req: { user: ctx.user },
        holdMinutes: byLink ? 30 : undefined,
        now: ctx.now,
      })
      if (result.errors?.length) {
        const e = result.errors[0]
        const alt = (e.alternatives || []).map((w) => clockFr(w.start)).join(' · ')
        refuse(e.code, `${e.message}${alt ? ` Les plus proches : ${alt}` : ''}${e.nextDay ? ` Prochaine journée libre : ${shortDay(e.nextDay)}.` : ''}`, 422, { errors: result.errors })
      }
      const order = result.order
      const queued = await ctx.payload.find({ collection: 'messages', where: { and: [{ order: { equals: order.id } }, { status: { equals: 'queued' } }] }, limit: 10, ...SYS })
      // The confirmation (sent now + 5 s by createOrder) waits for Studio's undo window; the day-before reminder keeps its time.
      await holdMessages(ctx.payload, queued.docs.filter((m) => m.template !== 'order_reminder'), ctx.undoUntil)
      if (byLink && result.paymentLink && order.customer?.phone) {
        const f = await facts(ctx.payload)
        const m = await enqueueMessage(ctx.payload, { channel: 'sms', template: 'payment_link', to: order.customer.phone, language: order.locale, orderId: order.id, body: studioSms('payment_link', order.locale, { number: order.number, link: result.paymentLink, phone: f.phone }) })
        await holdMessages(ctx.payload, [m], ctx.undoUntil)
      }
      return {
        entity: 'orders',
        entityId: order.id,
        before: null,
        after: { number: order.number, status: order.status, source: 'phone', payment: byLink ? 'lien' : 'comptoir' },
        summary: sentence(ctx.user, ctx.device, `a pris la commande téléphone ${order.number}`, ctx.now),
        message: `Commande ${order.number} créée · ${byLink ? 'lien de paiement par texto' : 'à payer au comptoir'} · confirmation au client dans 30 s`,
        data: { orderId: order.id, number: order.number, redirect: `/commandes/${order.id}/` },
      }
    },
    async undo(ctx, entry) {
      const order = await ctx.payload.findByID({ collection: 'orders', id: entry.entityId, ...SYS })
      if (order.payment?.status === 'paid') refuse('undo_state', `la commande ${order.number} est déjà payée : annulez-la avec un remboursement.`)
      await cancelQueued(ctx.payload, { orderId: order.id })
      if (order.payment?.provider === 'stripe' && order.payment?.reference) await cancelIntent(order.payment.reference)
      await ctx.payload.update({ collection: 'orders', id: order.id, data: { status: 'cancelled', holdExpiresAt: null, timeline: pushTimeline(order, timelineEntry(ctx, 'cancelled', 'Commande téléphone annulée (« Annuler »)')) }, ...SYS })
      return { message: `Commande ${order.number} annulée · rien n’est parti au client.` }
    },
  },

  // « Proposer un autre créneau »: the customer chooses; Studio never moves a confirmed pickup (G12).
  'order.otherSlot': {
    async run(ctx, input) {
      const order = await load(ctx, 'orders', input.orderId)
      if (!['paid', 'ready'].includes(order.status)) refuse('state', `la commande ${order.number} n’est plus prévue.`)
      if (!order.customer?.phone) refuse('no_phone', 'Pas de téléphone au dossier : appelez ou écrivez au client.', 422)
      const f = await facts(ctx.payload)
      const m = await enqueueMessage(ctx.payload, { channel: 'sms', template: 'other_slot', to: order.customer.phone, language: order.locale, orderId: order.id, body: studioSms('other_slot', order.locale, { number: order.number, phone: f.phone }) })
      await holdMessages(ctx.payload, [m], ctx.undoUntil)
      await ctx.payload.update({ collection: 'orders', id: order.id, data: { timeline: pushTimeline(order, timelineEntry(ctx, order.status, 'Autre créneau proposé par texto')) }, ...ctx.write, depth: 0 })
      return {
        entity: 'orders',
        entityId: order.id,
        before: null,
        after: { message: m?.id || null },
        summary: sentence(ctx.user, ctx.device, `a proposé un autre créneau pour la commande ${order.number}`, ctx.now),
        message: `Texto à ${customerName(order.customer)} dans 30 s : on lui demande d’appeler pour choisir une heure.`,
        data: { messageId: m?.id || null },
      }
    },
    async undo(ctx, entry) {
      await cancelQueued(ctx.payload, { orderId: entry.entityId, template: 'other_slot' })
      return { message: 'Annulé · le texto ne part pas.' }
    },
  },

  // Owner and manager: after the effects preview, with a reason. Paid online → a 15-day refund timer (07 A9).
  'order.cancel': {
    async run(ctx, input) {
      const order = await load(ctx, 'orders', input.orderId)
      const reason = str(input.reason, 300)
      if (!reason) refuse('reason_required', 'Indiquez la raison de l’annulation.', 422)
      moveOrFail(order, 'cancelled', ctx.user.role)
      const paid = order.payment?.status === 'paid'
      const refundDueBy = paid ? new Date(ctx.now.getTime() + REFUND_DAYS * 86400000).toISOString() : null
      await cancelQueued(ctx.payload, { orderId: order.id })
      // A payment page still open must not bring the order back: its intent is cancelled first (settle.js
      // records a payment that slips through anyway as a refund due, never as a confirmed order).
      if (!paid && order.payment?.provider === 'stripe' && order.payment?.reference) await cancelIntent(order.payment.reference)
      await ctx.payload.update({
        collection: 'orders',
        id: order.id,
        data: { status: 'cancelled', payment: refundDueBy ? { refundDueBy } : {}, timeline: pushTimeline(order, timelineEntry(ctx, 'cancelled', `Annulée : ${reason}`)) },
        ...ctx.write,
        depth: 0,
      })
      return {
        entity: 'orders',
        entityId: order.id,
        before: snapshot(order),
        after: { status: 'cancelled', reason, refundDueBy },
        summary: sentence(ctx.user, ctx.device, `a annulé la commande ${order.number} (${reason})`, ctx.now),
        message: `Commande ${order.number} annulée${refundDueBy ? ' · remboursement à faire d’ici 15 jours' : ''}`,
        noUndo: true,
      }
    },
  },

  'order.refund': {
    async run(ctx, input) {
      const order = await load(ctx, 'orders', input.orderId)
      const reason = str(input.reason, 300)
      if (!reason) refuse('reason_required', 'Indiquez la raison du remboursement.', 422)
      moveOrFail(order, 'refunded', ctx.user.role)
      const p = order.payment || {}
      const paidCents = p.kind === 'deposit' ? order.totals?.depositCents || p.amountCents : p.amountCents || order.totals?.totalCents
      if (!(p.status === 'paid' && paidCents > 0)) refuse('nothing_paid', `rien n’a été payé pour la commande ${order.number}.`)
      let reference = null
      let how = 'au comptoir'
      if (p.provider === 'stripe') {
        const stripe = stripeClient()
        if (!stripe || !p.reference) refuse('stripe_unavailable', 'Stripe n’est pas relié : remboursez dans le tableau de bord Stripe, puis réessayez.', 503)
        const refund = await stripe.refunds.create({ payment_intent: p.reference, amount: paidCents, metadata: { orderId: String(order.id), number: String(order.number) } }, { idempotencyKey: `refund-${order.id}-${paidCents}` })
        reference = refund.id
        how = 'par Stripe'
      } else if (p.provider === 'mock') {
        reference = `mock-refund-${order.id}`
        how = 'simulé (démo)'
      }
      await cancelQueued(ctx.payload, { orderId: order.id })
      await ctx.payload.update({
        collection: 'orders',
        id: order.id,
        data: { status: 'refunded', payment: { status: 'refunded', refundDueBy: null }, timeline: pushTimeline(order, timelineEntry(ctx, 'refunded', `Remboursée ${money(paidCents)} ${how} : ${reason}${reference ? ` (${reference})` : ''}`)) },
        ...ctx.write,
        depth: 0,
      })
      return {
        entity: 'orders',
        entityId: order.id,
        before: snapshot(order),
        after: { status: 'refunded', amountCents: paidCents, reason, reference, how },
        summary: sentence(ctx.user, ctx.device, `a remboursé ${money(paidCents)} pour la commande ${order.number} (${reason})`, ctx.now),
        message: `${money(paidCents)} remboursés ${how} · commande ${order.number}`,
        noUndo: true,
      }
    },
  },

  // Printed production sheet: the snapshot lets the screen show « Modifié après impression » (10 §7).
  'production.print': {
    async run(ctx, input) {
      const date = str(input.date, 10)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) refuse('date', 'Date invalide.', 422)
      let list = []
      try {
        list = JSON.parse(String(input.snapshot || '[]'))
      } catch {
        list = []
      }
      return {
        entity: 'production',
        entityId: date,
        before: null,
        after: { date, list },
        summary: sentence(ctx.user, ctx.device, `a imprimé la production du ${date}`, ctx.now),
        message: 'Liste imprimée · les changements après cette heure seront signalés.',
        noUndo: true,
      }
    },
  },
}
