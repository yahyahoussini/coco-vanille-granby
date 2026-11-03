// One open custom-cake request, its pools and its shop: for the tests of a price agreed by phone.
import { fakePayload } from '../ordering/fake-payload.js'
import { shop, pools } from '../ordering/fixtures.js'

const request = { id: 7, status: 'new', occasion: 'Anniversaire', eventDate: '2026-12-05T12:00:00.000Z', cakeMessage: 'Bonne fête', customer: { firstName: 'Julie', phone: '+14505550101', language: 'fr' } }

export const confirmed = () => fakePayload({ globals: { shop: shop(), business: {} }, collections: { requests: [{ ...request }], 'capacity-pools': pools() } })
