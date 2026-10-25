import { getPayload } from 'payload'
import config from '@payload-config'

// Health check for Docker, the deploy script and the uptime monitor (17 §1.1, §12.2).
// GET /svc/health/            → one `select 1` against Postgres (2 s timeout)
// GET /svc/health/?shallow=1  → process only, no database (liveness)
// Body stays minimal on purpose: the route is public on cocovanillegranby.com.
export const dynamic = 'force-dynamic'
export const revalidate = 0

const TIMEOUT_MS = 2000

const withTimeout = (promise, ms) =>
  Promise.race([promise, new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))])

const version = () => (process.env.GIT_SHA || process.env.APP_VERSION || 'dev').slice(0, 12)

async function pingDatabase() {
  const payload = await getPayload({ config })
  const pool = payload.db?.pool
  if (pool) return pool.query('select 1')
  // Fallback if the adapter ever stops exposing its pool: the cheapest Local API read.
  return payload.find({ collection: 'users', limit: 1, depth: 0, pagination: false, overrideAccess: true })
}

export async function GET(request) {
  const shallow = new URL(request.url).searchParams.get('shallow') === '1'
  const body = { ok: true, db: 'skipped', role: process.env.APP_ROLE || 'all', version: version() }

  if (!shallow) {
    try {
      await withTimeout(pingDatabase(), TIMEOUT_MS)
      body.db = 'up'
    } catch {
      body.ok = false
      body.db = 'down'
    }
  }

  return Response.json(body, {
    status: body.ok ? 200 : 503,
    headers: { 'Cache-Control': 'no-store, max-age=0', 'X-Robots-Tag': 'noindex, nofollow' },
  })
}

export const HEAD = async (request) => {
  const res = await GET(request)
  return new Response(null, { status: res.status, headers: res.headers })
}
