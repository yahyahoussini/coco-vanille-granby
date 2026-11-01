// The Journal's first posts (src/seed/journal-posts.json), read, checked and typeset for the seed (journal.js) and
// its test (test/unit/journal-content.test.js). One object per post, French and English side by side (blog spec
// §2); French copy gets Québec typography (lib/typo.js frenchCopy), English is stored as typed. Pure: no database.
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { checkPost, dayOfPost, weekKey } from '../lib/journal.js'
import { frenchCopy } from '../lib/typo.js'
import { addDays, weekdayOf } from '../lib/studio/time.js'
import { pages as pageCopy } from './content.js'

// November–December 2026: one post a Monday (docs/14, blog spec §14).
export const FIRST_DAY = '2026-11-02'
export const LAST_DAY = '2026-12-21'
export const KEY_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/

// The exact key set at every level: [required, optional].
export const SHAPE = {
  post: [['key', 'category', 'publishedAt', 'photo', 'related', 'sources', 'fr'], ['en']],
  copy: [['slug', 'title', 'description', 'h1', 'answer', 'sections', 'faq', 'changeNote'], []],
  section: [['heading', 'answer'], ['body', 'list']],
  item: [['item'], []],
  faq: [['question', 'answer'], []],
  source: [['label', 'url', 'date'], []],
}

const FILE = new URL('./journal-posts.json', import.meta.url)
export const readJournalFile = (file = FILE) => JSON.parse(readFileSync(file, 'utf8'))

function keysProblems(obj, [required, optional], where) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return [`${where} : objet attendu`]
  const keys = Object.keys(obj)
  return [...required.filter((k) => !keys.includes(k)).map((k) => `${where} : « ${k} » manque`), ...keys.filter((k) => !required.includes(k) && !optional.includes(k)).map((k) => `${where} : « ${k} » inconnu`)]
}

// The §2 shape, at every level: no unknown or missing key.
export function shapeProblems(posts = []) {
  if (!Array.isArray(posts)) return ['journal-posts.json : un tableau de billets']
  return posts.flatMap((p, i) => {
    const at = `billet ${i + 1} (${p?.key || '?'})`
    const out = keysProblems(p, SHAPE.post, at)
    for (const s of p?.sources || []) out.push(...keysProblems(s, SHAPE.source, `${at} › source`))
    for (const locale of ['fr', 'en']) {
      const c = p?.[locale]
      if (!c) continue
      out.push(...keysProblems(c, SHAPE.copy, `${at} › ${locale}`))
      for (const s of c.sections || []) {
        out.push(...keysProblems(s, SHAPE.section, `${at} › ${locale} › section`))
        for (const it of s?.list || []) out.push(...keysProblems(it, SHAPE.item, `${at} › ${locale} › liste`))
      }
      for (const f of c.faq || []) out.push(...keysProblems(f, SHAPE.faq, `${at} › ${locale} › FAQ`))
    }
    return out
  })
}

// The series moved so its first post lands on `start` (a Monday), keeping order and the 7-day spacing.
function shifted(posts, start) {
  if (!start || !posts.length) return posts
  const first = posts[0].publishedAt
  const days = Math.round((new Date(`${start}T12:00:00Z`) - new Date(`${first}T12:00:00Z`)) / 86_400_000)
  return posts.map((p) => ({ ...p, publishedAt: addDays(p.publishedAt, days) }))
}

// The posts as the seed writes them: French typeset, dates moved by JOURNAL_START when given.
export function journalPosts({ start = null, posts = readJournalFile() } = {}) {
  return shifted(posts, start).map((p) => ({ ...p, fr: frenchCopy(p.fr), ...(p.en ? { en: p.en } : {}) }))
}

// A post read in one language, as lib/journal.js checkPost reads a stored one.
export const asDoc = (p, locale) => ({ id: p.key, key: p.key, state: 'published', category: p.category, publishedAt: p.publishedAt, photo: p.photo, related: p.related, sources: p.sources, ...(p[locale] || {}) })

const pagesIn = (locale) => pageCopy.filter((pg) => pg.locales[locale]).map((pg) => ({ key: pg.key, title: pg.locales[locale].title, description: pg.locales[locale].description }))

// Every ERROR of the file (shape, keys, dates, checkPost in each language), and the warnings. `start`: JOURNAL_START.
export function journalProblems({ start = null, posts = readJournalFile() } = {}) {
  const errors = [...shapeProblems(posts)]
  const warnings = []
  if (errors.length) return { errors, warnings }
  if (start && (!DAY_RE.test(start) || weekdayOf(start) !== 'Monday')) errors.push(`JOURNAL_START ${start} : un lundi AAAA-MM-JJ`)
  const keys = posts.map((p) => p.key)
  for (const k of keys) if (!KEY_RE.test(k || '') || k.length > 60) errors.push(`clé « ${k} » : minuscules, chiffres et traits d’union, 60 au plus`)
  if (new Set(keys).size !== keys.length) errors.push('une clé apparaît deux fois')
  posts.forEach((p, i) => {
    if (!DAY_RE.test(p.publishedAt || '') || weekdayOf(p.publishedAt) !== 'Monday') errors.push(`${p.key} : ${p.publishedAt} n’est pas un lundi`)
    if (p.publishedAt < FIRST_DAY || p.publishedAt > LAST_DAY) errors.push(`${p.key} : ${p.publishedAt} hors de ${FIRST_DAY} … ${LAST_DAY}`)
    if (i > 0 && p.publishedAt !== addDays(posts[i - 1].publishedAt, 7)) errors.push(`${p.key} : 7 jours après le billet précédent, dans l’ordre du fichier`)
  })
  const ready = journalPosts({ start: errors.length ? null : start, posts })
  for (const locale of ['fr', 'en']) {
    const inLocale = ready.filter((p) => p[locale])
    const others = inLocale.map((p) => asDoc(p, locale))
    for (const p of inLocale) {
      const r = checkPost(asDoc(p, locale), locale, { others, pages: pagesIn(locale) })
      errors.push(...r.errors.map((e) => `${p.key} (${locale}) ${e.code} ${e.message}`))
      warnings.push(...r.warnings.map((w) => `${p.key} (${locale}) ${w.code} ${w.message}`))
    }
  }
  const weeks = ready.map((p) => weekKey(p.publishedAt))
  if (new Set(weeks).size !== weeks.length) errors.push('deux billets la même semaine')
  return { errors, warnings }
}

// The content a post holds, in one canonical form: the same for the file and for a post read back from the
// database (no row ids, no empty optional fields, the day as written). Its sha256 is the seed's « seedHash ».
const clean = (v) => {
  if (Array.isArray(v)) return v.map(clean)
  if (v && typeof v === 'object') {
    const out = {}
    for (const k of Object.keys(v).sort()) {
      if (k === 'id') continue
      const x = clean(v[k])
      if (x === null || x === undefined || x === '' || (Array.isArray(x) && !x.length)) continue
      out[k] = x
    }
    return out
  }
  return v
}
const COPY_KEYS = SHAPE.copy[0]
const copyOf = (c) => (c && c.title ? Object.fromEntries(COPY_KEYS.map((k) => [k, c[k] ?? null])) : null)
export function canonicalPost({ key, category, publishedAt, photo, related, sources, fr, en }) {
  return clean({ key, category, publishedAt: dayOfPost(publishedAt), photo, related, sources, fr: copyOf(fr), en: copyOf(en) })
}
export const seedHash = (post) => createHash('sha256').update(JSON.stringify(canonicalPost(post))).digest('hex')
