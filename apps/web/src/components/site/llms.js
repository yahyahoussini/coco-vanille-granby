// /llms.txt body (llmstxt.org format, 08 P13): the same facts as the site's JSON-LD and links to the key pages.
// Pure (node --test): facts come from bakeryNode(), the very function that writes the Bakery node, so the two
// cannot drift; a fact missing there is missing here too. No new claim, no marker.
import { bakeryNode, graph } from '../../lib/schema.js'
import { closureNotice } from '../../lib/studio/closure.js'
import { hoursSummary, upcomingSpecialDays } from './hours.js'

const LABELS = {
  fr: {
    intro: 'Faits publiés (identiques aux données structurées schema.org Bakery du site) :',
    name: 'Nom',
    alternateName: 'Autre graphie',
    address: 'Adresse',
    telephone: 'Téléphone',
    email: 'Courriel',
    hours: 'Heures',
    special: 'Jours spéciaux',
    closed: 'fermé',
    geo: 'Coordonnées',
    map: 'Carte',
    sameAs: 'Page officielle',
    languages: 'Langues de service',
    priceRange: 'Gamme de prix',
    url: 'Site',
    main: 'Pages principales',
    more: 'Autres pages',
    journal: 'Journal',
    optional: 'Optional',
  },
  en: { main: 'English', journal: 'Journal (English)' },
}

const line = (label, value) => (value ? `- ${label} : ${value}` : null)

const hhmm = (v) => String(v || '').replace(/^(\d{2}):(\d{2})$/, (_, h, m) => `${Number(h)} h${m === '00' ? '' : ` ${m}`}`)

// The same Bakery node as every page (special days and an exceptional closure included), and the banner's
// sentence when the shop is closed.
export function factLines(business, shop, { now = new Date() } = {}) {
  const node = graph([bakeryNode(business, shop, 'fr', upcomingSpecialDays(shop, { now }), { now })])['@graph'][0] || {}
  const l = LABELS.fr
  const special = (node.specialOpeningHoursSpecification || []).map((d) => `${d.validFrom} ${d.opens === '00:00' && d.closes === '00:00' ? l.closed : `${hhmm(d.opens)} – ${hhmm(d.closes)}`}`).join('; ')
  const notice = closureNotice(shop || {}, 'fr', now)
  const a = node.address || {}
  const address = [a.streetAddress, a.addressLocality, [a.addressRegion, a.postalCode].filter(Boolean).join(' '), a.addressCountry].filter(Boolean).join(', ')
  const hours = node.openingHoursSpecification?.length ? hoursSummary(shop?.hours, 'fr') : null
  return [
    line(l.name, node.name),
    line(l.alternateName, [].concat(node.alternateName || []).join(', ')),
    line(l.address, address),
    line(l.telephone, node.telephone && business?.phoneDisplay ? `${business.phoneDisplay} (${node.telephone})` : node.telephone),
    line(l.email, node.email),
    notice ? `- ${notice.text}` : null,
    line(l.hours, hours),
    line(l.special, special),
    line(l.geo, node.geo ? `${node.geo.latitude}, ${node.geo.longitude}` : null),
    line(l.map, node.hasMap),
    line(l.sameAs, [].concat(node.sameAs || []).join(', ')),
    line(l.languages, [].concat(node.knowsLanguage || []).join(', ')),
    line(l.priceRange, node.priceRange),
    line(l.url, node.url),
  ].filter(Boolean)
}

const link = (p) => `- [${p.title}](${p.url})${p.description ? `: ${p.description}` : ''}`
// A Journal post: its h1, its publication day and its own description (no new claim).
const postLink = (p) => `- [${p.title}](${p.url})${p.date ? ` (${p.date})` : ''}${p.description ? `: ${p.description}` : ''}`
const POSTS_MAX = 20
const postsIn = (posts, locale) =>
  posts
    .filter((p) => p.locale === locale)
    .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))
    .slice(0, POSTS_MAX)

// pages: [{ key, locale, status, template, url, title, description }] already filtered by the publish guard.
// posts: [{ locale, url, title (the h1), description, date: 'YYYY-MM-DD' }] already filtered by the guard too.
export function buildLlmsTxt({ business, shop, pages = [], posts = [] }) {
  const l = LABELS.fr
  const fr = pages.filter((p) => p.locale === 'fr')
  const main = fr.filter((p) => p.status === 'core' && p.template !== 'legal')
  const more = fr.filter((p) => p.status === 'conditional')
  const legal = fr.filter((p) => p.template === 'legal')
  const en = pages.filter((p) => p.locale === 'en')
  const journalFr = postsIn(posts, 'fr')
  const journalEn = postsIn(posts, 'en')
  const sections = [
    `# ${business?.name || 'Pâtisserie Coco Vanille'}`,
    business?.categorySentence ? `> ${business.categorySentence}` : null,
    [l.intro, ...factLines(business, shop)].join('\n'),
    main.length ? [`## ${l.main}`, ...main.map(link)].join('\n') : null,
    more.length ? [`## ${l.more}`, ...more.map(link)].join('\n') : null,
    journalFr.length ? [`## ${l.journal}`, ...journalFr.map(postLink)].join('\n') : null,
    journalEn.length ? [`## ${LABELS.en.journal}`, ...journalEn.map(postLink)].join('\n') : null,
    en.length ? [`## ${LABELS.en.main}`, ...en.map(link)].join('\n') : null,
    legal.length ? [`## ${l.optional}`, ...legal.map(link)].join('\n') : null,
  ]
  return `${sections.filter(Boolean).join('\n\n')}\n`
}

