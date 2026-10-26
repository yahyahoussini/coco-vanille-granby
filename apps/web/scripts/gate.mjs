#!/usr/bin/env node
// rank-first gate against a running server (plan v1 §12, research/19 §1.2 step 3).
// 1. Saves the raw HTML (what a crawler that runs no JavaScript sees) of every indexable FR/EN page
//    of src/lib/routes.js, every sitemap URL, robots.txt, sitemap.xml and the 404 page.
// 2. Runs ../../tools/audit.mjs (page contract) on that folder, and ../../tools/links.mjs on the
//    same pages plus every internal link target they reach (so a link to /boite/ is not "broken").
// 3. Fails unless every FAIL is explained by a [[FACT NEEDED]] marker, and prints those markers as
//    the owner's to-do list (also written to <out>/owner-todo.md). "Explained" is narrow (gate-lib.mjs):
//    the marker FAIL itself, or the noindex/title/description FAILs of a page the publish guard holds
//    back because it shows a marker. One audit.mjs false positive (a schema.org Bakery node is not
//    seen as the business node) is listed apart, only when the page really has that node.
// Usage: node scripts/gate.mjs [--base http://localhost:3000] [--out reports/gate] [--auth user:pass] [--max 300]
//   --base  server to read (default GATE_BASE_URL, then PUBLIC_ORIGIN); its Host must route to the public site
//   --auth  HTTP basic auth for staging (default GATE_BASIC_AUTH)
// Reads PUBLISH_GUARD and ENABLE_ES like the server: under strict, an unpublished registry page (404) is
// listed, not failed; under show (CI, staging) every registry page must answer 200.
// Exit 0 = pass, 1 = real failures, 2 = could not run.
import { mkdirSync, rmSync, writeFileSync, readFileSync, existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { parseArgs } from 'node:util'
import { PAGES, esEnabled } from '../src/lib/routes.js'
import { gatePages, siteConfig, internalLinks, sitemapPaths, classifyAudit, linkFails, ownerTodo, todoMarkdown } from './gate-lib.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const tools = resolve(here, '../../../tools')
const { values } = parseArgs({
  options: {
    base: { type: 'string', default: process.env.GATE_BASE_URL || process.env.PUBLIC_ORIGIN || 'http://localhost:3000' },
    out: { type: 'string', default: 'reports/gate' },
    auth: { type: 'string', default: process.env.GATE_BASIC_AUTH || '' },
    max: { type: 'string', default: '300' },
  },
})
const base = values.base.replace(/\/$/, '')
const out = resolve(values.out)
const htmlDir = join(out, 'html')
const linksDir = join(out, 'links')
const MAX = Number(values.max)
const headers = { 'user-agent': 'coco-gate/1 (+rank-first)', accept: 'text/html,application/xhtml+xml,*/*' }
if (values.auth) headers.authorization = `Basic ${Buffer.from(values.auth).toString('base64')}`

const step = (s) => console.log(`\n==> ${s}`)
const fileFor = (root, path) => (path.endsWith('/') ? join(root, path, 'index.html') : join(root, path))

async function get(path) {
  try {
    const res = await fetch(`${base}${path}`, { headers, redirect: 'manual', signal: AbortSignal.timeout(30_000) })
    return { status: res.status, location: res.headers.get('location'), type: res.headers.get('content-type') || '', body: await res.text() }
  } catch (e) {
    return { status: 0, error: e.message, body: '' }
  }
}

function save(root, path, body) {
  const file = fileFor(root, path)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, body)
}

