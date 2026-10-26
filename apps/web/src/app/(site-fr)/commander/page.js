import { orderingRoute } from '@/components/ordering/route'

// Ordering page (commander): reads cookies and the query string, so it renders per request.
export const dynamic = 'force-dynamic'

const route = orderingRoute('fr', ['commander'], 'commander')
export const generateMetadata = route.generateMetadata
export default route.Page
