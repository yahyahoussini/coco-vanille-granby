import { notFound } from 'next/navigation'
import { PAGES, resolvePath, pathFor, alternatesFor, isIndexable, SITE_ORIGIN, LOCALES, localeEnabled, pageByKey } from '@/lib/routes'
import { getBusiness, getShop, getPageDoc, getProductBySlugs, getOfferStates, payloadClient } from '@/lib/data'
import { containsMarker, publishGuard, marker } from '@/lib/facts'
import { t } from '@/lib/i18n'
import { graph, bakeryNode, websiteNode, webPageNode, breadcrumbNode } from '@/lib/schema'
import { Header } from './Header'
import { Footer } from './Footer'
import { StickyBar } from './StickyBar'
import { JsonLd } from './JsonLd'
import { Breadcrumb } from './Contract'
import { TEMPLATES } from '../templates'
import { ogPath } from './og-path'

// Resolves "/<locale>/<segments>/" to a registry page or a product page.
async function resolve(locale, segments) {
  const { page, path } = resolvePath(locale, segments)
  if (page) return { kind: 'page', page, path }
  if (segments.length === 2) {
    const product = await getProductBySlugs(locale, segments[0], segments[1])
    if (product) return { kind: 'product', product, path }
  }
  return null
}

function crumbsFor(key, locale, lastName) {
  const chain = []
  let page = pageByKey(key)
  while (page) {
    chain.unshift(page)
    page = page.parent ? pageByKey(page.parent) : null
  }
  if (chain[0]?.key !== 'home') chain.unshift(pageByKey('home'))
  return chain
    .map((p, i) => {
      const path = pathFor(p.key, locale)
      if (!path) return null
      const s = t(locale)
      const name = i === chain.length - 1 && lastName ? lastName : p.key === 'home' ? s.breadcrumbHome : s.nav[p.key] || s.pageNames?.[p.key] || p.key
      return { name, path, url: `${SITE_ORIGIN}${path}` }
    })
    .filter(Boolean)
}

async function productAlternates(product) {
  const payload = await payloadClient()
  const languages = {}
  for (const locale of LOCALES) {
    if (!localeEnabled(locale)) continue
    const doc = await payload.findByID({ collection: 'products', id: product.id, locale, depth: 1 }).catch(() => null)
    if (!doc?.slug || !doc.category?.slug) continue
    const prefix = locale === 'fr' ? '' : `/${locale}`
    languages[locale === 'fr' ? 'fr-CA' : locale === 'en' ? 'en-CA' : 'es'] = `${SITE_ORIGIN}${prefix}/${doc.category.slug}/${doc.slug}/`
  }
  if (languages['fr-CA']) languages['x-default'] = languages['fr-CA']
  return languages
}

export async function buildMetadata(locale, segments) {
  const hit = await resolve(locale, segments)
  if (!hit) return { title: t(locale).notFoundTitle, robots: { index: false } }
  const robotsIndex = { index: true, follow: true, googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1 } }
  const ogLocale = locale === 'en' ? 'en_CA' : locale === 'es' ? 'es_ES' : 'fr_CA'
  // Typographic OG card per page (src/components/site/og.js), absolute URL as crawlers expect.
  const social = ({ title, description, name, alt }) => {
    const image = { url: `${SITE_ORIGIN}${ogPath(locale, name)}`, width: 1200, height: 630, alt }
    return {
      openGraph: { title, description, url: `${SITE_ORIGIN}${hit.path}`, siteName: 'Pâtisserie Coco Vanille', locale: ogLocale, type: 'website', images: [image] },
      twitter: { card: 'summary_large_image', title, description, images: [image.url] },
    }
  }
  if (hit.kind === 'product') {
    const p = hit.product
    const title = `${p.title} · Coco Vanille, Granby`
    const description = p.summary?.slice(0, 160)
    return { title, description, robots: robotsIndex, ...social({ title, description, name: `p-${p.id}`, alt: p.title }) }
  }
  const doc = await getPageDoc(hit.page.key, locale)
  const indexable = isIndexable(hit.page) && doc && !(publishGuard() === 'show' && containsMarker(doc))
  return {
    title: doc?.title || 'Pâtisserie Coco Vanille · Granby',
    description: doc?.description,
    robots: indexable ? robotsIndex : { index: false, follow: true },
    ...social({ title: doc?.title, description: doc?.description, name: hit.page.key, alt: doc?.h1 || doc?.title || 'Pâtisserie Coco Vanille' }),
  }
}

