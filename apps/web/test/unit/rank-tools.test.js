// tools/ (rank-first measurement): the market block and its Moroccan fallback, Québec phone numbers, the prompt language
// sent to Google, the other forms of the brand name, the runs of a case (three passes kept, 2 of 3 counts), proxy weeks
// kept apart, the market map's output and weaknesses, and the crawler on non-HTML answers and login redirects. Spawned
// tools run in temp folders with fetch stubbed or saved answers (no request leaves the machine, nothing is written in the
// repository).
import test, { describe } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { spawnSync } from 'node:child_process'
import { MOROCCO, marketConfig, phoneNumbers, langCode, brandNameList, csvObjects, runCases, holds, casePosition, caseRow, readRuns } from '../../../../tools/lib.mjs'

const ROOT = fileURLToPath(new URL('../../../../', import.meta.url))
const tool = (name) => join(ROOT, 'tools', name)
const tmp = () => mkdtempSync(join(tmpdir(), 'rank-tools-'))
const node = (args, cwd) => spawnSync(process.execPath, args, { cwd, encoding: 'utf8', env: { ...process.env, FORCE_COLOR: '0' } })
const HEAD = 'week,prompt_id,engine,google_position,snippet_owner,ai_overview_cited,cited_domains,brand_named,brand_position,third_party_names_us,map_pack,notes'
const csv = (...lines) => [HEAD, ...lines].join('\n') + '\n'
const run = (o) => ({ week: '2026-W45', prompt_id: 'C1', engine: 'ChatGPT', google_position: '', cited_domains: '', brand_named: 'no', map_pack: '', notes: '', ...o })

// the project's config, as weekly.yml builds it (apps/web/scripts/rank-config.mjs)
const cfgDir = tmp()
const made = node([join(ROOT, 'apps/web/scripts/rank-config.mjs'), '--out', join(cfgDir, 'site.config.json')])
const QC = JSON.parse(readFileSync(join(cfgDir, 'site.config.json'), 'utf8'))

describe('market block', () => {
  test('without a market block the Moroccan values stay the fallback', () => {
    for (const m of [marketConfig(null), marketConfig({ site: 'https://x.ma', nap: { city: 'Rabat' } })]) {
      assert.equal(m.fallback, true)
      assert.equal(m.country, 'MA')
      assert.equal(m.gl, 'ma')
      assert.equal(m.googleDomain, 'google.co.ma')
      assert.equal(m.timezone, 'Africa/Casablanca')
      assert.equal(m.phonePattern, MOROCCO.phonePattern)
    }
    assert.equal(marketConfig({ nap: { city: 'Rabat' } }).city, 'Rabat')
  })

  test('rank-config.mjs writes the Québec block, the facts file and the shop mobile for this project', () => {
    assert.equal(made.status, 0, made.stderr)
    const m = marketConfig(QC)
    assert.equal(m.fallback, false)
    assert.deepEqual([m.country, m.region, m.gl, m.googleDomain, m.location, m.timezone, m.phoneDigits, m.city], ['CA', 'Quebec', 'ca', 'google.ca', 'Granby,Quebec,Canada', 'America/Toronto', 10, 'Granby'])
    assert.equal(resolve(cfgDir, QC.facts), join(ROOT, 'data', 'facts.json'))
    assert.deepEqual(phoneNumbers(QC.nap.mobile, m), ['4385287818'])
  })

  test('a block without gl takes the country code; command-line options win', () => {
    assert.equal(marketConfig({ market: { country: 'fr' } }).gl, 'fr')
    assert.equal(marketConfig({ market: { country: 'fr' } }).fallback, false)
    const m = marketConfig(QC, { timezone: 'America/Montreal', city: true, country: undefined })
    assert.equal(m.timezone, 'America/Montreal')
    assert.equal(m.city, 'Granby')
    assert.equal(m.country, 'CA')
  })
})

