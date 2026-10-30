import { nobody } from '../lib/access.js'

// « Écrivez-nous »: the site's own chat (no third-party processor, Loi 25). A visitor's thread is reached only
// with their HttpOnly cookie, compared with `tokenHash` (lib/chat/token.js); nobody reads or writes it over REST
// or « Avancé ». The public route (/svc/clavardage/) and Studio › Messages (role check first, lib/studio/roles.js)
// read and write it server-side. No IP address is kept; the worker deletes a thread 90 days after its last
// message (worker/tasks.js).
export const Conversations = {
  slug: 'conversations',
  admin: { useAsTitle: 'name', group: 'Système', defaultColumns: ['name', 'status', 'lastMessageAt'] },
  access: { read: nobody, create: nobody, update: nobody, delete: nobody },
  fields: [
    // SHA-256 of the visitor's secret; the secret itself lives only in their browser.
    { name: 'tokenHash', type: 'text', required: true, admin: { hidden: true } },
    { name: 'status', type: 'select', defaultValue: 'open', index: true, options: [
      { value: 'open', label: 'À répondre' },
      { value: 'answered', label: 'Répondu' },
      { value: 'closed', label: 'Réglé' },
    ] },
    { name: 'language', type: 'select', defaultValue: 'fr', options: ['fr', 'en', 'es'] },
    { name: 'startedOnPath', type: 'text', admin: { description: 'Page du site d’où la personne a écrit (sans paramètres).' } },
    { name: 'name', type: 'text', maxLength: 60 },
    // E.164 phone or lower-case email (lib/chat/validate.js).
    { name: 'contact', type: 'text', maxLength: 120 },
    { name: 'replyByConsent', type: 'checkbox', defaultValue: false, admin: { description: 'La personne a demandé la réponse aussi par texto ou courriel.' } },
    {
      name: 'messages',
      type: 'array',
      fields: [
        { name: 'from', type: 'select', required: true, options: ['client', 'shop'] },
        { name: 'text', type: 'textarea', required: true, maxLength: 1000 },
        { name: 'at', type: 'date', required: true, admin: { date: { pickerAppearance: 'dayAndTime' } } },
        // Who answered (shop messages); never shown on the site.
        { name: 'author', type: 'relationship', relationTo: 'users' },
        // A shop reply also sent by texto or courriel (the visitor asked for it).
        { name: 'relay', type: 'select', options: ['sms', 'email'] },
      ],
    },
    { name: 'lastMessageAt', type: 'date', index: true, admin: { date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'unreadForShop', type: 'number', defaultValue: 0, index: true },
    { name: 'unreadForVisitor', type: 'number', defaultValue: 0 },
  ],
}
