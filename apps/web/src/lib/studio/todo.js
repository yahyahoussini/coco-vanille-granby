// « À faire » on Aujourd'hui: at most 3 cards, filtered by role (16 §3.1, §4.5). Shop work first:
// late answers, unpicked orders after closing, failed textos, the display-case photo, holidays to confirm.
import { canSee } from './roles.js'
import { answerTimer, stars, customerName, money } from './format.js'
import { shortDay, addDays, localParts, closingOf, toMinutes, dayBounds } from './time.js'
import { holidaySuggestions } from '../ordering/holidays.js'

export const MAX_CARDS = 3

export function pickCards(cards, max = MAX_CARDS) {
  return [...cards].sort((a, b) => a.rank - b.rank).slice(0, max)
}

export async function todoCards(ctx, { now = new Date(), shop = {}, todayOrders = [], photoToday = null } = {}) {
  const { payload, user } = ctx
  const as = { user, overrideAccess: false }
  const here = localParts(now)
  const cards = []

  if (canSee(user, 'demandes')) {
    const req = await payload.find({ collection: 'requests', where: { status: { equals: 'new' } }, sort: 'answerBy', limit: 3, depth: 0, ...as })
    for (const r of req.docs) {
      const t = answerTimer(r.answerBy, now)
      cards.push({
        key: `req-${r.id}`,
        rank: t.overdue ? 0 : 2,
        tone: t.overdue ? 'bad' : t.urgent ? 'warn' : undefined,
        title: `Demande · ${r.occasion}${r.guests ? ` · ${r.guests} pers.` : ''} · ${shortDay(r.eventDate)}`,
        why: t.text,
        href: `/demandes/#demande-${r.id}`,
        action: 'Ouvrir',
      })
    }
  }

  if (canSee(user, 'avis') && user.role !== 'agence') {
    const rev = await payload.find({ collection: 'reviews', where: { status: { equals: 'unanswered' } }, sort: 'rating', limit: 3, depth: 0, ...as })
    for (const r of rev.docs) {
      const t = answerTimer(new Date(new Date(r.receivedAt).getTime() + 24 * 3600000), now)
      cards.push({ key: `rev-${r.id}`, rank: r.rating <= 3 ? 1 : 3, tone: r.rating <= 3 ? 'warn' : undefined, title: `Avis ${r.rating}★ · brouillon prêt`, why: t.text, href: `/avis/#avis-${r.id}`, action: 'Ouvrir', label: stars(r.rating) })
    }
  }

  if (canSee(user, 'aujourdhui')) {
    // After closing: orders still on the shelf (16 §3.1 « 2 commandes non récupérées · [Décider] »).
    const closes = closingOf(shop, here.iso)
    if (closes && here.minutes >= toMinutes(closes)) {
      const left = todayOrders.filter((o) => ['paid', 'ready'].includes(o.status))
      if (left.length) cards.push({ key: 'unpicked', rank: 0, tone: 'bad', title: `${left.length} ${left.length > 1 ? 'commandes non récupérées' : 'commande non récupérée'}`, why: 'La boutique est fermée : garder pour demain ou annuler selon la politique.', href: '/commandes/?onglet=aujourdhui', action: 'Décider' })
    }
    const failed = await payload.find({ collection: 'messages', where: { and: [{ status: { equals: 'failed' } }, { updatedAt: { greater_than_equal: dayBounds(addDays(here.iso, -1)).from } }] }, limit: 3, depth: 1, overrideAccess: true })
    for (const m of failed.docs) {
      const order = m.order && typeof m.order === 'object' ? m.order : null
      cards.push({ key: `sms-${m.id}`, rank: 1, tone: 'bad', title: `Texto non livré${order ? ` à ${customerName(order.customer)}` : ''}`, why: order ? `Commande ${order.number}` : m.template, href: order ? `/commandes/${order.id}/` : '/commandes/', action: 'Appeler' })
    }
    const open = (shop.hours || []).some((h) => h.day === here.weekday)
    if (open && here.hh >= 10 && !photoToday && canSee(user, 'vitrine')) cards.push({ key: 'photo', rank: 4, title: 'Pas encore de photo de la vitrine aujourd’hui', why: 'La photo du jour s’affiche sur le site.', href: '/vitrine/#photo', action: 'Prendre la photo' })
  }

  if (['proprietaire', 'gerant'].includes(user.role)) {
    // Money received that must go back within 15 days (07 A9): a cancelled order paid anyway, a payment after
    // its slot was taken, a deposit for a quote that changed or ran out.
    const due = await payload.find({ collection: 'orders', where: { and: [{ 'payment.status': { equals: 'paid' } }, { 'payment.refundDueBy': { exists: true } }] }, sort: 'createdAt', limit: 3, depth: 0, ...as })
    for (const o of due.docs) {
      cards.push({ key: `refund-${o.id}`, rank: 0, tone: 'bad', title: `Remboursement à faire · commande ${o.number}`, why: `${money(o.payment.amountCents || o.totals?.totalCents)} d’ici le ${shortDay(String(o.payment.refundDueBy).slice(0, 10))}`, href: `/commandes/${o.id}/`, action: 'Ouvrir' })
    }
    const known = new Set((shop.specialDays || []).filter((d) => d.state && d.state !== 'to_confirm').map((d) => String(d.date).slice(0, 10)))
    const soon = holidaySuggestions(shop, { fromISO: here.iso }).filter((h) => h.date <= addDays(here.iso, 30) && !known.has(h.date))
    for (const h of soon.slice(0, 2)) cards.push({ key: `hol-${h.date}`, rank: 3, title: `Le ${shortDay(h.date)} approche : ouvert ou fermé?`, why: `${h.label || 'Jour férié'} · à confirmer`, href: '/boutique/#jours-speciaux', action: 'Choisir' })
  }
  return pickCards(cards)
}
