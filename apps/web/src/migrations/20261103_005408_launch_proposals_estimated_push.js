import { sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }) {
  await db.execute(sql`
   CREATE TABLE "push_subscriptions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"endpoint" varchar NOT NULL,
  	"p256dh" varchar NOT NULL,
  	"auth" varchar NOT NULL,
  	"label" varchar,
  	"user_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "products" ADD COLUMN "price_estimated" boolean DEFAULT false;
  ALTER TABLE "_products_v" ADD COLUMN "version_price_estimated" boolean DEFAULT false;
  ALTER TABLE "site_facts" ADD COLUMN "proposed" boolean DEFAULT false;
  ALTER TABLE "site_facts" ADD COLUMN "verified_at" timestamp(3) with time zone;
  ALTER TABLE "site_facts" ADD COLUMN "verified_by_id" integer;
  ALTER TABLE "site_facts" ADD COLUMN "en_review" boolean DEFAULT false;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "push_subscriptions_id" integer;
  ALTER TABLE "push_subscriptions" ADD CONSTRAINT "push_subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "push_subscriptions_endpoint_idx" ON "push_subscriptions" USING btree ("endpoint");
  CREATE INDEX "push_subscriptions_user_idx" ON "push_subscriptions" USING btree ("user_id");
  CREATE INDEX "push_subscriptions_updated_at_idx" ON "push_subscriptions" USING btree ("updated_at");
  CREATE INDEX "push_subscriptions_created_at_idx" ON "push_subscriptions" USING btree ("created_at");
  ALTER TABLE "site_facts" ADD CONSTRAINT "site_facts_verified_by_id_users_id_fk" FOREIGN KEY ("verified_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_push_subscriptions_fk" FOREIGN KEY ("push_subscriptions_id") REFERENCES "public"."push_subscriptions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "site_facts_verified_by_idx" ON "site_facts" USING btree ("verified_by_id");
  CREATE INDEX "payload_locked_documents_rels_push_subscriptions_id_idx" ON "payload_locked_documents_rels" USING btree ("push_subscriptions_id");`)
}

export async function down({ db, payload, req }) {
  await db.execute(sql`
   ALTER TABLE "push_subscriptions" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "push_subscriptions" CASCADE;
  ALTER TABLE "site_facts" DROP CONSTRAINT "site_facts_verified_by_id_users_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_push_subscriptions_fk";
  
  DROP INDEX "site_facts_verified_by_idx";
  DROP INDEX "payload_locked_documents_rels_push_subscriptions_id_idx";
  ALTER TABLE "products" DROP COLUMN "price_estimated";
  ALTER TABLE "_products_v" DROP COLUMN "version_price_estimated";
  ALTER TABLE "site_facts" DROP COLUMN "proposed";
  ALTER TABLE "site_facts" DROP COLUMN "verified_at";
  ALTER TABLE "site_facts" DROP COLUMN "verified_by_id";
  ALTER TABLE "site_facts" DROP COLUMN "en_review";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "push_subscriptions_id";`)
}