describe('phone numbers', () => {
  const qc = marketConfig(QC)

  test('Québec numbers in every common form, compared on their last 10 digits', () => {
    const text = 'Appelez le (450) 770-7246, le 450-372-7177 ou le 438-528-7818. Aussi +1 450-372-7177, 1-450-372-7177, 450.372.7177, 4503727177.'
    assert.deepEqual(phoneNumbers(text, qc), ['4507707246', '4503727177', '4385287818', '4503727177', '4503727177', '4503727177', '4503727177'])
  })

  test('no number read in dates, postal codes, prices, hours or a 10-digit company number', () => {
    assert.deepEqual(phoneNumbers('Le 2026-10-29, J2G 4Y6, 45 $, de 8 h 30 à 17 h 30 (8:30–17:30), NEQ 1177082220, 3 rue Court.', qc), [])
  })

  test('the Moroccan pattern still reads +212 numbers', () => {
    assert.deepEqual(phoneNumbers('+212 6 12 34 56 78 ou 0522-00-00-00', MOROCCO), ['612345678', '522000000'])
    assert.deepEqual(phoneNumbers('(450) 770-7246', MOROCCO), [])
  })
})

describe('prompt language sent to Google', () => {
  test('langCode reads the lang column, else the default language', () => {
    assert.deepEqual([langCode('en'), langCode('ES'), langCode('FR|EN'), langCode('', 'fr'), langCode(undefined, 'en'), langCode('darija', 'fr')], ['en', 'es', 'fr', 'fr', 'en', 'fr'])
  })

  test('serp.mjs --dry-run: google.ca on Granby, hl=en for EN prompts and hl=es for ES prompts; candidates skipped', () => {
    const dir = tmp()
    writeFileSync(join(dir, 'prompts.csv'), 'id,type,lang,prompt\nC1,commercial,fr,meilleure pâtisserie à Granby\nC8,commercial,en,best bakery in Granby Quebec\nC10,commercial,es,mejor pastelería en Granby Quebec\nX1,candidate,fr,pâtisserie Granby\n')
    const r = node([tool('serp.mjs'), '--dry-run', '--config', join(cfgDir, 'site.config.json'), '--prompts', 'prompts.csv', '--from-dir', 'serp', '--skip-type', 'candidate'], dir)
    assert.equal(r.status, 0, r.stderr)
    const lines = r.stdout.split('\n').filter((l) => l.startsWith('would query'))
    assert.equal(lines.length, 3)
    for (const l of lines) assert.match(l, /\(Granby,Quebec,Canada, gl=ca, google\.ca, hl=/)
    assert.match(lines.find((l) => l.includes(' C1 ')), /hl=fr\)$/)
    assert.match(lines.find((l) => l.includes(' C8 ')), /hl=en\)$/)
    assert.match(lines.find((l) => l.includes(' C10 ')), /hl=es\)$/)
  })
})

