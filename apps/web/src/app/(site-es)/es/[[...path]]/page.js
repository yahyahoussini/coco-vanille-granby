import { SitePage, buildMetadata, staticParamsFor } from '@/components/site/SitePage'

export const revalidate = 300
export const dynamicParams = true

export const generateStaticParams = () => staticParamsFor('es')

export async function generateMetadata({ params }) {
  const { path = [] } = await params
  return buildMetadata('es', path)
}

export default async function Page({ params }) {
  const { path = [] } = await params
  return <SitePage locale="es" segments={path} />
}
