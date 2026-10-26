// « Ma boîte » (08 P16): the box lives in its token, so /boite/<token>/ restores it on any device
// (also the Safari hand-off from the Instagram/Facebook in-app browsers). No personal data in it:
// products, sizes, quantities and cake messages only. Prices are always re-read from the catalogue.
export const BOX_COOKIE = 'cv_boite'
export const MAX_LINES = 20
export const MAX_QTY = 50
export const MAX_MESSAGE = 60

const VERSION = 1
const TOKEN = /^[A-Za-z0-9_-]{4,3000}$/

const cleanId = (v) => (typeof v === 'number' && Number.isInteger(v) && v > 0 ? v : typeof v === 'string' && /^[A-Za-z0-9-]{1,40}$/.test(v) ? v : null)

export function normalizeItems(items = []) {
  const out = []
  for (const it of items) {
    const productId = cleanId(it?.productId)
    const variantIndex = Number.isInteger(it?.variantIndex) && it.variantIndex >= 0 && it.variantIndex < 20 ? it.variantIndex : 0
    const qty = Math.min(MAX_QTY, Math.max(0, Math.trunc(Number(it?.qty) || 0)))
    const message = String(it?.message || '').replace(/\s+/g, ' ').trim().slice(0, MAX_MESSAGE)
    if (!productId || !qty) continue
    const same = out.find((o) => o.productId === productId && o.variantIndex === variantIndex && o.message === message)
    if (same) same.qty = Math.min(MAX_QTY, same.qty + qty)
    else out.push({ productId, variantIndex, qty, message })
    if (out.length >= MAX_LINES) break
  }
  return out
}

export function encodeBox(items = []) {
  const list = normalizeItems(items)
  if (!list.length) return null
  const payload = { v: VERSION, i: list.map((l) => (l.message ? [l.productId, l.variantIndex, l.qty, l.message] : [l.productId, l.variantIndex, l.qty])) }
  return Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url')
}

export function decodeBox(token) {
  if (!token || !TOKEN.test(token)) return []
  try {
    const data = JSON.parse(Buffer.from(token, 'base64url').toString('utf8'))
    if (data?.v !== VERSION || !Array.isArray(data.i)) return []
    return normalizeItems(data.i.map(([productId, variantIndex, qty, message]) => ({ productId, variantIndex, qty, message })))
  } catch {
    return []
  }
}

// Box edits posted by the forms on the order page and « Ma boîte » (they work without JavaScript).
export function applyBoxAction(items, action = {}) {
  const list = normalizeItems(items)
  const productId = cleanId(typeof action.productId === 'string' && /^\d+$/.test(action.productId) ? Number(action.productId) : action.productId)
  const variantIndex = Number.isInteger(Number(action.variantIndex)) ? Number(action.variantIndex) : 0
  const at = Number.isInteger(Number(action.line)) ? Number(action.line) : -1
  switch (action.type) {
    case 'add':
      return normalizeItems([...list, { productId, variantIndex, qty: Number(action.qty) || 1, message: action.message }])
    case 'set':
      if (at < 0 || at >= list.length) return list
      return normalizeItems(list.map((l, i) => (i === at ? { ...l, qty: Number(action.qty), message: action.message ?? l.message } : l)))
    case 'remove':
      return list.filter((_, i) => i !== at)
    case 'clear':
      return []
    default:
      return list
  }
}

export const boxCount = (items = []) => normalizeItems(items).reduce((n, l) => n + l.qty, 0)
