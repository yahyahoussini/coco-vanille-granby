import { hasRole, nobody } from '../lib/access.js'
import { auditHooks } from '../lib/studio/audit.js'

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

// Agence sees counts, not customer names, phones, codes, cake messages or the history (Loi 25 minimisation, 16 §1.1).
export const hideFromAgency = { read: ({ req: { user } }) => hasRole(user, 'proprietaire', 'gerant', 'comptoir') }

// Read-only over REST and « Avancé »: every change goes through the checkout, the payment code, the worker or a
// Studio action (role matrix, state machine, audit log), all server-side with overrideAccess (10 §2, 16 §2.2).
export const Orders = {
  slug: 'orders',
  admin: { useAsTitle: 'number', group: 'Commandes', defaultColumns: ['number', 'status', 'pickupDate', 'total'] },
  access: {
    read: ({ req: { user } }) => hasRole(user, 'proprietaire', 'gerant', 'comptoir', 'agence'),
    create: nobody,
    update: nobody,
    delete: nobody,
  },
  hooks: auditHooks('orders'),
  fields: [
    { name: 'number', type: 'number', unique: true, index: true },
    { name: 'status', type: 'select', required: true, defaultValue: 'pending_payment', options: ORDER_STATUSES, index: true },
    { name: 'source', type: 'select', defaultValue: 'web', options: ['web', 'phone', 'request'] },
    { name: 'locale', type: 'select', defaultValue: 'fr', options: ['fr', 'en', 'es'], admin: { description: 'Langue de la commande (copie du contrat : français d’abord).' } },
    { name: 'customer', type: 'group', fields: customerFields, access: hideFromAgency },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'product', type: 'relationship', relationTo: 'products' },
        { name: 'variantIndex', type: 'number' },
        { name: 'title', type: 'text', required: true },
        { name: 'variantLabel', type: 'text' },
        { name: 'qty', type: 'number', required: true, min: 1 },
        { name: 'unitPriceCents', type: 'number', required: true },
        { name: 'taxClass', type: 'text' },
        { name: 'message', type: 'text', access: hideFromAgency, admin: { description: 'Message sur le gâteau.' } },
        // Capacity snapshot: what this line takes from which pool, on which production day (10 §3).
        { name: 'productionCategory', type: 'text' },
        { name: 'units', type: 'number' },
        { name: 'productionDate', type: 'text', admin: { description: 'AAAA-MM-JJ, jour de production.' } },
      ],
    },
    { name: 'pickupDate', type: 'date', index: true, admin: { date: { pickerAppearance: 'dayOnly' } } },
    { name: 'pickupWindowStart', type: 'text', admin: { description: 'HH:MM, America/Toronto' } },
    { name: 'pickupWindowEnd', type: 'text' },
    { name: 'pickupCode', type: 'text', access: hideFromAgency, admin: { description: 'Code à 4 chiffres montré au client.' } },
    // A web order holds its window and capacity for 10 minutes while the customer pays (10 §3.3).
    { name: 'holdExpiresAt', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
    // Opaque token for the customer's payment, thanks and calendar links (never the order number alone).
    { name: 'accessToken', type: 'text', index: true, access: hideFromAgency, admin: { readOnly: true } },
    { name: 'request', type: 'relationship', relationTo: 'requests' },
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
        // 'mock' = simulated payment (development and tests only, lib/payments).
        { name: 'provider', type: 'select', options: ['stripe', 'square', 'counter', 'mock', 'none'], defaultValue: 'none' },
        { name: 'kind', type: 'select', options: ['full', 'deposit'], defaultValue: 'full' },
        { name: 'reference', type: 'text', index: true },
        { name: 'status', type: 'select', options: ['none', 'pending', 'paid', 'failed', 'refunded'], defaultValue: 'none' },
        { name: 'amountCents', type: 'number' },
        { name: 'paidAt', type: 'date' },
        { name: 'refundDueBy', type: 'date' },
      ],
    },
    // Retained 30 days after pickup, then deleted (16 §6.2 nightly retention).
    { name: 'allergyNote', type: 'textarea', access: hideFromAgency },
    {
      name: 'consent',
      type: 'group',
      access: hideFromAgency,
      fields: [
        { name: 'termsAcceptedAt', type: 'date' },
        { name: 'termsVersion', type: 'text' },
        // Language of the conditions the customer expressly chose to be bound by (07 O3; French first).
        { name: 'bindingLanguage', type: 'select', options: ['fr', 'en', 'es'] },
        // Separate unticked boxes (07 O10), stored with the wording version.
        { name: 'reviewRequest', type: 'checkbox', defaultValue: false },
        { name: 'marketing', type: 'checkbox', defaultValue: false, admin: { description: 'Précommandes saisonnières.' } },
        { name: 'birthdayReminder', type: 'checkbox', defaultValue: false },
        { name: 'analytics', type: 'checkbox', defaultValue: false },
        { name: 'textVersion', type: 'text' },
      ],
    },
    { name: 'attribution', type: 'json', admin: { description: 'utm_*, gclid, langue, « comment nous avez-vous connus ? »' } },
    { name: 'boxToken', type: 'text', index: true, access: hideFromAgency },
    { name: 'contractSentAt', type: 'date', admin: { description: 'Copie du contrat envoyée (07 O6).' } },
    { name: 'timeline', type: 'json', access: hideFromAgency, admin: { description: 'Historique des changements d’état.' } },
  ],
}
