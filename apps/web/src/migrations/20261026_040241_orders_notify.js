import { sql } from '@payloadcms/db-postgres'
import { TRIGGER_SQL, DROP_TRIGGER_SQL } from '../lib/studio/live.js'

// Postgres NOTIFY on every new order and status change, for Studio's live screens (src/lib/studio/live.js).
// Shipped as a migration so a migrated database (production, staging) never sees DDL from the app at run time.
export async function up({ db }) {
  await db.execute(sql.raw(TRIGGER_SQL))
}

export async function down({ db }) {
  await db.execute(sql.raw(DROP_TRIGGER_SQL))
}
