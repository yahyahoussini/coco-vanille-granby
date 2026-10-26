// Invariants of infra/ that must not regress (nginx, Compose, the shell helpers).
// Run: node --test 'scripts/test/*.test.js'  (CI also runs nginx -t and shellcheck on the same files)
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

const infra = resolve(dirname(fileURLToPath(import.meta.url)), '../../../../infra')
const read = (p) => readFileSync(join(infra, p), 'utf8')
const nginx = (p) => read(`nginx/${p}`).replace(/#.*$/gm, '')

// Top-level `location … { … }` blocks of a server config, with their bodies.
function locations(conf) {
  const out = []
  const re = /location\s+([^{]+)\{/g
  let m
  while ((m = re.exec(conf))) {
    let depth = 1
    let i = re.lastIndex
    while (depth && i < conf.length) {
      if (conf[i] === '{') depth++
      if (conf[i] === '}') depth--
      i++
    }
    out.push({ match: m[1].trim(), body: conf.slice(re.lastIndex, i - 1) })
  }
  return out
}

test('HSTS is set by nginx, without preload', () => {
  const hsts = nginx('snippets/coco-hsts.conf')
  assert.match(hsts, /add_header Strict-Transport-Security "max-age=\d+[^"]*" always;/)
  assert.doesNotMatch(hsts, /preload/)
})

test('public host: apex canonical in one hop, private paths 404, long cache on /_next/static', () => {
  const conf = nginx('sites/cocovanillegranby.com.conf')
  assert.equal((conf.match(/return 301 https:\/\/cocovanillegranby\.com\$request_uri;/g) || []).length, 2)
  const blocks = locations(conf)
  const privateBlock = blocks.find((b) => b.match.includes('(admin|api|studio)'))
  assert.ok(privateBlock && /return 404;/.test(privateBlock.body))
  const statics = blocks.find((b) => b.match === '^~ /_next/static/')
  assert.match(statics.body, /max-age=31536000, immutable/)
  assert.match(conf, /proxy_pass http:\/\/coco_production_web;/)
  // Uploads straight from disk, but never the customers' request photos (Loi 25).
  const media = blocks.find((b) => b.match === '^~ /media/')
  assert.match(media.body, /alias \/opt\/coco\/production\/media\/;/)
  assert.match(blocks.find((b) => b.match === '^~ /media/demandes/').body, /return 404;/)
  assert.match(nginx('snippets/coco-proxy.conf'), /proxy_set_header Host \$host;/)
  assert.match(nginx('snippets/coco-proxy.conf'), /proxy_set_header X-Real-IP \$remote_addr;/)
})

test('an add_header inside a location drops the server ones: every such location repeats HSTS', () => {
  for (const site of ['cocovanillegranby.com.conf', 'admin.cocovanillegranby.com.conf', 'staging.cocovanillegranby.com.conf']) {
    for (const b of locations(nginx(`sites/${site}`))) {
      if (/add_header/.test(b.body)) assert.match(b.body, /coco-hsts\.conf/, `${site} location ${b.match}`)
    }
  }
})

test('admin host: noindex on every status, login rate limit, unbuffered SSE, 12 MB uploads', () => {
  const conf = nginx('sites/admin.cocovanillegranby.com.conf')
  assert.match(conf, /add_header X-Robots-Tag "noindex, nofollow, noarchive" always;/)
  assert.match(conf, /client_max_body_size 12m;/)
  const blocks = locations(conf)
  assert.ok(!blocks.some((b) => /add_header/.test(b.body)), 'no location may add its own headers (it would drop X-Robots-Tag)')
  const login = blocks.find((b) => b.match.includes('/api/users/') && b.match.includes('login'))
  assert.match(login.body, /limit_req zone=coco_login/)
  const sse = blocks.find((b) => b.match === '^~ /flux/')
  assert.match(sse.body, /proxy_buffering off;/)
  assert.match(nginx('conf.d/coco.conf'), /limit_req_zone \$binary_remote_addr zone=coco_login:/)
})

test('staging pair: basic auth and noindex on both hosts', () => {
  const conf = nginx('sites/staging.cocovanillegranby.com.conf')
  assert.equal((conf.match(/auth_basic_user_file \/etc\/nginx\/coco\/staging\.htpasswd;/g) || []).length, 2)
  assert.equal((conf.match(/add_header X-Robots-Tag "noindex, nofollow, noarchive" always;/g) || []).length, 2)
  assert.match(locations(conf).find((b) => b.match === '^~ /media/demandes/').body, /return 404;/)
})

test('unknown hosts and the raw IP get nothing', () => {
  const conf = nginx('sites/00-default.conf')
  assert.equal((conf.match(/default_server/g) || []).length, 4)
  assert.equal((conf.match(/return 444;/g) || []).length, 2)
  assert.match(conf, /ssl_reject_handshake on;/)
})

test('Compose: Postgres never published, app ports on 127.0.0.1 only, logs rotated', () => {
  const compose = read('docker-compose.yml')
  const db = compose.slice(compose.indexOf('\n  db:'), compose.indexOf('\n  migrate:'))
  assert.doesNotMatch(db, /ports:/)
  assert.match(db, /image: postgres:16/)
  const ports = [...compose.matchAll(/ports: \['([^']+)'\]/g)].map((m) => m[1])
  assert.equal(ports.length, 4)
  for (const p of ports) assert.match(p, /^127\.0\.0\.1:/)
  assert.match(compose, /max-size: 10m/)
  assert.match(compose, /command: \[npm, run, --silent, migrate\]/)
  assert.match(compose, /internal: true/)
  for (const role of ['web', 'studio', 'worker', 'migrate']) assert.match(compose, new RegExp(`APP_ROLE: ${role}`))
})

test('.env.example documents every variable the compose file interpolates', () => {
  const env = read('.env.example')
  const keys = new Set([...env.matchAll(/^([A-Z0-9_]+)=/gm)].map((m) => m[1]))
  const used = new Set([...read('docker-compose.yml').matchAll(/\$\{([A-Z0-9_]+)[:?}-]/g)].map((m) => m[1]))
  const state = new Set(['BLUE_TAG', 'GREEN_TAG', 'WORKER_TAG', 'DEPLOY_TAG']) // written by deploy.sh
  for (const k of used) if (!state.has(k)) assert.ok(keys.has(k), `${k} missing from infra/.env.example`)
  for (const k of ['PUBLISH_GUARD', 'ENABLE_ES', 'APP_ROLE', 'STRIPE_SECRET_KEY', 'TWILIO_AUTH_TOKEN', 'AWS_ACCESS_KEY_ID', 'EMAIL_PROVIDER', 'MAIL_FROM', 'REVALIDATE_SECRET', 'VAPID_PRIVATE_KEY']) assert.ok(keys.has(k), k)
  assert.match(env, /^PUBLISH_GUARD=strict$/m)
  assert.match(env, /^ENABLE_ES=false$/m)
  // Every variable carries a comment above it (or in its section).
  const lines = env.split('\n')
  lines.forEach((line, i) => {
    if (/^[A-Z0-9_]+=/.test(line)) assert.ok(lines.slice(Math.max(0, i - 6), i).some((l) => l.startsWith('#')), `${line} has no comment`)
  })
})

// Every variable the app reads (process.env.X, or env.X in the adapters that take env as a parameter).
function appEnvVars() {
  const src = resolve(infra, '../apps/web/src')
  const out = new Set()
  const walk = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, e.name)
      if (e.isDirectory()) walk(full)
      else if (/\.m?js$/.test(e.name)) for (const m of readFileSync(full, 'utf8').matchAll(/\b(?:process\.env|env)\.([A-Z][A-Z0-9_]{2,})\b/g)) out.add(m[1])
    }
  }
  walk(src)
  return out
}
const envKeys = (file) => new Set([...readFileSync(file, 'utf8').matchAll(/^([A-Z0-9_]+)=/gm)].map((m) => m[1]))
// Set by the platform, the image or Compose, never by hand.
const PLATFORM = new Set(['NODE_ENV'])
// Development and CI only: not on a server.
const DEV_ONLY = new Set(['SEED_DEV_USER', 'MESSAGE_LOG_FILE', 'WORKER_ONCE', 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', 'SES_REGION', 'AWS_SESSION_TOKEN', 'APP_VERSION', 'GIT_SHA', 'PORT', 'DATABASE_URI', 'PAYLOAD_CONFIG_PATH'])

test('both .env.example files document every variable the app reads', () => {
  const used = appEnvVars()
  assert.ok(used.size > 40, `found ${used.size} variables`)
  const dev = envKeys(resolve(infra, '../apps/web/.env.example'))
  const server = envKeys(join(infra, '.env.example'))
  for (const k of used) {
    if (PLATFORM.has(k)) continue
    assert.ok(dev.has(k), `${k} missing from apps/web/.env.example`)
    if (!DEV_ONLY.has(k)) assert.ok(server.has(k), `${k} missing from infra/.env.example`)
  }
  // Same names on both sides: nothing documented that the app does not read (beyond the infra-only block).
  const INFRA_ONLY = /^(APP_ENV|IMAGE|WEB_|STUDIO_|MEDIA_DIR|TZ|POSTGRES_|PUBLIC_HOST|ADMIN_HOST|BACKUP_|AGE_|HEARTBEAT_|INDEXNOW_KEY|SENTRY_DSN|VAPID_SUBJECT|NEXT_SERVER_ACTIONS_ENCRYPTION_KEY|REVALIDATE_URL)/
  for (const k of server) if (!INFRA_ONLY.test(k)) assert.ok(used.has(k), `${k} is in infra/.env.example but the app never reads it`)
})

const bash = (script) => execFileSync('bash', ['-c', `set -euo pipefail; . "${join(infra, 'scripts/lib.sh')}"; ${script}`], { encoding: 'utf8' })

test('lib.sh reads .env without executing it, and writes state.env atomically', () => {
  const root = mkdtempSync(join(tmpdir(), 'coco-lib-'))
  const dir = join(root, 'production')
  execFileSync('mkdir', ['-p', dir])
  writeFileSync(join(dir, '.env'), 'A=1\nSECRET=$(touch pwned)\nQUOTED="two words"\nA=2\nWEB_GREEN_PORT=4011\n')
  const out = bash(`COCO_ROOT='${root}'; ENV_NAME=production; env_get A; echo; env_get SECRET; echo; env_get QUOTED; echo; env_get MISSING dflt; echo; port_of web green; echo; port_of studio blue; echo; other_colour blue; echo; state_set LIVE_COLOR blue; state_set LIVE_COLOR green; state_set BLUE_TAG abc; state_get LIVE_COLOR; echo; upper green`)
  assert.deepEqual(out.trim().split('\n'), ['2', '$(touch pwned)', 'two words', 'dflt', '4011', '3002', 'green', 'green', 'GREEN'])
  assert.equal(readFileSync(join(dir, 'state.env'), 'utf8'), 'LIVE_COLOR=green\nBLUE_TAG=abc\n')
})

test('lib.sh switch_upstream writes the include and puts the old one back when nginx -t fails', () => {
  const root = mkdtempSync(join(tmpdir(), 'coco-ngx-'))
  execFileSync('mkdir', ['-p', join(root, 'staging')])
  writeFileSync(join(root, 'staging', '.env'), '')
  const run = (colour, testCmd) => bash(`COCO_ROOT='${root}'; NGINX_COCO_DIR='${root}/ngx'; NGINX_TEST_CMD='${testCmd}'; NGINX_RELOAD_CMD=true; ENV_NAME=staging; switch_upstream ${colour}`)
  run('green', 'true')
  const file = join(root, 'ngx/upstreams/staging.conf')
  assert.match(readFileSync(file, 'utf8'), /upstream coco_staging_web \{\n {2}server 127\.0\.0\.1:3111;/)
  assert.match(readFileSync(file, 'utf8'), /upstream coco_staging_studio \{\n {2}server 127\.0\.0\.1:3112;/)
  assert.throws(() => run('blue', 'false'), /Command failed/)
  assert.match(readFileSync(file, 'utf8'), /127\.0\.0\.1:3111/)
})
