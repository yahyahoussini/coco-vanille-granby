import { sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }) {
  await db.execute(sql`
   CREATE TYPE "public"."enum_conversations_messages_from" AS ENUM('client', 'shop');
  CREATE TYPE "public"."enum_conversations_messages_relay" AS ENUM('sms', 'email');
  CREATE TYPE "public"."enum_conversations_status" AS ENUM('open', 'answered', 'closed');
  CREATE TYPE "public"."enum_conversations_language" AS ENUM('fr', 'en', 'es');
  CREATE TABLE "conversations_messages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"from" "enum_conversations_messages_from" NOT NULL,
  	"text" varchar NOT NULL,
  	"at" timestamp(3) with time zone NOT NULL,
  	"author_id" integer,
  	"relay" "enum_conversations_messages_relay"
  );
  
  CREATE TABLE "conversations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"token_hash" varchar NOT NULL,
  	"status" "enum_conversations_status" DEFAULT 'open',
  	"language" "enum_conversations_language" DEFAULT 'fr',
  	"started_on_path" varchar,
  	"name" varchar,
  	"contact" varchar,
  	"reply_by_consent" boolean DEFAULT false,
  	"last_message_at" timestamp(3) with time zone,
  	"unread_for_shop" numeric DEFAULT 0,
  	"unread_for_visitor" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "conversations_id" integer;
  ALTER TABLE "business" ADD COLUMN "mobile" varchar;
  ALTER TABLE "business" ADD COLUMN "mobile_display" varchar;
  ALTER TABLE "shop" ADD COLUMN "chat_enabled" boolean DEFAULT true;
  ALTER TABLE "conversations_messages" ADD CONSTRAINT "conversations_messages_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "conversations_messages" ADD CONSTRAINT "conversations_messages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "conversations_messages_order_idx" ON "conversations_messages" USING btree ("_order");
  CREATE INDEX "conversations_messages_parent_id_idx" ON "conversations_messages" USING btree ("_parent_id");
  CREATE INDEX "conversations_messages_author_idx" ON "conversations_messages" USING btree ("author_id");
  CREATE INDEX "conversations_status_idx" ON "conversations" USING btree ("status");
  CREATE INDEX "conversations_last_message_at_idx" ON "conversations" USING btree ("last_message_at");
  CREATE INDEX "conversations_unread_for_shop_idx" ON "conversations" USING btree ("unread_for_shop");
  CREATE INDEX "conversations_updated_at_idx" ON "conversations" USING btree ("updated_at");
  CREATE INDEX "conversations_created_at_idx" ON "conversations" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_conversations_fk" FOREIGN KEY ("conversations_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_conversations_id_idx" ON "payload_locked_documents_rels" USING btree ("conversations_id");`)
}

export async function down({ db, payload, req }) {
  await db.execute(sql`
   ALTER TABLE "conversations_messages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "conversations" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "conversations_messages" CASCADE;
  DROP TABLE "conversations" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_conversations_fk";
  
  DROP INDEX "payload_locked_documents_rels_conversations_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "conversations_id";
  ALTER TABLE "business" DROP COLUMN "mobile";
  ALTER TABLE "business" DROP COLUMN "mobile_display";
  ALTER TABLE "shop" DROP COLUMN "chat_enabled";
  DROP TYPE "public"."enum_conversations_messages_from";
  DROP TYPE "public"."enum_conversations_messages_relay";
  DROP TYPE "public"."enum_conversations_status";
  DROP TYPE "public"."enum_conversations_language";`)
}