describe('the other forms of the brand name', () => {
  test('brandNameList: brand.name (or the override), nameAr and alternateNames, trimmed, lower-cased, once each', () => {
    assert.deepEqual(brandNameList({ brand: { name: 'Diab Car', nameAr: 'دياب كار' } }), ['diab car', 'دياب كار'])
    assert.deepEqual(brandNameList({ brand: { name: 'X', alternateNames: [' X ', 'Y', '', null, 'y'] } }, 'Z'), ['z', 'x', 'y'])
    assert.deepEqual(brandNameList(null), [])
  })

  test('rank-config.mjs: « Coco Vanille » and « Cocovanille » (scoreboard/README §3) cover every form the shop is written in', () => {
    const names = brandNameList(QC)
    for (const t of ['Pâtisserie Cocovanille', 'Patisserie Coco Vanille Inc', 'COCO VANILLE, 3 rue Court', 'Pâtisserie Coco Vanille']) assert.ok(names.some((n) => t.toLowerCase().includes(n)), t)
  })

  test('serp.mjs: the Business Profile listed as « Pâtisserie Cocovanille » is us in the map pack (saved SERP, no request)', () => {
    const dir = tmp()
    mkdirSync(join(dir, 'serp'))
    writeFileSync(join(dir, 'prompts.csv'), 'id,type,lang,prompt\nL1,local,fr,pâtisserie près de moi\n')
    writeFileSync(join(dir, 'serp', 'L1.json'), JSON.stringify({ organic_results: [{ position: 1, link: 'https://www.restomontreal.ca/resto/patisserie-cocovanille-granby/', title: 'Pâtisserie Cocovanille - Granby' }], local_results: { places: [{ position: 1, title: 'Pâtisserie Cocovanille', rating: 4.6, reviews: 50 }, { position: 2, title: 'Cake Design Granby' }] } }))
    const mapPack = (cfg) => {
      writeFileSync(join(dir, 'site.config.json'), JSON.stringify(cfg))
      const r = node([tool('serp.mjs'), '--prompts', 'prompts.csv', '--from-dir', 'serp', '--week', '2026-W45'], dir)
      assert.equal(r.status, 0, r.stderr)
      return csvObjects(readFileSync(join(dir, 'scoreboard', 'runs', '2026-W45-google.csv'), 'utf8'))[0].map_pack
    }
    assert.equal(mapPack(QC), 'yes')
    assert.equal(mapPack({ ...QC, brand: { name: QC.brand.name } }), 'no', 'brand.name alone misses the listing')
  })
})

