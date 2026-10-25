import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { fr } from '@payloadcms/translations/languages/fr'
import { en } from '@payloadcms/translations/languages/en'
import sharp from 'sharp'
import { collections } from './collections/index.js'
import { globals } from './globals/index.js'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const adminOrigin = process.env.ADMIN_ORIGIN || 'http://admin.localhost:3000'

export default buildConfig({
  serverURL: adminOrigin,
  admin: {
    user: 'users',
    meta: { titleSuffix: ' · Coco Studio (Avancé)' },
    importMap: { baseDir: path.resolve(dirname) },
  },
  // Payload's own admin and REST API live on the admin host only (proxy.js).
  cors: [adminOrigin],
  csrf: [adminOrigin],
  collections,
  globals,
  editor: lexicalEditor(),
  localization: {
    locales: [
      { code: 'fr', label: 'Français' },
      { code: 'en', label: 'English' },
      { code: 'es', label: 'Español' },
    ],
    defaultLocale: 'fr',
    // No silent fallback: a missing EN/ES field must show, not borrow French.
    fallback: false,
  },
  i18n: { supportedLanguages: { fr, en }, fallbackLanguage: 'fr' },
  secret: process.env.PAYLOAD_SECRET || '',
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI || '' },
    // Dev pushes schema automatically; production uses committed migrations.
    push: process.env.NODE_ENV !== 'production',
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  sharp,
  telemetry: false,
})
