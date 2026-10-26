import { timingSafeEqual } from 'node:crypto'
import { clearHere } from '@/lib/revalidate'

// POST /svc/revalidate/ (17 §12.3): Studio, the worker and scripts ask the live public process to clear its
// ISR cache (src/lib/revalidate.js). nginx lets only local callers reach it; the secret is the second lock.
// Anything else (wrong role, wrong or missing secret) is a plain 404.
export const dynamic = 'force-dynamic'

const MAX_PATHS = 200

function secretOk(given) {
  const secret = Buffer.from(process.env.REVALIDATE_SECRET || '')
  const value = Buffer.from(given || '')
  return secret.length > 0 && value.length === secret.length && timingSafeEqual(value, secret)
}

const notFound = () => new Response('Introuvable', { status: 404, headers: { 'Cache-Control': 'no-store' } })

export async function POST(request) {
  if (!['web', 'all'].includes(process.env.APP_ROLE || 'all') || !secretOk(request.headers.get('x-revalidate-secret'))) return notFound()
  const body = await request.json().catch(() => ({}))
  const paths = (Array.isArray(body?.paths) ? body.paths : []).filter((p) => typeof p === 'string' && /^\/[^\s?#]*$/.test(p) && p.length <= 300).slice(0, MAX_PATHS)
  const all = body?.all === true
  await clearHere({ all, paths })
  return Response.json({ ok: true, all, paths: paths.length }, { headers: { 'Cache-Control': 'no-store' } })
}
