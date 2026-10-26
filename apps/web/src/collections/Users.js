import { ROLES, isOwner, hasRole } from '../lib/access.js'
import { auditHooks } from '../lib/studio/audit.js'

const ROLE_LABELS = { proprietaire: 'Propriétaire', gerant: 'Gérant·e', comptoir: 'Comptoir', agence: 'Agence', traduction: 'Traduction', integration: 'Intégration' }
const ownerOnly = ({ req: { user } }) => hasRole(user, 'proprietaire')
const hidden = { read: () => false, update: () => false }

// Studio users. Email + password is the base session (12 h); the owner adds a passkey (+ backup codes);
// counter staff switch with a 4-digit PIN on a shared device (16 §1.1, 16b §4). Studio writes the secret
// fields server-side with overrideAccess; nobody can read them back.
export const Users = {
  slug: 'users',
  admin: { useAsTitle: 'name', group: 'Système', defaultColumns: ['name', 'role', 'email', 'active'] },
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
    // An advisory on 3.84.1: by default any logged-in user could unlock others (16b §4 #7).
    unlock: ownerOnly,
    // The first user (owner) is created by the seed or the Payload first-user screen.
    admin: ({ req: { user } }) => hasRole(user, 'proprietaire', 'gerant', 'agence', 'traduction'),
  },
  hooks: auditHooks('users'),
  fields: [
    { name: 'name', type: 'text', required: true, admin: { description: 'Prénom affiché sur la tablette (« Qui utilise la tablette? »).' } },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'comptoir',
      options: ROLES.map((value) => ({ value, label: ROLE_LABELS[value] || value })),
      access: { update: ownerOnly },
    },
    { name: 'uiLanguage', type: 'select', defaultValue: 'fr', options: ['fr', 'en'] },
    { name: 'active', type: 'checkbox', defaultValue: true, access: { update: ownerOnly } },
    // « Fermeture » for Comptoir only if the owner allows it (16 §2.2).
    { name: 'mayClose', type: 'checkbox', defaultValue: false, label: 'Peut fermer la boutique (Comptoir)', access: { update: ownerOnly } },
    // scrypt hash of the 4-digit PIN for the shared-device switch (never the PIN itself).
    { name: 'pinHash', type: 'text', admin: { hidden: true }, access: hidden },
    { name: 'pinFailures', type: 'number', defaultValue: 0, admin: { hidden: true }, access: hidden },
    { name: 'pinLockedUntil', type: 'date', admin: { hidden: true }, access: hidden },
    // WebAuthn credentials [{ id, publicKey, counter, transports, label, createdAt, lastUsedAt }] and backup codes (hashes).
    { name: 'passkeys', type: 'json', admin: { hidden: true }, access: hidden },
    { name: 'backupCodes', type: 'json', admin: { hidden: true }, access: hidden },
  ],
}
