'use client'

// Offline outbox (16a §7, 16b §3): a tap is persisted in IndexedDB first, shown at once, then sent with an
// idempotency key; the server never applies the same key twice. Safari has no Background Sync, so the queue
// is flushed on app open, on `online` and when the screen comes back (`visibilitychange`).
// Only the actions allowed offline wait in the queue (16 §3.0); the others say they need the network.
const DB = 'coco-studio'
const STORE = 'outbox'
export const OFFLINE_TYPES = new Set(['product.soldout', 'product.restock', 'order.ready', 'order.pickup', 'vitrine.photo', 'question.create', 'order.phone'])

let dbPromise = null
function db() {
  if (typeof indexedDB === 'undefined') return Promise.resolve(null)
  dbPromise ||= new Promise((resolve) => {
    const req = indexedDB.open(DB, 1)
    req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: 'id' })
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => resolve(null)
  })
  return dbPromise
}

async function tx(mode, fn) {
  const d = await db()
  if (!d) return null
  return new Promise((resolve) => {
    const t = d.transaction(STORE, mode)
    const req = fn(t.objectStore(STORE))
    t.oncomplete = () => resolve(req ? req.result : null)
    t.onerror = () => resolve(null)
  })
}

export const pending = async () => ((await tx('readonly', (s) => s.getAll())) || []).sort((a, b) => a.at - b.at)
export const count = async () => (await tx('readonly', (s) => s.count())) || 0
const remove = (id) => tx('readwrite', (s) => s.delete(id))
const put = (action) => tx('readwrite', (s) => s.put(action))

const emit = (name, detail) => window.dispatchEvent(new CustomEvent(name, { detail }))
const uuid = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`)

async function post(action) {
  const blobKey = Object.entries(action.input || {}).find(([, v]) => v instanceof Blob)
  let res
  if (blobKey) {
    const form = new FormData()
    form.set('type', action.type)
    form.set('key', action.id)
    for (const [k, v] of Object.entries(action.input)) form.append(k, v instanceof Blob ? new File([v], v.name || 'photo.jpg', { type: v.type || 'image/jpeg' }) : String(v ?? ''))
    res = await fetch('/svc/action/', { method: 'POST', headers: { accept: 'application/json', 'idempotency-key': action.id }, body: form, credentials: 'same-origin' })
  } else {
    res = await fetch('/svc/action/', {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json', 'idempotency-key': action.id },
      body: JSON.stringify({ type: action.type, input: action.input, key: action.id }),
      credentials: 'same-origin',
    })
  }
  const body = await res.json().catch(() => ({ ok: false, code: 'server', message: 'Problème de notre côté. Rien n’est perdu. L’agence est avertie.' }))
  return { status: res.status, body }
}

let flushing = null
export function flush() {
  flushing ||= (async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.onLine === false) return
      for (const action of await pending()) {
        let r
        try {
          r = await post(action)
        } catch {
          break // network: keep it for the next try
        }
        if (r.status >= 500) break
        await remove(action.id) // applied (2xx) or refused for good (4xx)
        if (!r.body.ok && r.body.code !== 'login') emit('studio:rejected', { action, result: r.body })
        if (r.body.code === 'login') {
          await put(action)
          break
        }
      }
    } finally {
      emit('studio:outbox', { count: await count() })
      flushing = null
    }
  })()
  return flushing
}

// One tap. Returns the server result, or { ok: true, queued: true } when it waits for the network.
export async function act(type, input = {}) {
  const action = { id: uuid(), type, input, at: Date.now() }
  const queueable = OFFLINE_TYPES.has(type)
  const online = typeof navigator === 'undefined' || navigator.onLine !== false
  if (!online && !queueable) return { ok: false, code: 'offline', message: 'Cette action a besoin du réseau. Rien n’a été envoyé.' }
  if (queueable) await put(action)
  if (!online) {
    emit('studio:outbox', { count: await count() })
    return { ok: true, queued: true, message: 'Hors ligne · gardé, envoi automatique au retour du réseau.' }
  }
  try {
    const r = await post(action)
    if (queueable && r.status < 500 && r.body.code !== 'login') await remove(action.id)
    if (r.status >= 500 && queueable) {
      emit('studio:outbox', { count: await count() })
      return { ok: true, queued: true, message: 'Problème de réseau · gardé, nouvel essai automatique.' }
    }
    return r.body
  } catch {
    if (queueable) {
      emit('studio:outbox', { count: await count() })
      return { ok: true, queued: true, message: 'Hors ligne · gardé, envoi automatique au retour du réseau.' }
    }
    return { ok: false, code: 'offline', message: 'Cette action a besoin du réseau. Rien n’a été envoyé.' }
  }
}

export async function undoAction(id) {
  try {
    const res = await fetch('/svc/annuler/', { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify({ input: { id } }), credentials: 'same-origin' })
    return await res.json()
  } catch {
    return { ok: false, code: 'offline', message: 'Annulation impossible hors ligne.' }
  }
}

let wired = false
export function wireOutbox() {
  if (wired || typeof window === 'undefined') return
  wired = true
  window.addEventListener('online', () => flush())
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') flush()
  })
  flush()
}