describe('runs of a case (citation-share.mjs, market.mjs)', () => {
  test('three passes of one case are three runs, never overwritten', () => {
    const cases = runCases([{ name: '2026-W45.csv', rows: [run({ brand_named: 'yes' }), run({}), run({ brand_named: 'yes' })] }])
    assert.equal(cases.length, 1)
    assert.equal(cases[0].runs.length, 3)
  })

  test('the hand-filled file beats SerpApi and AI rows, which beat Search Console', () => {
    const cases = runCases([
      { name: '2026-W45-gsc.csv', rows: [run({ prompt_id: 'L1', engine: 'Google', google_position: '9' })] },
      { name: '2026-W45-google.csv', rows: [run({ prompt_id: 'L1', engine: 'Google', google_position: '4' }), run({ prompt_id: 'L2', engine: 'Google', google_position: '7' })] },
      { name: '2026-W45.csv', rows: [run({ prompt_id: 'L1', engine: 'Google', google_position: '2' }), run({ prompt_id: 'L1', engine: 'google', google_position: '3' })] },
    ])
    const l1 = cases.find((k) => k.prompt_id === 'L1')
    assert.deepEqual(l1.runs.map((r) => r.google_position), ['2', '3'])
    assert.equal(cases.find((k) => k.prompt_id === 'L2').runs[0].google_position, '7')
  })

  test('a case holds on 2 of 3 runs, never on 1 of 3; the position is the median run', () => {
    const named = (r) => r.brand_named === 'yes'
    assert.equal(holds([run({ brand_named: 'yes' }), run({}), run({ brand_named: 'yes' })], named), true)
    assert.equal(holds([run({ brand_named: 'yes' }), run({}), run({})], named), false)
    assert.equal(holds([run({ brand_named: 'yes' }), run({})], named), false)
    assert.equal(casePosition([{ google_position: '3' }, { google_position: '0' }, { google_position: '2' }]), 3)
    assert.equal(casePosition([{ google_position: '1' }, { google_position: '' }]), 0)
    assert.equal(casePosition([{ google_position: '5' }]), 5)
  })

  test('caseRow keeps what most runs agree on', () => {
    const k = { runs: [run({ cited_domains: 'restomontreal.ca;cocovanillegranby.com', brand_named: 'yes' }), run({ cited_domains: 'restomontreal.ca' }), run({ cited_domains: 'cocovanillegranby.com;yelp.ca', brand_named: 'oui' })] }
    const row = caseRow(k)
    assert.equal(row.cited_domains, 'restomontreal.ca;cocovanillegranby.com')
    assert.equal(row.brand_named, 'yes')
  })

  test('readRuns never reads runs/proxy/ and leaves PROXY rows out', () => {
    const dir = tmp()
    mkdirSync(join(dir, 'proxy'))
    writeFileSync(join(dir, 'proxy', '2026-W44.csv'), csv('2026-W44,C8,Google,0,,,,yes,1,yes,,"PROXY (WebSearch, US-located)"'))
    writeFileSync(join(dir, '2026-W45.csv'), csv('2026-W45,C8,Google,4,,,,,,,,phone check', '2026-W43,I1,Google,0,,,,,,,,"PROXY (copied back by mistake)"'))
    const { cases, proxySkipped } = readRuns(dir)
    assert.deepEqual(cases.map((k) => `${k.week} ${k.prompt_id}`), ['2026-W45 C8'])
    assert.equal(proxySkipped, 1)
    assert.equal(readRuns(dir, { proxy: true }).cases.length, 2)
  })

  test('citation-share.mjs: 2 of 3 counts, an unknown id is reported and never scored, a proxy week never enters the table', () => {
    const dir = tmp()
    mkdirSync(join(dir, 'runs', 'proxy'), { recursive: true })
    writeFileSync(join(dir, 'prompts.csv'), 'id,type,lang,prompt\nC1,commercial,fr,a\nC8,commercial,en,b\n')
    writeFileSync(join(dir, 'runs', '2026-W45.csv'), csv(
      '2026-W45,C1,ChatGPT,,,,cocovanillegranby.com,yes,1,,,pass 1', '2026-W45,C1,ChatGPT,,,,restomontreal.ca,no,,,,pass 2', '2026-W45,C1,ChatGPT,,,,cocovanillegranby.com,yes,1,,,pass 3',
      '2026-W45,C8,ChatGPT,,,,restomontreal.ca,yes,,,,pass 1', '2026-W45,C8,ChatGPT,,,,restomontreal.ca,no,,,,pass 2', '2026-W45,C8,ChatGPT,,,,yelp.ca,no,,,,pass 3',
      '2026-W45,Z9,ChatGPT,,,,yelp.ca,no,,,,typo'))
    writeFileSync(join(dir, 'runs', 'proxy', '2026-W44.csv'), csv('2026-W44,C1,ChatGPT,,,,cocovanillegranby.com,yes,1,,,PROXY'))
    const r = node([tool('citation-share.mjs'), '--brand', 'cocovanillegranby.com', '--runs', 'runs', '--prompts', 'prompts.csv', '--out', 'summary.csv'], dir)
    assert.equal(r.status, 0, r.stderr)
    assert.match(r.stdout, /1 prompt_id\(s\) not in prompts\.csv: counted as unknown.*Z9/)
    assert.match(r.stdout, /\(last 1 week\(s\)\): 0\/2 prompts/)
    const rows = readFileSync(join(dir, 'summary.csv'), 'utf8').trim().split('\n')
    assert.equal(rows.length, 2, 'one week (W44 is a proxy week in runs/proxy/)')
    assert.equal(rows[1], '2026-W45,ChatGPT,3,,,,,33,33,') // C1 held 2 of 3 (named, first); C8 1 of 3; Z9 not named
  })

  test('citation-share.mjs --proxy scores the proxy weeks into summary-proxy.csv, never over the real summary.csv', () => {
    const dir = tmp()
    mkdirSync(join(dir, 'scoreboard', 'runs', 'proxy'), { recursive: true })
    writeFileSync(join(dir, 'scoreboard', 'prompts.csv'), 'id,type,lang,prompt\nC8,commercial,en,best bakery in Granby Quebec\n')
    writeFileSync(join(dir, 'scoreboard', 'summary.csv'), 'the real scoreboard\n')
    writeFileSync(join(dir, 'scoreboard', 'runs', 'proxy', '2026-W44.csv'), csv('2026-W44,C8,Google,0,,,,yes,1,yes,,"PROXY (WebSearch, US-located)"'))
    const r = node([tool('citation-share.mjs'), '--brand', 'cocovanillegranby.com', '--runs', 'scoreboard/runs/proxy', '--proxy'], dir)
    assert.equal(r.status, 0, r.stderr)
    assert.equal(readFileSync(join(dir, 'scoreboard', 'summary.csv'), 'utf8'), 'the real scoreboard\n')
    assert.equal(readFileSync(join(dir, 'scoreboard', 'summary-proxy.csv'), 'utf8').trim().split('\n')[1], '2026-W44,Google,1,0,0,0,0,,,')
  })
})

