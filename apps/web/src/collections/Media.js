import { anyone, isTeam } from '../lib/access.js'

// Real photos only (v1 L19). Alt text is written from visible facts, never invented.
export const Media = {
  slug: 'media',
  admin: { useAsTitle: 'alt', group: 'Contenu' },
  access: { read: anyone, create: isTeam, update: isTeam, delete: isTeam },
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*'],
    formatOptions: { format: 'avif', options: { quality: 60 } },
    imageSizes: [
      { name: 'card', width: 640, height: 800, position: 'centre', formatOptions: { format: 'avif', options: { quality: 55 } } },
      { name: 'hero', width: 1600, formatOptions: { format: 'avif', options: { quality: 55 } } },
      { name: 'og', width: 1200, height: 630, position: 'centre', formatOptions: { format: 'jpeg', options: { quality: 80 } } },
    ],
  },
  fields: [
    { name: 'alt', type: 'text', required: true, localized: true },
    { name: 'takenAt', type: 'date' },
    { name: 'credit', type: 'text' },
    { name: 'consent', type: 'checkbox', label: 'Consentement des personnes visibles', defaultValue: false },
  ],
}
