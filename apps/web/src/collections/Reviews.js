import { isStaff, isOwner, isOwnerOrManager, isOwnerOrAgency, isTeam, hasRole, nobody } from '../lib/access.js'

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
