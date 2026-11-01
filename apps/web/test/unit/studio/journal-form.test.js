// The Journal editor's flat form (lib/studio/journal-form.js): parse ↔ defaults round trip, empty rows dropped,
// one list item per line, clamps, the address proposed from the title.
import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { parsePostForm, toFormValues, slugFrom, MAX } from '../../../src/lib/studio/journal-form.js'

const doc = {
  id: 4,
  category: 'histoire',
  photo: 'paris-brest',
  related: ['patisseries', 'carte'],
  publishedAt: '2026-11-16T11:00:00.000Z',
  sources: [{ label: 'CNRTL', url: 'https://www.cnrtl.fr/definition/paris-brest', date: '2026-11-01' }],
  slug: 'histoire-paris-brest',
  title: 'L’histoire du Paris-Brest',
  description: 'Une description.',
  h1: 'L’histoire du Paris-Brest, un gâteau né d’une course',
  answer: 'Une réponse.',
  sections: [
    { heading: 'Qui l’a inventé?', answer: 'Louis Durand.', body: 'Premier paragraphe.\n\nDeuxième.', list: [{ item: 'Un' }, { item: 'Deux' }] },
    { heading: 'Pourquoi une roue?', answer: 'Pour la course.' },
  ],
  faq: [{ question: 'Où en goûter?', answer: 'Au 3, rue Court.' }],
  changeNote: 'Première version.',
}

describe('parsePostForm ↔ toFormValues', () => {
  test('a stored post comes back the same through the form', () => {
    const { shared, copy, major } = parsePostForm(toFormValues(doc, 'fr'), 'fr')
    assert.deepEqual(shared, { category: 'histoire', photo: 'paris-brest', related: ['patisseries', 'carte'], publishedAt: '2026-11-16', sources: doc.sources })
    assert.deepEqual(copy, { slug: doc.slug, title: doc.title, description: doc.description, h1: doc.h1, answer: doc.answer, sections: doc.sections, faq: doc.faq, changeNote: doc.changeNote })
    assert.equal(major, false)
  })

  test('English reads no shared field', () => {
    const { shared, copy } = parsePostForm({ ...toFormValues(doc, 'en'), category: 'granby' }, 'en')
    assert.deepEqual(shared, {})
    assert.equal(copy.title, doc.title)
  })

  test('empty rows are dropped; a list is one item per line', () => {
    const { shared, copy } = parsePostForm({ title: 'T', s2_heading: 'Q?', s2_answer: 'R.', s2_list: ' Un \r\n\r\nDeux\n', f5_q: 'Q?', f5_a: 'R.', src3_url: 'https://x.test', src3_label: 'X', src3_date: '2026-11-01', related: 'carte', major: 'on' }, 'fr')
    assert.deepEqual(copy.sections, [{ heading: 'Q?', answer: 'R.', list: [{ item: 'Un' }, { item: 'Deux' }] }])
    assert.deepEqual(copy.faq, [{ question: 'Q?', answer: 'R.' }])
    assert.deepEqual(shared.sources, [{ label: 'X', url: 'https://x.test', date: '2026-11-01' }])
    assert.deepEqual(shared.related, ['carte'])
    assert.equal(parsePostForm({ major: 'on' }, 'fr').major, true)
  })

  test('every field is clamped', () => {
    const { copy, shared } = parsePostForm({ title: 'x'.repeat(500), description: 'd'.repeat(500), answer: 'a'.repeat(5000), s0_heading: 'h'.repeat(500), s0_answer: 'b'.repeat(5000), f0_q: 'q'.repeat(500), f0_a: 'r'.repeat(5000), changeNote: 'n'.repeat(500), src0_label: 'l'.repeat(500), src0_url: `https://${'u'.repeat(900)}` }, 'fr')
    assert.equal(copy.title.length, MAX.title)
    assert.equal(copy.description.length, MAX.description)
    assert.equal(copy.answer.length, MAX.answer)
    assert.equal(copy.sections[0].heading.length, MAX.heading)
    assert.equal(copy.sections[0].answer.length, MAX.sectionAnswer)
    assert.equal(copy.faq[0].question.length, MAX.question)
    assert.equal(copy.faq[0].answer.length, MAX.faqAnswer)
    assert.equal(copy.changeNote.length, MAX.changeNote)
    assert.equal(shared.sources[0].label.length, MAX.label)
    assert.equal(shared.sources[0].url.length, MAX.url)
    assert.ok(copy.slug.length <= MAX.slug)
  })

  test('the address is proposed from the title until one is typed', () => {
    assert.equal(slugFrom('Le Paris-Brest : d’où vient-il?'), 'le-paris-brest-d-ou-vient-il')
    assert.equal(slugFrom('Bûche de Noël, 1er décembre'), 'buche-de-noel-1er-decembre')
    assert.equal(parsePostForm({ title: 'Chocolatine ou pain au chocolat?' }, 'fr').copy.slug, 'chocolatine-ou-pain-au-chocolat')
    assert.equal(parsePostForm({ title: 'Chocolatine', slug: 'Mon-Adresse' }, 'fr').copy.slug, 'mon-adresse')
    assert.ok(slugFrom('mot '.repeat(40)).length <= 80)
    assert.doesNotMatch(slugFrom('mot '.repeat(40)), /-$/)
  })
})
