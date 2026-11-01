// IndexNow (v1 Layer 5): tells Bing, Yandex, Naver, Seznam and Yep that a page changed, so Bing (and through it
// ChatGPT search and Copilot) fetches it again within hours. Google does not use it: request indexing in Search
// Console instead. Only on the real domain, with INDEXNOW_KEY set: the key file is served at /<key>.txt by
// src/proxy.js, and a temporary address (localhost, sslip.io, nip.io) is noindex, so nothing is announced from it.
// Relative imports only: the Payload hooks (lib/revalidate.js) load outside Next too.

const KEY_RE = /^[A-Za-z0-9-]{8,128}$/
const TEMPORARY = /(^|\.)(localhost|sslip\.io|nip\.io)$/i

export const indexNowKey = (env = process.env) => (KEY_RE.test(env.INDEXNOW_KEY || '') ? env.INDEXNOW_KEY : null)

// The public host the key belongs to, or null when nothing may be announced (no key, temporary address).
export function indexNowHost(env = process.env) {
  if (!indexNowKey(env)) return null
  let host
  try {
    host = new URL(env.PUBLIC_ORIGIN || '').hostname
  } catch {
    return null
  }
  return host && !TEMPORARY.test(host) ? host : null
}

// paths: site paths ('/carte/', '/en/menu/'); only page URLs are sent (no images, feeds or service routes).
export function indexNowBody(paths = [], env = process.env) {
  const host = indexNowHost(env)
  if (!host) return null
  const urlList = [...new Set(paths)].filter((p) => typeof p === 'string' && p.startsWith('/') && p.endsWith('/') && !p.startsWith('/svc/')).map((p) => `https://${host}${p}`)
  if (!urlList.length) return null
  const key = indexNowKey(env)
  return { host, key, keyLocation: `https://${host}/${key}.txt`, urlList: urlList.slice(0, 10000) }
}

// 200 submitted, 202 received (key check pending); 403 key not valid, 422 URL not on this host, 429 too many.
export async function pingIndexNow(paths, { env = process.env, fetchImpl = fetch } = {}) {
  const body = indexNowBody(paths, env)
  if (!body) return { ok: false, skipped: true }
  const res = await fetchImpl('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(5000),
  })
  return { ok: res.status === 200 || res.status === 202, status: res.status, count: body.urlList.length }
}
