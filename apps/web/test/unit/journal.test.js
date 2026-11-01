// lib/journal: the Journal's routes, dates (Granby time), publish guard (show and strict), hreflang, pagination,
// related links and post checks. Pure: no database.
import test, { describe } from 'node:test'
import assert from 'node:assert/strict'
import {
  journalRoute,
  postPath,
  listPath,
  releaseInstant,
  isoWithOffset,
  weekKey,
  dateModifiedOf,
  postReady,
  servedPosts,
  withJournal,
  postAlternates,
  paginate,
  latestFor,
  relatedLinks,
  checkPost,
  PAGE_SIZE,
  RESERVED_SLUGS,
  POST_PHOTO_KEYS,
} from '../../src/lib/journal.js'
import { PHOTOS } from '../../src/lib/photos.js'
import { SITE_ORIGIN } from '../../src/lib/routes.js'

const words = (n, lead = 'Pâtisserie Coco Vanille à Granby en 2026') => `${lead} ${Array.from({ length: n - lead.split(' ').length }, (_, i) => `mot${i}`).join(' ')}.`

// A complete French post (every check passes).
const post = (over = {}) => ({
  id: 1,
  key: 'billet-test',
  state: 'published',
  stateEn: 'draft',
  category: 'conseils',
  photo: 'viennoiseries',
  related: ['viennoiseries', 'nous-trouver'],
  sources: [{ label: 'MAPAQ, Thermoguide', url: 'https://www.mapaq.gouv.qc.ca/thermoguide', date: '2026-11-01' }],
  publishedAt: '2026-11-02T11:00:00.000Z',
  slug: 'conserver-des-croissants',
  title: 'Comment conserver des croissants',
  description: 'Où ranger un croissant, combien de temps il se garde et comment le congeler : les repères du MAPAQ, expliqués par Pâtisserie Coco Vanille à Granby.'.padEnd(150, '.'),
  h1: 'Comment conserver des croissants et des viennoiseries',
  answer: words(50),
  sections: [1, 2, 3].map((i) => ({ heading: `Question ${i}?`, answer: words(30, `Réponse ${i} de Pâtisserie Coco Vanille`) })),
  faq: [1, 2, 3, 4, 5].map((i) => ({ question: `Question fréquente ${i}?`, answer: words(60, `Réponse ${i}`) })),
  changeNote: 'Première version.',
  ...over,
})

describe('routes', () => {
  test('a post, a list page from 2, nothing else', () => {
    assert.deepEqual(journalRoute('fr', ['journal', 'conserver-des-croissants']), { type: 'post', slug: 'conserver-des-croissants' })
    assert.deepEqual(journalRoute('fr', ['journal', 'page', '2']), { type: 'list', n: 2 })
    assert.deepEqual(journalRoute('en', ['journal', 'how-to-keep-croissants']), { type: 'post', slug: 'how-to-keep-croissants' })
    assert.deepEqual(journalRoute('en', ['journal', 'page', '12']), { type: 'list', n: 12 })
    for (const segs of [['journal', 'page', '1'], ['journal', 'page', '0'], ['journal', 'page', '01'], ['journal', 'Abc'], ['journal', 'éclair'], ['journal', 'a', 'b'], ['journal'], ['carte', 'x'], ['journal', 'page', '2', 'x']]) {
      assert.equal(journalRoute('fr', segs), null, segs.join('/'))
    }
    for (const slug of RESERVED_SLUGS) assert.equal(journalRoute('fr', ['journal', slug]), null, slug)
    assert.equal(journalRoute('es', ['journal', 'x-y']), null, 'no Spanish Journal')
  })

  test('paths', () => {
    assert.equal(postPath({ slug: 'x-y' }, 'fr'), '/journal/x-y/')
    assert.equal(postPath({ slug: 'x-y' }, 'en'), '/en/journal/x-y/')
    assert.equal(postPath({}, 'fr'), null)
    assert.equal(listPath('fr', 1), '/journal/')
    assert.equal(listPath('en', 1), '/en/journal/')
    assert.equal(listPath('fr', 3), '/journal/page/3/')
  })
})

