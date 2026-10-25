import { isStaff, isOwner, isOwnerOrManager, isOwnerOrAgency, isTeam, hasRole, nobody } from '../lib/access.js'

// Order state machine (10 §2): pending_payment → paid → ready → picked_up
// (+ not_picked_up, cancelled, refunded). « En préparation » is derived, never tapped.
export const ORDER_STATUSES = ['pending_payment', 'paid', 'ready', 'picked_up', 'not_picked_up', 'cancelled', 'refunded']

const customerFields = [
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

// Custom-cake requests: request → price → deposit link (16 §3.4, 10 §5.2).
export const Requests = {
  slug: 'requests',
  admin: { useAsTitle: 'occasion', group: 'Commandes' },
  access: { read: isOwnerOrManager, create: isOwnerOrManager, update: isOwnerOrManager, delete: nobody },
  fields: [
    { name: 'status', type: 'select', defaultValue: 'new', options: ['new', 'quoted', 'deposit_paid', 'confirmed', 'declined', 'expired'], index: true },
    { name: 'occasion', type: 'text', required: true },
    { name: 'guests', type: 'number' },
    { name: 'eventDate', type: 'date', required: true },
    { name: 'flavour', type: 'text' },
    { name: 'cakeMessage', type: 'text' },
    { name: 'details', type: 'textarea' },
    { name: 'photos', type: 'upload', relationTo: 'media', hasMany: true },
    { name: 'hasAllergy', type: 'checkbox', defaultValue: false, admin: { description: 'Toujours traitée par téléphone (07 S10).' } },
    { name: 'customer', type: 'group', fields: customerFields },
    { name: 'answerBy', type: 'date', admin: { description: 'Réponse promise dans les 24 h.' } },
    {
      name: 'quote',
      type: 'group',
      fields: [
        { name: 'totalCents', type: 'number' },
        { name: 'depositPercent', type: 'number' },
        { name: 'depositCents', type: 'number' },
        { name: 'validUntil', type: 'date' },
        { name: 'paymentLink', type: 'text' },
        { name: 'sentAt', type: 'date' },
      ],
    },
    { name: 'order', type: 'relationship', relationTo: 'orders' },
  ],
}

// Daily capacity per production category; date overrides from « Boutique & heures ».
export const CapacityPools = {
  slug: 'capacity-pools',
  admin: { useAsTitle: 'productionCategory', group: 'Boutique' },
  access: { read: isTeam, create: isOwnerOrManager, update: isOwnerOrManager, delete: isOwnerOrManager },
  fields: [
    { name: 'productionCategory', type: 'text', required: true },
    { name: 'unit', type: 'select', defaultValue: 'items', options: ['items', 'cakes', 'boxes'] },
    { name: 'defaultPerDay', type: 'number', admin: { description: 'Vide = [[FACT NEEDED: capacité]].' } },
    { name: 'overrides', type: 'array', fields: [{ name: 'date', type: 'date', required: true }, { name: 'capacity', type: 'number', required: true }] },
  ],
}

// Reviews from Google (API or manual), replied within 24 h (M1).
export const Reviews = {
  slug: 'reviews',
  admin: { useAsTitle: 'author', group: 'Avis' },
  access: { read: isOwnerOrAgency, create: isOwnerOrManager, update: isOwnerOrManager, delete: nobody },
  fields: [
    { name: 'platform', type: 'select', defaultValue: 'google', options: ['google', 'facebook', 'tripadvisor', 'yelp'] },
    { name: 'externalId', type: 'text', index: true },
    { name: 'author', type: 'text', required: true },
    { name: 'rating', type: 'number', min: 1, max: 5, required: true },
    { name: 'text', type: 'textarea' },
    { name: 'language', type: 'select', defaultValue: 'fr', options: ['fr', 'en', 'es'] },
    { name: 'receivedAt', type: 'date', required: true },
    { name: 'replyDraft', type: 'textarea' },
    { name: 'reply', type: 'textarea' },
    { name: 'repliedAt', type: 'date' },
    { name: 'status', type: 'select', defaultValue: 'unanswered', options: ['unanswered', 'answered', 'later'] },
  ],
}

// Every state change carries person, device, time, before and after (16 AC9).
export const AuditLog = {
  slug: 'audit-log',
  admin: { useAsTitle: 'action', group: 'Système' },
  access: { read: isOwnerOrAgency, create: isTeam, update: nobody, delete: nobody },
  fields: [
    { name: 'actor', type: 'relationship', relationTo: 'users' },
    { name: 'device', type: 'text' },
    { name: 'action', type: 'text', required: true },
    { name: 'entity', type: 'text' },
    { name: 'entityId', type: 'text' },
    { name: 'before', type: 'json' },
    { name: 'after', type: 'json' },
  ],
}

// « Noter une question de client » → agency FAQ queue (AEO loop).
export const Questions = {
  slug: 'questions',
  admin: { useAsTitle: 'text', group: 'Contenu' },
  access: { read: isTeam, create: isTeam, update: isOwnerOrAgency, delete: isOwnerOrAgency },
  fields: [
    { name: 'text', type: 'textarea', required: true },
    { name: 'language', type: 'select', defaultValue: 'fr', options: ['fr', 'en', 'es'] },
    { name: 'source', type: 'select', defaultValue: 'comptoir', options: ['comptoir', 'telephone', 'instagram', 'courriel', 'avis'] },
    { name: 'status', type: 'select', defaultValue: 'new', options: ['new', 'answered_on_site', 'ignored'] },
  ],
}

// Outbound texts and emails (transactional vs commercial, CASL), with delivery status.
export const Messages = {
  slug: 'messages',
  admin: { useAsTitle: 'template', group: 'Système' },
  access: { read: isOwnerOrManager, create: isStaff, update: isStaff, delete: nobody },
  fields: [
    { name: 'channel', type: 'select', options: ['sms', 'email'], required: true },
    { name: 'kind', type: 'select', options: ['transactional', 'commercial'], defaultValue: 'transactional' },
    { name: 'template', type: 'text', required: true },
    { name: 'to', type: 'text', required: true },
    { name: 'language', type: 'select', defaultValue: 'fr', options: ['fr', 'en', 'es'] },
    { name: 'body', type: 'textarea' },
    { name: 'order', type: 'relationship', relationTo: 'orders' },
    { name: 'sendAfter', type: 'date', admin: { description: 'Part après la fenêtre « Annuler ».' } },
    { name: 'status', type: 'select', defaultValue: 'queued', options: ['queued', 'cancelled', 'sent', 'delivered', 'failed'] },
    { name: 'providerId', type: 'text' },
  ],
}

export const operationsCollections = [Orders, Requests, CapacityPools, Reviews, AuditLog, Questions, Messages]
export { isOwner }