describe('market.mjs', () => {
  test('writes scoreboard/market/<week>.md, never docs/19; weaknesses only in the languages the site serves; cart and login pages are not noindex weaknesses', () => {
    const dir = tmp()
    mkdirSync(join(dir, 'scoreboard'))
    mkdirSync(join(dir, 'crawl'))
    mkdirSync(join(dir, 'docs'))
    writeFileSync(join(dir, 'site.config.json'), JSON.stringify(QC))
    writeFileSync(join(dir, 'scoreboard', 'prompts.csv'), 'id,type,lang,prompt,w_score\nC1,commercial,fr,meilleure pâtisserie à Granby,18\n')
    writeFileSync(join(dir, 'docs', '19-marche-et-concurrence.md'), 'completed by hand\n')
    const page = (url, noindex) => ({ url, status: 200, noindex, words: 100, questions: [] })
    const summary = { host: 'rival.example', ok: 4, thin: 4, noDate: 4, noAuthor: 4, withFaq: 0, withVideo: 0, withQuestions: 0, avgFactDensity: 1, schemaTypes: {}, languages: { 'fr-CA': 4 }, topics: { gateau: 4 }, latestYear: null, duplicateTitles: 0, noindex: 3 }
    writeFileSync(join(dir, 'crawl', 'rival.example.json'), JSON.stringify({ summary, pages: [page('https://rival.example/', false), page('https://rival.example/cart', true), page('https://account.rival.example/authentication/oauth/authorize', true), page('https://rival.example/vieille-page/', true)] }))
    const r = node([tool('market.mjs'), '--week', '2026-W45'], dir)
    assert.equal(r.status, 0, r.stderr)
    assert.equal(readFileSync(join(dir, 'docs', '19-marche-et-concurrence.md'), 'utf8'), 'completed by hand\n')
    const md = readFileSync(join(dir, 'scoreboard', 'market', '2026-W45.md'), 'utf8')
    const weak = md.split('\n').find((l) => l.startsWith('- **rival.example**'))
    assert.match(weak, /pas de version anglaise/)
    assert.doesNotMatch(md, /arabe/)
    assert.match(weak, /· 1 pages noindex/)
  })

  test('the battle map takes each prompt’s Google position and map pack from its latest week, never an older one', () => {
    const dir = tmp()
    mkdirSync(join(dir, 'scoreboard', 'runs'), { recursive: true })
    writeFileSync(join(dir, 'site.config.json'), JSON.stringify(QC))
    writeFileSync(join(dir, 'scoreboard', 'prompts.csv'), 'id,type,lang,prompt,w_score\nL1,local,fr,pâtisserie près de moi,17\n')
    // file order puts the older week first: last week's SerpApi file (rank 1) is read before this week's hand-filled one (rank 2)
    writeFileSync(join(dir, 'scoreboard', 'runs', '2026-W45-google.csv'), csv('2026-W45,L1,Google,7,,,,,,,no,serpapi'))
    writeFileSync(join(dir, 'scoreboard', 'runs', '2026-W46.csv'), csv('2026-W46,L1,Google,2,,,,,,,yes,phone check'))
    const r = node([tool('market.mjs'), '--week', '2026-W46'], dir)
    assert.equal(r.status, 0, r.stderr)
    const row = readFileSync(join(dir, 'scoreboard', 'market', '2026-W46.md'), 'utf8').split('\n').find((l) => l.startsWith('| L1 ')).split('|').map((x) => x.trim())
    assert.equal(row[4], '2', 'our position: W46, not W45')
    assert.equal(row[10], 'yes', 'map pack: W46, not W45')
  })
})

