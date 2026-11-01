// Studio « Journal » editor form (src/app/(studio)/studio/(app)/plus/journal/…): flat field names, because
// readAction and ActionForm carry flat keys and `[]` arrays only, and the form works without JavaScript.
//   Shared (French editor only): id, category, photo, related[], publishedAt, src0_label src0_url src0_date … src19_*
//   Per language: slug, title, description, h1, answer, s0_heading s0_answer s0_body s0_list … s5_*,
//                 f0_q f0_a … f7_*, changeNote, major
// Pure module: the actions (lib/studio/actions/journal.js), the screens and test/unit/studio/journal-form.test.js.
import { str, bool } from './actions/util.js'
import { dayOfPost, MAX_SOURCES } from '../journal.js'

export const SECTION_ROWS = 6
export const FAQ_ROWS = 8
export const SOURCE_ROWS = MAX_SOURCES
// The longest text each field keeps (a pasted page never fills the database).
export const MAX = { slug: 80, title: 70, description: 200, h1: 120, answer: 800, heading: 160, sectionAnswer: 1200, body: 6000, item: 300, question: 200, faqAnswer: 1500, changeNote: 200, label: 200, url: 500 }

const rows = (n) => Array.from({ length: n }, (_, i) => i)
// A multi-line field keeps its paragraphs; only the ends are trimmed.
const block = (v, max) => String(v ?? '').replace(/\r\n?/g, '\n').trim().slice(0, max)
const line = (v, max) => str(v, max).replace(/\s+/g, ' ')

// « Le paris-brest : d’où vient-il? » → « le-paris-brest-d-ou-vient-il »: lowercase, accents removed, 80 characters.
export function slugFrom(text = '') {
  return String(text)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[’']/g, '-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, MAX.slug)
    .replace(/-+$/g, '')
}

// input (readAction's object) → { shared, copy, major }. Empty rows are dropped; `shared` only for French.
export function parsePostForm(input = {}, locale = 'fr') {
  const sections = rows(SECTION_ROWS)
    .map((i) => {
      const heading = line(input[`s${i}_heading`], MAX.heading)
      const answer = block(input[`s${i}_answer`], MAX.sectionAnswer)
      const body = block(input[`s${i}_body`], MAX.body)
      const list = block(input[`s${i}_list`], MAX.body)
        .split('\n')
        .map((x) => line(x, MAX.item))
        .filter(Boolean)
        .map((item) => ({ item }))
      return { heading, answer, ...(body ? { body } : {}), ...(list.length ? { list } : {}) }
    })
    .filter((s) => s.heading || s.answer || s.body || s.list)
  const faq = rows(FAQ_ROWS)
    .map((i) => ({ question: line(input[`f${i}_q`], MAX.question), answer: block(input[`f${i}_a`], MAX.faqAnswer) }))
    .filter((f) => f.question || f.answer)
  const title = line(input.title, MAX.title)
  const typed = line(input.slug, MAX.slug).toLowerCase()
  const copy = {
    // Proposed from the title until the person types one.
    slug: typed || slugFrom(title) || null,
    title,
    description: line(input.description, MAX.description),
    h1: line(input.h1, MAX.h1),
    answer: block(input.answer, MAX.answer).replace(/\s*\n\s*/g, ' '),
    sections,
    faq,
    changeNote: line(input.changeNote, MAX.changeNote),
  }
  let shared = {}
  if (locale === 'fr') {
    const related = [...new Set([].concat(input.related ?? []).map((k) => str(k, 60)).filter(Boolean))]
    const sources = rows(SOURCE_ROWS)
      .map((i) => ({ label: line(input[`src${i}_label`], MAX.label), url: str(input[`src${i}_url`], MAX.url), date: str(input[`src${i}_date`], 10) }))
      .filter((s) => s.label || s.url || s.date)
    shared = {
      category: str(input.category, 20) || null,
      photo: str(input.photo, 40) || null,
      related,
      publishedAt: /^\d{4}-\d{2}-\d{2}$/.test(str(input.publishedAt, 10)) ? str(input.publishedAt, 10) : null,
      sources,
    }
  }
  return { shared, copy, major: bool(input.major) }
}

// A stored post (read in `locale`) → the same flat keys, for the inputs' defaultValue.
export function toFormValues(doc = {}, locale = 'fr') {
  const out = {
    slug: doc.slug || '',
    title: doc.title || '',
    description: doc.description || '',
    h1: doc.h1 || '',
    answer: doc.answer || '',
    changeNote: doc.changeNote || '',
  }
  rows(SECTION_ROWS).forEach((i) => {
    const s = doc.sections?.[i] || {}
    out[`s${i}_heading`] = s.heading || ''
    out[`s${i}_answer`] = s.answer || ''
    out[`s${i}_body`] = s.body || ''
    out[`s${i}_list`] = (s.list || []).map((l) => l.item).join('\n')
  })
  rows(FAQ_ROWS).forEach((i) => {
    const f = doc.faq?.[i] || {}
    out[`f${i}_q`] = f.question || ''
    out[`f${i}_a`] = f.answer || ''
  })
  if (locale === 'fr') {
    out.id = doc.id ?? ''
    out.category = doc.category || ''
    out.photo = doc.photo || ''
    out.related = [...(doc.related || [])]
    out.publishedAt = dayOfPost(doc.publishedAt) || ''
    rows(SOURCE_ROWS).forEach((i) => {
      const s = doc.sources?.[i] || {}
      out[`src${i}_label`] = s.label || ''
      out[`src${i}_url`] = s.url || ''
      out[`src${i}_date`] = s.date || ''
    })
  }
  return out
}
