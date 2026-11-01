// Studio « Journal »: the state tags, the weekly strip and the filters, computed from the stored posts (never
// stored). Pure module (relative imports only) for the screens and node --test.
import { weekKey, dayOfPost, releaseInstant } from '../journal.js'
import { addDays, longDay, localParts } from './time.js'

const SLOT = /\[\[FACT NEEDED/g
export const markerCount = (doc) => (JSON.stringify(doc ?? '').match(SLOT) || []).length
const facts = (n) => `${n} ${n > 1 ? 'faits' : 'fait'} à donner`

// « lundi 9 novembre 2026 »
export const dayText = (iso) => (iso ? `${longDay(iso)} ${iso.slice(0, 4)}` : '')

// French state: Brouillon · Retiré · Programmé · En ligne · En ligne, caché en production while a fact is missing.
export function frenchTag(doc, now = new Date()) {
  if (doc?.state !== 'published') return doc?.releasedAt ? { label: 'Retiré', tone: 'bad' } : { label: 'Brouillon', tone: undefined }
  const due = new Date(doc.publishedAt).getTime() <= new Date(now).getTime()
  if (!due) return { label: `Programmé · ${longDay(dayOfPost(doc.publishedAt))}, 6 h`, tone: 'warn' }
  const n = markerCount(doc)
  return n ? { label: `En ligne · caché en production (${facts(n)})`, tone: 'warn' } : { label: 'En ligne', tone: 'ok' }
}

// English state, read beside the French: — · Brouillon · Programmé · En ligne · À revoir.
export function englishTag(en, fr, now = new Date()) {
  if (!en?.title) return { label: '—', tone: undefined }
  if (en.enReviewNeeded && en.stateEn === 'published') return { label: 'À revoir', tone: 'warn' }
  if (en.stateEn !== 'published') return { label: 'Brouillon', tone: undefined }
  const live = fr?.state === 'published' && new Date(fr.publishedAt).getTime() <= new Date(now).getTime()
  return live ? { label: 'En ligne', tone: 'ok' } : { label: 'Programmé', tone: 'warn' }
}

export const factsTag = (doc) => {
  const n = markerCount(doc)
  return n ? facts(n) : null
}

// List filters (Plus › Journal). « Anglais à faire »: a French post whose English is missing, unpublished or to review.
export const FILTERS = [
  ['tous', 'Tous'],
  ['brouillons', 'Brouillons'],
  ['programmes', 'Programmés'],
  ['en-ligne', 'En ligne'],
  ['anglais', 'Anglais à faire'],
]
export function matchesFilter(filter, fr, en, now = new Date()) {
  const due = fr?.state === 'published' && new Date(fr.publishedAt).getTime() <= new Date(now).getTime()
  if (filter === 'brouillons') return fr?.state !== 'published'
  if (filter === 'programmes') return fr?.state === 'published' && !due
  if (filter === 'en-ligne') return due
  if (filter === 'anglais') return Boolean(fr?.title) && (!en?.title || en.stateEn !== 'published' || Boolean(en.enReviewNeeded))
  return true
}

// The next `count` Mondays from this week's, each with the post published or scheduled in that week (one at most).
export function weekStrip(posts = [], now = new Date(), count = 8) {
  const first = weekKey(localParts(now).iso)
  return Array.from({ length: count }, (_, i) => {
    const monday = addDays(first, i * 7)
    const post = posts.find((p) => p.state === 'published' && weekKey(p.publishedAt) === monday) || null
    return { monday, post }
  })
}

// The first Monday from today with no published or scheduled post: the editor's default day.
export function nextFreeMonday(posts = [], now = new Date()) {
  const today = localParts(now).iso
  let monday = weekKey(today)
  if (monday < today || releaseInstant(monday).getTime() <= new Date(now).getTime()) monday = addDays(monday, 7)
  for (let i = 0; i < 52; i++, monday = addDays(monday, 7)) {
    if (!posts.some((p) => p.state === 'published' && weekKey(p.publishedAt) === monday)) return monday
  }
  return monday
}
