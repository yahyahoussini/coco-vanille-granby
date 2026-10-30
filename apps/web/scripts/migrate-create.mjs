#!/usr/bin/env node
// npm run migrate:create -- <name>
// Payload writes migrations in TypeScript; this project is JavaScript only. This runs Payload's generator
// (with NODE_ENV=production, so it never pushes the dev schema into the database it reads), then rewrites the
// new file as .js (same SQL, no type annotations) and drops Payload's index.ts: the migrate CLI reads the
// folder itself (prodMigrations is not used). Commit src/migrations/<stamp>_<name>.js and its .json snapshot.
import { spawnSync } from 'node:child_process'
import { readdirSync, readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'migrations')
const before = new Set(existsSync(dir) ? readdirSync(dir) : [])

const r = spawnSync('npx', ['payload', 'migrate:create', ...process.argv.slice(2)], {
  stdio: 'inherit',
  env: { ...process.env, PAYLOAD_CONFIG_PATH: 'src/payload.config.js', NODE_ENV: process.env.NODE_ENV || 'production' },
  // Windows runs npx through its .cmd shim, which needs a shell.
  shell: process.platform === 'win32',
})
if (r.status !== 0) process.exit(r.status ?? 1)

const toJavaScript = (ts) =>
  ts
    .replace(/import \{ MigrateUpArgs, MigrateDownArgs, sql \} from '([^']+)'/, "import { sql } from '$1'")
    .replace(/\}: Migrate(Up|Down)Args\): Promise<void> \{/g, '}) {')

for (const file of readdirSync(dir)) {
  if (before.has(file) || !file.endsWith('.ts') || file === 'index.ts') continue
  const js = toJavaScript(readFileSync(join(dir, file), 'utf8'))
  if (/:\s*(Migrate|Promise)/.test(js)) {
    console.error(`${file}: TypeScript left after the rewrite, convert it by hand`)
    process.exit(1)
  }
  writeFileSync(join(dir, file.replace(/\.ts$/, '.js')), js)
  rmSync(join(dir, file))
  console.log(`src/migrations/${file.replace(/\.ts$/, '.js')} (JavaScript)`)
}
rmSync(join(dir, 'index.ts'), { force: true })
