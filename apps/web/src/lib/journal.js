// The Journal (blog): every rule the posts collection, the public pages, Studio « Journal » and the journal seed
// share. A post is French first, published per language (state, stateEn), public once its day has come (6 h,
// Granby time), and checked before it goes out (checkPost). Pure module (relative imports only) for node --test
// and the Payload config.
import { PAGES, pathFor, SITE_ORIGIN } from './routes.js'
import { containsMarker, MARKER_RE } from './facts.js'
import { hasCopy } from './publish.js'
import { PHOTOS } from './photos.js'
import { localParts, zonedTime, addDays, weekdayOf, TZ } from './studio/time.js'
import { countWords, firstSentence, POST_BANNED } from './copy-rules.js'

export const POST_CATEGORIES = ['conseils', 'histoire', 'granby', 'boutique']
export const CATEGORY_LABELS = {
  fr: { conseils: 'Conseils', histoire: 'Histoire', granby: 'Granby', boutique: 'La boutique' },
  en: { conseils: 'Tips', histoire: 'History', granby: 'Granby', boutique: 'The shop' },
  es: { conseils: 'Consejos', histoire: 'Historia', granby: 'Granby', boutique: 'La tienda' },
}
// Illustrations a post may show until the shop's own photo replaces it (src/lib/photos.js). Not the map or the Zoo
// photo (real places, with their own licence), and no picture that could pass for the shop's kitchen or its chef.
export const POST_PHOTO_KEYS = [
  'hero', 'viennoiseries', 'pains', 'patisseries', 'gateaux', 'cafe', 'vitrine', 'boite', 'parts', 'gateau-fete', 'buche', 'boulangerie', 'ingredients', 'pause',
  'croissant-aux-amandes', 'paris-brest', 'vol-au-vent', 'shortcake-aux-fraises', 'croissant-au-beurre', 'gateau-au-chocolat',
]
export const RESERVED_SLUGS = ['page', 'categorie', 'category', 'flux', 'feed', 'tout-sur-la-vanille'] // last one: abandoned in docs/17 §6
export const PAGE_SIZE = 12
export const CATEGORY_MIN_POSTS = 6 // archive pages only from this count (not built in v1)
export const RELEASE_TIME = '06:00' // Granby time (America/Toronto), the hour a dated post goes public
export const RELATED_EXCLUDED = ['home', 'journal']
// Sources a post may list (the collection's maxRows and the Studio editor's rows).
export const MAX_SOURCES = 20

export const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/
// A year in the answer (its dated fact): 1000 to 2099, since a history post dates its fact centuries ago (« attesté
// dès 1750 »), as well as a page dates its own (« au 22 octobre 2026 »).
const YEAR_RE = /\b(1\d|20)\d{2}\b/
const BRAND_OR_PLACE = /Pâtisserie Coco Vanille|Granby/

// Registry pages a post may link to (2 to 4): every public page except the home page and the Journal itself.
export const RELATABLE = PAGES.filter((p) => p.status !== 'utility' && !RELATED_EXCLUDED.includes(p.key)).map((p) => p.key)

// ---------- Field rules (the collection, Studio and the seed say the same thing) ----------

// docs/17 §7: lowercase, unaccented, hyphens, never a year. → true or the French reason.
export function slugError(value) {
  if (!SLUG_RE.test(value || '') || value.length < 3 || value.length > 80) return 'Minuscules, chiffres et traits d’union (3 à 80).'
  if (RESERVED_SLUGS.includes(value)) return 'Adresse réservée.'
  if (/(^|-)(19|20)\d\d(-|$)/.test(value)) return 'Jamais d’année dans l’adresse (docs/17 §7).'
  return null
}

export function relatedError(value) {
  const list = Array.isArray(value) ? value : []
  if (list.length < 2 || list.length > 4) return 'De 2 à 4 pages liées.'
  if (new Set(list).size !== list.length) return 'Une page liée apparaît deux fois.'
  const unknown = list.filter((k) => !RELATABLE.includes(k))
  return unknown.length ? `Pages inconnues : ${unknown.join(', ')}` : null
}

export const photoKnown = (key) => POST_PHOTO_KEYS.includes(key) && Object.hasOwn(PHOTOS, key)

// ---------- URLs ----------

const prefixOf = (locale) => (locale === 'fr' ? '' : `/${locale}`)

