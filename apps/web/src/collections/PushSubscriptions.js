import { isTeam } from '../lib/access.js'

// The devices that asked for alerts (Studio › Réglages): where the browser's push service delivers them. A key to reach one
// device, nothing about customers; only the server writes here (Studio's push.* actions, lib/studio/push.js).
export const PushSubscriptions = {
  slug: 'push-subscriptions',
  admin: { useAsTitle: 'label', group: 'Système', hidden: true },
  access: { read: isTeam, create: () => false, update: () => false, delete: () => false },
  fields: [
    { name: 'endpoint', type: 'text', required: true, unique: true, index: true },
    { name: 'p256dh', type: 'text', required: true },
    { name: 'auth', type: 'text', required: true },
    { name: 'label', type: 'text' },
    { name: 'user', type: 'relationship', relationTo: 'users' },
  ],
}
