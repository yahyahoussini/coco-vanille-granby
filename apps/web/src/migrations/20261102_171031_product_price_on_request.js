import { sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }) {
  await db.execute(sql`
   ALTER TABLE "products" ADD COLUMN "price_on_request" boolean DEFAULT false;
  ALTER TABLE "_products_v" ADD COLUMN "version_price_on_request" boolean DEFAULT false;`)
}

export async function down({ db, payload, req }) {
  await db.execute(sql`
   ALTER TABLE "products" DROP COLUMN "price_on_request";
  ALTER TABLE "_products_v" DROP COLUMN "version_price_on_request";`)
}
