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
import { cocoEmailAdapter } from './lib/messaging/payload-email.js'

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
  // Same delivery adapter as the shop's messages: SES in production, a log in development (lib/messaging).
  email: cocoEmailAdapter,
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
    // Explicit size, and a wait that ends: a query that cannot get a connection in 15 s fails instead of
    // hanging the process (ordering/context.js keeps the booking lock from holding more than one).
    pool: { connectionString: process.env.DATABASE_URI || '', max: 10, connectionTimeoutMillis: 15_000 },
    // Dev pushes schema automatically; production uses committed migrations.
    push: process.env.NODE_ENV !== 'production',
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  sharp,
  // JavaScript project: no generated payload-types.ts.
  typescript: { autoGenerate: false },
  telemetry: false,
})
