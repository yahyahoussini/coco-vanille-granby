import { sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }) {
  await db.execute(sql`
   CREATE TABLE "site_facts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"fr" varchar,
  	"en" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "site_facts_id" integer;
  CREATE UNIQUE INDEX "site_facts_key_idx" ON "site_facts" USING btree ("key");
  CREATE INDEX "site_facts_updated_at_idx" ON "site_facts" USING btree ("updated_at");
  CREATE INDEX "site_facts_created_at_idx" ON "site_facts" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_site_facts_fk" FOREIGN KEY ("site_facts_id") REFERENCES "public"."site_facts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_site_facts_id_idx" ON "payload_locked_documents_rels" USING btree ("site_facts_id");`)
}

export async function down({ db, payload, req }) {
  await db.execute(sql`
   ALTER TABLE "site_facts" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "site_facts" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_site_facts_fk";
  
  DROP INDEX "payload_locked_documents_rels_site_facts_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "site_facts_id";`)
}
