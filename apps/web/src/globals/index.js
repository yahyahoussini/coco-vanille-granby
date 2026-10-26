import { anyone, isOwner, isOwnerOrManager, hasRole, withStepUp } from '../lib/access.js'
import { withRevalidation } from '../lib/revalidate.js'
import { auditHooks } from '../lib/studio/audit.js'

const weekdays = [
  { value: 'Monday', label: 'lundi' },
  { value: 'Tuesday', label: 'mardi' },
  { value: 'Wednesday', label: 'mercredi' },
  { value: 'Thursday', label: 'jeudi' },
  { value: 'Friday', label: 'vendredi' },
  { value: 'Saturday', label: 'samedi' },
  { value: 'Sunday', label: 'dimanche' },
]

// The entity: one source of truth for NAP, schema, footer, GBP sync (v1 L8).
// The name is locked: only the owner can change it (G-GBP name lock).
export const Business = {
  slug: 'business',
  admin: { group: 'Boutique' },
  access: { read: anyone, update: isOwnerOrManager },
  hooks: auditHooks('business', { global: true }),
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      defaultValue: 'Pâtisserie Coco Vanille',
      access: { update: ({ req: { user } }) => hasRole(user, 'proprietaire') },
    },
    { name: 'alternateName', type: 'text', hasMany: true },
    { name: 'legalName', type: 'text' },
    { name: 'neq', type: 'text' },
    { name: 'categorySentence', type: 'textarea', localized: true },
    { name: 'phone', type: 'text', admin: { description: 'Format E.164, ex. +14503727177' } },
    { name: 'phoneDisplay', type: 'text' },
    { name: 'email', type: 'email' },
    {
      name: 'address',
      type: 'group',
      fields: [
        { name: 'street', type: 'text' },
        { name: 'city', type: 'text', defaultValue: 'Granby' },
        { name: 'region', type: 'text', defaultValue: 'QC' },
        { name: 'postalCode', type: 'text' },
        { name: 'country', type: 'text', defaultValue: 'CA' },
      ],
    },
    { name: 'geo', type: 'group', fields: [{ name: 'lat', type: 'number' }, { name: 'lng', type: 'number' }] },
    {
      name: 'google',
      type: 'group',
      fields: [
        { name: 'cid', type: 'text' },
        { name: 'kgmid', type: 'text' },
        { name: 'placeId', type: 'text' },
        { name: 'reviewLink', type: 'text', admin: { description: 'Cible du QR /avis.' } },
        { name: 'rating', type: 'number' },
        { name: 'reviewCount', type: 'number' },
        { name: 'ratingAsOf', type: 'date' },
      ],
    },
    { name: 'sameAs', type: 'array', fields: [{ name: 'url', type: 'text', required: true }, { name: 'verified', type: 'checkbox' }] },
    { name: 'priceRange', type: 'text' },
    { name: 'languagesServed', type: 'select', hasMany: true, options: ['fr', 'en', 'es'], defaultValue: ['fr'] },
    {
      name: 'privacyOfficer',
      type: 'group',
      admin: { description: 'Personne responsable de la protection des renseignements personnels (Loi 25).' },
      fields: [
        { name: 'name', type: 'text' },
        { name: 'title', type: 'text' },
        { name: 'email', type: 'email' },
      ],
    },
    { name: 'mapaqPermit', type: 'text' },
    { name: 'parking', type: 'textarea', localized: true },
    { name: 'seats', type: 'number' },
  ],
}

// « Boutique & heures »: regular hours, special days, closure, busy mode, pause, ordering rules.
// REST and « Avancé »: owner and manager. Comptoir's « Délai allongé » (and « Fermeture » when the owner allows it)
// are Studio actions, checked against the role matrix and written server-side.
export const Shop = {
  slug: 'shop',
  admin: { group: 'Boutique' },
  access: { read: anyone, update: isOwnerOrManager },
  hooks: auditHooks('shop', { global: true }),
  fields: [
    {
      name: 'hours',
      type: 'array',
      admin: { description: 'Heures habituelles. Vide = [[FACT NEEDED: heures]].' },
      fields: [
        { name: 'day', type: 'select', required: true, options: weekdays },
        { name: 'opens', type: 'text', required: true, admin: { description: 'HH:MM' } },
        { name: 'closes', type: 'text', required: true },
      ],
    },
    {
      name: 'specialDays',
      type: 'array',
      fields: [
        { name: 'date', type: 'date', required: true },
        { name: 'label', type: 'text', localized: true },
        { name: 'state', type: 'select', defaultValue: 'to_confirm', options: ['to_confirm', 'closed', 'open', 'special'] },
        { name: 'opens', type: 'text' },
        { name: 'closes', type: 'text' },
      ],
    },
    {
      name: 'closure',
      type: 'group',
      fields: [
        { name: 'active', type: 'checkbox', defaultValue: false },
        { name: 'reason', type: 'select', options: ['tempete', 'maladie', 'bris', 'autre'] },
        { name: 'until', type: 'date' },
        { name: 'message', type: 'text', localized: true },
      ],
    },
    { name: 'busy', type: 'group', fields: [{ name: 'extraMinutes', type: 'number', defaultValue: 0 }, { name: 'until', type: 'date' }] },
    { name: 'onlinePause', type: 'group', fields: [{ name: 'active', type: 'checkbox', defaultValue: false }, { name: 'until', type: 'date' }] },
    {
      name: 'ordering',
      type: 'group',
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: false, admin: { description: 'Commande en ligne active (sinon formulaire de demande).' } },
        { name: 'nextDayCutoff', type: 'text', admin: { description: 'HH:MM pour « commandez avant … pour demain ». Vide = [[FACT NEEDED]].' } },
        { name: 'windowMinutes', type: 'number', defaultValue: 15 },
        { name: 'maxPerWindow', type: 'number', defaultValue: 4 },
        { name: 'maxDaysAhead', type: 'number', defaultValue: 30 },
        // Money: the owner, after a fresh identity check (16b §4 #4), like Studio's « Acompte ».
        { name: 'depositPercent', type: 'number', access: { update: withStepUp('proprietaire') } },
        { name: 'quoteValidHours', type: 'number', defaultValue: 72 },
        { name: 'termsVersion', type: 'text' },
      ],
    },
  ],
}

// Both show on every public page (footer NAP and hours, closure banner, JSON-LD): a change refreshes the site.
export const globals = [Business, Shop].map((g) => withRevalidation(g, { global: true }))
export { isOwner }
