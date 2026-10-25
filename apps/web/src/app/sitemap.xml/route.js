import { PAGES, LOCALES, SITE_ORIGIN, HTML_LANG, pathFor, alternatesFor, isIndexable, localeEnabled } from '@/lib/routes'
import { payloadClient } from '@/lib/data'
import { containsMarker, publishGuard } from '@/lib/facts'

export const revalidate = 300

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')

// Sitemap from real pages, real lastmod and reciprocal hreflang (v1 L5).
export async function GET() {
  const payload = await payloadClient()
  const strict = publishGuard() === 'strict'
  const docs = await payload.find({ collection: 'pages', where: { _status: { equals: 'published' } }, locale: 'all', limit: 500, depth: 0 })
  const byKey = Object.fromEntries(docs.docs.map((d) => [d.key, d]))
  const urls = []
  for (const page of PAGES) {
    if (!isIndexable(page)) continue
    const doc = byKey[page.key]
    if (strict && (!doc || containsMarker(doc))) continue
    if (page.status === 'conditional' && !doc) continue
    const alternates = alternatesFor(page.key)
    for (const locale of LOCALES) {
      const path = pathFor(page.key, locale)
      if (!path) continue
      urls.push({ loc: `${SITE_ORIGIN}${path}`, lastmod: doc?.updatedAt, alternates })
    }
  }
  const products = await payload.find({ collection: 'products', where: { _status: { equals: 'published' } }, locale: 'all', limit: 1000, depth: 1 })
  for (const p of products.docs) {
    if (strict && containsMarker(p)) continue
    const alternates = {}
    for (const locale of LOCALES) {
      if (!localeEnabled(locale)) continue
      const slug = p.slug?.[locale]
      const cat = p.category?.slug?.[locale]
      if (slug && cat) alternates[HTML_LANG[locale]] = `${SITE_ORIGIN}${locale === 'fr' ? '' : `/${locale}`}/${cat}/${slug}/`
    }
    if (alternates['fr-CA']) alternates['x-default'] = alternates['fr-CA']
    for (const [lang, loc] of Object.entries(alternates)) {
      if (lang !== 'x-default') urls.push({ loc, lastmod: p.updatedAt, alternates })
    }
  }
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...urls.map((u) =>
      [
        '  <url>',
        `    <loc>${esc(u.loc)}</loc>`,
        u.lastmod ? `    <lastmod>${new Date(u.lastmod).toISOString()}</lastmod>` : null,
        ...Object.entries(u.alternates).map(([lang, href]) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${esc(href)}"/>`),
        '  </url>',
      ]
        .filter(Boolean)
        .join('\n'),
    ),
    '</urlset>',
    '',
  ].join('\n')
  return new Response(xml, { headers: { 'content-type': 'application/xml; charset=utf-8' } })
}
