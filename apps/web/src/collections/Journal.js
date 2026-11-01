import { isOwnerOrAgency, isEditor } from '../lib/access.js'
import { auditHooks } from '../lib/studio/audit.js'
import { POST_CATEGORIES, POST_PHOTO_KEYS, MAX_SOURCES, slugError, relatedError } from '../lib/journal.js'

// Journal posts (docs/17 §6): French first, published per language (state, stateEn), public from 6 h on their day
// (lib/journal.js). No Payload drafts on purpose: a toggle such as « Retirer l’anglais » is a plain write, and with
// drafts a plain write would publish whatever half-written French draft is stored. Completeness is checked by
// lib/journal.js checkPost when a post is published (Studio) or seeded, not field by field here.
const EDITORS = ['proprietaire', 'gerant', 'agence', 'traduction']
// Public reads: published and due only (REST lives on the admin host, but a scheduled post stays private there too).
const readPosts = ({ req: { user } }) =>
  EDITORS.includes(user?.role) ? true : { and: [{ state: { equals: 'published' } }, { publishedAt: { less_than_equal: new Date().toISOString() } }] }
// Traduction writes English only, in « Avancé » too (Studio's actions check the same rule).
const notTranslation = ({ req: { user } }) => user?.role !== 'traduction'
const englishOrNotTranslation = ({ req }) => req.user?.role !== 'traduction' || req.locale === 'en'

const slugRule = (value, { req } = {}) => {
  if (!value) return req?.locale === 'fr' ? 'Adresse du billet requise en français.' : true
  return slugError(value) || true
}
const relatedRule = (value) => relatedError(value) || true
const local = { access: { update: englishOrNotTranslation, create: englishOrNotTranslation } }
const shared = { access: { update: notTranslation, create: notTranslation } }

export const Posts = {
  slug: 'posts',
  labels: { singular: 'Billet du Journal', plural: 'Journal' },
  admin: { useAsTitle: 'title', group: 'Contenu', defaultColumns: ['title', 'category', 'publishedAt', 'state', 'stateEn'] },
  // History without Payload drafts. Rollback lives in « Avancé » › Versions.
  versions: { maxPerDoc: 50 },
  access: { read: readPosts, create: isOwnerOrAgency, update: isEditor, delete: isOwnerOrAgency },
  hooks: { ...auditHooks('posts') },
  fields: [
    { name: 'key', type: 'text', required: true, unique: true, index: true, ...shared, admin: { description: 'Identifiant fixe (seed, Faits du site).' } },
    // Not "status": Content.js (collides with Payload's _status enum if drafts are ever turned on).
    { name: 'state', type: 'select', required: true, defaultValue: 'draft', ...shared, options: [{ value: 'draft', label: 'Brouillon' }, { value: 'published', label: 'Publié (français)' }] },
    { name: 'stateEn', type: 'select', required: true, defaultValue: 'draft', ...shared, options: [{ value: 'draft', label: 'Brouillon' }, { value: 'published', label: 'Publié (anglais)' }] },
    { name: 'category', type: 'select', required: true, options: POST_CATEGORIES, ...shared },
    { name: 'publishedAt', type: 'date', required: true, index: true, ...shared, admin: { description: 'Jour de publication : le billet paraît ce jour-là à 6 h (heure de Granby).' } },
    { name: 'photo', type: 'text', required: true, ...shared, validate: (v) => (POST_PHOTO_KEYS.includes(v) ? true : 'Photo d’illustration inconnue.') },
    { name: 'hero', type: 'upload', relationTo: 'media', ...shared, admin: { description: 'Photo de la boutique : remplace l’illustration (consentement des personnes visibles).' } },
    { name: 'related', type: 'text', hasMany: true, ...shared, validate: relatedRule },
    {
      name: 'sources',
      type: 'array',
      // A source per fact: a walk through downtown or the allergens list cites up to 16 (lib/journal.js MAX_SOURCES).
      minRows: 1,
      maxRows: MAX_SOURCES,
      ...shared,
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true, validate: (v) => (/^https:\/\/[^\s]+$/.test(v || '') ? true : 'Adresse https:// complète.') },
        // Text, not date: "YYYY-MM-DD" exactly as written, never shifted by a time zone.
        { name: 'date', type: 'text', required: true, validate: (v) => (/^\d{4}-\d{2}-\d{2}$/.test(v || '') ? true : 'AAAA-MM-JJ.') },
      ],
    },
    { name: 'author', type: 'select', defaultValue: 'equipe', options: [{ value: 'equipe', label: 'L’équipe de Pâtisserie Coco Vanille' }], ...shared },
    { name: 'slug', type: 'text', localized: true, unique: true, index: true, validate: slugRule, ...local },
    { name: 'title', type: 'text', localized: true, ...local, admin: { description: '< 60 caractères.' } },
    { name: 'description', type: 'textarea', localized: true, ...local, admin: { description: '140–160 caractères.' } },
    { name: 'h1', type: 'text', localized: true, ...local },
    { name: 'answer', type: 'textarea', localized: true, ...local, admin: { description: '40–60 mots : Pâtisserie Coco Vanille ou Granby + un fait daté et sourcé.' } },
    {
      name: 'sections',
      type: 'array',
      localized: true,
      maxRows: 6,
      ...local,
      fields: [
        { name: 'heading', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
        { name: 'body', type: 'textarea' },
        { name: 'list', type: 'array', fields: [{ name: 'item', type: 'text', required: true }] },
      ],
    },
    { name: 'faq', type: 'array', localized: true, maxRows: 8, ...local, fields: [{ name: 'question', type: 'text', required: true }, { name: 'answer', type: 'textarea', required: true }] },
    { name: 'changeNote', type: 'text', localized: true, ...local },
    // Server-written stamps (Studio actions, worker, seed): never typed.
    { name: 'contentUpdatedAt', type: 'date', ...shared, admin: { readOnly: true, description: 'Dernier changement important (date « Mis à jour »).' } },
    { name: 'releasedAt', type: 'date', ...shared, admin: { readOnly: true, description: 'Première parution publique en français : l’adresse est fixée.' } },
    { name: 'releasedEnAt', type: 'date', ...shared, admin: { readOnly: true } },
    { name: 'enReviewNeeded', type: 'checkbox', defaultValue: false, ...shared, admin: { readOnly: true } },
    { name: 'seedHash', type: 'text', ...shared, admin: { hidden: true } },
  ],
}
