// Shared page module for the ordering routes. They read cookies and the query string, so they render per
// request (dynamic) instead of the catch-all's ISR (SitePage.DYNAMIC_TEMPLATES skips them there).
import { SitePage, buildMetadata } from '@/components/site/SitePage'
import { orderingCopy } from './copy'
import { payloadClient } from '@/lib/data'
import { paymentOptions } from '@/lib/payments/settings'

const TITLE_KEY = { boite: 'box', paiement: 'checkout', merci: 'thanks' }

export function orderingRoute(locale, segments, key) {
  async function generateMetadata() {
    const meta = await buildMetadata(locale, segments)
    const titleKey = TITLE_KEY[key]
    if (!titleKey) return meta
    await paymentOptions(await payloadClient())
    // Utility pages (noindex, out of the sitemap) have no seeded copy: the title comes from the interface strings.
    return { ...meta, title: orderingCopy(locale).metaTitles[titleKey], robots: { index: false, follow: false } }
  }

  async function Page({ searchParams, params }) {
    const query = { ...((await searchParams) || {}) }
    const p = params ? await params : {}
    if (Array.isArray(p.token) && p.token.length) query.token = p.token[0]
    if (Array.isArray(p.token) && p.token.length > 1) query.token = null
    await paymentOptions(await payloadClient())
    return <SitePage locale={locale} segments={segments} query={query} />
  }

  return { generateMetadata, Page }
}
