import { isOwnerOrManager, hasRole, nobody } from '../lib/access.js'
import { auditHooks } from '../lib/studio/audit.js'

// Reviews from Google (API later, typed in until it is approved), replied within 24 h in the reviewer's
// language (M1). No per-staff fields of any kind (G20).
export const Reviews = {
  slug: 'reviews',
  admin: { useAsTitle: 'author', group: 'Avis', defaultColumns: ['author', 'rating', 'status', 'receivedAt'] },
  access: {
    read: ({ req: { user } }) => hasRole(user, 'proprietaire', 'gerant', 'agence'),
    create: isOwnerOrManager,
    update: isOwnerOrManager,
    delete: nobody,
  },
  hooks: auditHooks('reviews'),
  fields: [
    { name: 'platform', type: 'select', defaultValue: 'google', options: ['google', 'facebook', 'tripadvisor', 'yelp'] },
    { name: 'externalId', type: 'text', index: true },
    { name: 'author', type: 'text', required: true, admin: { description: 'Nom affiché sur la plateforme.' } },
    { name: 'rating', type: 'number', min: 1, max: 5, required: true },
    { name: 'text', type: 'textarea' },
    { name: 'language', type: 'select', defaultValue: 'fr', options: ['fr', 'en', 'es'] },
    { name: 'receivedAt', type: 'date', required: true, index: true, admin: { date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'replyDraft', type: 'textarea', admin: { description: 'Brouillon à vérifier avant de publier (modèles, jamais publié seul).' } },
    { name: 'reply', type: 'textarea' },
    { name: 'repliedAt', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'status', type: 'select', defaultValue: 'unanswered', options: ['unanswered', 'answered', 'later'], index: true },
  ],
}
