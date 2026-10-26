import { ogImageResponse, ogStaticParams } from '@/components/site/og'

// Open Graph image for every fr page: /…/og/<page key>.png (products: p-<id>.png), regenerated like the pages.
export const revalidate = 300
export const dynamicParams = true
export const generateStaticParams = () => ogStaticParams('fr')

export async function GET(_request, { params }) {
  const { slug } = await params
  return ogImageResponse('fr', slug)
}