// A child process that installs a fetch stand-in, then runs the tool: the stub is in place before the tool's first line.
function withStub(dir, stubBody, script, args) {
  const runner = join(dir, 'run-with-stub.mjs')
  writeFileSync(runner, `${stubBody}\nawait import(${JSON.stringify(pathToFileURL(script).href)})\n`)
  return node([runner, ...args], dir)
}

describe('crawl.mjs', () => {
  test('a 200 that is not HTML is skipped; a login redirect is stored without its query string', () => {
    const dir = tmp()
    const stub = `
const html = (body) => \`<!doctype html><html lang="fr"><head><title>t</title></head><body>\${body}</body></html>\`
const pages = {
  'https://rival.example/': [200, 'text/html; charset=UTF-8', html('<a href="/choco-vanille/">a</a> <a href="/compte/connexion">b</a> <a href="/gateaux/">c</a>')],
  'https://rival.example/choco-vanille/': [200, 'image/jpeg', '\\u00ff\\u00d8\\u00ff'],
  'https://rival.example/gateaux/': [200, 'text/html', html('<h1>Gâteaux</h1>')],
}
globalThis.fetch = async (url) => {
  const u = String(url)
  if (u === 'https://rival.example/compte/connexion') return { status: 200, url: 'https://account.rival.example/authorize?state=abc&nonce=xyz&client_id=1', headers: new Headers({ 'content-type': 'text/html' }), text: async () => html('<meta name="robots" content="noindex">') }
  const [status, type, body] = pages[u] ?? [404, 'text/html', 'not found']
  return { status, url: u, headers: new Headers({ 'content-type': type }), text: async () => body }
}`
    const r = withStub(dir, stub, tool('crawl.mjs'), ['https://rival.example/', '--out', 'rival.json', '--delay', '0', '--no-robots'])
    assert.equal(r.status, 0, r.stderr)
    const { summary, pages } = JSON.parse(readFileSync(join(dir, 'rival.json'), 'utf8'))
    assert.equal(summary.statusCounts['non-html'], 1)
    assert.equal(summary.ok, 3)
    assert.equal(pages.find((p) => p.status === 'non-html').contentType, 'image/jpeg')
    assert.ok(pages.some((p) => p.url === 'https://account.rival.example/authorize'))
    assert.ok(!JSON.stringify(pages).includes('?'), 'no stored URL keeps a query string')
  })
})

