import Link from 'next/link'
import { t } from '@/lib/i18n'
import { pathFor } from '@/lib/routes'
import { getBusiness, getShop, getServed } from '@/lib/data'
import { Header } from './Header'
import { Footer } from './Footer'

const NEXT = ['home', 'carte', 'commander', 'nous-trouver', 'faq']

export function notFoundMetadata(locale) {
  const s = t(locale)
  return { title: `${s.notFoundTitle} · Pâtisserie Coco Vanille`, description: s.notFoundDescription, robots: { index: false, follow: true } }
}

// The 404 page in its language, with header and footer, in the server HTML (src/proxy.js rewrites unknown
// URLs here with status 404; the not-found.js files reuse it for notFound() calls).
// `head`: Next skips the metadata API on a response the proxy already marked 404, so the page writes its
// own <title> and description (React hoists them into <head>); Next adds the noindex itself.
export async function NotFoundPage({ locale, head = false }) {
  const s = t(locale)
  const meta = notFoundMetadata(locale)
  const [business, shop, served] = await Promise.all([getBusiness(locale), getShop(locale), getServed()])
  const links = NEXT.filter((k) => pathFor(k, locale) && served[locale]?.has(k))
  return (
    <>
      {head && (
        <>
          <title>{meta.title}</title>
          <meta name="description" content={meta.description} />
        </>
      )}
      <Header locale={locale} pageKey={null} served={served} />
      <main id="contenu" className="site-main">
        <article className="wrap page not-found">
          <h1>{s.notFoundTitle}</h1>
          <p className="answer">{s.notFoundBody}</p>
          <nav aria-labelledby="not-found-next">
            <h2 id="not-found-next">{s.notFoundNext}</h2>
            <ul className="start-grid">
              {links.map((k) => (
                <li key={k}>
                  <Link href={pathFor(k, locale)}>{k === 'home' ? `Pâtisserie Coco Vanille · ${s.breadcrumbHome}` : s.nav[k] || s.pageNames[k]}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </article>
      </main>
      <Footer business={business} shop={shop} locale={locale} served={served} />
    </>
  )
}
