// Studio « Journal » actions (lib/studio/actions/journal.js) through the action engine: roles, French first, the
// checks before « Publier », one post a week, fixed addresses, « Changement important », undo and the audit log.
import { test, describe, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { fakePayload } from '../ordering/fake-payload.js'
import { perform, undo } from '../../../src/lib/studio/actions/index.js'

const LOCALIZED = ['slug', 'title', 'description', 'h1', 'answer', 'sections', 'faq', 'changeNote']
const owner = { id: 1, role: 'proprietaire', name: 'Proprio', active: true }
const agency = { id: 2, role: 'agence', name: 'Agence', active: true }
const translator = { id: 3, role: 'traduction', name: 'Trad', active: true }
const NOW = new Date('2026-11-01T15:00:00Z') // Sunday 10 h in Granby

const words = (n, lead) => `${lead} ${Array.from({ length: n - lead.split(' ').length }, (_, i) => `mot${i}`).join(' ')}.`

// The flat form of the French editor (lib/studio/journal-form.js names), every check passing.
function frenchForm(over = {}) {
  const form = {
    category: 'conseils',
    photo: 'viennoiseries',
    related: ['viennoiseries', 'nous-trouver'],
    publishedAt: '2026-11-02',
    src0_label: 'MAPAQ, Thermoguide',
    src0_url: 'https://www.mapaq.gouv.qc.ca/thermoguide',
    src0_date: '2026-11-01',
    title: 'Comment conserver des croissants',
    description: 'Où ranger un croissant, combien de temps il se garde et comment le congeler : les repères du MAPAQ, expliqués par Pâtisserie Coco Vanille à Granby.',
    h1: 'Comment conserver des croissants et des viennoiseries',
    answer: words(50, 'Pâtisserie Coco Vanille à Granby en 2026'),
    changeNote: 'Première version.',
  }
  for (const i of [0, 1, 2]) Object.assign(form, { [`s${i}_heading`]: `Question numéro ${i + 1}?`, [`s${i}_answer`]: words(30, `Réponse ${i + 1} de Pâtisserie Coco Vanille`) })
  for (const i of [0, 1, 2, 3, 4]) Object.assign(form, { [`f${i}_q`]: `Question fréquente ${i + 1}?`, [`f${i}_a`]: words(60, `Réponse fréquente ${i + 1}`) })
  return { ...form, ...over }
}
const englishForm = (over = {}) => {
  const form = {
    title: 'How to keep croissants',
    description: 'Where to keep a croissant, how long it lasts and how to freeze it: MAPAQ’s guidance, explained by Pâtisserie Coco Vanille in Granby, Quebec, for you.',
    h1: 'How to keep croissants and viennoiseries',
    answer: words(50, 'Pâtisserie Coco Vanille in Granby in 2026'),
    changeNote: 'First version.',
  }
  for (const i of [0, 1, 2]) Object.assign(form, { [`s${i}_heading`]: `English question ${i + 1}?`, [`s${i}_answer`]: words(30, `English answer ${i + 1}`) })
  for (const i of [0, 1, 2, 3, 4]) Object.assign(form, { [`f${i}_q`]: `English FAQ ${i + 1}?`, [`f${i}_a`]: words(60, `English FAQ answer ${i + 1}`) })
  return { ...form, ...over }
}

let payload
const act = (user, type, input, now = NOW) => perform(payload, { user, type, input, now })
const stored = () => payload.store.posts[0]
beforeEach(() => {
  payload = fakePayload({ collections: { posts: [], pages: [] }, localized: { posts: LOCALIZED } })
})

async function created(over) {
  const r = await act(agency, 'post.saveFr', frenchForm(over))
  assert.ok(r.ok, r.message)
  return r.data.id
}

describe('writing', () => {
  test('a new post is a French draft with a fixed key, French typography and a redirect to its screen', async () => {
    const r = await act(agency, 'post.saveFr', frenchForm())
    assert.ok(r.ok, r.message)
    assert.equal(r.data.redirect, `/plus/journal/${r.data.id}/`)
    const doc = stored()
    assert.equal(doc.state, 'draft')
    assert.equal(doc.stateEn, 'draft')
    assert.equal(doc.key, 'comment-conserver-des-croissants')
    assert.equal(doc.publishedAt, '2026-11-02T11:00:00.000Z')
    assert.equal(doc._locales.fr.slug, 'comment-conserver-des-croissants')
    assert.equal(doc._locales.fr.sections[0].heading, 'Question numéro 1 ?')
    assert.match(doc._locales.fr.description, /congeler : /)
  })

  test('Traduction cannot write French, publish or release English', async () => {
    const id = await created()
    for (const type of ['post.saveFr', 'post.publish', 'post.publishEn']) {
      const r = await act(translator, type, { id, ...frenchForm(), verified: 'on' })
      assert.equal(r.status, 403, type)
    }
  })

  test('English needs the French first; Traduction writes it, as typed', async () => {
    const id = await created({ title: '' }).catch(() => null)
    assert.equal(id, null, 'a post needs a French title')
    payload.store.posts.push({ id: 9, key: 'vide', state: 'draft', stateEn: 'draft', _locales: { fr: {} } })
    const refused = await act(translator, 'post.saveEn', { id: 9, ...englishForm() })
    assert.equal(refused.code, 'french_first')
    const real = await created()
    const ok = await act(translator, 'post.saveEn', { id: real, ...englishForm() })
    assert.ok(ok.ok, ok.message)
    const doc = payload.store.posts.find((p) => p.id === real)
    assert.equal(doc._locales.en.title, 'How to keep croissants')
    assert.equal(doc._locales.en.slug, 'how-to-keep-croissants')
    assert.equal(doc._locales.en.sections[0].heading, 'English question 1?', 'English is stored as typed')
  })
})

describe('publishing', () => {
  test('refused while a check fails, without « J’ai vérifié », or for a past date', async () => {
    const id = await created({ s2_heading: '', s2_answer: '' })
    const checks = await act(agency, 'post.publish', { id, publishedAt: '2026-11-02', verified: 'on' })
    assert.equal(checks.code, 'checks')
    assert.ok(checks.errors?.length || /erreur/.test(checks.message))
    const id2 = await created({ title: 'Un autre titre de billet', description: frenchForm().description.replace('Où ranger', 'Où garder'), slug: 'autre-billet' })
    assert.equal((await act(agency, 'post.publish', { id: id2, publishedAt: '2026-11-09' })).code, 'verify')
    assert.equal((await act(agency, 'post.publish', { id: id2, publishedAt: '2026-10-26', verified: 'on' })).code, 'past_date')
  })

  test('schedules on its day at 6 h; one post a week (the owner may allow a second)', async () => {
    const first = await created()
    const r = await act(agency, 'post.publish', { id: first, publishedAt: '2026-11-02', verified: 'on' })
    assert.ok(r.ok, r.message)
    assert.match(r.message, /programmé pour le lundi 2 novembre 2026, 6 h/)
    assert.equal(stored().state, 'published')
    assert.equal(stored().releasedAt, undefined, 'not public yet: no release stamp')
    const second = await created({ title: 'Deuxième billet de la semaine', description: frenchForm().description.replace('Où ranger', 'Où garder'), slug: 'deuxieme-billet', publishedAt: '2026-11-05' })
    const clash = await act(agency, 'post.publish', { id: second, publishedAt: '2026-11-05', verified: 'on' })
    assert.equal(clash.code, 'one_per_week')
    assert.match(clash.message, /semaine du lundi 2 novembre 2026/)
    assert.equal((await act(agency, 'post.publish', { id: second, publishedAt: '2026-11-05', verified: 'on', override: '1' })).code, 'one_per_week', 'only the owner may override')
    const allowed = await act(owner, 'post.publish', { id: second, publishedAt: '2026-11-05', verified: 'on', override: '1' })
    assert.ok(allowed.ok, allowed.message)
    assert.match(payload.store['audit-log'].at(-1).summary, /deuxième billet de la semaine/)
  })

  test('« Annuler » after « Publier » puts the post back as it was', async () => {
    const id = await created()
    const r = await act(agency, 'post.publish', { id, publishedAt: '2026-11-02', verified: 'on' })
    const u = await undo(payload, { user: agency, id: r.auditId, now: new Date(NOW.getTime() + 5000) })
    assert.ok(u.ok, u.message)
    assert.equal(stored().state, 'draft')
  })

  test('English is released only while the French is published', async () => {
    const id = await created()
    await act(agency, 'post.saveEn', { id, ...englishForm() })
    assert.equal((await act(agency, 'post.publishEn', { id, verified: 'on' })).code, 'french_first')
    await act(agency, 'post.publish', { id, publishedAt: '2026-11-02', verified: 'on' })
    assert.equal((await act(agency, 'post.publishEn', { id })).code, 'verify')
    const ok = await act(owner, 'post.publishEn', { id, verified: 'on' })
    assert.ok(ok.ok, ok.message)
    assert.equal(stored().stateEn, 'published')
  })
})

describe('a post that has been public', () => {
  async function live() {
    const id = await created({ publishedAt: '2026-11-02' })
    await act(agency, 'post.saveEn', { id, ...englishForm() })
    const later = new Date('2026-11-03T15:00:00Z')
    await act(agency, 'post.publish', { id, publishedAt: '2026-11-02', verified: 'on' }, later)
    await act(agency, 'post.publishEn', { id, verified: 'on' }, later)
    return { id, later }
  }

  test('published on a past-due day: released at once, its address fixed', async () => {
    const { id, later } = await live()
    assert.ok(stored().releasedAt)
    const r = await act(agency, 'post.saveFr', { id, ...frenchForm({ slug: 'nouvelle-adresse' }) }, later)
    assert.equal(r.code, 'slug_locked')
  })

  test('« Changement important » dates the update and asks for an English review', async () => {
    const { id, later } = await live()
    const r = await act(agency, 'post.saveFr', { id, ...frenchForm({ changeNote: 'Repères du MAPAQ mis à jour.', major: 'on' }) }, later)
    assert.ok(r.ok, r.message)
    assert.equal(stored().contentUpdatedAt, later.toISOString())
    assert.equal(stored().enReviewNeeded, true)
  })

  test('a live post is checked before it is saved', async () => {
    const { id, later } = await live()
    // The editor sends the address it shows; a title of 65 characters fails E1.
    const r = await act(agency, 'post.saveFr', { id, ...frenchForm({ title: `Comment conserver des croissants ${'x'.repeat(40)}`, slug: 'comment-conserver-des-croissants' }) }, later)
    assert.equal(r.code, 'invalid')
    assert.match(r.message, /Titre/)
  })

  test('« Retirer du site » needs a reason; every action is in the log with before and after', async () => {
    const { id, later } = await live()
    assert.equal((await act(agency, 'post.unpublish', { id }, later)).code, 'missing')
    const r = await act(agency, 'post.unpublish', { id, reason: 'Une source a changé.' }, later)
    assert.ok(r.ok, r.message)
    assert.equal(stored().state, 'draft')
    const log = payload.store['audit-log'].filter((e) => e.entity === 'posts')
    assert.deepEqual([...new Set(log.map((e) => e.action))].sort(), ['post.publish', 'post.publishEn', 'post.saveEn', 'post.saveFr', 'post.unpublish'])
    for (const e of log) {
      assert.ok(e.after, e.action)
      assert.ok(e.summary, e.action)
    }
    assert.equal(log.at(-1).before.state, 'published')
    assert.equal(log.at(-1).after.reason, 'Une source a changé.')
  })
})
