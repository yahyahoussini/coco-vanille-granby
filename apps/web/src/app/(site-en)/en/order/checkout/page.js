import { orderingRoute } from '@/components/ordering/route'

// Ordering page (paiement): reads cookies and the query string, so it renders per request.
export const dynamic = 'force-dynamic'

const route = orderingRoute('en', ['order', 'checkout'], 'paiement')
export const generateMetadata = route.generateMetadata
export default route.Page
