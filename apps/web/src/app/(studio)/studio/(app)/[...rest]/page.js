import { notFound } from 'next/navigation'
import { studioPage } from '@/lib/studio/guard'

// Unknown Studio paths: the Studio 404 inside the shell (after sign-in), never the public site.
export default async function Inconnu() {
  await studioPage(null)
  notFound()
}