describe('dates, Granby time', () => {
  test('a post goes public at 6 h on its day (11:00 UTC in November)', () => {
    assert.equal(releaseInstant('2026-11-02').toISOString(), '2026-11-02T11:00:00.000Z')
    assert.equal(releaseInstant('2026-06-01').toISOString(), '2026-06-01T10:00:00.000Z')
  })

  test('ISO dates carry the Granby offset: -05:00 in November, -04:00 in June', () => {
    assert.equal(isoWithOffset('2026-11-02T11:00:00.000Z'), '2026-11-02T06:00:00-05:00')
    assert.equal(isoWithOffset(new Date('2026-06-01T10:00:00.000Z')), '2026-06-01T06:00:00-04:00')
    assert.equal(isoWithOffset('2026-11-02'), '2026-11-02T06:00:00-05:00')
  })

  test('weeks run Monday to Sunday in Granby time', () => {
    assert.equal(weekKey('2026-11-02'), '2026-11-02')
    assert.equal(weekKey('2026-11-08'), '2026-11-02')
    assert.equal(weekKey('2026-11-09'), '2026-11-09')
    // Sunday 23:30 in Granby is already Monday in UTC: it stays in its own week.
    assert.equal(weekKey('2026-11-09T04:30:00.000Z'), '2026-11-02')
    assert.equal(weekKey('2026-11-02T11:00:00.000Z'), '2026-11-02')
  })

  test('« Mis à jour » only after a change on a later day', () => {
    assert.equal(dateModifiedOf({ publishedAt: '2026-11-02T11:00:00.000Z', contentUpdatedAt: '2026-11-02T20:00:00.000Z' }), '2026-11-02T11:00:00.000Z')
    assert.equal(dateModifiedOf({ publishedAt: '2026-11-02T11:00:00.000Z', contentUpdatedAt: '2026-11-05T15:00:00.000Z' }), '2026-11-05T15:00:00.000Z')
    assert.equal(dateModifiedOf({ publishedAt: '2026-11-02T11:00:00.000Z' }), '2026-11-02T11:00:00.000Z')
  })
})

describe('publish guard (blog spec §4.1 matrix)', () => {
  const now = new Date('2026-11-10T12:00:00Z')
  const base = { fr: new Set(['home', 'journal']), en: new Set(['home', 'journal']), es: new Set() }
  const PAST = '2026-11-02T11:00:00.000Z'
  const FUTURE = '2026-11-16T11:00:00.000Z'
  const MARK = '[[FACT NEEDED: âges et heures de début des ateliers]]'
  // [label, state, stateEn, publishedAt, fr extra, en extra, show [fr, en], strict [fr, en]]
  const rows = [
    ['draft, any', 'draft', 'published', PAST, {}, {}, [404, 404], [404, 404]],
    ['published, English draft, future', 'published', 'draft', FUTURE, {}, {}, [404, 404], [404, 404]],
    ['published, English draft, past', 'published', 'draft', PAST, {}, {}, [200, 404], [200, 404]],
    ['both published, past', 'published', 'published', PAST, {}, {}, [200, 200], [200, 200]],
    ['marker in French', 'published', 'published', PAST, { answer: `${words(45)} ${MARK}` }, {}, [200, 200], [404, 404]],
    ['marker in English', 'published', 'published', PAST, {}, { answer: `${words(45)} ${MARK}` }, [200, 200], [200, 404]],
    ['English title empty', 'published', 'published', PAST, {}, { title: '' }, [200, 404], [200, 404]],
  ]
  for (const [label, state, stateEn, publishedAt, frExtra, enExtra, show, strict] of rows) {
    test(label, () => {
      const fr = post({ state, stateEn, publishedAt, ...frExtra })
      const en = post({ state, stateEn, publishedAt, slug: 'keeping-croissants', title: 'How to keep croissants', ...enExtra })
      for (const [mode, want] of [['show', show], ['strict', strict]]) {
        const r = servedPosts({ fr: [fr], en: [en] }, { strict: mode === 'strict', now, base })
        assert.deepEqual([r.fr.length ? 200 : 404, r.en.length ? 200 : 404], want, `${label} (${mode})`)
      }
    })
  }

  test('strict serves nothing in a language without its home page', () => {
    const r = servedPosts({ fr: [post()], en: [] }, { strict: true, now, base: { fr: new Set(), en: new Set() } })
    assert.equal(r.fr.length, 0)
  })

  test('newest first, then by id; ids map to each language’s slug', () => {
    const a = post({ id: 1, publishedAt: '2026-11-02T11:00:00.000Z' })
    const b = post({ id: 2, slug: 'b-b', publishedAt: '2026-11-09T11:00:00.000Z' })
    const c = post({ id: 3, slug: 'c-c', publishedAt: '2026-11-09T11:00:00.000Z' })
    const r = servedPosts({ fr: [a, b, c], en: [] }, { now, base })
    assert.deepEqual(r.fr.map((p) => p.id), [3, 2, 1])
    assert.equal(r.ids.fr.get(2), 'b-b')
  })

  test('postReady needs the whole post and no marker', () => {
    assert.ok(postReady(post()))
    assert.equal(postReady(post({ faq: [] })), false)
    assert.equal(postReady(post({ slug: null })), false)
    assert.equal(postReady(post({ h1: 'X [[FACT NEEDED: x]]' })), false)
  })
})

