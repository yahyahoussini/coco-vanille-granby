import { isOwnerOrAgency, isTeam } from '../lib/access.js'
import { auditHooks } from '../lib/studio/audit.js'

// The owner's answers to the facts the site asks for (Studio › Plus › « Faits du site », lib/facts-catalog.js).
// One row per fact: its key in the catalog (or « autre:<langue>:<libellé> » for a slot the catalog does not
// know), the French answer and the English one. The public pages fill their [[FACT NEEDED]] slots from it
// (lib/data.js), so the copy written by the agency never has to be edited to add a fact. Studio writes
// through its actions (role matrix, audit log); « Avancé » keeps owner and agency only.
export const SiteFacts = {
  slug: 'site-facts',
  labels: { singular: 'Fait du site', plural: 'Faits du site' },
  admin: { useAsTitle: 'key', group: 'Contenu', description: 'Réponses aux faits que le site attend; se remplissent dans Studio › Plus › Faits du site.' },
  access: { read: isTeam, create: isOwnerOrAgency, update: isOwnerOrAgency, delete: isOwnerOrAgency },
  hooks: auditHooks('site-facts'),
  fields: [
    { name: 'key', type: 'text', required: true, unique: true, index: true },
    { name: 'fr', type: 'textarea', admin: { description: 'Réponse en français, telle qu’elle s’affiche dans la phrase.' } },
    { name: 'en', type: 'textarea', admin: { description: 'English answer (never more than the French one).' } },
  ],
}
