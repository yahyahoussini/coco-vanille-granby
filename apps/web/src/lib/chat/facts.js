// Everything the « Écrivez-nous » widget may say without asking the server, read from the business and shop
// records (zero invention: a missing fact is null and the widget leaves its answer out). Links go only to pages
// the site answers (`served`, lib/publish.js): the visitor's language first, else the French page (French
// first), else null. Pure and serialisable (a server component hands it to the client widget); node --test.
import { pathFor } from '../routes.js'
import { normalizePhone, phoneDisplay } from '../ordering/customer.js'
import { hoursSummary, pillSchedule, upcomingSpecialDays } from '../../components/site/hours.js'

const LOCALES = ['fr', 'en', 'es']
const text = (v) => (typeof v === 'string' && v.trim() ? v.trim() : null)

function addressLine(address = {}, locale) {
  const streetFr = text(address?.street)
  if (!streetFr) return null
  const street = locale === 'fr' ? streetFr : streetFr.replace(/^(\d+),\s*/, '$1 ')
  const city = text(address.city) || 'Granby'
  const postal = text(address.postalCode) || ''
  if (locale === 'fr') return `${street}, ${city} (Québec) ${postal}`.trim()
  return `${street}, ${city}, ${locale === 'es' ? 'Quebec' : 'Québec'} ${postal}`.trim()
}

const active = (g, now) => Boolean(g?.active) && (!g.until || new Date(g.until).getTime() > new Date(now).getTime())

export function chatFacts({ business = {}, shop = {}, locale = 'fr', served = null, now = new Date() } = {}) {
  const l = LOCALES.includes(locale) ? locale : 'fr'
  const b = business || {}
  const s = shop || {}
  const answers = (key, lang) => Boolean(pathFor(key, lang)) && (!served || Boolean(served[lang]?.has(key)))
  const link = (key) => {
    for (const lang of [...new Set([l, 'fr'])]) if (answers(key, lang)) return pathFor(key, lang)
    return null
  }
  const order = link('commander')
  const phone = normalizePhone(b.phone) || null
  const mobileDisplay = text(b.mobileDisplay)
  const mobile = normalizePhone(b.mobile) || normalizePhone(mobileDisplay) || null
  const facebook = (Array.isArray(b.sameAs) ? b.sameAs : []).find((x) => x?.verified && /^https:\/\/(www\.|m\.)?facebook\.com\/\S+$/i.test(String(x.url || '')))
  return {
    enabled: s.chat?.enabled !== false,
    locale: l,
    name: text(b.name) || 'Pâtisserie Coco Vanille',
    hours: hoursSummary(s.hours || [], l) || null,
    // The live « Ouvert / Fermé » line: regular week, closure, and three weeks of special days for « réouverture ».
    schedule: { ...pillSchedule(s, now), specialDays: upcomingSpecialDays(s, { now, days: 21 }) },
    address: addressLine(b.address, l),
    maps: text(b.google?.cid) ? `https://maps.google.com/?cid=${encodeURIComponent(b.google.cid.trim())}` : null,
    phone,
    phoneDisplay: phone ? text(b.phoneDisplay) || phoneDisplay(phone) : null,
    mobile: mobile && mobileDisplay ? mobile : null,
    mobileDisplay: mobile && mobileDisplay ? mobileDisplay : null,
    facebook: facebook ? facebook.url : null,
    orderingOpen: Boolean(s.ordering?.enabled) && !active(s.onlinePause, now),
    links: {
      order,
      cake: order ? `${order}#demande` : null,
      menu: link('carte'),
      visit: link('nous-trouver'),
      allergens: link('allergenes'),
      privacy: link('confidentialite'),
    },
  }
}
