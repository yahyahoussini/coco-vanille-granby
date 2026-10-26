// Shop status wording for Aujourd'hui and Boutique & heures (16 §3.1, §3.6).
import { shopStatus, clockFr, clockOf, localParts } from './time.js'
import { whenFr } from './format.js'
import { marker } from '../facts.js'

const active = (g, now) => Boolean(g?.active) && (!g.until || new Date(g.until).getTime() > new Date(now).getTime())

export function statusLine(shop = {}, now = new Date()) {
  const s = shopStatus(shop, now)
  const next = s.next ? whenFr(s.next, now) : null
  switch (s.state) {
    case 'closure':
      return { tone: 'bad', icon: '×', text: s.until ? `Fermeture exceptionnelle jusqu’à ${whenFr(s.until, now)}` : 'Fermeture exceptionnelle · jusqu’à réouverture', state: s.state }
    case 'open':
      return { tone: 'ok', icon: '●', text: `Ouvert · ferme à ${clockFr(s.closes)}${s.toConfirm ? ' (à confirmer)' : ''}`, state: s.state }
    case 'before':
      return { tone: 'warn', icon: '◷', text: `Ouvre à ${clockFr(s.opens)}`, state: s.state }
    case 'after':
      return { tone: 'muted', icon: '○', text: `Fermé pour aujourd’hui${next ? ` · prochaine ouverture : ${next}` : ''}`, state: s.state }
    case 'closed':
      return { tone: 'muted', icon: '○', text: `Fermé aujourd’hui${next ? ` · prochaine ouverture : ${next}` : ''}`, state: s.state }
    default:
      return { tone: 'warn', icon: '?', text: `Heures à confirmer · ${marker('heures d’ouverture')}`, state: 'unknown' }
  }
}

// Amber/red banners: closure, busy mode, online pause.
export function shopBanners(shop = {}, now = new Date()) {
  const out = []
  if (active(shop.closure, now)) out.push({ key: 'closure', tone: 'bad', text: shop.closure.until ? `Fermeture exceptionnelle jusqu’à ${whenFr(shop.closure.until, now)}` : 'Fermeture exceptionnelle', action: 'shop.reopen', label: 'Rouvrir maintenant' })
  const b = shop.busy || {}
  if (b.extraMinutes > 0 && (!b.until || new Date(b.until) > new Date(now))) {
    const span = b.extraMinutes >= 60 && b.extraMinutes % 60 === 0 ? `${b.extraMinutes / 60} h` : `${b.extraMinutes} min`
    out.push({ key: 'busy', tone: 'warn', text: `Délai allongé de ${span}${b.until ? ` jusqu’à ${clockOf(b.until)}` : ''}`, action: 'shop.busyStop', label: 'Arrêter' })
  }
  if (active(shop.onlinePause, now)) out.push({ key: 'pause', tone: 'warn', text: `Commandes en ligne en pause${shop.onlinePause.until ? ` jusqu’à ${whenFr(shop.onlinePause.until, now)}` : ''}`, action: 'shop.resume', label: 'Reprendre' })
  return out
}

export const todayLocal = (now = new Date()) => localParts(now).iso
