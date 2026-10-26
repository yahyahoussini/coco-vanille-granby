// Refreshes the public site's ISR pages when what they show changes (17 §12.3): the shop and business globals,
// the catalogue, page copy and photos, whether the write comes from Studio, « Avancé » (/admin), the worker or
// a seed. revalidatePath only clears the cache of the process that calls it, so:
//   APP_ROLE web | all (one process in dev) → clears its own cache, inside the request that wrote;
//   studio, worker, `payload run` scripts   → POST /svc/revalidate/ on the public host (nginx: local callers
//                                             only) with REVALIDATE_SECRET; the public process clears its cache.
// A failed refresh never blocks a write: the pages renew on their own after 5 minutes (revalidate = 300).
// Relative imports only: the Payload config (and so these hooks) also loads outside Next.
import { PAGES } from './routes.js'

// Route handlers outside the page layouts, refreshed with every change.
export const FILES = ['/sitemap.xml', '/llms.txt']

// What a change touches. Hours, closures, the business identity and the catalogue appear on every page (footer
// hours, closure banner, product cards, JSON-LD), so they refresh the whole site; a page's copy refreshes its
// own URLs in every language, its card, the sitemap and /llms.txt.
export function affected(kind, doc = {}) {
  if (kind === 'pages' && doc?.key) {
    const page = PAGES.find((p) => p.key === doc.key)
    if (page) {
      const paths = Object.values(page.paths)
      const cards = Object.keys(page.paths).map((l) => `${l === 'fr' ? '' : `/${l}`}/og/${page.key}.png`)
      return { all: false, paths: [...paths, ...cards, ...FILES] }
    }
  }
  return { all: true, paths: [...FILES] }
}

// Clears this process's cache. Throws outside a Next request (scripts, the worker): the caller falls back to HTTP.
export async function clearHere({ all = false, paths = [] }) {
  const { revalidatePath } = await import('next/cache')
  if (all) revalidatePath('/', 'layout')
  for (const p of paths) revalidatePath(p)
}

export const revalidateUrl = (env = process.env) => env.REVALIDATE_URL || `${(env.PUBLIC_ORIGIN || 'https://cocovanillegranby.com').replace(/\/$/, '')}/svc/revalidate/`

export async function postRevalidate(job, { env = process.env, fetchImpl = fetch } = {}) {
  if (!env.REVALIDATE_SECRET) return { ok: false, skipped: 'REVALIDATE_SECRET not set' }
  const res = await fetchImpl(revalidateUrl(env), {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-revalidate-secret': env.REVALIDATE_SECRET },
    body: JSON.stringify(job),
    signal: AbortSignal.timeout(5000),
  })
  return { ok: res.ok, status: res.status }
}

export async function revalidatePublic(job, { env = process.env, fetchImpl = fetch, clear = clearHere } = {}) {
  const role = env.APP_ROLE || 'all'
  if (role === 'web' || role === 'all') {
    try {
      await clear(job)
      return { ok: true, local: true }
    } catch {
      // not inside a Next request (seed, worker, a render): ask the public process over HTTP
    }
  }
  try {
    return await postRevalidate(job, { env, fetchImpl })
  } catch (e) {
    return { ok: false, error: e.message }
  }
}

const run = async (kind, doc, previousDoc, req) => {
  const job = affected(kind, doc)
  if (!job.all && previousDoc?.key && previousDoc.key !== doc?.key) Object.assign(job, { all: true })
  const r = await revalidatePublic(job)
  if (!r.ok && !r.skipped) req?.payload?.logger?.warn?.({ kind, ...r }, 'public pages not refreshed (they renew within 5 minutes)')
}

// Payload hooks for a collection or a global that the public site shows.
export function revalidateHooks(kind, { global = false } = {}) {
  const afterChange = async ({ doc, previousDoc, req }) => {
    await run(kind, doc, previousDoc, req)
    return doc
  }
  if (global) return { afterChange: [afterChange] }
  const afterDelete = async ({ doc, req }) => {
    await run(kind, doc, null, req)
    return doc
  }
  return { afterChange: [afterChange], afterDelete: [afterDelete] }
}

// Adds the hooks to a collection or global config, keeping the hooks it already has.
export function withRevalidation(config, { global = false } = {}) {
  const extra = revalidateHooks(config.slug, { global })
  const hooks = { ...(config.hooks || {}) }
  for (const [name, list] of Object.entries(extra)) hooks[name] = [...(hooks[name] || []), ...list]
  return { ...config, hooks }
}