// Catch-all segments (no « en » prefix) → { type: 'post', slug } · { type: 'list', n } · null. « /journal/ » alone
// is the registry page and is not handled here; « /journal/page/1/ » is not a page (the index is page 1).
export function journalRoute(locale, segments = []) {
  const path = pathFor('journal', locale)
  if (!path) return null
  const base = path.slice(prefixOf(locale).length).split('/').filter(Boolean)
  if (segments.length <= base.length || base.some((b, i) => segments[i] !== b)) return null
  const rest = segments.slice(base.length)
  if (rest.length === 1) return SLUG_RE.test(rest[0]) && !RESERVED_SLUGS.includes(rest[0]) ? { type: 'post', slug: rest[0] } : null
  if (rest.length === 2 && rest[0] === 'page' && /^[1-9]\d{0,3}$/.test(rest[1]) && Number(rest[1]) >= 2) return { type: 'list', n: Number(rest[1]) }
  return null
}

export function postPath(post, locale) {
  const base = pathFor('journal', locale)
  return base && post?.slug ? `${base}${post.slug}/` : null
}

export const postUrl = (post, locale) => {
  const p = postPath(post, locale)
  return p ? `${SITE_ORIGIN}${p}` : null
}

export function listPath(locale, n = 1) {
  const base = pathFor('journal', locale)
  if (!base) return null
  return n === 1 ? base : `${base}page/${n}/`
}

// ---------- Dates (Granby time) ----------

// The Granby calendar day of a stored value: « 2026-11-02 » as written, an instant in America/Toronto.
export function dayOfPost(value) {
  if (!value) return null
  if (typeof value === 'string' && DAY_RE.test(value)) return value
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? null : localParts(d).iso
}

// 06:00 Granby on that day (11:00 UTC in November, EST).
export const releaseInstant = (dateISO) => zonedTime(String(dateISO).slice(0, 10), RELEASE_TIME)

const offsetFmt = new Intl.DateTimeFormat('en-CA', {
  timeZone: TZ,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
  timeZoneName: 'longOffset',
})

