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

// Check and record in the same synchronous step, before any await: parallel requests can't all slip past a
// check that only counts once each of them has finished (a burst of PIN guesses). A success hands its slot back.
export function attempt(key, { max = 20, windowMs = 10 * 60 * 1000, now = Date.now() } = {}) {
  if (tooMany(key, { max, windowMs, now })) return false
  failed(key, { windowMs, now })
  return true
}

export function forgive(key) {
  const list = fails.get(key)
  if (list?.length) list.pop()
}
