import { NextResponse } from 'next/server'

// Host-based routing (16b §2): one build, two hosts.
//  admin.cocovanillegranby.com → Studio at "/", Payload « Avancé » at /admin, REST at /api; never indexed.
//  cocovanillegranby.com       → public site only; /admin, /api, /studio return 404; trailing slash enforced.
const list = (v, d) => (v || d).split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)
const ADMIN_HOSTS = list(process.env.ADMIN_HOSTS, 'admin.localhost,admin.cocovanillegranby.com')
const ROLE = process.env.APP_ROLE || 'all' // web | studio | all
const NOINDEX = 'noindex, nofollow, noarchive'

const hostOf = (req) => (req.headers.get('host') || '').split(':')[0].toLowerCase()
const isAsset = (p) => p.startsWith('/_next/') || /\.[a-z0-9]{2,5}$/i.test(p)
const isHealth = (p) => p === '/svc/health' || p === '/svc/health/'

function notFound(req) {
  const url = req.nextUrl.clone()
  url.pathname = '/__introuvable/'
  return NextResponse.rewrite(url, { status: 404 })
}

function adminHeaders(res) {
  res.headers.set('X-Robots-Tag', NOINDEX)
  res.headers.set('Cache-Control', 'no-store, private')
  // Studio and « Avancé » are never framed by another site (16b §4 #10).
  res.headers.set('Content-Security-Policy', "frame-ancestors 'none'")
  return res
}

export function proxy(req) {
  const host = hostOf(req)
  const { pathname } = req.nextUrl
  const adminHost = ADMIN_HOSTS.includes(host)

  // Health check (17 §12.2) on every host and every role, before the Studio rewrite and the role checks:
  // Docker, deploy.sh and the uptime monitor reach web and studio processes the same way.
  if (isHealth(pathname)) return adminHost ? adminHeaders(NextResponse.next()) : NextResponse.next()

  if (adminHost) {
    if (ROLE === 'web') return notFound(req)
    let res
    if (pathname === '/robots.txt') {
      // Crawlable + noindex header: Google must fetch a URL to see its noindex (16b §2.4).
      res = new NextResponse('User-agent: *\nAllow: /\n', { headers: { 'content-type': 'text/plain' } })
    } else if (pathname.startsWith('/admin') || pathname.startsWith('/api') || pathname.startsWith('/_next/')) {
      res = NextResponse.next()
    } else {
      // Everything else (screens and files like /sw.js, /manifest.webmanifest) comes from the Studio tree,
      // so public files such as /sitemap.xml or /llms.txt never answer on the admin host.
      const url = req.nextUrl.clone()
      url.pathname = `/studio${pathname === '/' ? '' : pathname}`
      res = NextResponse.rewrite(url)
    }
    return adminHeaders(res)
  }

  // Public host
  if (ROLE === 'studio') return notFound(req)
  if (/^\/(admin|api|studio)(\/|$)/.test(pathname)) return notFound(req)
  if (!isAsset(pathname) && !pathname.endsWith('/')) {
    // Built from the raw URL: nextUrl normalises trailing slashes away.
    const url = new URL(req.url)
    url.pathname = `${pathname}/`
    return NextResponse.redirect(url.toString(), 301)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
