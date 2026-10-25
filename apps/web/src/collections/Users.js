import { ROLES, isOwner, hasRole } from '../lib/access.js'

// Studio users. Owner logs in with a passkey (+ backup code); counter staff switch
// with a 4-digit PIN on a shared device (16 §1.1, 16b §4). Sessions last 12 h.
export const Users = {
  slug: 'users',
  admin: { useAsTitle: 'name', group: 'Système' },
  auth: {
    tokenExpiration: 60 * 60 * 12,
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
    cookies: { sameSite: 'Lax', secure: process.env.NODE_ENV === 'production' },
  },
  access: {
    read: ({ req: { user } }) => (hasRole(user, 'proprietaire') ? true : user ? { id: { equals: user.id } } : false),
    create: isOwner,
    update: ({ req: { user } }) => (hasRole(user, 'proprietaire') ? true : user ? { id: { equals: user.id } } : false),
    delete: isOwner,
    // The first user (owner) is created by the seed or the Payload first-user screen.
    admin: ({ req: { user } }) => hasRole(user, 'proprietaire', 'gerant', 'agence', 'traduction'),
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'comptoir',
      options: ROLES.map((value) => ({ value, label: value })),
      access: { update: ({ req: { user } }) => hasRole(user, 'proprietaire') },
    },
    { name: 'uiLanguage', type: 'select', defaultValue: 'fr', options: ['fr', 'en'] },
    // Hash of the 4-digit PIN for the shared-device switch (never the PIN itself).
    { name: 'pinHash', type: 'text', admin: { hidden: true }, access: { read: () => false } },
    {
      name: 'passkeys',
      type: 'json',
      admin: { hidden: true },
      access: { read: ({ req: { user } }) => hasRole(user, 'proprietaire') },
    },
    { name: 'active', type: 'checkbox', defaultValue: true },
  ],
}
