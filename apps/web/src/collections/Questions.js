import { isOwnerOrAgency, isTeam } from '../lib/access.js'
import { auditHooks } from '../lib/studio/audit.js'

// « Noter une question de client » → agency FAQ queue (AEO loop).
export const Questions = {
  slug: 'questions',
  admin: { useAsTitle: 'text', group: 'Contenu' },
  access: { read: isTeam, create: isTeam, update: isOwnerOrAgency, delete: isOwnerOrAgency },
  hooks: auditHooks('questions'),
  fields: [
    { name: 'text', type: 'textarea', required: true },
    { name: 'language', type: 'select', defaultValue: 'fr', options: ['fr', 'en', 'es'] },
    { name: 'source', type: 'select', defaultValue: 'comptoir', options: ['comptoir', 'telephone', 'instagram', 'courriel', 'avis'] },
    { name: 'status', type: 'select', defaultValue: 'new', options: ['new', 'answered_on_site', 'ignored'] },
  ],
}
