// Engine copy (10 §3.2): the same words on product cards, « Ma boîte », the checkout and Studio.
// Québec French first; EN/ES adapted. Pure module (relative imports only) so node --test can load it.
import { clock } from '../i18n.js'
import { marker } from '../facts.js'

const TAGS = { fr: 'fr-CA', en: 'en-CA', es: 'es' }
const firstOfMonth = (s) => s.replace(/(^|\s)1(\s)/, '$11er$2')

// « jeudi 29 oct. » · "Thursday, Oct 29" · « jueves, 29 oct »
export function dayLabel(iso, locale = 'fr') {
  if (!iso) return ''
  const text = new Intl.DateTimeFormat(TAGS[locale] || TAGS.fr, { weekday: 'long', day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(`${iso.slice(0, 10)}T12:00:00Z`))
  return locale === 'fr' ? firstOfMonth(text) : text
}

// « samedi 31 octobre » · "Saturday, October 31"
export function longDayLabel(iso, locale = 'fr') {
  if (!iso) return ''
  const text = new Intl.DateTimeFormat(TAGS[locale] || TAGS.fr, { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }).format(new Date(`${iso.slice(0, 10)}T12:00:00Z`))
  return locale === 'fr' ? firstOfMonth(text) : text
}

// « 10 h 15 à 10 h 30 » · "10:15 a.m. to 10:30 a.m."
export const windowLabel = (start, end, locale = 'fr') => (locale === 'en' ? `${clock(start, 'en')} to ${clock(end, 'en')}` : locale === 'es' ? `${clock(start, 'es')} a ${clock(end, 'es')}` : `${clock(start)} à ${clock(end)}`)

const strings = {
  fr: {
    readyToday: (time) => `Prête dès aujourd’hui, ${time}`,
    readyTomorrow: 'Prête dès demain',
    readyOn: (day) => `Prête dès ${day}`,
    cutoff: (time) => `Commandez avant ${time} pour demain`,
    cutoffMissing: `Commandez avant ${marker('heure limite pour le lendemain')} pour demain`,
    soldOut: 'Épuisé',
    backOn: (day) => `De retour le ${day}`,
    preorderFrom: (day) => `Précommande · prête dès le ${day}`,
    discontinued: 'Retiré de la carte',
    inStoreOnly: 'En boutique seulement',
    windowTaken: (list) => `Ce créneau vient d’être pris. Les plus proches : ${list}`,
    dayFull: (day) => `Complet ce jour-là. Prochaine date : ${day}`,
    closedOn: (day) => `Fermé le ${day}`,
    dateFirst: 'Choisissez d’abord votre journée de cueillette',
    missing: {
      hours: marker('heures d’ouverture confirmées par le propriétaire'),
      lead_time: marker('délai de préparation'),
      capacity: marker('capacité de production par jour'),
      windows: marker('durée des plages et nombre de commandes par plage'),
      date: marker('date de retour ou de mise en vente'),
    },
  },
  en: {
    readyToday: (time) => `Ready today from ${time}`,
    readyTomorrow: 'Ready tomorrow',
    readyOn: (day) => `Ready ${day}`,
    cutoff: (time) => `Order by ${time} for tomorrow`,
    cutoffMissing: `Order by ${marker('next-day cut-off time')} for tomorrow`,
    soldOut: 'Sold out',
    backOn: (day) => `Back on ${day}`,
    preorderFrom: (day) => `Pre-order · ready from ${day}`,
    discontinued: 'No longer on the menu',
    inStoreOnly: 'In store only',
    windowTaken: (list) => `That time was just taken. Closest: ${list}`,
    dayFull: (day) => `Full that day. Next date: ${day}`,
    closedOn: (day) => `Closed ${day}`,
    dateFirst: 'First, pick your pickup day',
    missing: {
      hours: marker('opening hours confirmed by the owner'),
      lead_time: marker('preparation lead time'),
      capacity: marker('daily production capacity'),
      windows: marker('pickup slot length and orders per slot'),
      date: marker('return or release date'),
    },
  },
  es: {
    readyToday: (time) => `Lista hoy desde las ${time}`,
    readyTomorrow: 'Lista mañana',
    readyOn: (day) => `Lista desde el ${day}`,
    cutoff: (time) => `Pida antes de las ${time} para mañana`,
    cutoffMissing: `Pida antes de las ${marker('hora límite para el día siguiente')} para mañana`,
    soldOut: 'Agotado',
    backOn: (day) => `Vuelve el ${day}`,
    preorderFrom: (day) => `Reserva · lista desde el ${day}`,
    discontinued: 'Ya no está en la carta',
    inStoreOnly: 'Solo en la tienda',
    windowTaken: (list) => `Ese horario se acaba de ocupar. Los más cercanos: ${list}`,
    dayFull: (day) => `Completo ese día. Próxima fecha: ${day}`,
    closedOn: (day) => `Cerrado el ${day}`,
    dateFirst: 'Primero, elija su día de recogida',
    missing: {
      hours: marker('horario confirmado por el propietario'),
      lead_time: marker('plazo de preparación'),
      capacity: marker('capacidad de producción diaria'),
      windows: marker('duración de las franjas y pedidos por franja'),
      date: marker('fecha de regreso o de lanzamiento'),
    },
  },
}

export const engineLabels = (locale) => strings[locale] || strings.fr
