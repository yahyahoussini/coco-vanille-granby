import { notFound } from 'next/navigation'
import { PAGES, resolvePath, pathFor, isIndexable, SITE_ORIGIN, LOCALES, HTML_LANG, localeEnabled, pageByKey } from '@/lib/routes'
import { getBusiness, getShop, getPageDoc, getProductBySlugs, getOfferStates, getServed, getServedPosts, getPostBySlug, payloadClient } from '@/lib/data'
import { containsMarker, publishGuard } from '@/lib/facts'
import { readyCopy, servedAlternates, productServed, productReady } from '@/lib/publish'
import { journalRoute, paginate, postAlternates, isoWithOffset, dateModifiedOf, CATEGORY_LABELS, PAGE_SIZE } from '@/lib/journal'
import { mediaUrl } from '@/lib/media'
import { productTitle, productDescription } from '@/lib/meta'
import { t } from '@/lib/i18n'
import { graph, bakeryNode, websiteNode, webPageNode, breadcrumbNode, blogPostingNode, ZOO_DE_GRANBY } from '@/lib/schema'
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
import { JournalLinks } from './JournalLinks'
import { ownHeroOf } from '../templates/journal'
import { notFoundMetadata } from './NotFoundPage'
import { Motion } from './Motion'
import { ChatWidget } from './chat/ChatWidget'
import { chatFacts } from '@/lib/chat/facts'

// Resolves "/<locale>/<segments>/" to a registry page (the Journal's list pages included), a Journal post or a
// product page. The Journal runs first: its post URLs have two segments, like products.
async function resolve(locale, segments) {
  const { page, path } = resolvePath(locale, segments)
  if (page) return { kind: 'page', page, path, listPage: 1 }
  const j = journalRoute(locale, segments)
  if (j?.type === 'list') return { kind: 'page', page: pageByKey('journal'), path, listPage: j.n }
  if (j?.type === 'post') {
    const post = await getPostBySlug(locale, j.slug)
    return post ? { kind: 'post', post, path } : null
  }
  if (segments.length === 2) {
    const product = await getProductBySlugs(locale, segments[0], segments[1])
    if (product) return { kind: 'product', product, path }
  }
  return null
}

// `served` (strict): crumbs only to pages the site answers; the current page always closes the trail.
// WebPage subtypes (schema.org) for the pages whose job they name.
const PAGE_TYPE = { 'a-propos': 'AboutPage', 'nous-trouver': 'ContactPage' }

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
      // og:url is written by SitePage as a plain <meta>, with the trailing slash the canonical has (Next strips it).
      openGraph: { title, description, siteName: 'Pâtisserie Coco Vanille', locale: ogLocale, type: 'website', images: [image] },
      twitter: { card: 'summary_large_image', title, description, images: [image.url] },
    }
  }
  if (hit.kind === 'product') {
    const p = hit.product
    const title = productTitle(p, locale)
    const description = productDescription(p, await getBusiness(locale), locale)
    // A product page with facts still missing (price, servings, lead time, checked allergens) is not indexed yet.
    return { title, description, robots: productReady(p) ? robotsIndex : { index: false, follow: true }, ...social({ title, description, name: `p-${p.id}`, alt: p.title }) }
  }
  if (hit.kind === 'post') {
    const p = hit.post
    const meta = social({ title: p.title, description: p.description, name: `j-${p.id}`, alt: p.h1 })
    // A post with a fact still missing renders under PUBLISH_GUARD=show, but is not indexed until it is given.
    return {
      title: p.title,
      description: p.description,
      robots: containsMarker(p) ? { index: false, follow: true } : robotsIndex,
      ...meta,
      openGraph: { ...meta.openGraph, type: 'article', publishedTime: isoWithOffset(p.publishedAt), modifiedTime: isoWithOffset(dateModifiedOf(p)) },
    }
  }
  const doc = await getPageDoc(hit.page.key, locale)
  // Indexed only with its copy in this language and no missing fact; until then noindex (or hidden, strict).
  let indexable = isIndexable(hit.page) && readyCopy(doc)
  const s = t(locale)
  let title = doc?.title || `${s.pageNames?.[hit.page.key] || s.nav[hit.page.key] || s.breadcrumbHome} · Pâtisserie Coco Vanille`
  let description = doc?.description
  if (hit.page.key === 'journal') {
    const posts = (await getServedPosts())[locale] || []
    const pager = paginate(posts, hit.listPage)
    if (!pager) return notFoundMetadata(locale)
    // The empty index (show mode only: strict does not serve it) is a thin page: not indexed.
    if (!posts.length) indexable = false
    if (hit.listPage > 1) {
      const from = (hit.listPage - 1) * PAGE_SIZE + 1
      title = `${doc?.title || title} · page ${hit.listPage}`
      description = s.journal.listDescription(from, from + pager.items.length - 1)
    }
  }
  return {
    title,
    description,
    robots: indexable ? robotsIndex : { index: false, follow: true },
    ...social({ title, description, name: hit.page.key, alt: doc?.h1 || doc?.title || 'Pâtisserie Coco Vanille' }),
  }
}

