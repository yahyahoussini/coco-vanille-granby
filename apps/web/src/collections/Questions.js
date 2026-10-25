import { isStaff, isOwner, isOwnerOrManager, isOwnerOrAgency, isTeam, hasRole, nobody } from '../lib/access.js'

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
