import { customerFields } from './Orders.js'
import { isStaff, isOwner, isOwnerOrManager, isOwnerOrAgency, isTeam, hasRole, nobody } from '../lib/access.js'

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
