import { isStaff, isOwner, isOwnerOrManager, isOwnerOrAgency, isTeam, hasRole, nobody } from '../lib/access.js'

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
