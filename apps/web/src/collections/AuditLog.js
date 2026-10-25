import { isStaff, isOwner, isOwnerOrManager, isOwnerOrAgency, isTeam, hasRole, nobody } from '../lib/access.js'

// Every state change carries person, device, time, before and after (16 AC9).
export const AuditLog = {
  slug: 'audit-log',
  admin: { useAsTitle: 'action', group: 'Système' },
  access: { read: isOwnerOrAgency, create: isTeam, update: nobody, delete: nobody },
  fields: [
    { name: 'actor', type: 'relationship', relationTo: 'users' },
    { name: 'device', type: 'text' },
    { name: 'action', type: 'text', required: true },
    { name: 'entity', type: 'text' },
    { name: 'entityId', type: 'text' },
    { name: 'before', type: 'json' },
    { name: 'after', type: 'json' },
  ],
}
