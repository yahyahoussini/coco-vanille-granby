import { SitePage, buildMetadata, staticParamsFor } from '@/components/site/SitePage'

export const revalidate = 300
export const dynamicParams = true

export const generateStaticParams = () => staticParamsFor('fr')

export async function generateMetadata({ params }) {
  const { path = [] } = await params
  return buildMetadata('fr', path)
}

export default async function Page({ params }) {
  const { path = [] } = await params
  return <SitePage locale="fr" segments={path} />
}
