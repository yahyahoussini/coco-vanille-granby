// « À faire » on Aujourd'hui: at most 3 cards, filtered by role (16 §3.1, §4.5). Shop work first:
// late answers, unpicked orders after closing, failed textos, the display-case photo, holidays to confirm.
import { canSee } from './roles.js'
import { answerTimer, stars, customerName, money } from './format.js'
import { shortDay, addDays, localParts, closingOf, toMinutes, dayBounds, relative } from './time.js'
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

  // « Écrivez-nous »: someone wrote on the site and waits for the shop (one card: that person, or how many).
  if (canSee(user, 'messages')) {
    const inbox = await payload.find({ collection: 'conversations', where: { unreadForShop: { greater_than: 0 } }, sort: '-lastMessageAt', limit: 3, depth: 0, overrideAccess: true }).catch(() => null)
    const latest = inbox?.docs?.[0]
    if (latest) {
      const n = inbox.totalDocs || inbox.docs.length
      const said = String((latest.messages || []).filter((m) => m.from === 'client').at(-1)?.text || '').replace(/\s+/g, ' ')
      const waiting = inbox.docs.some((c) => now.getTime() - new Date(c.lastMessageAt).getTime() > 2 * 3600000)
      cards.push({
        key: 'chat',
        rank: 1,
        tone: waiting ? 'warn' : undefined,
        title: n > 1 ? `${n} messages du site à lire` : `Message du site · ${latest.name || 'internaute'}`,
        why: `${n > 1 ? 'Dernier : ' : ''}« ${said.length > 80 ? `${said.slice(0, 79)}…` : said} » · ${relative(latest.lastMessageAt, now)}`,
        href: n > 1 ? '/messages/' : `/messages/${latest.id}/`,
        action: 'Répondre',
      })
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

  // Reservations made on the site since yesterday, whatever their pickup day: nothing else tells the team while no text leaves.
  if (canSee(user, 'commandes') && user.role !== 'agence') {
    const since = new Date(now.getTime() - 24 * 3600000).toISOString()
    const fresh = await payload.count({ collection: 'orders', where: { and: [{ source: { equals: 'web' } }, { createdAt: { greater_than_equal: since } }, { status: { in: ['paid', 'ready'] } }] }, overrideAccess: true }).catch(() => null)
    if (fresh?.totalDocs) cards.push({ key: 'fresh', rank: 1, title: `${fresh.totalDocs} ${fresh.totalDocs > 1 ? 'réservations reçues' : 'réservation reçue'} sur le site depuis hier`, why: 'À préparer pour leur jour de cueillette.', href: '/commandes/', action: 'Voir' })
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
  // The launch list (2026-11-03): what the agency filled in with approximations, for the owner to check. After the shop's work.
  if (['proprietaire', 'gerant'].includes(user.role)) {
    const count = async (collection, where) => (await payload.count({ collection, where, overrideAccess: true }).catch(() => null))?.totalDocs ?? 0
    if (!(await count('push-subscriptions', { user: { exists: true } }))) cards.push({ key: 'push', rank: 4, title: 'Recevoir les nouvelles commandes sur votre téléphone', why: 'Sans alerte, une réservation ne se voit que Studio ouvert : aucun courriel ni texto ne part encore.', href: '/plus/reglages/#alertes-section', action: 'Activer' })
    const facts = await count('site-facts', { proposed: { equals: true } })
    if (facts) cards.push({ key: 'facts', rank: 5, title: `${facts} ${facts > 1 ? 'réponses du site' : 'réponse du site'} à vérifier`, why: 'Le site affiche des réponses proposées par l’agence : lisez-les et touchez « C’est bon », ou changez-les.', href: '/plus/faits/', action: 'Vérifier' })
    const prices = await count('products', { and: [{ priceEstimated: { equals: true } }, { availability: { not_equals: 'discontinued' } }] })
    if (prices) cards.push({ key: 'prices', rank: 6, title: `${prices} ${prices > 1 ? 'produits' : 'produit'} : prix à vérifier`, why: 'Le site affiche « prix indicatif », et une réservation garde le prix affiché.', href: '/plus/produits/?vue=prix', action: 'Vérifier' })
    const allergens = await count('products', { and: [{ 'allergensVerified.at': { exists: false } }, { _status: { equals: 'published' } }, { availability: { not_equals: 'discontinued' } }] })
    if (allergens) cards.push({ key: 'allergens', rank: 7, title: `${allergens} ${allergens > 1 ? 'fiches' : 'fiche'} d’allergènes à cocher`, why: 'Sans cette vérification, le site invite le client à appeler avant de commander.', href: '/plus/produits/?vue=allergenes', action: 'Cocher' })
  }
  return pickCards(cards)
}
