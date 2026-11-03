// Public robots.txt (v1 L5, 00 §5.1): every search, user-fetch and AI crawler allowed;
// cart, account, search and service endpoints kept out. The cake builder uses noindex, not Disallow.
// The admin host serves its own robots.txt from src/proxy.js.
import { SITE_ORIGIN } from '@/lib/routes'

// Read at run time: the sitemap line follows the address this deployment answers on.
export const dynamic = 'force-dynamic'

// Named in the same group as * (same rules): a crawler obeys only the most specific group that names it, so naming
// each one here states the decision for it without a second set of rules to keep in step (Layer 5 table).
const NAMED = [
  'Googlebot', 'Google-Extended', 'Google-CloudVertexBot', 'Bingbot', 'OAI-SearchBot', 'ChatGPT-User', 'GPTBot',
  'PerplexityBot', 'Perplexity-User', 'Claude-SearchBot', 'Claude-User', 'ClaudeBot', 'Applebot', 'Applebot-Extended',
  'meta-webindexer', 'meta-externalfetcher', 'meta-externalagent', 'Amzn-SearchBot', 'Amzn-User', 'Amazonbot',
  'DuckAssistBot', 'MistralAI-Index', 'MistralAI-User', 'MistralAI-Training', 'CCBot',
]

export function GET() {
  const body = [
    'User-agent: *',
    ...NAMED.map((name) => `User-agent: ${name}`),
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
    `Sitemap: ${SITE_ORIGIN}/sitemap.xml`,
    '',
  ].join('\n')
  return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8' } })
}
