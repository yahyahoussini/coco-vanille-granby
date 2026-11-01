#!/usr/bin/env node
// Writes the site.config.json the rank-first tools read (weekly.yml, gate.mjs), from
// src/lib/routes.js (pages, languages) and data/facts.json (brand, NAP, geo, sameAs, category sentence),
// plus the pillar and its clusters, the facts file path, the other forms of the brand name and the
// market block the measurement tools search from (Québec). Written over an existing file, it keeps
// that file's $comment and competitors (kept by hand for reference; the tools read scoreboard/).
// Usage: node apps/web/scripts/rank-config.mjs [--out site.config.json]
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import { PAGES, esEnabled } from '../src/lib/routes.js'
import { siteConfig } from './gate-lib.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const { values } = parseArgs({ options: { out: { type: 'string', default: 'site.config.json' } } })
const factsFile = resolve(here, '../../../data/facts.json')
const { entity } = JSON.parse(readFileSync(factsFile, 'utf8'))
const cfg = siteConfig(PAGES, { es: esEnabled(), entity })

// Layer 9.3 (tools/links.mjs): the custom-cake pillar and the pages that answer its sub-questions
// (docs/17 §1, §4.4). Without these types links.mjs skips the pillar ↔ cluster check.
const TOPIC = { 'gateaux-personnalises': 'pillar', 'gateau-pour-demain': 'cluster', prix: 'cluster', calculateur: 'cluster', buches: 'cluster', gateaux: 'cluster' }
for (const p of PAGES) {
  const page = TOPIC[p.key] && cfg.pages.find((x) => x.path === p.paths.fr)
  if (page) page.type = TOPIC[p.key]
}

// The category sentence as published (facts.json: default option B until the owner chooses, research/14 S5).
const sentence = entity.category_sentence
const unmarked = (v) => typeof v === 'string' && v && !v.includes('[[FACT NEEDED')
if (unmarked(sentence?.fr)) cfg.category = { ...cfg.category, sentence: { fr: sentence.fr, ...(unmarked(sentence.en) ? { en: sentence.en } : {}) } }

// The shop's second number (owner-published mobile): ai-runs.mjs counts it as ours, never as a wrong phone.
const mobile = entity.telephoneMobile?.match(/\+?\d[\d\s().-]{8,}\d/)?.[0]
if (mobile) cfg.nap = { ...cfg.nap, mobile }

// The forms of the name that count as the brand (scoreboard/README.md §3: an answer that says « Coco Vanille » or
// « Cocovanille »; the Google listing is « Pâtisserie Cocovanille », entity.alternateName): ai-runs.mjs reads them as
// the brand named, serp.mjs and market.mjs as our listing in the local pack. Without them only brand.name is matched.
cfg.brand = { ...cfg.brand, alternateNames: ['Coco Vanille', 'Cocovanille'] }

// ai-runs.mjs reads the facts there: a path relative to the config file written here.
cfg.facts = relative(dirname(resolve(values.out)), factsFile).split(sep).join('/')

// Where the measurement searches from (tools/lib.mjs marketConfig): Google.ca located on Granby, the AI engines'
// web search from Québec on Eastern time, North American phone numbers. Without this block the tools fall back
// to their Moroccan defaults (google.co.ma, +212 numbers, Africa/Casablanca). hl comes from each prompt's lang.
const city = cfg.nap?.city
cfg.market = {
  country: 'CA',
  region: 'Quebec',
  gl: 'ca',
  googleDomain: 'google.ca',
  ...(city ? { location: `${city},Quebec,Canada` } : {}), // SerpApi canonical location name
  timezone: 'America/Toronto',
  // (450) 770-7246, 450-372-7177, +1 438-528-7818: compared on their last 10 digits
  phonePattern: /(?<!\d)(?:\+?1[\s.-]?)?\(?[2-9]\d{2}\)?[\s.-]?[2-9]\d{2}[\s.-]?\d{4}(?!\d)/.source,
  phoneDigits: 10,
}

// Hand-kept fields of the file being replaced: the note on top and the competitors list (reference only).
let old = {}
try {
  if (existsSync(values.out)) old = JSON.parse(readFileSync(values.out, 'utf8'))
} catch {}
const out = { ...(old.$comment ? { $comment: old.$comment } : {}), ...cfg, ...(old.competitors ? { competitors: old.competitors } : {}) }
writeFileSync(values.out, `${JSON.stringify(out, null, 2)}\n`)
console.log(`wrote ${values.out}`)