// « 2026-11-02T06:00:00-05:00 »: the byline's <time>, the JSON-LD dates and the sitemap say the same instant.
export function isoWithOffset(date) {
  const d = new Date(typeof date === 'string' && DAY_RE.test(date) ? releaseInstant(date) : date)
  if (Number.isNaN(d.getTime())) return null
  const p = Object.fromEntries(offsetFmt.formatToParts(d).map((x) => [x.type, x.value]))
  const offset = (p.timeZoneName || 'GMT').replace('GMT', '') || '+00:00'
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}${offset}`
}

// The Monday (ISO date) of the week, Monday to Sunday in Granby time: at most one post per week (§14).
export function weekKey(date) {
  const day = dayOfPost(date)
  if (!day) return null
  const idx = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].indexOf(weekdayOf(day))
  return addDays(day, -idx)
}

// « Mis à jour » only after a real change on a later day (Studio « Changement important »).
export function dateModifiedOf(post) {
  const published = post?.publishedAt
  const changed = post?.contentUpdatedAt
  if (changed && dayOfPost(changed) > dayOfPost(published)) return changed
  return published
}

// ---------- Publish guard ----------

const between = (n, min, max) => n >= min && n <= max

export const postReady = (doc) =>
  hasCopy(doc) &&
  Boolean(doc.h1 && doc.answer && doc.slug) &&
  between((doc.sections || []).length, 3, 6) &&
  between((doc.faq || []).length, 5, 8) &&
  !containsMarker(doc)

const newestFirst = (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime() || Number(b.id) - Number(a.id) || String(b.id).localeCompare(String(a.id))

// fr, en: the same post documents read in each language (state, stateEn and publishedAt are shared).
// base: lib/publish.js servedByLocale (the registry pages served, before the Journal gate).
//   show: a published, due post renders (a marker shows; the page is noindex while one remains).
//   strict: only with every field and no marker, and only once its language has a home page.
// English follows French: never served without the same post served in French.
// → { fr, en, ids: { fr: Map(id → slug), en: Map(id → slug) } }, newest first.
export function servedPosts({ fr = [], en = [] } = {}, { strict = false, now = new Date(), base = {} } = {}) {
  const at = new Date(now).getTime()
  const due = (p) => p?.state === 'published' && p.publishedAt && new Date(p.publishedAt).getTime() <= at && Boolean(p.slug)
  const frList = fr.filter((p) => due(p) && (!strict || (Boolean(base.fr?.has('home')) && postReady(p)))).sort(newestFirst)
  const frIds = new Map(frList.map((p) => [p.id, p.slug]))
  const enList = en
    .filter((p) => frIds.has(p.id) && due(p) && p.stateEn === 'published' && hasCopy(p) && (!strict || (Boolean(base.en?.has('home')) && postReady(p))))
    .sort(newestFirst)
  return { fr: frList, en: enList, ids: { fr: frIds, en: new Map(enList.map((p) => [p.id, p.slug])) } }
}

// Under strict, an index with no post is not served (no thin empty page, no link to it). Show: unchanged.
export function withJournal(base, counts = {}, { strict = false } = {}) {
  if (!strict) return base
  const out = {}
  for (const [locale, keys] of Object.entries(base)) {
    const next = new Set(keys)
    if (!(counts[locale] > 0)) next.delete('journal')
    out[locale] = next
  }
  return out
}

// hreflang on a post: both languages, or nothing at all.
export function postAlternates(post, servedIds = {}) {
  const fr = servedIds.fr?.get?.(post?.id)
  const en = servedIds.en?.get?.(post?.id)
  if (!fr || !en) return {}
  const frUrl = postUrl({ slug: fr }, 'fr')
  return { 'fr-CA': frUrl, 'en-CA': postUrl({ slug: en }, 'en'), 'x-default': frUrl }
}

// Page n of the list (newest first), or null past the last page.
export function paginate(list = [], n = 1) {
  const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE))
  if (!Number.isInteger(n) || n < 1 || n > pages) return null
  return { items: list.slice((n - 1) * PAGE_SIZE, n * PAGE_SIZE), page: n, pages, prev: n > 1 ? n - 1 : null, next: n < pages ? n + 1 : null }
}

// The newest served posts about a page (its key in their related pages).
export const latestFor = (posts = [], pageKey, max = 3) => posts.filter((p) => (p.related || []).includes(pageKey)).slice(0, max)

// A post's related pages that exist in this language and, given servedHere (strict), that the site answers.
export const relatedLinks = (post, locale, servedHere = null) => (post?.related || []).filter((key) => pathFor(key, locale) && (!servedHere || servedHere.has(key)))

// ---------- Checks (Studio « Contrôle », the seed and its test) ----------

const issue = (code, message) => ({ code, message })

// doc: a post read in `locale` (shared fields and that language's copy).
// others: the other posts in that language ({ id, slug, title, description, state, publishedAt }).
// pages: the registry pages' copy in that language ({ key, title, description }).
// served: the registry keys served in that language (warning W5 only).
// → { errors, warnings }: an error blocks « Publier » and the seed, a warning never does.
export function checkPost(doc = {}, locale = 'fr', { others = [], pages = [], served = null } = {}) {
  const errors = []
  const warnings = []
  const e = (code, message) => errors.push(issue(code, message))
  const w = (code, message) => warnings.push(issue(code, message))
  const text = (v) => (typeof v === 'string' ? v.trim() : '')
  const marked = (v) => MARKER_RE.test(String(v ?? ''))
  const rest = others.filter((o) => o && String(o.id) !== String(doc.id))

  const title = text(doc.title)
  if (!title || title.length > 60) e('E1', `Titre : ${title.length} caractères (1 à 60).`)
  if (marked(title)) e('E1', 'Titre : un fait manque dans le titre.')
  const description = text(doc.description)
  if (description.length < 140 || description.length > 160) e('E2', `Description : ${description.length} caractères (140 à 160).`)
  if (marked(description)) e('E2', 'Description : un fait manque dans la description.')
  if (!text(doc.h1)) e('E3', 'Titre de la page (h1) manquant.')
  else if (marked(doc.h1)) e('E3', 'Titre de la page (h1) : un fait manque.')

  const answer = text(doc.answer)
  const words = countWords(answer)
  if (words < 40 || words > 60) e('E4', `Réponse : ${words} mots (40 à 60).`)
  if (answer && !BRAND_OR_PLACE.test(answer.replace(/ /g, ' '))) e('E4', 'Réponse : nommer Pâtisserie Coco Vanille ou Granby.')
  if (answer && !YEAR_RE.test(answer)) e('E4', 'Réponse : un fait daté (une année).')

  const sections = doc.sections || []
  if (sections.length < 3 || sections.length > 6) e('E5', `${sections.length} sections (3 à 6).`)
  for (const s of sections) {
    if (!/\?$/.test(text(s?.heading))) e('E5', `Section « ${text(s?.heading) || '…'} » : la question finit par « ? ».`)
    if (!text(s?.answer)) e('E5', `Section « ${text(s?.heading) || '…'} » : la première phrase répond.`)
  }
  const faq = doc.faq || []
  if (faq.length < 5 || faq.length > 8) e('E6', `${faq.length} questions fréquentes (5 à 8).`)
  for (const f of faq) {
    if (!/\?$/.test(text(f?.question))) e('E6', `Question « ${text(f?.question) || '…'} » : finit par « ? ».`)
    if (!text(f?.answer)) e('E6', `Question « ${text(f?.question) || '…'} » : réponse manquante.`)
  }
  const questions = [...sections.map((s) => text(s?.heading)), ...faq.map((f) => text(f?.question))].filter(Boolean).map((q) => q.replace(/[\s  ]+/g, ' ').toLowerCase())
  if (new Set(questions).size !== questions.length) e('E6', 'Une question apparaît deux fois (sections et FAQ).')

  const note = typeof doc.changeNote === 'string' ? doc.changeNote : ''
  if (!note.trim() || /[\r\n]/.test(note) || note.trim().length > 160) e('E7', 'Note de mise à jour : une ligne, 160 caractères au plus.')

  const slugIssue = doc.slug ? slugError(doc.slug) : 'Adresse du billet manquante.'
  if (slugIssue) e('E8', `Adresse : ${slugIssue}`)
  else if (rest.some((o) => o.slug === doc.slug)) e('E8', 'Adresse déjà prise par un autre billet.')

  // Shared fields (the same in both languages).
  if (!POST_CATEGORIES.includes(doc.category)) e('E9', 'Catégorie inconnue.')
  if (!photoKnown(doc.photo)) e('E9', `Photo d’illustration inconnue : ${doc.photo ?? '—'}.`)
  const related = relatedError(doc.related)
  if (related) e('E9', related)
  const day = dayOfPost(doc.publishedAt)
  if (!day) e('E9', 'Date de publication invalide.')
  const sources = doc.sources || []
  if (!sources.length) e('E9', 'Au moins une source.')
  if (sources.length > MAX_SOURCES) e('E9', `${sources.length} sources (${MAX_SOURCES} au plus).`)
  for (const s of sources) {
    if (!/^https:\/\/[^\s]+$/.test(s?.url || '')) e('E9', `Source « ${s?.label || '…'} » : adresse https:// complète.`)
    if (!DAY_RE.test(s?.date || '')) e('E9', `Source « ${s?.label || '…'} » : date AAAA-MM-JJ.`)
    else if (day && s.date > day) e('E9', `Source « ${s?.label || '…'} » : datée après la publication.`)
    if (!text(s?.label)) e('E9', 'Une source sans nom.')
  }

  const copy = JSON.stringify([doc.title, doc.description, doc.h1, doc.answer, doc.sections, doc.faq, doc.changeNote])
  for (const [re, why] of POST_BANNED) if (re.test(copy)) e('E10', `Mot ou affirmation refusé (${why}).`)

  const same = (a, b) => text(a) && text(a) === text(b)
  if (rest.some((o) => same(o.title, title)) || pages.some((p) => same(p.title, title))) e('E11', 'Titre déjà utilisé par une autre page ou un autre billet.')
  if (rest.some((o) => same(o.description, description)) || pages.some((p) => same(p.description, description))) e('E11', 'Description déjà utilisée par une autre page ou un autre billet.')

  if (answer && !/Coco Vanille/.test(answer)) w('W1', 'La réponse ne nomme pas Coco Vanille.')
  for (const s of sections) {
    const n = countWords(s?.answer)
    if ((s?.answer && (n < 25 || n > 90)) || countWords(firstSentence(s?.answer)) > 45) w('W2', `Section « ${text(s?.heading)} » : réponse de ${n} mots (25 à 90, première phrase de 45 au plus).`)
  }
  const total = countWords([answer, ...sections.flatMap((s) => [s?.heading, s?.answer, s?.body, ...(s?.list || []).map((l) => l?.item)]), ...faq.flatMap((f) => [f?.question, f?.answer])].filter(Boolean).join(' '))
  if (total < 300) w('W3', `${total} mots en tout : un billet mince (300 au moins).`)
  if (containsMarker(doc)) w('W4', 'Un fait manque : caché en production tant que le fait manque.')
  if (served) for (const key of doc.related || []) if (!served.has(key)) w('W5', `Page liée pas encore en ligne dans cette langue : ${key} (le lien n’apparaît pas).`)
  const week = weekKey(doc.publishedAt)
  const clash = rest.find((o) => o.state === 'published' && week && weekKey(o.publishedAt) === week)
  if (clash) w('W6', `Un autre billet paraît la même semaine : « ${clash.title || clash.slug || clash.id} ».`)
  return { errors, warnings }
}
