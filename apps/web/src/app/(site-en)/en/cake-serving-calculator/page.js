import { SitePage, buildMetadata } from '@/components/site/SitePage'

// The serving calculator answers a GET form (?invites=N) on the server, so it works with JavaScript off.
// Reading the query makes this one route dynamic; every other page stays static (ISR) in the catch-all.
const segments = ['cake-serving-calculator']

export async function generateMetadata() {
  return buildMetadata('en', segments)
}

export default async function Page({ searchParams }) {
  const query = await searchParams
  return <SitePage locale="en" segments={segments} query={query} />
}
