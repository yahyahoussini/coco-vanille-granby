import { isStaff, isOwner, isOwnerOrManager, isOwnerOrAgency, isTeam, hasRole, nobody } from '../lib/access.js'

// Order state machine (10 §2): pending_payment → paid → ready → picked_up
// (+ not_picked_up, cancelled, refunded). « En préparation » is derived, never tapped.
export const ORDER_STATUSES = ['pending_payment', 'paid', 'ready', 'picked_up', 'not_picked_up', 'cancelled', 'refunded']

export const customerFields = [
  { name: 'firstName', type: 'text', required: true },
  { name: 'lastName', type: 'text' },
  { name: 'phone', type: 'text' },
  { name: 'email', type: 'email' },
  { name: 'language', type: 'select', defaultValue: 'fr', options: ['fr', 'en', 'es'] },
]

// Agence sees counts, not customer names or phones (Loi 25 minimisation, 16 §1.1).
const hideFromAgency = { read: ({ req: { user } }) => hasRole(user, 'proprietaire', 'gerant', 'comptoir') }

export const Orders = {
  slug: 'orders',
  admin: { useAsTitle: 'number', group: 'Commandes', defaultColumns: ['number', 'status', 'pickupDate', 'total'] },
  access: {
    read: ({ req: { user } }) => hasRole(user, 'proprietaire', 'gerant', 'comptoir', 'agence'),
    create: isStaff,
    update: isStaff,
    delete: nobody,
  },
  fields: [
    { name: 'number', type: 'number', unique: true, index: true },
    { name: 'status', type: 'select', required: true, defaultValue: 'pending_payment', options: ORDER_STATUSES, index: true },
    { name: 'source', type: 'select', defaultValue: 'web', options: ['web', 'phone', 'request'] },
    { name: 'customer', type: 'group', fields: customerFields, access: hideFromAgency },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'product', type: 'relationship', relationTo: 'products' },
        { name: 'title', type: 'text', required: true },
        { name: 'variantLabel', type: 'text' },
        { name: 'qty', type: 'number', required: true, min: 1 },
        { name: 'unitPriceCents', type: 'number', required: true },
        { name: 'taxClass', type: 'text' },
        { name: 'message', type: 'text', admin: { description: 'Message sur le gâteau.' } },
      ],
    },
    { name: 'pickupDate', type: 'date', index: true, admin: { date: { pickerAppearance: 'dayOnly' } } },
    { name: 'pickupWindowStart', type: 'text', admin: { description: 'HH:MM, America/Toronto' } },
    { name: 'pickupWindowEnd', type: 'text' },
    { name: 'pickupCode', type: 'text', admin: { description: 'Code à 4 chiffres montré au client.' } },
    {
      name: 'totals',
      type: 'group',
      fields: [
        { name: 'subtotalCents', type: 'number' },
        { name: 'gstCents', type: 'number' },
        { name: 'qstCents', type: 'number' },
        { name: 'totalCents', type: 'number' },
        { name: 'depositCents', type: 'number' },
        { name: 'balanceCents', type: 'number' },
      ],
    },
    {
      name: 'payment',
      type: 'group',
      fields: [
        { name: 'provider', type: 'select', options: ['stripe', 'square', 'counter', 'none'], defaultValue: 'none' },
        { name: 'reference', type: 'text' },
        { name: 'status', type: 'select', options: ['none', 'pending', 'paid', 'failed', 'refunded'], defaultValue: 'none' },
        { name: 'paidAt', type: 'date' },
        { name: 'refundDueBy', type: 'date' },
      ],
    },
    // Retained 30 days after pickup, then deleted (16 §6.2 nightly retention).
    { name: 'allergyNote', type: 'textarea', access: hideFromAgency },
    {
      name: 'consent',
      type: 'group',
      fields: [
        { name: 'termsAcceptedAt', type: 'date' },
        { name: 'termsVersion', type: 'text' },
        { name: 'reviewRequest', type: 'checkbox', defaultValue: false },
        { name: 'marketing', type: 'checkbox', defaultValue: false },
        { name: 'analytics', type: 'checkbox', defaultValue: false },
      ],
    },
    { name: 'attribution', type: 'json', admin: { description: 'utm_*, gclid, langue, « comment nous avez-vous connus ? »' } },
    { name: 'boxToken', type: 'text', index: true },
    { name: 'timeline', type: 'json', admin: { description: 'Historique des changements d’état.' } },
  ],
}