// `query` (search params) reaches the template only from routes that opt into dynamic rendering (the calculator).
export async function SitePage({ locale, segments = [], query }) {
  const hit = await resolve(locale, segments)
  if (!hit) notFound()
  const [business, shop] = await Promise.all([getBusiness(locale), getShop(locale)])
  const strict = publishGuard() === 'strict'

  let pageKey = null
  let doc = null
  let Template
  let props = { locale, business, shop, query }
  let crumbs
  let pageName

  if (hit.kind === 'product') {
    Template = TEMPLATES.product
    props.product = hit.product
    props.offer = (await getOfferStates([hit.product], locale)).get(hit.product.id)
    pageKey = null
    pageName = hit.product.title
    crumbs = crumbsFor('carte', locale)
    if (hit.product.category) {
      crumbs.push({ name: hit.product.category.title, path: `${locale === 'fr' ? '' : `/${locale}`}/${hit.product.category.slug}/`, url: '' })
    }
    crumbs.push({ name: hit.product.title, path: hit.path, url: `${SITE_ORIGIN}${hit.path}` })
    if (strict && containsMarker(hit.product)) notFound()
  } else {
    const { page } = hit
    pageKey = page.key
    doc = await getPageDoc(page.key, locale)
    if (strict && (!doc || containsMarker(doc))) notFound()
    Template = TEMPLATES[page.template] || TEMPLATES.content
    props = { ...props, page, doc, conditionNotice: page.status === 'conditional' && (!doc || containsMarker(doc)) ? marker(page.condition) : null }
    pageName = doc?.h1 || doc?.title
    crumbs = crumbsFor(page.key, locale, doc?.h1)
  }

  const url = `${SITE_ORIGIN}${hit.path}`
  // Canonical + hreflang as real <link> tags (React 19 hoists them to <head>). Next's metadata API
  // strips the trailing slash from the root URL; these must match the sitemap byte for byte.
  const languages = hit.kind === 'product' ? await productAlternates(hit.product) : alternatesFor(hit.page.key)
  const pageNodes = [
    bakeryNode(business, shop, locale),
    websiteNode(),
    webPageNode({ url, name: pageName, description: doc?.description || props.product?.summary, locale, dateModified: doc?.updatedAt || props.product?.updatedAt }),
    breadcrumbNode(url, crumbs),
  ]
  const extra = Template.schema ? await Template.schema({ ...props, url }) : []

  return (
    <>
      <link rel="canonical" href={url} />
      {Object.entries(languages).map(([lang, href]) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={href} />
      ))}
      <Header locale={locale} pageKey={pageKey} />
      <main id="contenu" className="site-main">
        <div className="wrap">
          <Breadcrumb crumbs={crumbs} />
        </div>
        <Template {...props} />
      </main>
      <Footer business={business} shop={shop} locale={locale} />
      <StickyBar business={business} locale={locale} />
      <JsonLd data={graph([...pageNodes, ...extra])} />
    </>
  )
}

// Templates that read the query string have their own dynamic route (src/app/(site-*)/…/calculateur…/page.js).
export const DYNAMIC_TEMPLATES = ['calculator', 'order', 'box', 'checkout', 'thanks']

export function staticParamsFor(locale) {
  if (!localeEnabled(locale)) return []
  const prefix = locale === 'fr' ? '' : `/${locale}`
  return PAGES.filter((p) => p.paths[locale] && !DYNAMIC_TEMPLATES.includes(p.template))
    .map((p) => p.paths[locale].slice(prefix.length).split('/').filter(Boolean))
    .map((path) => ({ path }))
}
