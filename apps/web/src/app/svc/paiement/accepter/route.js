import { getPayload } from 'payload'
import config from '@payload-config'
import { quoteConsent } from '@/lib/payments/consent'

// POST /svc/paiement/accepter/ (JSON): records the express acceptance of the conditions for a quote deposit
// just before Stripe confirms the card (the webhook copies it onto the order).
export const dynamic = 'force-dynamic'

export async function POST(request) {
  const body = await request.json().catch(() => ({}))
  const token = String(body.soumission || '')
  if (!/^[\w-]{10,64}$/.test(token)) return Response.json({ ok: false }, { status: 404 })
  const locale = ['fr', 'en', 'es'].includes(body.locale) ? body.locale : 'fr'
  const payload = await getPayload({ config })
  const req = (await payload.find({ collection: 'requests', where: { accessToken: { equals: token } }, limit: 1, overrideAccess: true, depth: 0 })).docs[0]
  if (!req || req.status !== 'quoted') return Response.json({ ok: false, code: 'request_state' }, { status: 409 })
  const consent = await quoteConsent(payload, { locale, terms: body.terms, frenchFirst: body.frenchFirst })
  if (!consent.ok) return Response.json(consent, { status: 422 })
  await payload.update({ collection: 'requests', id: req.id, data: { consent: consent.consent }, overrideAccess: true, depth: 0 })
  return Response.json({ ok: true })
}
