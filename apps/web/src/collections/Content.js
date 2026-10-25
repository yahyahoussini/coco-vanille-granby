import { anyone, isOwnerOrAgency, isTeam, publishedOrTeam } from '../lib/access.js'

// Page copy following the page contract (v1 §7, rank-first 02-page-contract):
// h1 with the searcher's words → 40–60-word answer block (brand + place + dated number)
// → question-phrased sections → key facts → FAQ in <details> → one primary action.
export const Pages = {
  slug: 'pages',
  admin: { useAsTitle: 'key', group: 'Contenu', defaultColumns: ['key', 'title', 'tier', '_status'] },
  versions: { drafts: true, maxPerDoc: 50 },
  access: { read: publishedOrTeam, create: isOwnerOrAgency, update: isTeam, delete: isOwnerOrAgency },
  fields: [
    { name: 'key', type: 'text', required: true, unique: true, admin: { description: 'Clé du registre des pages (src/lib/routes.js).' } },
    {
      // "status" would collide with Payload's draft enum (_status) in Postgres.
      name: 'tier',
      type: 'select',
      defaultValue: 'core',
      options: [
        { value: 'core', label: 'Essentielle' },
        { value: 'conditional', label: 'Conditionnelle (faits du propriétaire requis)' },
        { value: 'frozen', label: 'Gelée' },
      ],
    },
    { name: 'condition', type: 'text', admin: { description: 'Ce qui doit être vrai pour publier.' } },
    { name: 'title', type: 'text', required: true, localized: true, admin: { description: '< 60 caractères.' } },
    { name: 'description', type: 'textarea', localized: true, admin: { description: '140–160 caractères qui donnent la réponse.' } },
    { name: 'h1', type: 'text', localized: true },
    { name: 'answer', type: 'textarea', localized: true, admin: { description: 'Bloc-réponse 40–60 mots : marque + service + lieu + un fait daté.' } },
    {
      name: 'sections',
      type: 'array',
      localized: true,
      fields: [
        { name: 'heading', type: 'text', required: true, admin: { description: 'Une question réelle, en h2.' } },
        { name: 'answer', type: 'textarea', required: true, admin: { description: 'La première phrase répond.' } },
        { name: 'body', type: 'textarea' },
        { name: 'list', type: 'array', fields: [{ name: 'item', type: 'text', required: true }] },
      ],
    },
    {
      name: 'faq',
      type: 'array',
      localized: true,
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
      ],
    },
    { name: 'hero', type: 'upload', relationTo: 'media' },
    { name: 'author', type: 'text', defaultValue: 'L’équipe Coco Vanille' },
    { name: 'changeNote', type: 'text', localized: true, admin: { description: 'Une ligne : ce qui a changé.' } },
    { name: 'contentUpdatedAt', type: 'date' },
  ],
}

export const Redirects = {
  slug: 'redirects',
  admin: { useAsTitle: 'from', group: 'Contenu' },
  access: { read: anyone, create: isOwnerOrAgency, update: isOwnerOrAgency, delete: isOwnerOrAgency },
  fields: [
    { name: 'from', type: 'text', required: true, unique: true },
    { name: 'to', type: 'text', required: true },
    { name: 'code', type: 'select', defaultValue: '301', options: ['301', '302', '410'] },
  ],
}
