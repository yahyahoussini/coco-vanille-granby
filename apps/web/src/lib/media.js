// Uploads on the public host (17 §2.1): nginx serves /media/ from MEDIA_DIR in production and
// src/app/media/[...file]/route.js does the same in dev and standalone; /api is 404 on the public host.
// Customer request photos (media/demandes/) are never public (Loi 25 minimisation).
// Pure module (relative imports only) so node --test can load it.
import { resolve, sep, extname } from 'node:path'
import { SITE_ORIGIN } from './routes.js'

export const PRIVATE_DIRS = ['demandes']

export const MEDIA_TYPES = {
  '.avif': 'image/avif',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
}

// A Payload media doc (or one of its sizes) → { path: '/media/<file>', width, height }, or null.
export function mediaFile(media, size) {
  if (!media || typeof media !== 'object') return null
  const variant = size && media.sizes?.[size]?.filename ? media.sizes[size] : media
  if (!variant?.filename) return null
  return { path: `/media/${encodeURIComponent(variant.filename)}`, width: variant.width || null, height: variant.height || null }
}

// Absolute URL on the canonical host, for JSON-LD and feeds.
export function mediaUrl(media, size) {
  const file = mediaFile(media, size)
  return file ? `${SITE_ORIGIN}${file.path}` : null
}

// URL segments → an absolute path inside root, or null: no traversal, no hidden or private folder, images only.
export function safeMediaPath(root, segments = []) {
  const parts = [].concat(segments).map(String)
  if (!parts.length) return null
  for (const p of parts) {
    if (!p || p === '.' || p === '..' || p.startsWith('.') || /[/\\\0]/.test(p)) return null
  }
  if (PRIVATE_DIRS.includes(parts[0])) return null
  if (!MEDIA_TYPES[extname(parts.at(-1)).toLowerCase()]) return null
  const base = resolve(root)
  const target = resolve(base, ...parts)
  return target.startsWith(base + sep) ? target : null
}