describe('ai-runs.mjs', () => {
  test('searches from Québec in every engine, reads data/facts.json, flags only the numbers that are not ours', () => {
    const dir = tmp()
    writeFileSync(join(dir, 'site.config.json'), JSON.stringify({ ...QC, facts: join(ROOT, 'data', 'facts.json') }))
    writeFileSync(join(dir, 'prompts.csv'), 'id,type,lang,prompt\nB2,brand,fr,Coco Vanille Granby heures\nX1,candidate,fr,pâtisserie Granby\n')
    const stub = `
import { appendFileSync } from 'node:fs'
const text = 'Pâtisserie Coco Vanille, 3 rue Court, Granby. Téléphone : (450) 770-7246 ou 438-528-7818; principal 450-372-7177.'
globalThis.fetch = async (url, opts = {}) => {
  const u = String(url)
  if (opts.method !== 'POST') throw new Error('offline')
  appendFileSync('bodies.jsonl', JSON.stringify({ host: new URL(u).host, body: JSON.parse(opts.body) }) + '\\n')
  const json = u.includes('openai') || u.includes('perplexity') ? { output: [{ type: 'message', content: [{ type: 'output_text', text, annotations: [] }] }] }
    : u.includes('generativelanguage') ? { candidates: [{ content: { parts: [{ text }] }, groundingMetadata: {} }] } : { content: [{ type: 'text', text }] }
  return new Response(JSON.stringify(json), { status: 200, headers: { 'content-type': 'application/json' } })
}`
    const keys = { OPENAI_API_KEY: 'stub', PERPLEXITY_API_KEY: 'stub', GEMINI_API_KEY: 'stub', ANTHROPIC_API_KEY: 'stub' }
    const runner = join(dir, 'run-with-stub.mjs')
    writeFileSync(runner, `${stub}\nawait import(${JSON.stringify(pathToFileURL(tool('ai-runs.mjs')).href)})\n`)
    const r = spawnSync(process.execPath, [runner, '--prompts', 'prompts.csv', '--skip-type', 'candidate', '--week', '2026-W45', '--delay', '0', '--no-verify-mentions'], { cwd: dir, encoding: 'utf8', env: { ...process.env, ...keys, FORCE_COLOR: '0' } })
    assert.equal(r.status, 0, r.stderr)
    const bodies = readFileSync(join(dir, 'bodies.jsonl'), 'utf8').trim().split('\n').map((l) => JSON.parse(l))
    assert.equal(bodies.length, 4, 'B2 once per engine, the candidate skipped')
    const where = { country: 'CA', region: 'Quebec', city: 'Granby', timezone: 'America/Toronto' }
    assert.deepEqual(bodies.find((b) => b.host === 'api.openai.com').body.tools[0].user_location, { type: 'approximate', ...where })
    assert.deepEqual(bodies.find((b) => b.host === 'api.anthropic.com').body.tools[0].user_location, { type: 'approximate', ...where })
    assert.deepEqual(bodies.find((b) => b.host === 'api.perplexity.ai').body.tools[0].user_location, { country: 'CA', city: 'Granby' })
    assert.deepEqual(bodies.find((b) => b.host === 'generativelanguage.googleapis.com').body.toolConfig.retrievalConfig.latLng, { latitude: QC.geo.lat, longitude: QC.geo.lng })
    assert.ok(!JSON.stringify(bodies).includes('"MA"') && !JSON.stringify(bodies).includes('Casablanca'))
    const facts = readFileSync(join(dir, 'ai', '2026-W45', 'facts-propagation.csv'), 'utf8').trim().split('\n').slice(1)
    assert.equal(facts.length, 4)
    for (const line of facts) assert.match(line, /,yes,phone\.primary,4507707246,$/)
    assert.ok(existsSync(join(dir, 'scoreboard', 'runs', '2026-W45-ai.csv')))
  })

  test('a relative "facts" path is read from the folder of the config file that names it (--dry-run, no request)', () => {
    const dir = tmp()
    mkdirSync(join(dir, 'conf'))
    mkdirSync(join(dir, 'data'))
    writeFileSync(join(dir, 'data', 'facts.json'), JSON.stringify({ facts: [{ id: 'phone.primary', value: '450-372-7177' }] }))
    writeFileSync(join(dir, 'conf', 'site.config.json'), JSON.stringify({ ...QC, facts: '../data/facts.json' }))
    writeFileSync(join(dir, 'prompts.csv'), 'id,type,lang,prompt\nB2,brand,fr,Coco Vanille Granby heures\n')
    const r = node([tool('ai-runs.mjs'), '--config', join('conf', 'site.config.json'), '--prompts', 'prompts.csv', '--from-dir', 'ai', '--engines', 'openai', '--dry-run'], dir)
    assert.equal(r.status, 0, r.stderr)
    assert.match(r.stdout, /facts: .*data[\\/]facts\.json · 1 prompts/)
    assert.doesNotMatch(r.stdout, /No facts file/)
    assert.match(r.stdout, /would ask ChatGPT: B2/)
  })
})
