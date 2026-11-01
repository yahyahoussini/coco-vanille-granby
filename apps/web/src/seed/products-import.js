// The shop's real products from a sheet (data/produits-a-remplir.csv, filled and saved as data/produits.csv):
// one row per format, the same French name on every row of a product. A dry run by default: it prints what it
// would create or change and writes nothing; APPLY=1 writes. Products missing from the sheet are listed, never
// removed. Declared allergens are recorded but NOT marked as checked: a person of the shop confirms them in
// Studio › Plus › Produits (step-up), and until then the product page shows a marker and stays unindexed.
//
//   npm run --silent products:import                      (dry run, data/produits.csv)
//   APPLY=1 PRODUCTS_CSV=../../data/produits.csv npm run --silent products:import
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../payload.config.js'
import { PRIORITY_ALLERGENS, PRODUCTION_CATEGORIES } from '../collections/Catalog.js'

const here = path.dirname(fileURLToPath(import.meta.url))
const file = path.resolve(process.cwd(), process.env.PRODUCTS_CSV || path.join(here, '../../../../data/produits.csv'))
const apply = process.env.APPLY === '1'
const FAMILIES = PRODUCTION_CATEGORIES.map((c) => c.value)
const CODES = PRIORITY_ALLERGENS.map(([code]) => code)

// CSV as Excel saves it in Québec (comma or semicolon, quotes, a BOM).
function parse(text) {
  const src = text.replace(/^﻿/, '')
  const sep = (src.split(/\r?\n/)[0].match(/;/g) || []).length > (src.split(/\r?\n/)[0].match(/,/g) || []).length ? ';' : ','
  const rows = []
  let row = []
  let cell = ''
  let quoted = false
  for (let i = 0; i < src.length; i++) {
    const c = src[i]
    if (quoted) {
      if (c === '"' && src[i + 1] === '"') (cell += '"'), i++
      else if (c === '"') quoted = false
      else cell += c
    } else if (c === '"') quoted = true
    else if (c === sep) row.push(cell), (cell = '')
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && src[i + 1] === '\n') i++
      row.push(cell)
      rows.push(row)
      row = []
      cell = ''
    } else cell += c
  }
  if (cell || row.length) row.push(cell), rows.push(row)
  const [head, ...body] = rows.filter((r) => r.some((c) => c.trim()))
  return body.map((r) => Object.fromEntries(head.map((h, i) => [h.trim(), (r[i] || '').trim()])))
}

const slugify = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/œ/g, 'oe').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const int = (v) => (v === '' || v === undefined ? null : Number.isInteger(Number(v)) && Number(v) >= 0 ? Number(v) : NaN)
// « 4,50 », « 4.50 $ », « 12 » → cents
const cents = (v) => {
  if (!v) return null
  const n = Number(v.replace(/\$|\s/g, '').replace(',', '.'))
  return Number.isFinite(n) && n > 0 ? Math.round(n * 100) : NaN
}
const codes = (v) => (v ? v.split(/[\s,;]+/).filter(Boolean).map((c) => c.toLowerCase()) : [])

const problems = []
const products = new Map()
const rows = parse(readFileSync(file, 'utf8'))
rows.forEach((r, i) => {
  const line = i + 2
  if (/^exemple/i.test(r.notes || '')) return
  const name = r.nom_fr
  if (!name) return problems.push(`line ${line}: nom_fr is empty`)
  if (!FAMILIES.includes(r.famille)) problems.push(`line ${line} (${name}): famille must be one of ${FAMILIES.join(', ')}`)
  const variant = { label: r.format || 'Format standard', labelEn: r.format_en || r.format || 'Standard size', priceCents: cents(r.prix), portionsMin: int(r.portions_min), portionsMax: int(r.portions_max), unitWeightGrams: int(r.poids_g) }
  for (const [k, v] of Object.entries(variant)) if (Number.isNaN(v)) problems.push(`line ${line} (${name}): ${k} is not a number: ${JSON.stringify(r)}`)
  for (const c of [...codes(r.contient), ...codes(r.peut_contenir)]) if (!CODES.includes(c)) problems.push(`line ${line} (${name}): unknown allergen code « ${c} » (codes: ${CODES.join(' ')})`)
  const p = products.get(name) || { name, nameEn: r.nom_en, family: r.famille, summary: r.description_fr, lead: int(r.delai_heures), contains: codes(r.contient), mayContain: codes(r.peut_contenir), online: /^o(ui)?$/i.test(r.en_ligne || ''), variants: [] }
  if (p.family !== r.famille) problems.push(`line ${line} (${name}): the same product is in two families`)
  p.variants.push(variant)
  products.set(name, p)
})
if (problems.length) {
  console.error(`${problems.length} problem(s) in ${file}; nothing was written:\n- ${problems.join('\n- ')}`)
  process.exit(1)
}

const payload = await getPayload({ config })
const SYS = { overrideAccess: true, depth: 0 }
const categories = new Map((await payload.find({ collection: 'categories', limit: 50, ...SYS })).docs.map((c) => [c.productionCategory, c.id]))
const allergenIds = new Map((await payload.find({ collection: 'allergens', limit: 50, ...SYS })).docs.map((a) => [a.code, a.id]))
const existing = (await payload.find({ collection: 'products', limit: 1000, locale: 'fr', ...SYS })).docs

for (const p of products.values()) {
  const slug = slugify(p.name)
  const found = existing.find((d) => d.slug === slug)
  const data = {
    title: p.name,
    slug,
    productionCategory: p.family,
    category: categories.get(p.family),
    variants: p.variants.map(({ labelEn, ...v }) => Object.fromEntries(Object.entries(v).filter(([, x]) => x !== null))),
    allergens: p.contains.map((c) => allergenIds.get(c)).filter(Boolean),
    mayContain: p.mayContain.map((c) => allergenIds.get(c)).filter(Boolean),
    leadTimeHours: p.lead ?? 0,
    onlineOrderable: p.online,
    ...(p.summary ? { summary: p.summary } : {}),
    ...(found ? {} : { availability: 'instock', _status: 'published' }),
  }
  console.log(`${found ? 'update' : 'create'}  ${p.name} (${p.family}) · ${p.variants.map((v) => `${v.label} ${v.priceCents ? (v.priceCents / 100).toFixed(2) + ' $' : 'no price'}`).join(' | ')} · allergens to confirm in Studio: ${p.contains.join(' ') || 'none declared'}`)
  if (!apply) continue
  const doc = found ? await payload.update({ collection: 'products', id: found.id, data, locale: 'fr', ...SYS }) : await payload.create({ collection: 'products', data, locale: 'fr', ...SYS })
  if (p.nameEn) {
    const variantsEn = (doc.variants || []).map((v, i) => ({ id: v.id, label: p.variants[i]?.labelEn || v.label }))
    await payload.update({ collection: 'products', id: doc.id, locale: 'en', data: { title: p.nameEn, slug: slugify(p.nameEn), variants: variantsEn }, ...SYS })
  }
}
const named = new Set([...products.keys()].map(slugify))
const left = existing.filter((d) => !named.has(d.slug) && d.availability !== 'discontinued')
if (left.length) console.log(`not in the sheet (kept as they are): ${left.map((d) => d.title).join(', ')}`)
console.log(apply ? `Done: ${products.size} product(s) written. Next: confirm each product's allergens in Studio › Plus › Produits.` : `Dry run: ${products.size} product(s), nothing written. APPLY=1 to write.`)
process.exit(0)
