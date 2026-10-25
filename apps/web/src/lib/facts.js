// Zero-invention rule: a fact is either a real value or a visible marker.
// The marker text matches rank-first's audit rule ("[[FACT NEEDED: …]]").
export const MARKER_RE = /\[\[FACT NEEDED[^\]]*\]\]/

export const marker = (label) => `[[FACT NEEDED: ${label}]]`

export const isMissing = (value) =>
  value === undefined ||
  value === null ||
  value === '' ||
  (Array.isArray(value) && value.length === 0) ||
  (typeof value === 'string' && MARKER_RE.test(value))

// Returns the value, or the marker when the value is missing.
export const factOr = (value, label) => (isMissing(value) ? marker(label) : value)

// "show" renders markers (staging). "strict" hides any page that still has one (production).
export const publishGuard = () => (process.env.PUBLISH_GUARD === 'strict' ? 'strict' : 'show')

export const containsMarker = (data) => MARKER_RE.test(typeof data === 'string' ? data : JSON.stringify(data ?? ''))
