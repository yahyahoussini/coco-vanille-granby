import { notFound } from 'next/navigation'
import { PAGES, resolvePath, pathFor, isIndexable, SITE_ORIGIN, LOCALES, HTML_LANG, localeEnabled, pageByKey } from '@/lib/routes'
import { getBusiness, getShop, getPageDoc, getProductBySlugs, getOfferStates, getServed, payloadClient } from '@/lib/data'
import { containsMarker, publishGuard, marker } from '@/lib/facts'
import { readyCopy, servedAlternates, productServed } from '@/lib/publish'
import { productTitle, productDescription } from '@/lib/meta'
import { t } from '@/lib/i18n'
import { graph, bakeryNode, websiteNode, webPageNode, breadcrumbNode, ZOO_DE_GRANBY } from '@/lib/schema'
import { Header } from './Header'
import { Footer } from './Footer'
import { StickyBar } from './StickyBar'
import { JsonLd } from './JsonLd'
import { Breadcrumb } from './Contract'
import { TEMPLATES } from '../templates'
import { ogPath } from './og-path'
import { closureNotice } from '@/lib/studio/closure'
import { upcomingSpecialDays } from './hours'
import { RelatedPages } from './Related'
import { notFoundMetadata } from './NotFoundPage'
import { Motion } from './Motion'
import { ChatWidget } from './chat/ChatWidget'
import { chatFacts } from '@/lib/chat/facts'

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

// `served` (strict): crumbs only to pages the site answers; the current page always closes the trail.
function crumbsFor(key, locale, lastName, served) {
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
      if (!path || (served && i < chain.length - 1 && !served.has(p.key))) return null
      const s = t(locale)
      const name = i === chain.length - 1 && lastName ? lastName : p.key === 'home' ? s.breadcrumbHome : s.nav[p.key] || s.pageNames?.[p.key] || p.key
      return { name, path, url: `${SITE_ORIGIN}${path}` }
    })
    .filter(Boolean)
}

// The product's URL in every language that answers it (the French document decides for the others, under
// strict). The same map drives hreflang, the language switcher and whether this page is served at all.
async function productAlternates(product, servedBy) {
  const strict = publishGuard() === 'strict'
  const payload = await payloadClient()
  const languages = {}
  const frProduct = await payload.findByID({ collection: 'products', id: product.id, locale: 'fr', depth: 1 }).catch(() => null)
  for (const locale of LOCALES) {
    if (!localeEnabled(locale)) continue
    const doc = locale === 'fr' ? frProduct : await payload.findByID({ collection: 'products', id: product.id, locale, depth: 1 }).catch(() => null)
    if (!doc?.slug || !doc.category?.slug || !productServed(doc, { strict, servedHere: servedBy[locale], locale, frProduct })) continue
    const prefix = locale === 'fr' ? '' : `/${locale}`
    languages[HTML_LANG[locale]] = `${SITE_ORIGIN}${prefix}/${doc.category.slug}/${doc.slug}/`
  }
  if (languages['fr-CA']) languages['x-default'] = languages['fr-CA']
  return languages
}

export async function buildMetadata(locale, segments) {
  const hit = await resolve(locale, segments)
  if (!hit) return notFoundMetadata(locale)
  // Top level, so every engine reads them (Bing feeds Copilot and ChatGPT search), not only Googlebot.
  const robotsIndex = { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1 }
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
    const title = productTitle(p, locale)
    const description = productDescription(p, await getBusiness(locale), locale)
    return { title, description, robots: robotsIndex, ...social({ title, description, name: `p-${p.id}`, alt: p.title }) }
  }
  const doc = await getPageDoc(hit.page.key, locale)
  // Indexed only with its copy in this language and no missing fact; until then noindex (or hidden, strict).
  const indexable = isIndexable(hit.page) && readyCopy(doc)
  const s = t(locale)
  return {
    title: doc?.title || `${s.pageNames?.[hit.page.key] || s.nav[hit.page.key] || s.breadcrumbHome} · Pâtisserie Coco Vanille`,
    description: doc?.description,
    robots: indexable ? robotsIndex : { index: false, follow: true },
    ...social({ title: doc?.title, description: doc?.description, name: hit.page.key, alt: doc?.h1 || doc?.title || 'Pâtisserie Coco Vanille' }),
  }
}

