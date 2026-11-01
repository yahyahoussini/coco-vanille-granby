import { sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }) {
  await db.execute(sql`
   CREATE TYPE "public"."enum_posts_state" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_posts_state_en" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_posts_category" AS ENUM('conseils', 'histoire', 'granby', 'boutique');
  CREATE TYPE "public"."enum_posts_author" AS ENUM('equipe');
  CREATE TYPE "public"."enum__posts_v_version_state" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_version_state_en" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_version_category" AS ENUM('conseils', 'histoire', 'granby', 'boutique');
  CREATE TYPE "public"."enum__posts_v_version_author" AS ENUM('equipe');
  CREATE TABLE "posts_sources" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"date" varchar NOT NULL
  );
  
  CREATE TABLE "posts_sections_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar NOT NULL
  );
  
  CREATE TABLE "posts_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"body" varchar
  );
  
  CREATE TABLE "posts_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"state" "enum_posts_state" DEFAULT 'draft' NOT NULL,
  	"state_en" "enum_posts_state_en" DEFAULT 'draft' NOT NULL,
  	"category" "enum_posts_category" NOT NULL,
  	"published_at" timestamp(3) with time zone NOT NULL,
  	"photo" varchar NOT NULL,
  	"hero_id" integer,
  	"author" "enum_posts_author" DEFAULT 'equipe',
  	"content_updated_at" timestamp(3) with time zone,
  	"released_at" timestamp(3) with time zone,
  	"released_en_at" timestamp(3) with time zone,
  	"en_review_needed" boolean DEFAULT false,
  	"seed_hash" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "posts_locales" (
  	"slug" varchar,
  	"title" varchar,
  	"description" varchar,
  	"h1" varchar,
  	"answer" varchar,
  	"change_note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "posts_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_posts_v_version_sources" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"date" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v_version_sections_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v_version_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v_version_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_key" varchar NOT NULL,
  	"version_state" "enum__posts_v_version_state" DEFAULT 'draft' NOT NULL,
  	"version_state_en" "enum__posts_v_version_state_en" DEFAULT 'draft' NOT NULL,
  	"version_category" "enum__posts_v_version_category" NOT NULL,
  	"version_published_at" timestamp(3) with time zone NOT NULL,
  	"version_photo" varchar NOT NULL,
  	"version_hero_id" integer,
  	"version_author" "enum__posts_v_version_author" DEFAULT 'equipe',
  	"version_content_updated_at" timestamp(3) with time zone,
  	"version_released_at" timestamp(3) with time zone,
  	"version_released_en_at" timestamp(3) with time zone,
  	"version_en_review_needed" boolean DEFAULT false,
  	"version_seed_hash" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_posts_v_locales" (
  	"version_slug" varchar,
  	"version_title" varchar,
  	"version_description" varchar,
  	"version_h1" varchar,
  	"version_answer" varchar,
  	"version_change_note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_posts_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "posts_id" integer;
  ALTER TABLE "posts_sources" ADD CONSTRAINT "posts_sources_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_sections_list" ADD CONSTRAINT "posts_sections_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_sections" ADD CONSTRAINT "posts_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_faq" ADD CONSTRAINT "posts_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_hero_id_media_id_fk" FOREIGN KEY ("hero_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_locales" ADD CONSTRAINT "posts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_texts" ADD CONSTRAINT "posts_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_sources" ADD CONSTRAINT "_posts_v_version_sources_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_sections_list" ADD CONSTRAINT "_posts_v_version_sections_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v_version_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_sections" ADD CONSTRAINT "_posts_v_version_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_faq" ADD CONSTRAINT "_posts_v_version_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_hero_id_media_id_fk" FOREIGN KEY ("version_hero_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_locales" ADD CONSTRAINT "_posts_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_texts" ADD CONSTRAINT "_posts_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "posts_sources_order_idx" ON "posts_sources" USING btree ("_order");
  CREATE INDEX "posts_sources_parent_id_idx" ON "posts_sources" USING btree ("_parent_id");
  CREATE INDEX "posts_sections_list_order_idx" ON "posts_sections_list" USING btree ("_order");
  CREATE INDEX "posts_sections_list_parent_id_idx" ON "posts_sections_list" USING btree ("_parent_id");
  CREATE INDEX "posts_sections_list_locale_idx" ON "posts_sections_list" USING btree ("_locale");
  CREATE INDEX "posts_sections_order_idx" ON "posts_sections" USING btree ("_order");
  CREATE INDEX "posts_sections_parent_id_idx" ON "posts_sections" USING btree ("_parent_id");
  CREATE INDEX "posts_sections_locale_idx" ON "posts_sections" USING btree ("_locale");
  CREATE INDEX "posts_faq_order_idx" ON "posts_faq" USING btree ("_order");
  CREATE INDEX "posts_faq_parent_id_idx" ON "posts_faq" USING btree ("_parent_id");
  CREATE INDEX "posts_faq_locale_idx" ON "posts_faq" USING btree ("_locale");
  CREATE UNIQUE INDEX "posts_key_idx" ON "posts" USING btree ("key");
  CREATE INDEX "posts_published_at_idx" ON "posts" USING btree ("published_at");
  CREATE INDEX "posts_hero_idx" ON "posts" USING btree ("hero_id");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "posts_locales_locale_parent_id_unique" ON "posts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "posts_locales_parent_id_idx" ON "posts_locales" USING btree ("_parent_id");
  CREATE INDEX "posts_texts_order_parent" ON "posts_texts" USING btree ("order","parent_id");
  CREATE INDEX "_posts_v_version_sources_order_idx" ON "_posts_v_version_sources" USING btree ("_order");
  CREATE INDEX "_posts_v_version_sources_parent_id_idx" ON "_posts_v_version_sources" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_version_sections_list_order_idx" ON "_posts_v_version_sections_list" USING btree ("_order");
  CREATE INDEX "_posts_v_version_sections_list_parent_id_idx" ON "_posts_v_version_sections_list" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_version_sections_list_locale_idx" ON "_posts_v_version_sections_list" USING btree ("_locale");
  CREATE INDEX "_posts_v_version_sections_order_idx" ON "_posts_v_version_sections" USING btree ("_order");
  CREATE INDEX "_posts_v_version_sections_parent_id_idx" ON "_posts_v_version_sections" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_version_sections_locale_idx" ON "_posts_v_version_sections" USING btree ("_locale");
  CREATE INDEX "_posts_v_version_faq_order_idx" ON "_posts_v_version_faq" USING btree ("_order");
  CREATE INDEX "_posts_v_version_faq_parent_id_idx" ON "_posts_v_version_faq" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_version_faq_locale_idx" ON "_posts_v_version_faq" USING btree ("_locale");
  CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_key_idx" ON "_posts_v" USING btree ("version_key");
  CREATE INDEX "_posts_v_version_version_published_at_idx" ON "_posts_v" USING btree ("version_published_at");
  CREATE INDEX "_posts_v_version_version_hero_idx" ON "_posts_v" USING btree ("version_hero_id");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v_locales" USING btree ("version_slug","_locale");
  CREATE UNIQUE INDEX "_posts_v_locales_locale_parent_id_unique" ON "_posts_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_posts_v_locales_parent_id_idx" ON "_posts_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_texts_order_parent" ON "_posts_v_texts" USING btree ("order","parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");`)
}

