import { withPayload } from '@payloadcms/next/withPayload'

// Checkout pages (FR/EN/ES): the only page with a third-party script, Stripe.js, whose Payment and Express
// Checkout Elements run in Stripe's iframes (10 §1.4). Next's bootstrap is inline, hence 'unsafe-inline' for
// scripts; everything else is this site, plus Stripe where the Elements need it. 3-D Secure opens in a
// hooks.stripe.com frame. The mock payment form posts to /svc/paiement/mock/ (self).
const STRIPE_CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://js.stripe.com",
  "frame-src https://js.stripe.com https://hooks.stripe.com",
  "connect-src 'self' https://api.stripe.com",
  "img-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
].join('; ')
const CHECKOUT_PATHS = ['/commander/paiement', '/en/order/checkout', '/es/pedidos/pago']

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  // nginx compresses every response (infra/nginx/conf.d/coco.conf) and asks Node for plain bodies.
  compress: false,
  // Blue/green (17 §2): one id per build (CI passes the git SHA), so a browser holding the old colour's pages
  // reloads instead of mixing builds. The Server Actions key (NEXT_SERVER_ACTIONS_ENCRYPTION_KEY) is read
  // from the environment by Next at build and at run time: the same value on every build and colour.
  deploymentId: process.env.DEPLOYMENT_ID || undefined,
  // Trailing slashes are enforced per host in src/proxy.js (public host only).
  skipTrailingSlashRedirect: true,
  images: { formats: ['image/avif', 'image/webp'] },
  // src/proxy.js runs for /svc/demande/ too: let it read a cake request with its 3 photos (nginx allows 32m).
  experimental: { proxyClientMaxBodySize: '32mb' },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(self), geolocation=(), microphone=()' },
        ],
      },
      ...CHECKOUT_PATHS.flatMap((path) => [path, `${path}/`]).map((source) => ({ source, headers: [{ key: 'Content-Security-Policy', value: STRIPE_CSP }] })),
    ]
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
