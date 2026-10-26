import { SitePage, buildMetadata } from '@/components/site/SitePage'

// The serving calculator answers a GET form (?invites=N) on the server, so it works with JavaScript off.
// Reading the query makes this one route dynamic; every other page stays static (ISR) in the catch-all.
const segments = ['calculateur-portions-gateau']

export async function generateMetadata() {
  return buildMetadata('fr', segments)
}

export default async function Page({ searchParams }) {
  const query = await searchParams
  return <SitePage locale="fr" segments={segments} query={query} />
}