describe('index gate, hreflang, pagination, links', () => {
  test('strict: an index with no post is not served; show: unchanged', () => {
    const base = { fr: new Set(['home', 'journal']), en: new Set(['home', 'journal']) }
    const strict = withJournal(base, { fr: 0, en: 2 }, { strict: true })
    assert.equal(strict.fr.has('journal'), false)
    assert.equal(strict.en.has('journal'), true)
    assert.equal(base.fr.has('journal'), true, 'the input is not changed')
    assert.equal(withJournal(base, { fr: 0 }, { strict: false }), base)
  })

  test('hreflang on a post: both languages or nothing', () => {
    const ids = { fr: new Map([[1, 'conserver-des-croissants'], [2, 'seul']]), en: new Map([[1, 'keeping-croissants']]) }
    assert.deepEqual(postAlternates({ id: 1 }, ids), {
      'fr-CA': `${SITE_ORIGIN}/journal/conserver-des-croissants/`,
      'en-CA': `${SITE_ORIGIN}/en/journal/keeping-croissants/`,
      'x-default': `${SITE_ORIGIN}/journal/conserver-des-croissants/`,
    })
    assert.deepEqual(postAlternates({ id: 2 }, ids), {})
  })

  test('12 posts a page; past the last page: null', () => {
    const list = (n) => Array.from({ length: n }, (_, i) => ({ id: i }))
    assert.deepEqual(paginate([], 1), { items: [], page: 1, pages: 1, prev: null, next: null })
    assert.equal(paginate([], 2), null)
    assert.equal(paginate(list(12), 1).pages, 1)
    assert.equal(paginate(list(12), 2), null)
    const p = paginate(list(13), 2)
    assert.deepEqual([p.items.length, p.pages, p.prev, p.next], [1, 2, 1, null])
    const q = paginate(list(25), 2)
    assert.deepEqual([q.items.length, q.pages, q.prev, q.next], [PAGE_SIZE, 3, 1, 3])
    assert.equal(listPath('fr', q.prev), '/journal/')
    assert.equal(listPath('fr', q.next), '/journal/page/3/')
    assert.equal(paginate(list(25), 4), null)
  })

  test('latest posts about a page, and a post’s related pages', () => {
    const posts = [{ id: 3, related: ['carte', 'faq'] }, { id: 2, related: ['faq'] }, { id: 1, related: ['carte'] }, { id: 0, related: ['carte'] }]
    assert.deepEqual(latestFor(posts, 'carte').map((p) => p.id), [3, 1, 0])
    assert.deepEqual(latestFor(posts, 'carte', 2).map((p) => p.id), [3, 1])
    const p = { related: ['prix', 'carte', 'viennoiseries'] }
    assert.deepEqual(relatedLinks(p, 'fr'), ['prix', 'carte', 'viennoiseries'])
    assert.deepEqual(relatedLinks(p, 'fr', new Set(['carte', 'viennoiseries'])), ['carte', 'viennoiseries'], 'order kept, unserved dropped')
  })
})

