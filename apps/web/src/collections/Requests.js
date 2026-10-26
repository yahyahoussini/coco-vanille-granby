import { customerFields } from './Orders.js'
import { PRODUCTION_CATEGORIES } from './Catalog.js'
import { isStaff, isOwner, isOwnerOrManager, isOwnerOrAgency, isTeam, hasRole, nobody } from '../lib/access.js'

// Custom-cake requests: request → price → deposit link (16 §3.4, 10 §5.2).
export const Requests = {
  slug: 'requests',
  admin: { useAsTitle: 'occasion', group: 'Commandes', defaultColumns: ['occasion', 'eventDate', 'status', 'answerBy'] },
  access: { read: isOwnerOrManager, create: isOwnerOrManager, update: isOwnerOrManager, delete: nobody },
  fields: [
    { name: 'status', type: 'select', defaultValue: 'new', options: ['new', 'quoted', 'deposit_paid', 'confirmed', 'declined', 'expired'], index: true },
    { name: 'source', type: 'select', defaultValue: 'web', options: ['web', 'phone'] },
    { name: 'occasion', type: 'text', required: true },
    { name: 'guests', type: 'number' },
    { name: 'eventDate', type: 'date', required: true, index: true, admin: { description: 'Date de cueillette souhaitée.', date: { pickerAppearance: 'dayOnly' } } },
    { name: 'flavour', type: 'text' },
    { name: 'cakeMessage', type: 'text' },
    { name: 'details', type: 'textarea' },
    // Inspiration photos stay private (staff only), unlike the public media library.
    { name: 'photos', type: 'upload', relationTo: 'request-photos', hasMany: true, maxRows: 3 },
    { name: 'hasAllergy', type: 'checkbox', defaultValue: false, admin: { description: 'Toujours traitée par téléphone (07 S10).' } },
    { name: 'customer', type: 'group', fields: customerFields },
    { name: 'answerBy', type: 'date', admin: { description: 'Réponse promise dans les 24 h.' } },
    // An open quote holds this much of its day's pool until it expires (10 §5.2).
    { name: 'productionCategory', type: 'select', defaultValue: 'gateaux', options: PRODUCTION_CATEGORIES },
    { name: 'capacityUnits', type: 'number', defaultValue: 1, min: 1 },
    {
      name: 'quote',
      type: 'group',
      fields: [
        { name: 'subtotalCents', type: 'number', admin: { description: 'Prix avant taxes.' } },
        { name: 'taxClass', type: 'select', options: ['zero', 'taxable', 'rule'] },
        { name: 'gstCents', type: 'number' },
        { name: 'qstCents', type: 'number' },
        { name: 'totalCents', type: 'number', admin: { description: 'Total avec taxes.' } },
        { name: 'depositPercent', type: 'number' },
        { name: 'depositCents', type: 'number' },
        { name: 'balanceCents', type: 'number' },
        { name: 'validUntil', type: 'date' },
        { name: 'paymentLink', type: 'text' },
        { name: 'sentAt', type: 'date' },
      ],
    },
    {
      name: 'payment',
      type: 'group',
      fields: [
        { name: 'provider', type: 'select', options: ['stripe', 'square', 'mock', 'none'], defaultValue: 'none' },
        { name: 'reference', type: 'text', index: true },
        { name: 'status', type: 'select', options: ['none', 'pending', 'paid', 'failed', 'refunded'], defaultValue: 'none' },
        { name: 'paidAt', type: 'date' },
      ],
    },
    // Opaque token for the customer's links (thanks page, deposit payment).
    { name: 'accessToken', type: 'text', index: true, admin: { readOnly: true } },
    { name: 'order', type: 'relationship', relationTo: 'orders' },
    { name: 'attribution', type: 'json' },
    { name: 'timeline', type: 'json', admin: { description: 'Historique des changements d’état.' } },
  ],
}

// Photos sent with a request: readable by the owner and the manager only, never public (Loi 25 minimisation).
export const RequestPhotos = {
  slug: 'request-photos',
  admin: { group: 'Commandes', hidden: ({ user }) => !hasRole(user, 'proprietaire', 'gerant') },
  access: { read: isOwnerOrManager, create: nobody, update: isOwnerOrManager, delete: isOwnerOrManager },
  upload: {
    staticDir: 'media/demandes',
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    imageSizes: [{ name: 'thumb', width: 480, height: 480, fit: 'inside', formatOptions: { format: 'webp', options: { quality: 70 } } }],
  },
  fields: [{ name: 'alt', type: 'text' }],
}
