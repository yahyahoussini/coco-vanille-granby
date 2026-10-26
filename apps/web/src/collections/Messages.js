import { isOwnerOrManager, nobody } from '../lib/access.js'

// Outbound texts and emails (transactional vs commercial, CASL), with delivery status. Only server code queues
// them (lib/messaging/queue.js, which sets `kind` from the template); nobody writes one over REST.
export const Messages = {
  slug: 'messages',
  admin: { useAsTitle: 'template', group: 'Système' },
  access: { read: isOwnerOrManager, create: nobody, update: nobody, delete: nobody },
  fields: [
    { name: 'channel', type: 'select', options: ['sms', 'email'], required: true },
    { name: 'kind', type: 'select', options: ['transactional', 'commercial'], defaultValue: 'transactional' },
    { name: 'template', type: 'text', required: true },
    { name: 'to', type: 'text', required: true },
    { name: 'language', type: 'select', defaultValue: 'fr', options: ['fr', 'en', 'es'] },
    { name: 'subject', type: 'text' },
    { name: 'body', type: 'textarea', admin: { description: 'Texte du texto, ou version texte du courriel.' } },
    { name: 'html', type: 'textarea', admin: { hidden: true } },
    // Calendar file and other attachments: [{ filename, contentType, content }]
    { name: 'attachments', type: 'json', admin: { hidden: true } },
    { name: 'order', type: 'relationship', relationTo: 'orders' },
    { name: 'request', type: 'relationship', relationTo: 'requests' },
    { name: 'sendAfter', type: 'date', admin: { description: 'Part après la fenêtre « Annuler ».' } },
    { name: 'status', type: 'select', defaultValue: 'queued', options: ['queued', 'sending', 'cancelled', 'sent', 'delivered', 'failed'], index: true },
    { name: 'providerId', type: 'text' },
    { name: 'attempts', type: 'number', defaultValue: 0 },
    { name: 'error', type: 'text' },
    { name: 'sentAt', type: 'date' },
    { name: 'segments', type: 'number', admin: { description: 'Texto : nombre de segments (1 visé, GSM-7).' } },
  ],
}
