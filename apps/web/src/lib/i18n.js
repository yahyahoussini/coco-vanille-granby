// Interface strings. Québec French is the source; EN/ES are adaptations, never more complete (Loi 96).
const strings = {
  fr: {
    languageName: 'Français',
    skip: 'Aller au contenu',
    nav: { carte: 'Carte', commander: 'Commander', 'nous-trouver': 'Nous trouver', 'a-propos': 'À propos' },
    actions: { order: 'Commander', directions: 'Itinéraire', call: 'Appeler', request: 'Envoyer ma demande', addToBox: 'Ajouter à ma boîte', preorder: 'Précommander' },
    breadcrumbHome: 'Accueil',
    hours: 'Heures d’ouverture',
    closed: 'fermé',
    updated: 'Mis à jour le',
    published: 'Publié le',
    by: 'Par',
    faq: 'Questions fréquentes',
    keyFacts: 'En bref',
    allergens: 'Allergènes',
    mayContain: 'Peut contenir',
    priceFrom: 'à partir de',
    portions: 'portions',
    taxesExtra: 'taxes en sus',
    soldOut: 'Épuisé aujourd’hui',
    backSoon: 'De retour le',
    readyFrom: 'Prête dès',
    legal: 'Informations légales',
    privacy: 'Confidentialité',
    terms: 'Conditions de vente',
    cookies: 'Témoins',
    accessibility: 'Accessibilité',
    notFoundTitle: 'Oups, cette page s’est émiettée.',
    notFoundBody: 'La page demandée n’existe pas ou a changé d’adresse.',
    factNeeded: 'Information à confirmer',
    openNow: 'Ouvert',
    closedNow: 'Fermé',
    until: 'jusqu’à',
    weekdays: { Monday: 'lundi', Tuesday: 'mardi', Wednesday: 'mercredi', Thursday: 'jeudi', Friday: 'vendredi', Saturday: 'samedi', Sunday: 'dimanche' },
  },
  en: {
    languageName: 'English',
    skip: 'Skip to content',
    nav: { carte: 'Menu', commander: 'Order', 'nous-trouver': 'Visit', 'a-propos': 'About' },
    actions: { order: 'Order', directions: 'Directions', call: 'Call', request: 'Send my request', addToBox: 'Add to my box', preorder: 'Pre-order' },
    breadcrumbHome: 'Home',
    hours: 'Opening hours',
    closed: 'closed',
    updated: 'Updated',
    published: 'Published',
    by: 'By',
    faq: 'Frequently asked questions',
    keyFacts: 'At a glance',
    allergens: 'Allergens',
    mayContain: 'May contain',
    priceFrom: 'from',
    portions: 'servings',
    taxesExtra: 'plus taxes',
    soldOut: 'Sold out today',
    backSoon: 'Back on',
    readyFrom: 'Ready from',
    legal: 'Legal',
    privacy: 'Privacy',
    terms: 'Terms of sale',
    cookies: 'Cookies',
    accessibility: 'Accessibility',
    notFoundTitle: 'Oops, this page crumbled.',
    notFoundBody: 'The page you asked for does not exist or has moved.',
    factNeeded: 'To be confirmed',
    openNow: 'Open',
    closedNow: 'Closed',
    until: 'until',
    weekdays: { Monday: 'Monday', Tuesday: 'Tuesday', Wednesday: 'Wednesday', Thursday: 'Thursday', Friday: 'Friday', Saturday: 'Saturday', Sunday: 'Sunday' },
  },
  es: {
    languageName: 'Español',
    skip: 'Ir al contenido',
    nav: { carte: 'Carta', commander: 'Pedidos', 'nous-trouver': 'Cómo llegar', 'a-propos': 'Nosotros' },
    actions: { order: 'Pedir', directions: 'Cómo llegar', call: 'Llamar', request: 'Enviar mi solicitud', addToBox: 'Añadir a mi caja', preorder: 'Reservar' },
    breadcrumbHome: 'Inicio',
    hours: 'Horario',
    closed: 'cerrado',
    updated: 'Actualizado el',
    published: 'Publicado el',
    by: 'Por',
    faq: 'Preguntas frecuentes',
    keyFacts: 'En breve',
    allergens: 'Alérgenos',
    mayContain: 'Puede contener',
    priceFrom: 'desde',
    portions: 'porciones',
    taxesExtra: 'impuestos aparte',
    soldOut: 'Agotado hoy',
    backSoon: 'Vuelve el',
    readyFrom: 'Lista desde',
    legal: 'Información legal',
    privacy: 'Privacidad',
    terms: 'Condiciones de venta',
    cookies: 'Cookies',
    accessibility: 'Accesibilidad',
    notFoundTitle: 'Uy, esta página se desmoronó.',
    notFoundBody: 'La página no existe o cambió de dirección.',
    factNeeded: 'Por confirmar',
    openNow: 'Abierto',
    closedNow: 'Cerrado',
    until: 'hasta',
    weekdays: { Monday: 'lunes', Tuesday: 'martes', Wednesday: 'miércoles', Thursday: 'jueves', Friday: 'viernes', Saturday: 'sábado', Sunday: 'domingo' },
  },
}

export const t = (locale) => strings[locale] || strings.fr

// 12,50 $ (fr) · $12.50 (en) · 12,50 $ (es-CA style)
export function money(cents, locale = 'fr') {
  if (cents === null || cents === undefined) return null
  const tag = locale === 'en' ? 'en-CA' : 'fr-CA'
  return new Intl.NumberFormat(tag, { style: 'currency', currency: 'CAD' }).format(cents / 100)
}

// « 9 h » / « 16 h 30 » (fr) · "9 a.m." / "4:30 p.m." (en)
export function clock(hhmm, locale = 'fr') {
  if (!hhmm) return ''
  const [h, m] = hhmm.split(':').map(Number)
  if (locale === 'en') {
    const suffix = h < 12 ? 'a.m.' : 'p.m.'
    const h12 = h % 12 === 0 ? 12 : h % 12
    return m ? `${h12}:${String(m).padStart(2, '0')} ${suffix}` : `${h12} ${suffix}`
  }
  return m ? `${h} h ${String(m).padStart(2, '0')}` : `${h} h`
}

export function longDate(iso, locale = 'fr') {
  if (!iso) return ''
  const tag = locale === 'en' ? 'en-CA' : locale === 'es' ? 'es' : 'fr-CA'
  return new Intl.DateTimeFormat(tag, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Toronto' }).format(new Date(iso))
}
