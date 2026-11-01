// /llms.txt: same facts as the JSON-LD Bakery node, links to the key pages, nothing invented.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildLlmsTxt, factLines } from '../../src/components/site/llms.js'
import { bakeryNode, graph } from '../../src/lib/schema.js'
import { HOURS } from '../../src/seed/content.js'

const business = {
  name: 'Pâtisserie Coco Vanille',
  alternateName: ['Pâtisserie Cocovanille'],
  categorySentence: 'Pâtisserie Coco Vanille est une pâtisserie-boulangerie du centre-ville de Granby : viennoiseries, pains et gâteaux sur commande.',
  phone: '+14503727177',
  phoneDisplay: '450-372-7177',
  address: { street: '3, rue Court', city: 'Granby', region: 'QC', postalCode: 'J2G 4Y6', country: 'CA' },
  google: { cid: '10789122976114705165' },
  sameAs: [{ url: 'https://www.facebook.com/PatisserieCocoVanille/', verified: true }, { url: 'https://www.instagram.com/x/', verified: false }],
  languagesServed: ['fr'],
}
const pages = [
  { key: 'home', locale: 'fr', status: 'core', template: 'home', url: 'https://cocovanillegranby.com/', title: 'Pâtisserie et boulangerie', description: 'Accueil.' },
  { key: 'prix', locale: 'fr', status: 'conditional', template: 'prices', url: 'https://cocovanillegranby.com/prix/', title: 'Prix', description: 'Prix.' },
  { key: 'confidentialite', locale: 'fr', status: 'core', template: 'legal', url: 'https://cocovanillegranby.com/confidentialite/', title: 'Politique de confidentialité' },
  { key: 'home', locale: 'en', status: 'core', template: 'home', url: 'https://cocovanillegranby.com/en/', title: 'Pastry shop and bakery' },
]

test('every fact line comes from the Bakery node; unverified profiles and missing facts stay out', () => {
  const node = graph([bakeryNode(business, {}, 'fr')])['@graph'][0]
  const text = factLines(business, {}).join('\n')
  assert.match(text, /Nom : Pâtisserie Coco Vanille/)
  assert.match(text, /3, rue Court, Granby, QC J2G 4Y6, CA/)
  assert.match(text, new RegExp(node.telephone.replace('+', '\\+')))
  assert.match(text, /maps\.google\.com\/\?cid=10789122976114705165/)
  assert.match(text, /facebook\.com\/PatisserieCocoVanille/)
  assert.doesNotMatch(text, /instagram/, 'unverified profile')
  assert.doesNotMatch(text, /Heures|Courriel|Gamme de prix/, 'facts the owner has not given are absent, not guessed')
  assert.doesNotMatch(text, /FACT NEEDED/)
})

test('hours appear only when the hours record exists', () => {
  const shop = { hours: [{ day: 'Sunday', opens: '09:00', closes: '17:00' }] }
  assert.match(factLines(business, shop).join('\n'), /Heures : le dimanche de 9 h à 17 h/)
})

test('the seeded hours read the same in llms.txt as on the site; the unconfirmed mobile number stays out', () => {
  const seeded = { ...business, mobile: '+14385287818', mobileDisplay: '438-528-7818' }
  const text = factLines(seeded, { hours: HOURS }).join('\n')
  assert.match(text, /Heures : du mercredi au samedi de 8 h 30 à 17 h 30, et le dimanche de 9 h 30 à 17 h/)
  assert.doesNotMatch(text, /438|5287818/, 'mobile use is not confirmed: not an AI-facing fact')
})

test('the file follows llmstxt.org: title, summary, sections of links, Optional last', () => {
  const text = buildLlmsTxt({ business, shop: {}, pages })
  const lines = text.split('\n')
  assert.equal(lines[0], '# Pâtisserie Coco Vanille')
  assert.match(lines[2], /^> Pâtisserie Coco Vanille est une pâtisserie-boulangerie/)
  assert.match(text, /## Pages principales\n- \[Pâtisserie et boulangerie\]\(https:\/\/cocovanillegranby\.com\/\): Accueil\./)
  assert.match(text, /## Autres pages\n- \[Prix\]/)
  assert.match(text, /## English\n- \[Pastry shop and bakery\]\(https:\/\/cocovanillegranby\.com\/en\/\)/)
  assert.ok(text.indexOf('## Optional') > text.indexOf('## English'))
})

test('an exceptional closure reaches llms.txt like the banner and the JSON-LD', () => {
  const shop = { hours: [{ day: 'Monday', opens: '09:00', closes: '18:00' }], closure: { active: true, until: '2026-10-31T13:00:00.000Z' }, specialDays: [{ date: '2026-12-25T12:00:00.000Z', state: 'closed', label: 'Noël' }] }
  const text = factLines(business, shop, { now: new Date('2026-10-30T15:00:00.000Z') }).join('\n')
  assert.match(text, /Fermeture exceptionnelle : la boutique rouvre le samedi 31 octobre à 9 h\./)
  assert.match(text, /Jours spéciaux : 2026-10-30 fermé/)
  assert.doesNotMatch(factLines(business, { ...shop, closure: { active: false } }, { now: new Date('2026-10-30T15:00:00.000Z') }).join('\n'), /Fermeture/)
})

test('Journal sections: the posts given, newest first, 20 at most, dated, English apart, Optional still last', () => {
  const posts = Array.from({ length: 22 }, (_, i) => ({ locale: 'fr', url: `https://cocovanillegranby.com/journal/b-${i}/`, title: `Billet ${i}`, description: `Description ${i}.`, date: `2026-${String(1 + Math.floor(i / 4)).padStart(2, '0')}-0${1 + (i % 4)}` }))
  posts.push({ locale: 'en', url: 'https://cocovanillegranby.com/en/journal/post/', title: 'A post', description: 'About it.', date: '2026-11-02' })
  const text = buildLlmsTxt({ business, shop: {}, pages, posts })
  const fr = text.split('## Journal\n')[1].split('\n\n')[0].split('\n')
  assert.equal(fr.length, 20)
  assert.equal(fr[0], '- [Billet 21](https://cocovanillegranby.com/journal/b-21/) (2026-06-02): Description 21.')
  assert.match(text, /## Journal \(English\)\n- \[A post\]\(https:\/\/cocovanillegranby\.com\/en\/journal\/post\/\) \(2026-11-02\): About it\./)
  assert.ok(text.indexOf('## Journal') > text.indexOf('## Autres pages'))
  assert.ok(text.indexOf('## Journal (English)') < text.indexOf('## English'))
  assert.ok(text.indexOf('## Optional') > text.indexOf('## English'))
})

test('no Journal section without posts', () => {
  assert.doesNotMatch(buildLlmsTxt({ business, shop: {}, pages }), /## Journal/)
})
