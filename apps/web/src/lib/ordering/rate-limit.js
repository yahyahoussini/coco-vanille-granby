// Small in-memory limiter for the public forms (one process; nginx limits in front, research/17).
const hits = new Map()

export function allow(key, { max = 5, windowMs = 10 * 60 * 1000, now = Date.now() } = {}) {
  const list = (hits.get(key) || []).filter((t) => now - t < windowMs)
  if (list.length >= max) {
    hits.set(key, list)
    return false
  }
  list.push(now)
  hits.set(key, list)
  if (hits.size > 5000) for (const k of [...hits.keys()].slice(0, 1000)) hits.delete(k)
  return true
}

// X-Real-IP is set by nginx from the connection; X-Forwarded-For can be typed by the client (audit.js ipOf).
export const clientIp = (request) => String(request.headers.get('x-real-ip') || '').trim() || 'local'
