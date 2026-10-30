import Link from 'next/link'
import { t } from '@/lib/i18n'
import { pathFor } from '@/lib/routes'
import { getBusiness, getShop, getServed } from '@/lib/data'
import { Header } from './Header'
import { Footer } from './Footer'
import { Ornament } from './Ornament'
import { Icon } from './Icon'

const NEXT = ['home', 'carte', 'commander', 'nous-trouver', 'faq']
// The same pictures as the tab bar, so each way out is recognised at a glance.
const ICONS = { home: 'home', carte: 'menu', commander: 'box', 'nous-trouver': 'pin', faq: 'chat' }

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
      <Header locale={locale} pageKey={null} served={served} business={business} shop={shop} />
      <main id="contenu" className="site-main">
        <article className="wrap page not-found">
          <div className="not-found-art" aria-hidden="true">
            <img src="/brand/logo-badge-192.webp" srcSet="/brand/logo-badge-192.webp 192w, /brand/logo-badge-384.webp 384w" sizes="160px" width="160" height="160" alt="" />
            <Ornament name="coconut" className="not-found-coconut" />
          </div>
          <h1>{s.notFoundTitle}</h1>
          <p className="answer">{s.notFoundBody}</p>
          <nav aria-labelledby="not-found-next" className="not-found-next">
            <h2 id="not-found-next">{s.notFoundNext}</h2>
            <ul className="start-grid">
              {links.map((k) => (
                <li key={k}>
                  <Link href={pathFor(k, locale)}>
                    <span className="start-icon" aria-hidden="true">
                      <Icon name={ICONS[k]} size={20} />
                    </span>
                    {k === 'home' ? (
                      // Same words as before (« Pâtisserie Coco Vanille · Accueil »); the brand sits small above.
                      <span className="start-label">
                        <span className="start-kicker">Pâtisserie Coco Vanille</span>
                        <span className="visually-hidden"> · </span>
                        {s.breadcrumbHome}
                      </span>
                    ) : (
                      <span className="start-label">{s.nav[k] || s.pageNames[k]}</span>
                    )}
                  </Link>
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