// `query` (search params) reaches the template only from routes that opt into dynamic rendering (the calculator).
export async function SitePage({ locale, segments = [], query }) {
  const hit = await resolve(locale, segments)
  if (!hit) notFound()
  const [business, shop, shopFr, served] = await Promise.all([getBusiness(locale), getShop(locale), getShop('fr'), getServed()])
  // Studio writes the closure and its special-day label in French: read the notice from the French record.
  const notice = closureNotice(shopFr, locale)
  const strict = publishGuard() === 'strict'

  let pageKey = null
  let doc = null
  let Template
  let props = { locale, business, shop, query, served }
  let crumbs
  let pageName

  if (hit.kind === 'product') {
    Template = TEMPLATES.product
    props.product = hit.product
    props.offer = (await getOfferStates([hit.product], locale)).get(hit.product.id)
    pageKey = null
    pageName = hit.product.title
    crumbs = crumbsFor('carte', locale, null, strict ? served[locale] : null)
    if (strict && crumbs.at(-1)?.path === pathFor('carte', locale) && !served[locale].has('carte')) crumbs.pop()
    const categoryPage = PAGES.find((p) => p.template === 'category' && p.category === hit.product.productionCategory)
    if (hit.product.category && (!strict || (categoryPage && served[locale].has(categoryPage.key)))) {
      const path = `${locale === 'fr' ? '' : `/${locale}`}/${hit.product.category.slug}/`
      crumbs.push({ name: hit.product.category.title, path, url: `${SITE_ORIGIN}${path}` })
    }
    crumbs.push({ name: hit.product.title, path: hit.path, url: `${SITE_ORIGIN}${hit.path}` })
  } else {
    const { page } = hit
    pageKey = page.key
    doc = await getPageDoc(page.key, locale)
    if (strict && !readyCopy(doc)) notFound()
    Template = TEMPLATES[page.template] || TEMPLATES.content
    props = { ...props, page, doc, conditionNotice: page.status === 'conditional' && (!doc || containsMarker(doc)) ? marker(page.condition) : null }
    pageName = doc?.h1 || doc?.title
    crumbs = crumbsFor(page.key, locale, doc?.h1, strict ? served[locale] : null)
  }

  const url = `${SITE_ORIGIN}${hit.path}`
  // Payment pages run only the processor's scripts (10 §1.4): no chat there.
  const checkout = hit.kind === 'page' && hit.page.template === 'checkout'
  const chat = !checkout && shop?.chat?.enabled !== false
  // Canonical + hreflang as real <link> tags (React 19 hoists them to <head>). Next's metadata API
  // strips the trailing slash from the root URL; these must match the sitemap byte for byte.
  const languages = hit.kind === 'product' ? await productAlternates(hit.product, served) : servedAlternates(hit.page.key, served)
  if (hit.kind === 'product' && strict && !languages[HTML_LANG[locale]]) notFound()
  const pageNodes = [
    bakeryNode(business, shop, locale, upcomingSpecialDays(shop)),
    websiteNode(),
    webPageNode({
      url,
      name: pageName,
      description: doc?.description || props.product?.summary,
      locale,
      dateModified: doc?.updatedAt || props.product?.updatedAt,
      mentions: hit.kind === 'page' && hit.page.key === 'zoo-de-granby' ? ZOO_DE_GRANBY : undefined,
    }),
    breadcrumbNode(url, crumbs),
  ]
  const extra = Template.schema ? await Template.schema({ ...props, url }) : []

  return (
    <>
      <link rel="canonical" href={url} />
      {Object.entries(languages).map(([lang, href]) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={href} />
      ))}
      <Header locale={locale} pageKey={pageKey} served={served} alternates={languages} business={business} shop={shop} product={hit.kind === 'product'} />
      <main id="contenu" className="site-main">
        <div className="wrap">
          {notice && (
            <p className={`closure-banner${notice.tone === 'closure' ? '' : ' is-notice'}`} data-nosnippet="">
              {notice.text}
            </p>
          )}
          <Breadcrumb crumbs={crumbs} />
        </div>
        <Template {...props} />
        <RelatedPages pageKey={pageKey} locale={locale} served={served[locale]} />
      </main>
      <Footer business={business} shop={shop} locale={locale} served={served} chat={chat} />
      <StickyBar business={business} locale={locale} served={served} chat={chat} pageKey={pageKey} product={hit.kind === 'product'} />
      {!checkout && <ChatWidget locale={locale} facts={chatFacts({ business, shop, locale, served })} />}
      <Motion />
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
