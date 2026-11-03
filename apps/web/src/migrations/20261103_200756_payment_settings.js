import { sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }) {
  await db.execute(sql`
   CREATE TABLE "payment_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"counter_enabled" boolean,
  	"online_enabled" boolean,
  	"stripe_publishable_key" varchar,
  	"stripe_secret_key" varchar,
  	"stripe_webhook_secret" varchar,
  	"stripe_webhook_id" varchar,
  	"stripe_webhook_url" varchar,
  	"stripe_account_id" varchar,
  	"stripe_account_name" varchar,
  	"stripe_live" boolean,
  	"stripe_charges_enabled" boolean,
  	"stripe_connected_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  `)
}

export async function down({ db, payload, req }) {
  await db.execute(sql`
   DROP TABLE "payment_settings" CASCADE;`)
}
