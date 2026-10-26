import { getPayload } from 'payload'
import config from '@payload-config'
import { paymentProvider } from '@/lib/payments/provider'
import { markOrderPaid, markDepositPaid } from '@/lib/payments/settle'
import { checkoutPath, thanksPath, Q } from '@/lib/ordering/paths'
import { seeOther } from '@/lib/ordering/cookies'
import { newToken } from '@/lib/ordering/context'
import { quoteConsent } from '@/lib/payments/consent'

// POST /svc/paiement/mock/: the simulated payment (development and tests only, never with Stripe keys and
// never on the production origin, see lib/payments/provider.js). Settles exactly like the Stripe webhook.
export const dynamic = 'force-dynamic'

export async function POST(request) {
  if (paymentProvider() !== 'mock') return new Response('Introuvable', { status: 404 })
  const form = await request.formData().catch(() => null)
  if (!form) return new Response('Formulaire illisible', { status: 400 })
  const get = (k) => (typeof form.get(k) === 'string' ? form.get(k).trim() : '')
  const locale = ['fr', 'en', 'es'].includes(get('locale')) ? get('locale') : 'fr'
  const payload = await getPayload({ config })
  const SYS = { overrideAccess: true, depth: 0, limit: 1 }

  if (get('commande')) {
    const order = (await payload.find({ collection: 'orders', where: { accessToken: { equals: get('commande') } }, ...SYS })).docs[0]
    if (!order || order.payment?.provider !== 'mock') return new Response('Introuvable', { status: 404 })
    await markOrderPaid(payload, { orderId: order.id, provider: 'mock', reference: `mock_${newToken(9)}`, amountCents: order.totals?.totalCents })
    return seeOther(`${thanksPath(locale)}?${Q.order}=${order.accessToken}`)
  }

  if (get('soumission')) {
    const req = (await payload.find({ collection: 'requests', where: { accessToken: { equals: get('soumission') } }, ...SYS })).docs[0]
    if (!req) return new Response('Introuvable', { status: 404 })
    const consent = await quoteConsent(payload, { locale, terms: get('terms'), frenchFirst: get('frenchFirst') })
    if (!consent.ok) return seeOther(`${checkoutPath(locale)}?${Q.quote}=${req.accessToken}&${Q.error}=${consent.code}#paiement`)
    const res = await markDepositPaid(payload, { requestId: req.id, provider: 'mock', reference: `mock_${newToken(9)}`, amountCents: req.quote?.depositCents, consent: consent.consent })
    if (!res.ok) return seeOther(`${checkoutPath(locale)}?${Q.quote}=${req.accessToken}&${Q.error}=${res.code}#paiement`)
    return seeOther(`${thanksPath(locale)}?${Q.order}=${res.order?.accessToken || res.request?.order?.accessToken || ''}`)
  }
  return new Response('Introuvable', { status: 404 })
}
