import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { join, extname } from 'node:path'
import { Readable } from 'node:stream'
import { safeMediaPath, MEDIA_TYPES } from '@/lib/media'

// /media/<file> for dev and standalone runs; in production nginx answers this path from MEDIA_DIR and the
// request never reaches Node. Same headers as nginx (infra/nginx/sites/cocovanillegranby.com.conf).
export const dynamic = 'force-dynamic'

const ROOT = join(/* turbopackIgnore: true */ process.cwd(), 'media')
const HEADERS = {
  'Cache-Control': 'public, max-age=2592000',
  'X-Content-Type-Options': 'nosniff',
  'Content-Security-Policy': "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; sandbox",
}

const notFound = () => new Response('Introuvable', { status: 404, headers: { 'Cache-Control': 'no-store', 'Content-Type': 'text/plain; charset=utf-8' } })

async function serve(request, { params }, withBody) {
  const { file = [] } = await params
  const path = safeMediaPath(ROOT, file)
  if (!path) return notFound()
  const info = await stat(path).catch(() => null)
  if (!info?.isFile()) return notFound()
  const headers = { ...HEADERS, 'Content-Type': MEDIA_TYPES[extname(path).toLowerCase()], 'Last-Modified': info.mtime.toUTCString() }
  const since = Date.parse(request.headers.get('if-modified-since') || '')
  if (!Number.isNaN(since) && Math.floor(info.mtimeMs / 1000) <= Math.floor(since / 1000)) return new Response(null, { status: 304, headers })
  headers['Content-Length'] = String(info.size)
  return new Response(withBody ? Readable.toWeb(createReadStream(path)) : null, { status: 200, headers })
}

export const GET = (request, ctx) => serve(request, ctx, true)
export const HEAD = (request, ctx) => serve(request, ctx, false)
