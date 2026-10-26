// Reads a Studio action from a request: JSON from the outbox (fetch), or a plain HTML form (JavaScript off).
const RESERVED = new Set(['type', 'key', 'back'])

export async function readAction(request) {
  const type = request.headers.get('content-type') || ''
  if (type.includes('application/json')) {
    const body = await request.json().catch(() => ({}))
    return { type: String(body.type || ''), key: body.key ? String(body.key) : null, back: body.back || null, input: body.input && typeof body.input === 'object' ? body.input : {} }
  }
  const form = await request.formData().catch(() => null)
  if (!form) return { type: '', key: null, back: null, input: {} }
  const input = {}
  for (const [k, v] of form.entries()) {
    if (RESERVED.has(k)) continue
    const value = typeof v === 'string' ? v : v
    if (k.endsWith('[]')) (input[k.slice(0, -2)] ||= []).push(value)
    else if (k in input) input[k] = [].concat(input[k], value)
    else input[k] = value
  }
  const get = (k) => (typeof form.get(k) === 'string' ? form.get(k) : null)
  return { type: get('type') || '', key: get('key') || request.headers.get('idempotency-key') || null, back: get('back'), input }
}

// Query string for the server-rendered notice after a no-JavaScript form post.
export function withParams(path, params) {
  const [base, hash] = String(path).split('#')
  const [p, q] = base.split('?')
  const sp = new URLSearchParams(q || '')
  for (const k of ['fait', 'erreur', 'msg', 'annule']) sp.delete(k)
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== null && v !== '') sp.set(k, String(v))
  const qs = sp.toString()
  return `${p}${qs ? `?${qs}` : ''}${hash ? `#${hash}` : ''}`
}
