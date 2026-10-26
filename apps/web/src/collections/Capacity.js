import { isOwnerOrManager, isTeam } from '../lib/access.js'

// Daily capacity per production category; date overrides from « Boutique & heures ».
export const CapacityPools = {
  slug: 'capacity-pools',
  admin: { useAsTitle: 'productionCategory', group: 'Boutique' },
  access: { read: isTeam, create: isOwnerOrManager, update: isOwnerOrManager, delete: isOwnerOrManager },
  fields: [
    { name: 'productionCategory', type: 'text', required: true },
    { name: 'unit', type: 'select', defaultValue: 'items', options: ['items', 'cakes', 'boxes'] },
    { name: 'defaultPerDay', type: 'number', admin: { description: 'Vide = [[FACT NEEDED: capacité]] : pas de commande en ligne pour cette catégorie.' } },
    {
      name: 'perWeekday',
      type: 'array',
      admin: { description: 'Capacité par jour de la semaine (remplace la valeur par défaut).' },
      fields: [
        { name: 'day', type: 'select', required: true, options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
        { name: 'capacity', type: 'number', required: true, min: 0 },
      ],
    },
    // A date override wins over the weekday and the default (holiday caps, season days: 10 §3.4).
    { name: 'overrides', type: 'array', fields: [{ name: 'date', type: 'date', required: true }, { name: 'capacity', type: 'number', required: true, min: 0 }] },
  ],
}
