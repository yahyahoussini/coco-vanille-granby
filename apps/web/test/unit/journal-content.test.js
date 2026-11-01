// The Journal's first posts (src/seed/journal-posts.json) as the seed writes them (seed/journal-data.js): the §2
// shape, one Monday each from 2026-11-02 to 2026-12-21, known illustrations and pages, dated https sources, no
// checkPost error in either language, unique addresses and titles, Québec typography that keeps markers intact.
import test, { describe } from 'node:test'
import assert from 'node:assert/strict'
import { journalPosts, journalProblems, shapeProblems, readJournalFile, asDoc, seedHash, canonicalPost, FIRST_DAY, LAST_DAY, KEY_RE } from '../../src/seed/journal-data.js'
import { checkPost, POST_CATEGORIES, POST_PHOTO_KEYS, RELATABLE, weekKey } from '../../src/lib/journal.js'
import { PHOTOS } from '../../src/lib/photos.js'
import { PAGES } from '../../src/lib/routes.js'
import { addDays, weekdayOf } from '../../src/lib/studio/time.js'
import { pages } from '../../src/seed/content.js'

const raw = readJournalFile()
const posts = journalPosts()
const MARKER = /\[\[FACT NEEDED: [^\]]+\]\]/g

describe('journal-posts.json', () => {
  test('the file is an array; the loader works on an empty one', () => {
    assert.ok(Array.isArray(raw))
    assert.deepEqual(journalPosts({ posts: [] }), [])
    assert.deepEqual(journalProblems({ posts: [] }).errors, [])
  })

  test('no error at all (shape, dates, checks)', () => {
    assert.deepEqual(journalProblems().errors, [])
  })

  test('the exact §2 key set at every level', () => {
    assert.deepEqual(shapeProblems(raw), [])
    assert.match(shapeProblems([{ ...raw[0], extra: 1 }])[0] || 'no post', /extra|no post/)
  })

  test('keys unique and kebab-case; categories known', () => {
    const keys = posts.map((p) => p.key)
    assert.equal(new Set(keys).size, keys.length)
    for (const p of posts) {
      assert.match(p.key, KEY_RE)
      assert.ok(p.key.length <= 60, p.key)
      assert.ok(POST_CATEGORIES.includes(p.category), `${p.key}: ${p.category}`)
    }
  })

  test(`Mondays from ${FIRST_DAY} to ${LAST_DAY}, 7 days apart, in file order, one a week`, () => {
    posts.forEach((p, i) => {
      assert.equal(weekdayOf(p.publishedAt), 'Monday', p.key)
      assert.ok(p.publishedAt >= FIRST_DAY && p.publishedAt <= LAST_DAY, p.key)
      if (i) assert.equal(p.publishedAt, addDays(posts[i - 1].publishedAt, 7), p.key)
    })
    assert.equal(new Set(posts.map((p) => weekKey(p.publishedAt))).size, posts.length)
  })

  test('a known illustration (in POST_PHOTO_KEYS and in the photo registry), 2 to 4 relatable pages', () => {
    for (const p of posts) {
      assert.ok(POST_PHOTO_KEYS.includes(p.photo), `${p.key}: photo ${p.photo} is not a post illustration`)
      assert.ok(Object.hasOwn(PHOTOS, p.photo), `${p.key}: photo ${p.photo} missing from src/lib/photos.js`)
      assert.ok(p.related.length >= 2 && p.related.length <= 4, p.key)
      for (const k of p.related) assert.ok(RELATABLE.includes(k), `${p.key}: related ${k}`)
    }
  })

  test('sources: https, an ISO date no later than the post', () => {
    for (const p of posts) {
      assert.ok(p.sources.length >= 1, p.key)
      for (const s of p.sources) {
        assert.match(s.url, /^https:\/\/\S+$/, `${p.key}: ${s.url}`)
        assert.match(s.date, /^\d{4}-\d{2}-\d{2}$/, `${p.key}: ${s.date}`)
        assert.ok(s.date <= p.publishedAt, `${p.key}: source dated ${s.date} after ${p.publishedAt}`)
      }
    }
  })

  test('checkPost: no error in French, nor in English when present', () => {
    for (const locale of ['fr', 'en']) {
      const inLocale = posts.filter((p) => p[locale])
      const others = inLocale.map((p) => asDoc(p, locale))
      const registry = pages.filter((pg) => pg.locales[locale]).map((pg) => ({ key: pg.key, ...pg.locales[locale] }))
      for (const p of inLocale) assert.deepEqual(checkPost(asDoc(p, locale), locale, { others, pages: registry }).errors, [], `${p.key} (${locale})`)
    }
  })

  test('addresses unique per language, never a registry path segment', () => {
    const segments = new Set(PAGES.flatMap((pg) => Object.values(pg.paths)).flatMap((path) => path.split('/').filter(Boolean)))
    for (const locale of ['fr', 'en']) {
      const slugs = posts.filter((p) => p[locale]).map((p) => p[locale].slug)
      assert.equal(new Set(slugs).size, slugs.length, locale)
      for (const s of slugs) assert.ok(!segments.has(s), `${locale}: ${s}`)
    }
  })

  test('titles and descriptions unique across the posts and the registry pages', () => {
    for (const locale of ['fr', 'en']) {
      const copies = [...posts.filter((p) => p[locale]).map((p) => p[locale]), ...pages.filter((pg) => pg.locales[locale]).map((pg) => pg.locales[locale])]
      for (const field of ['title', 'description']) {
        const values = copies.map((c) => c[field])
        assert.equal(new Set(values).size, values.length, `${locale} ${field}`)
      }
    }
  })

  test('French typography keeps every marker byte for byte', () => {
    for (const p of raw) {
      const before = JSON.stringify(p.fr).match(MARKER) || []
      const after = JSON.stringify(posts.find((x) => x.key === p.key).fr).match(MARKER) || []
      assert.deepEqual(after, before, p.key)
    }
  })

  test('no plain space before « : » or inside « » in French (same rule as the pages)', () => {
    for (const p of posts) assert.doesNotMatch(JSON.stringify(p.fr), / [:»]|« /, p.key)
  })

  test('the seed hash reads the same from the file and from a stored post', () => {
    const p = posts[0]
    if (!p) return
    const stored = { ...p, id: 7, publishedAt: '2026-11-02T11:00:00.000Z', sources: p.sources.map((s, i) => ({ ...s, id: `s${i}` })) }
    const fr = { ...p.fr, sections: p.fr.sections.map((s, i) => ({ id: `x${i}`, body: null, list: [], ...s })) }
    assert.equal(seedHash({ ...stored, fr, en: p.en || { title: null } }), seedHash(p))
    assert.notEqual(seedHash({ ...p, photo: 'pains' }), seedHash(p))
    assert.equal(canonicalPost(p).publishedAt, p.publishedAt)
  })

  test('JOURNAL_START moves the series to another Monday, same spacing; anything else is refused', () => {
    const moved = journalPosts({ start: '2026-11-16' })
    if (!moved.length) return
    assert.equal(moved[0].publishedAt, '2026-11-16')
    if (moved[1]) assert.equal(moved[1].publishedAt, '2026-11-23')
    assert.deepEqual(journalProblems({ start: '2026-11-16' }).errors, [])
    assert.ok(journalProblems({ start: '2026-11-17' }).errors.some((e) => /JOURNAL_START/.test(e)))
  })
})
