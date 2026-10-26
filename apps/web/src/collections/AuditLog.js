import { isOwnerOrAgency, nobody } from '../lib/access.js'

// Every state change carries person, device, time, before and after (16 AC9, G10). Read-only for everyone;
// the owner and the agency can read it. Studio writes it server-side (lib/studio/audit.js).
export const AuditLog = {
  slug: 'audit-log',
  admin: { useAsTitle: 'summary', group: 'Système', defaultColumns: ['summary', 'action', 'createdAt'] },
  access: { read: isOwnerOrAgency, create: nobody, update: nobody, delete: nobody },
  fields: [
    { name: 'actor', type: 'relationship', relationTo: 'users' },
    { name: 'device', type: 'text' },
    { name: 'ip', type: 'text' },
    { name: 'action', type: 'text', required: true, index: true },
    { name: 'entity', type: 'text' },
    { name: 'entityId', type: 'text', index: true },
    { name: 'summary', type: 'text', admin: { description: 'Phrase lisible : « Léa (tablette) a marqué … à 10 h 42 ».' } },
    { name: 'before', type: 'json' },
    { name: 'after', type: 'json' },
    // The on-screen message can name a customer (« texto à Julie T. »): not for Agence (Loi 25 minimisation).
    { name: 'result', type: 'json', access: { read: ({ req: { user } }) => user?.role === 'proprietaire' }, admin: { description: 'Réponse renvoyée à l’écran (rejouée telle quelle pour une même clé).' } },
    // Idempotency key from the offline outbox: the same key never applies twice (16a §7 rule 3).
    { name: 'key', type: 'text', unique: true, index: true },
    { name: 'undoUntil', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'undoneAt', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'undoOf', type: 'text', admin: { description: 'Entrée annulée par celle-ci (« Annuler »).' } },
  ],
}