function run(script, args) {
  const r = spawnSync(process.execPath, [join(tools, script), ...args], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
  const text = `${r.stdout || ''}${r.stderr || ''}`
  process.stdout.write(text)
  return { status: r.status, text }
}

if (!existsSync(join(tools, 'audit.mjs')) || !existsSync(join(tools, 'links.mjs'))) {
  console.error(`rank-first tools not found in ${tools}`)
  process.exit(2)
}

rmSync(out, { recursive: true, force: true })
mkdirSync(htmlDir, { recursive: true })
const es = esEnabled()
const strict = process.env.PUBLISH_GUARD === 'strict'
const problems = [] // real failures found by the gate itself (status codes, redirects)
const hidden = [] // registry pages the server does not publish yet (404 under PUBLISH_GUARD=strict)
const htmlByPath = {}

step(`Reading ${base}`)
const ping = await get('/svc/health/?shallow=1')
if (ping.status !== 200) {
  console.error(`Server not reachable at ${base} (/svc/health/ → ${ping.status || ping.error})`)
  process.exit(2)
}

const robots = await get('/robots.txt')
if (robots.status === 200) save(htmlDir, '/robots.txt', robots.body)
else problems.push({ where: '/robots.txt', message: `HTTP ${robots.status}` })
const sitemap = await get('/sitemap.xml')
if (sitemap.status === 200) save(htmlDir, '/sitemap.xml', sitemap.body)
else problems.push({ where: '/sitemap.xml', message: `HTTP ${sitemap.status}` })

const registry = gatePages(PAGES, { es })
const wanted = new Map(registry.map((p) => [p.path, p]))
for (const path of sitemapPaths(sitemap.body)) if (!wanted.has(path) && (es || !path.startsWith('/es/'))) wanted.set(path, { path, from: 'sitemap' })

step(`Saving ${wanted.size} indexable pages (${registry.length} from src/lib/routes.js${es ? ', ES on' : ''}, the rest from the sitemap)`)
for (const [path, page] of wanted) {
  const r = await get(path)
  if (r.status === 200 && /html/.test(r.type)) {
    save(htmlDir, path, r.body)
    htmlByPath[path] = r.body
    console.log(`  200 ${path}`)
  } else if (r.status === 404 && strict && !page.from) {
    // PUBLISH_GUARD=strict: a registry page that still lacks a fact is not published (src/lib/facts.js).
    hidden.push(path)
    console.log(`  404 ${path} (not published until its facts exist)`)
  } else {
    problems.push({ where: path, message: r.status === 0 ? `fetch failed: ${r.error}` : `HTTP ${r.status}${r.location ? ` → ${r.location}` : ''}` })
    console.log(`  ${r.status} ${path}`)
  }
}
const missing = await get(`/gate-introuvable-${Date.now()}/`)
if (missing.status === 404) save(htmlDir, '/404.html', missing.body)
else problems.push({ where: '404 page', message: `an unknown URL answered HTTP ${missing.status}, not 404` })

step('Following internal links (for links.mjs)')
const reached = new Map(Object.entries(htmlByPath))
const queue = [...reached.keys()]
const linkTargets = new Map() // path -> status
while (queue.length && reached.size < MAX) {
  const from = queue.shift()
  for (const target of internalLinks(reached.get(from))) {
    if (reached.has(target) || linkTargets.has(target)) continue
    const r = await get(target)
    linkTargets.set(target, r.status)
    if (r.status === 200 && /html/.test(r.type)) {
      reached.set(target, r.body)
      queue.push(target)
    } else if (r.status >= 200 && r.status < 400) {
      // A redirect or a file: the link works; links.mjs only needs something at that path.
      reached.set(target, '<!doctype html><title>link target</title>')
    }
    console.log(`  ${r.status} ${target} (linked from ${from})`)
  }
}
for (const [path, body] of reached) save(linksDir, path, body)

step('Writing site.config.json for rank-first')
const configFile = join(out, 'site.config.json')
writeFileSync(configFile, `${JSON.stringify(siteConfig(PAGES, { es }), null, 2)}\n`)

step('tools/audit.mjs (page contract)')
const auditJson = join(out, 'audit.json')
const audit = run('audit.mjs', [htmlDir, '--config', configFile, '--json', auditJson, '--quiet'])
if (!existsSync(auditJson)) {
  console.error(`audit.mjs did not write a report (exit ${audit.status})`)
  process.exit(2)
}
const { marker, toolGap, real } = classifyAudit(JSON.parse(readFileSync(auditJson, 'utf8')), htmlByPath)

step('tools/links.mjs (internal links)')
const links = run('links.mjs', [linksDir, '--config', configFile, '--json', join(out, 'links.json')])
const broken = linkFails(links.text)

const todo = ownerTodo(htmlByPath)
const generated = new Date().toISOString()
writeFileSync(join(out, 'owner-todo.md'), todoMarkdown(todo, { base, generated }))
const failures = [...problems, ...real, ...broken]
const summary = {
  generated,
  base,
  pages: Object.keys(htmlByPath).length,
  hidden,
  markerFails: marker.length,
  auditFalsePositives: toolGap,
  failures,
  ownerTodo: todo,
  pass: failures.length === 0,
}
writeFileSync(join(out, 'gate.json'), `${JSON.stringify(summary, null, 2)}\n`)

step(`Faits à fournir (propriétaire) · owner to-do: ${todo.length}`)
todo.forEach((t, i) => console.log(`  ${String(i + 1).padStart(2)}. ${t.fact}  —  ${t.pages.length} page(s): ${t.pages.slice(0, 4).join(', ')}${t.pages.length > 4 ? ', …' : ''}`))
if (hidden.length) console.log(`  Not published yet (404): ${hidden.join(', ')}`)

step('Gate result')
console.log(`  ${summary.pages} pages audited · ${marker.length} FAIL(s) explained by [[FACT NEEDED]] markers · ${failures.length} other FAIL(s)`)
if (toolGap.length) console.log(`  ${toolGap.length} audit.mjs false positive(s) not counted: Bakery node not recognised (tools/audit.mjs org check)`)
for (const f of failures) console.log(`  ✗ ${f.where}: ${f.message}`)
console.log(`  Reports: ${out}/{gate.json,audit.json,links.json,owner-todo.md}`)
console.log(failures.length ? '\nGATE FAIL' : '\nGATE PASS (only owner facts are missing)')
process.exit(failures.length ? 1 : 0)
