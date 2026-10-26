import { NotFoundPage } from '@/components/site/NotFoundPage'

// Target of src/proxy.js for unknown URLs (status 404 set by the rewrite). Rendered per request so the
// rewrite's status is kept; a direct visit is rewritten here too, so this URL is never a 200.
export const dynamic = 'force-dynamic'

export default function Page() {
  return <NotFoundPage locale="en" head />
}