describe('checks (checkPost)', () => {
  const codes = (r) => [...new Set(r.errors.map((e) => e.code))].sort()
  test('a complete post has no error', () => {
    assert.deepEqual(checkPost(post(), 'fr').errors, [])
  })

  test('each rule has its code', () => {
    assert.deepEqual(codes(checkPost(post({ title: 'x'.repeat(61) }), 'fr')), ['E1'])
    assert.deepEqual(codes(checkPost(post({ description: 'Trop court.' }), 'fr')), ['E2'])
    assert.deepEqual(codes(checkPost(post({ h1: '' }), 'fr')), ['E3'])
    assert.deepEqual(codes(checkPost(post({ answer: 'Trop court, à Granby, en 2026.' }), 'fr')), ['E4'])
    assert.deepEqual(codes(checkPost(post({ answer: words(50, 'Une réponse sans la ville et sans année') }), 'fr')), ['E4'])
    assert.deepEqual(codes(checkPost(post({ sections: post().sections.slice(0, 2) }), 'fr')), ['E5'])
    assert.deepEqual(codes(checkPost(post({ sections: [...post().sections.slice(0, 2), { heading: 'Pas une question', answer: 'Oui.' }] }), 'fr')), ['E5'])
    assert.deepEqual(codes(checkPost(post({ faq: [...post().faq.slice(0, 4), { question: 'Question 1?', answer: 'Doublon.' }] }), 'fr')), ['E6'])
    assert.deepEqual(codes(checkPost(post({ changeNote: 'Deux\nlignes' }), 'fr')), ['E7'])
    assert.deepEqual(codes(checkPost(post({ slug: 'billet-2026' }), 'fr')), ['E8'])
    assert.deepEqual(codes(checkPost(post(), 'fr', { others: [{ id: 9, slug: 'conserver-des-croissants' }] })), ['E8'])
    assert.deepEqual(codes(checkPost(post({ photo: 'ateliers' }), 'fr')), ['E9'])
    assert.deepEqual(codes(checkPost(post({ related: ['carte'] }), 'fr')), ['E9'])
    assert.deepEqual(codes(checkPost(post({ sources: [{ label: 'X', url: 'http://x.test', date: '2026-11-01' }] }), 'fr')), ['E9'])
    assert.deepEqual(codes(checkPost(post({ sources: [{ label: 'X', url: 'https://x.test', date: '2026-11-03' }] }), 'fr')), ['E9'], 'a source dated after the post')
    assert.deepEqual(codes(checkPost(post({ answer: words(50, 'Le meilleur croissant de Granby en 2026') }), 'fr')), ['E10'])
    assert.deepEqual(codes(checkPost(post({ faq: [...post().faq.slice(0, 4), { question: 'Que disent les clients?', answer: 'Un témoignage inventé.' }] }), 'fr')), ['E10'])
    assert.deepEqual(codes(checkPost(post({ faq: [...post().faq.slice(0, 4), { question: 'Pourquoi?', answer: 'Pour que ChatGPT nous cite.' }] }), 'fr')), ['E10'])
    assert.deepEqual(codes(checkPost(post(), 'fr', { pages: [{ key: 'faq', title: 'Comment conserver des croissants' }] })), ['E11'])
  })

  test('the photo must be a known illustration of the registry', () => {
    for (const key of POST_PHOTO_KEYS) assert.ok(Object.hasOwn(PHOTOS, key), key)
    for (const key of ['ateliers', 'chef', 'zoo', 'carte-granby']) assert.ok(!POST_PHOTO_KEYS.includes(key), key)
  })

  test('« imprimé » and « supprimé » are not « primé »; a history year counts as the dated fact', () => {
    assert.deepEqual(checkPost(post({ changeNote: 'Paragraphe supprimé, puis imprimé.' }), 'fr').errors, [])
    assert.deepEqual(checkPost(post({ answer: words(50, 'Le vol-au-vent, attesté dès 1750, à Granby') }), 'fr').errors, [])
  })

  test('warnings never block', () => {
    const r = checkPost(post({ answer: words(50, 'Une réponse à Granby en 2026'), publishedAt: '2026-11-03T11:00:00.000Z' }), 'fr', { others: [{ id: 5, title: 'Autre', state: 'published', publishedAt: '2026-11-02T11:00:00.000Z' }], served: new Set(['viennoiseries']) })
    assert.deepEqual(r.errors, [])
    const w = r.warnings.map((x) => x.code)
    for (const code of ['W1', 'W5', 'W6']) assert.ok(w.includes(code), code)
    assert.ok(checkPost(post({ answer: `${words(45)} [[FACT NEEDED: x]]` }), 'fr').warnings.some((x) => x.code === 'W4'))
    const thin = checkPost(post({ faq: post().faq.map((f) => ({ ...f, answer: 'Oui.' })) }), 'fr')
    assert.deepEqual(thin.errors, [])
    assert.ok(thin.warnings.some((x) => x.code === 'W3'), 'a thin post')
    const short = checkPost(post({ sections: [...post().sections.slice(0, 2), { heading: 'Court?', answer: 'Une réponse de six mots seulement.' }] }), 'fr')
    assert.ok(short.warnings.some((x) => x.code === 'W2'), 'a section answer under 25 words')
  })
})