// DROP TABLE "posts" CASCADE already removes the locked-documents foreign key: IF EXISTS keeps down() from failing
// on it and on its index (Payload's generator writes both unconditionally).
export async function down({ db, payload, req }) {
  await db.execute(sql`
   ALTER TABLE "posts_sources" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_sections_list" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_sections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_version_sources" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_version_sections_list" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_version_sections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_version_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_texts" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "posts_sources" CASCADE;
  DROP TABLE "posts_sections_list" CASCADE;
  DROP TABLE "posts_sections" CASCADE;
  DROP TABLE "posts_faq" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "posts_locales" CASCADE;
  DROP TABLE "posts_texts" CASCADE;
  DROP TABLE "_posts_v_version_sources" CASCADE;
  DROP TABLE "_posts_v_version_sections_list" CASCADE;
  DROP TABLE "_posts_v_version_sections" CASCADE;
  DROP TABLE "_posts_v_version_faq" CASCADE;
  DROP TABLE "_posts_v" CASCADE;
  DROP TABLE "_posts_v_locales" CASCADE;
  DROP TABLE "_posts_v_texts" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_posts_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_posts_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "posts_id";
  DROP TYPE "public"."enum_posts_state";
  DROP TYPE "public"."enum_posts_state_en";
  DROP TYPE "public"."enum_posts_category";
  DROP TYPE "public"."enum_posts_author";
  DROP TYPE "public"."enum__posts_v_version_state";
  DROP TYPE "public"."enum__posts_v_version_state_en";
  DROP TYPE "public"."enum__posts_v_version_category";
  DROP TYPE "public"."enum__posts_v_version_author";`)
}
