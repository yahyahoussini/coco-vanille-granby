import { PAGES, LOCALES, SITE_ORIGIN, pathFor, isIndexable } from '@/lib/routes'
import { getBusiness, getShop, payloadClient } from '@/lib/data'
import { containsMarker, publishGuard } from '@/lib/facts'
import { buildLlmsTxt } from '@/components/site/llms'

export const revalidate = 300

// /llms.txt on the public host (the admin host never serves it, src/proxy.js). Same page set as the sitemap:
// published copy only, conditional pages once seeded, and nothing with a marker under PUBLISH_GUARD=strict.
export async function GET() {
  const payload = await payloadClient()
  const strict = publishGuard() === 'strict'
  const [business, shop] = await Promise.all([getBusiness('fr'), getShop('fr')])
  const docs = await payload.find({ collection: 'pages', where: { _status: { equals: 'published' } }, locale: 'all', limit: 500, depth: 0 })
  const byKey = Object.fromEntries(docs.docs.map((d) => [d.key, d]))
  const pick = (field, locale) => (field && typeof field === 'object' ? field[locale] : undefined)
  const pages = []
  for (const page of PAGES) {
    const doc = byKey[page.key]
    if (!isIndexable(page) || !doc || (strict && containsMarker(doc))) continue
    for (const locale of LOCALES) {
      const path = pathFor(page.key, locale)
      const title = pick(doc.h1, locale) || pick(doc.title, locale)
      if (!path || !title) continue
      pages.push({ key: page.key, locale, status: page.status, template: page.template, url: `${SITE_ORIGIN}${path}`, title, description: pick(doc.description, locale) })
    }
  }
  return new Response(buildLlmsTxt({ business, shop, pages }), { headers: { 'content-type': 'text/plain; charset=utf-8' } })
}
