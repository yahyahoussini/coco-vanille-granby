import { getPayload } from 'payload'
import config from '@payload-config'
import { pickupIcs } from '@/lib/ordering/ics'
import { senderFacts, thanksUrl } from '@/lib/messaging/templates'

// GET /svc/calendrier/?commande=<token>: the pickup as a calendar file (10 §4).
export const dynamic = 'force-dynamic'

export async function GET(request) {
  const token = new URL(request.url).searchParams.get('commande') || ''
  if (!/^[\w-]{10,64}$/.test(token)) return new Response('Introuvable', { status: 404 })
  const payload = await getPayload({ config })
  const order = (await payload.find({ collection: 'orders', where: { accessToken: { equals: token } }, limit: 1, overrideAccess: true, depth: 0 })).docs[0]
  if (!order || !order.pickupWindowStart) return new Response('Introuvable', { status: 404 })
  const business = await payload.findGlobal({ slug: 'business', overrideAccess: true, depth: 0 })
  const facts = senderFacts(business, { origin: process.env.PUBLIC_ORIGIN || 'https://cocovanillegranby.com' })
  const ics = pickupIcs(order, { location: [facts.name, facts.addressLine.fr].filter(Boolean).join(', '), url: thanksUrl(facts, order) })
  return new Response(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="cueillette-${order.number}.ics"`,
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex',
    },
  })
}
