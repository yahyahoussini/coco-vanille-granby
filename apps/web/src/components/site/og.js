import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { PAGES, pageByKey, localeEnabled, isIndexable } from '@/lib/routes'
import { getBusiness, getPageDoc, payloadClient } from '@/lib/data'
import { MARKER_RE } from '@/lib/facts'

// Typographic Open Graph images (1200×630): brand + page title, one route per locale group
// (/og/<key>.png, /en/og/<key>.png, /es/og/<key>.png; products: p-<id>.png). No photo, no claim beyond the page.
const BRAND = 'Pâtisserie Coco Vanille'
const COLORS = { paper: '#f7f0e3', raised: '#fffcf6', ink: '#2e211a', soft: '#5a4636', accent: '#7a4d24', caramel: '#c8915a', framboise: '#b8435a' }
const SPECKLE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cpath d='M2 90l1.2 .2M171 82l.2 1.5M95 57l-.7 .9M30 77l-1.4 .8M77 19l-.7 .8M118 111l1.1 1.0M62 158l.7 .5M115 142l.3 .8M176 104l-.3 .9M190 65l2.1 .1M143 160l1.3 1.7M35 159l-1.4 1.6M123 7l-1.8 1.1M71 173l-.4 .7M188 110l-.1 1.8M85 161l1.1 1.0M11 12l1.8 .7M71 110l.1 1.3M23 76l-.2 1.0M110 183l-.9 .1M171 129l.9 1.2M106 52l-.5 2.1M137 58l.8 1.8M22 158l1.4 1.5M150 69l.4 2.0M60 160l-.5 1.1M130 99l.8 .8M99 124l.8 1.2M162 99l1.2 1.0M78 41l-1.5 .4M144 49l.9 .8M63 182l-.3 1.7M5 156l1.9 .1M168 193l1.5 1.4' stroke='%232e211a' stroke-opacity='.22' stroke-width='1.6' stroke-linecap='round'/%3E%3C/svg%3E\")"

// Static (non-variable) WOFF instances under the OFL (public/fonts/og/OFL-*.txt): satori reads TTF/OTF/WOFF only.
const FONT_DIR = join(process.cwd(), 'public', 'fonts', 'og')
let fontsPromise
const fonts = () =>
  (fontsPromise ??= Promise.all([readFile(join(FONT_DIR, 'fraunces-latin-500-normal.woff')), readFile(join(FONT_DIR, 'inter-latin-600-normal.woff'))]).then(([display, ui]) => [
    { name: 'Fraunces', data: display, weight: 500, style: 'normal' },
    { name: 'Inter', data: ui, weight: 600, style: 'normal' },
  ]))

export { ogPath } from './og-path'

// Registry pages with a URL in this locale; products are rendered on demand.
export const ogStaticParams = (locale) => (localeEnabled(locale) ? PAGES.filter((p) => p.paths[locale] && isIndexable(p)).map((p) => ({ slug: `${p.key}.png` })) : [])

const clean = (text) => (text && !MARKER_RE.test(text) ? text : null)

async function titleFor(locale, name) {
  const product = name.match(/^p-(\d+)$/)
  if (product) {
    const payload = await payloadClient()
    const res = await payload.find({ collection: 'products', where: { id: { equals: Number(product[1]) }, _status: { equals: 'published' } }, locale, limit: 1, depth: 0 })
    return res.docs[0] ? clean(res.docs[0].title) || BRAND : null
  }
  const page = pageByKey(name)
  if (!page || !page.paths[locale]) return null
  const doc = await getPageDoc(name, locale)
  return clean(doc?.h1) || clean(doc?.title) || BRAND
}

export async function ogImageResponse(locale, slug) {
  const name = typeof slug === 'string' && slug.endsWith('.png') ? slug.slice(0, -4) : null
  if (!name || !localeEnabled(locale)) return new Response('Not found', { status: 404 })
  const [title, business] = await Promise.all([titleFor(locale, name), getBusiness(locale)])
  if (!title) return new Response('Not found', { status: 404 })
  const a = business?.address || {}
  const street = a.street && locale !== 'fr' ? a.street.replace(/^(\d+),\s*/, '$1 ') : a.street
  const place = [street, a.city].filter(Boolean).join(' · ') || 'Granby'
  const size = title.length > 60 ? 64 : title.length > 38 ? 76 : 92

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '64px 80px', backgroundColor: COLORS.paper, backgroundImage: SPECKLE, backgroundRepeat: 'repeat', fontFamily: 'Inter', color: COLORS.ink }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 22, letterSpacing: 7, textTransform: 'uppercase', color: COLORS.accent }}>Pâtisserie</div>
          <div style={{ fontFamily: 'Fraunces', fontSize: 44, marginTop: 4 }}>Coco Vanille</div>
        </div>
        <div style={{ display: 'flex', fontFamily: 'Fraunces', fontSize: size, lineHeight: 1.06, letterSpacing: -1.5, maxWidth: 960 }}>{title}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: 26, color: COLORS.soft }}>
            <div style={{ width: 56, height: 3, backgroundColor: COLORS.caramel, marginRight: 20 }} />
            {place}
          </div>
          <div style={{ display: 'flex', width: 18, height: 18, borderRadius: 9, backgroundColor: COLORS.framboise }} />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: await fonts(),
      headers: { 'cache-control': 'public, max-age=3600, stale-while-revalidate=86400' },
    },
  )
}
