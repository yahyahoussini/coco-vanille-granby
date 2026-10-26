// /llms.txt: same facts as the JSON-LD Bakery node, links to the key pages, nothing invented.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildLlmsTxt, factLines } from '../../src/components/site/llms.js'
import { bakeryNode, graph } from '../../src/lib/schema.js'

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
