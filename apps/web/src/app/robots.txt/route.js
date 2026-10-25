// Public robots.txt (v1 L5, 00 §5.1): every search, user-fetch and AI crawler allowed;
// cart, account, search and service endpoints kept out. The cake builder uses noindex, not Disallow.
// The admin host serves its own robots.txt from src/proxy.js.
export const dynamic = 'force-static'

export function GET() {
  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /boite/',
    'Disallow: /en/box/',
    'Disallow: /es/caja/',
    'Disallow: /compte/',
    'Disallow: /recherche',
    'Disallow: /svc/',
    // Optional, zero confirmed effect on any engine (06 i); kept per plan-v1 §4 L5.
    'Content-Signal: search=yes, ai-input=yes, ai-train=yes',
    '',
    'Sitemap: https://cocovanillegranby.com/sitemap.xml',
    '',
  ].join('\n')
  return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8' } })
}
