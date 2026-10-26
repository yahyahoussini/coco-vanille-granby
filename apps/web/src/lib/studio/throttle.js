// Failed sign-in attempts per IP or person (one process; nginx limit_req sits in front, 16b §4 #7).
// Only failures count, so a busy shop tablet signing people in and out is never locked out.
const fails = new Map()

const recent = (key, windowMs, now) => (fails.get(key) || []).filter((t) => now - t < windowMs)

export function tooMany(key, { max = 20, windowMs = 10 * 60 * 1000, now = Date.now() } = {}) {
  const list = recent(key, windowMs, now)
  fails.set(key, list)
  return list.length >= max
}

export function failed(key, { windowMs = 10 * 60 * 1000, now = Date.now() } = {}) {
  const list = recent(key, windowMs, now)
  list.push(now)
  fails.set(key, list)
  if (fails.size > 5000) for (const k of [...fails.keys()].slice(0, 1000)) fails.delete(k)
}