// `query` (search params) reaches the template only from routes that opt into dynamic rendering (the calculator).
export async function SitePage({ locale, segments = [], query }) {
  const hit = await resolve(locale, segments)
  if (!hit) notFound()
  const [business, shop, shopFr, served, posts] = await Promise.all([getBusiness(locale), getShop(locale), getShop('fr'), getServed(), getServedPosts()])
  // Studio writes the closure and its special-day label in French: read the notice from the French record.
  const notice = closureNotice(shopFr, locale)
  const strict = publishGuard() === 'strict'
  const url = `${SITE_ORIGIN}${hit.path}`

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
  } else if (hit.kind === 'post') {
    // A Journal post: the menu and the language switch treat it as part of « Journal »; its own related pages
    // replace the registry's « À consulter aussi ».
    Template = TEMPLATES.post
    props.post = hit.post
    pageKey = 'journal'
    pageName = hit.post.h1
    crumbs = crumbsFor('journal', locale, null, strict ? served[locale] : null)
    if (strict && crumbs.at(-1)?.path === pathFor('journal', locale) && !served[locale].has('journal')) crumbs.pop()
    crumbs.push({ name: hit.post.h1, path: hit.path, url })
  } else {
    const { page } = hit
    pageKey = page.key
    doc = await getPageDoc(page.key, locale)
    // Strict: the Journal index also needs a served post in its language (lib/journal.js withJournal). In any mode, a
    // conditional page with a fact still missing (the chef's page) does not exist (lib/publish.js).
    if (strict && (!readyCopy(doc) || (page.key === 'journal' && !served[locale]?.has('journal')))) notFound()
    if (page.status === 'conditional' && !served[locale]?.has(page.key)) notFound()
    // A list page past the last one (/journal/page/9/) does not exist.
    if (page.key === 'journal' && !paginate(posts[locale] || [], hit.listPage)) notFound()
    Template = TEMPLATES[page.template] || TEMPLATES.content
    props = { ...props, page, doc, listPage: hit.listPage }
    pageName = doc?.h1 || doc?.title
    crumbs = crumbsFor(page.key, locale, doc?.h1, strict ? served[locale] : null)
  }

  // Payment pages run only the processor's scripts (10 §1.4): no chat there.
  const checkout = hit.kind === 'page' && hit.page.template === 'checkout'
  const chat = !checkout && shop?.chat?.enabled !== false
  // Canonical + hreflang as real <link> tags (React 19 hoists them to <head>). Next's metadata API
  // strips the trailing slash from the root URL; these must match the sitemap byte for byte. A post names its
  // other language only when both are served; a list page after the first has none (each language's page 2
  // holds different posts).
  const languages =
    hit.kind === 'product'
      ? await productAlternates(hit.product, served)
      : hit.kind === 'post'
        ? postAlternates(hit.post, posts.ids)
        : hit.listPage > 1
          ? {}
          : servedAlternates(hit.page.key, served)
  if (hit.kind === 'product' && strict && !languages[HTML_LANG[locale]]) notFound()
  const post = hit.kind === 'post' ? hit.post : null
  const published = post ? isoWithOffset(post.publishedAt) : null
  const modified = post ? isoWithOffset(dateModifiedOf(post)) : null
  const pageNodes = [
    bakeryNode(business, shop, locale, upcomingSpecialDays(shop)),
    websiteNode(),
    webPageNode({
      url,
      name: pageName,
      description: post ? post.description : doc?.description || props.product?.summary,
      locale,
      // The same dates as the visible meta line (Contract.js MetaLine, a post's byline): content changes, not any
      // database write.
      datePublished: post ? published : doc ? [doc.createdAt, doc.contentUpdatedAt].filter(Boolean).sort()[0] : props.product?.createdAt,
      dateModified: post ? modified : doc?.contentUpdatedAt || doc?.updatedAt || props.product?.updatedAt,
      mentions: hit.kind === 'page' && hit.page.key === 'zoo-de-granby' ? ZOO_DE_GRANBY : undefined,
      // The About page is the source of truth about the shop; the Visit page holds the address, phones and hours.
      ...(hit.kind === 'page' && PAGE_TYPE[hit.page.key] ? { type: PAGE_TYPE[hit.page.key] } : {}),
    }),
    breadcrumbNode(url, crumbs),
    post
      ? blogPostingNode({ url, post, locale, business, published, modified, section: CATEGORY_LABELS[locale]?.[post.category], ownImageUrl: ownHeroOf(post) ? mediaUrl(post.hero, 'hero') : null })
      : null,
  ]
  const extra = Template.schema ? await Template.schema({ ...props, url }) : []
  // « À lire dans le journal » under a page that posts are about (not the home page, the index, legal or utility pages).
  const journalLinks = hit.kind === 'page' && !['home', 'journal'].includes(hit.page.key) && hit.page.template !== 'legal' && hit.page.status !== 'utility'

  return (
    <>
      <link rel="canonical" href={url} />
      <meta property="og:url" content={url} />
      {Object.entries(languages).map(([lang, href]) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={href} />
      ))}
      <Header locale={locale} pageKey={pageKey} served={served} alternates={languages} business={business} shop={shop} product={hit.kind === 'product'} post={hit.kind === 'post'} />
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
        {hit.kind !== 'post' && <RelatedPages pageKey={pageKey} locale={locale} served={served[locale]} />}
        {journalLinks && <JournalLinks pageKey={pageKey} locale={locale} posts={posts[locale] || []} />}
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
