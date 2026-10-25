import { isStaff, isOwner, isOwnerOrManager, isOwnerOrAgency, isTeam, hasRole, nobody } from '../lib/access.js'

// Daily capacity per production category; date overrides from « Boutique & heures ».
export const CapacityPools = {
  slug: 'capacity-pools',
  admin: { useAsTitle: 'productionCategory', group: 'Boutique' },
  access: { read: isTeam, create: isOwnerOrManager, update: isOwnerOrManager, delete: isOwnerOrManager },
  fields: [
    { name: 'productionCategory', type: 'text', required: true },
    { name: 'unit', type: 'select', defaultValue: 'items', options: ['items', 'cakes', 'boxes'] },
    { name: 'defaultPerDay', type: 'number', admin: { description: 'Vide = [[FACT NEEDED: capacité]].' } },
    { name: 'overrides', type: 'array', fields: [{ name: 'date', type: 'date', required: true }, { name: 'capacity', type: 'number', required: true }] },
  ],
}
