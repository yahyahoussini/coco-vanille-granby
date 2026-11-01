// Seed of the Journal's first posts (src/seed/journal-posts.json, checked by journal-data.js). Run after
// `npm run migrate` and `npm run seed`: npm run seed:journal
//   (no variable)          check, then upsert every post by key: French published and dated (a post stays hidden
//                          until its day, 6 h Granby), English stored as a draft
//   JOURNAL_DRY_RUN=1      check and print the plan, write nothing; exit 1 on any error
//   JOURNAL_ENGLISH=publish also publish the English of every post that has one (after the agency's review)
//   JOURNAL_START=YYYY-MM-DD move the series so its first post lands on that Monday (7 days apart, same order)
//   JOURNAL_FORCE=1        overwrite posts edited in Studio since the last seed
// Idempotent: a post whose stored content still hashes to its seedHash and matches the file is left alone; one
// edited in Studio is skipped (unless JOURNAL_FORCE=1); one taken off the site (draft, released once) is never
// published again by the seed. Two posts in one week (the file's or the database's) stop the seed.
import { getPayload } from 'payload'
import config from '../payload.config.js'
import { journalPosts, journalProblems, seedHash } from './journal-data.js'
import { releaseInstant, weekKey } from '../lib/journal.js'

const env = process.env
const dry = env.JOURNAL_DRY_RUN === '1'
const force = env.JOURNAL_FORCE === '1'
const english = env.JOURNAL_ENGLISH === 'publish'
const start = env.JOURNAL_START || null

const say = (line) => console.log(`[journal] ${line}`)
const { errors, warnings } = journalProblems({ start })
for (const w of warnings) say(`attention · ${w}`)
if (errors.length) {
  for (const e of errors) say(`ERREUR · ${e}`)
  say(`${errors.length} erreur(s) : rien n’est écrit.`)
  process.exit(1)
}
const posts = journalPosts({ start })
if (dry) {
  for (const p of posts) say(`${p.publishedAt} 6 h · ${p.key} · « ${p.fr.title} »${p.en ? ` · EN « ${p.en.title} »${english ? ' (publié)' : ' (brouillon)'}` : ''}`)
  say(`${posts.length} billet(s) prêts, rien n’est écrit (JOURNAL_DRY_RUN=1).`)
  process.exit(0)
}

const payload = await getPayload({ config })
const SYS = { overrideAccess: true, depth: 0 }
const shared = (p) => ({ key: p.key, category: p.category, publishedAt: releaseInstant(p.publishedAt).toISOString(), photo: p.photo, related: p.related, sources: p.sources, author: 'equipe' })

// The stored post in the file's shape, to tell a Studio edit from an untouched seed.
async function stored(id) {
  const [fr, en] = await Promise.all(['fr', 'en'].map((locale) => payload.findByID({ collection: 'posts', id, locale, ...SYS })))
  return { fr, en, hash: seedHash({ ...fr, fr, en }) }
}

// One post a week, the database's own posts included.
const fileKeys = new Set(posts.map((p) => p.key))
const inDb = (await payload.find({ collection: 'posts', where: { state: { equals: 'published' } }, locale: 'fr', limit: 1000, pagination: false, ...SYS })).docs
const clashes = posts.flatMap((p) => inDb.filter((d) => !fileKeys.has(d.key) && weekKey(d.publishedAt) === weekKey(p.publishedAt)).map((d) => `${p.key} et « ${d.title || d.key} » la semaine du ${weekKey(p.publishedAt)}`))
if (clashes.length) {
  for (const c of clashes) say(`ERREUR · deux billets la même semaine : ${c}`)
  process.exit(1)
}

let created = 0
let updated = 0
let skipped = 0
for (const p of posts) {
  const hash = seedHash(p)
  const found = (await payload.find({ collection: 'posts', where: { key: { equals: p.key } }, locale: 'fr', limit: 1, ...SYS })).docs[0]
  if (!found) {
    const doc = await payload.create({ collection: 'posts', locale: 'fr', data: { ...shared(p), ...p.fr, state: 'published', stateEn: 'draft', seedHash: hash }, ...SYS })
    if (p.en) await payload.update({ collection: 'posts', id: doc.id, locale: 'en', data: { ...p.en, ...(english ? { stateEn: 'published' } : {}) }, ...SYS })
    created += 1
    say(`créé · ${p.publishedAt} · ${p.key}`)
    continue
  }
  if (found.state === 'draft' && found.releasedAt) {
    skipped += 1
    say(`laissé · ${p.key} : retiré du site dans Studio, le seed ne le republie pas`)
    continue
  }
  const now = await stored(found.id)
  if (now.hash === hash) {
    if (english && p.en && found.stateEn !== 'published') await payload.update({ collection: 'posts', id: found.id, locale: 'en', data: { stateEn: 'published' }, ...SYS })
    skipped += 1
    say(`à jour · ${p.key}`)
    continue
  }
  if (now.hash !== found.seedHash && !force) {
    skipped += 1
    say(`laissé · ${p.key} : modifié dans Studio depuis le dernier seed (JOURNAL_FORCE=1 pour écraser)`)
    continue
  }
  await payload.update({ collection: 'posts', id: found.id, locale: 'fr', data: { ...shared(p), ...p.fr, state: 'published', seedHash: hash }, ...SYS })
  if (p.en) await payload.update({ collection: 'posts', id: found.id, locale: 'en', data: { ...p.en, ...(english ? { stateEn: 'published' } : {}) }, ...SYS })
  updated += 1
  say(`mis à jour · ${p.key}`)
}
say(`${created} créé(s), ${updated} mis à jour, ${skipped} laissé(s).`)
process.exit(0)
