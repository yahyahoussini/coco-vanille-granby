import { getBusiness } from '@/lib/data'

// QR code on every box → /avis → the Google review link (target editable in Studio, 11 §4.2).
export const dynamic = 'force-dynamic'

export async function GET() {
  const business = await getBusiness('fr')
  const target = business?.google?.reviewLink || (business?.google?.cid ? `https://maps.google.com/?cid=${business.google.cid}` : 'https://cocovanillegranby.com/')
  return new Response(null, { status: 302, headers: { Location: target, 'X-Robots-Tag': 'noindex' } })
}
