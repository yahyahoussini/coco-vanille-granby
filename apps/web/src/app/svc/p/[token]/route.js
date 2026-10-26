import { getPayload } from 'payload'
import config from '@payload-config'
import { checkoutPath, orderPath } from '@/lib/ordering/paths'

// GET /svc/p/<token>/: short deposit link sent by text (one SMS segment) → the quote's payment page.
export const dynamic = 'force-dynamic'

export async function GET(request, { params }) {
  const { token } = await params
  const headers = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' }
  if (!/^[\w-]{10,64}$/.test(token || '')) return new Response(null, { status: 303, headers: { ...headers, Location: orderPath('fr') } })
  const payload = await getPayload({ config })
  const req = (await payload.find({ collection: 'requests', where: { accessToken: { equals: token } }, limit: 1, overrideAccess: true, depth: 0 })).docs[0]
  const locale = req?.customer?.language || 'fr'
  return new Response(null, { status: 303, headers: { ...headers, Location: req ? `${checkoutPath(locale)}?soumission=${token}` : orderPath('fr') } })
}
