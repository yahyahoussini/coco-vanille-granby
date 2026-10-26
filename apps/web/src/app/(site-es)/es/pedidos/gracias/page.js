import { orderingRoute } from '@/components/ordering/route'

// Ordering page (merci): reads cookies and the query string, so it renders per request.
export const dynamic = 'force-dynamic'

const route = orderingRoute('es', ['pedidos', 'gracias'], 'merci')
export const generateMetadata = route.generateMetadata
export default route.Page
