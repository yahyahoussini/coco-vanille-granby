import { sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }) {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum_users_role" AS ENUM('proprietaire', 'gerant', 'comptoir', 'agence', 'traduction', 'integration');
  CREATE TYPE "public"."enum_users_ui_language" AS ENUM('fr', 'en');
  CREATE TYPE "public"."enum_categories_production_category" AS ENUM('gateaux', 'viennoiseries', 'pains', 'patisseries', 'traiteur');
  CREATE TYPE "public"."enum_products_production_category" AS ENUM('gateaux', 'viennoiseries', 'pains', 'patisseries', 'traiteur');
  CREATE TYPE "public"."enum_products_tax_class" AS ENUM('pending', 'zero', 'taxable', 'rule');
  CREATE TYPE "public"."enum_products_availability" AS ENUM('instock', 'soldout', 'backorder', 'preorder', 'discontinued');
  CREATE TYPE "public"."enum_products_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__products_v_version_production_category" AS ENUM('gateaux', 'viennoiseries', 'pains', 'patisseries', 'traiteur');
  CREATE TYPE "public"."enum__products_v_version_tax_class" AS ENUM('pending', 'zero', 'taxable', 'rule');
  CREATE TYPE "public"."enum__products_v_version_availability" AS ENUM('instock', 'soldout', 'backorder', 'preorder', 'discontinued');
  CREATE TYPE "public"."enum__products_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__products_v_published_locale" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum_seasons_mode" AS ENUM('date-first', 'product-first');
  CREATE TYPE "public"."enum_pages_tier" AS ENUM('core', 'conditional', 'frozen');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_version_tier" AS ENUM('core', 'conditional', 'frozen');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_published_locale" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum_redirects_code" AS ENUM('301', '302', '410');
  CREATE TYPE "public"."enum_orders_status" AS ENUM('pending_payment', 'paid', 'ready', 'picked_up', 'not_picked_up', 'cancelled', 'refunded');
  CREATE TYPE "public"."enum_orders_source" AS ENUM('web', 'phone', 'request');
  CREATE TYPE "public"."enum_orders_locale" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum_orders_customer_language" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum_orders_payment_provider" AS ENUM('stripe', 'square', 'counter', 'mock', 'none');
  CREATE TYPE "public"."enum_orders_payment_kind" AS ENUM('full', 'deposit');
  CREATE TYPE "public"."enum_orders_payment_status" AS ENUM('none', 'pending', 'paid', 'failed', 'refunded');
  CREATE TYPE "public"."enum_orders_consent_binding_language" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum_requests_status" AS ENUM('new', 'quoted', 'deposit_paid', 'confirmed', 'declined', 'expired');
  CREATE TYPE "public"."enum_requests_source" AS ENUM('web', 'phone');
  CREATE TYPE "public"."enum_requests_customer_language" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum_requests_production_category" AS ENUM('gateaux', 'viennoiseries', 'pains', 'patisseries', 'traiteur');
  CREATE TYPE "public"."enum_requests_quote_tax_class" AS ENUM('zero', 'taxable', 'rule');
  CREATE TYPE "public"."enum_requests_payment_provider" AS ENUM('stripe', 'square', 'mock', 'none');
  CREATE TYPE "public"."enum_requests_payment_status" AS ENUM('none', 'pending', 'paid', 'failed', 'refunded');
  CREATE TYPE "public"."enum_requests_consent_binding_language" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum_capacity_pools_per_weekday_day" AS ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');
  CREATE TYPE "public"."enum_capacity_pools_unit" AS ENUM('items', 'cakes', 'boxes');
  CREATE TYPE "public"."enum_messages_channel" AS ENUM('sms', 'email');
  CREATE TYPE "public"."enum_messages_kind" AS ENUM('transactional', 'commercial');
  CREATE TYPE "public"."enum_messages_language" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum_messages_status" AS ENUM('queued', 'sending', 'cancelled', 'sent', 'delivered', 'failed');
  CREATE TYPE "public"."enum_reviews_platform" AS ENUM('google', 'facebook', 'tripadvisor', 'yelp');
  CREATE TYPE "public"."enum_reviews_language" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum_reviews_status" AS ENUM('unanswered', 'answered', 'later');
  CREATE TYPE "public"."enum_questions_language" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum_questions_source" AS ENUM('comptoir', 'telephone', 'instagram', 'courriel', 'avis');
  CREATE TYPE "public"."enum_questions_status" AS ENUM('new', 'answered_on_site', 'ignored');
  CREATE TYPE "public"."enum_business_languages_served" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum_shop_hours_day" AS ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');
  CREATE TYPE "public"."enum_shop_special_days_state" AS ENUM('to_confirm', 'closed', 'open', 'special');
  CREATE TYPE "public"."enum_shop_closure_reason" AS ENUM('tempete', 'maladie', 'bris', 'autre');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" "enum_users_role" DEFAULT 'comptoir' NOT NULL,
  	"ui_language" "enum_users_ui_language" DEFAULT 'fr',
  	"active" boolean DEFAULT true,
  	"may_close" boolean DEFAULT false,
  	"pin_hash" varchar,
  	"pin_failures" numeric DEFAULT 0,
  	"pin_locked_until" timestamp(3) with time zone,
  	"passkeys" jsonb,
  	"backup_codes" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"taken_at" timestamp(3) with time zone,
  	"credit" varchar,
  	"consent" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar,
  	"sizes_og_url" varchar,
  	"sizes_og_width" numeric,
  	"sizes_og_height" numeric,
  	"sizes_og_mime_type" varchar,
  	"sizes_og_filesize" numeric,
  	"sizes_og_filename" varchar
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "allergens" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"code" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "allergens_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"production_category" "enum_categories_production_category",
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "categories_locales" (
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "products_variants" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size_inches" numeric,
  	"portions_min" numeric,
  	"portions_max" numeric,
  	"unit_weight_grams" numeric,
  	"price_cents" numeric,
  	"sku" varchar,
  	"pack_count" numeric
  );
  
  CREATE TABLE "products_variants_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"category_id" integer,
  	"production_category" "enum_products_production_category",
  	"allergens_verified_by_id" integer,
  	"allergens_verified_at" timestamp(3) with time zone,
  	"tax_class" "enum_products_tax_class" DEFAULT 'pending',
  	"lead_time_hours" numeric DEFAULT 0,
  	"availability" "enum_products_availability" DEFAULT 'instock',
  	"sold_out_until" timestamp(3) with time zone,
  	"availability_date" timestamp(3) with time zone,
  	"online_orderable" boolean DEFAULT false,
  	"capacity_units" numeric,
  	"production_offset_days" numeric,
  	"cake_message_max" numeric,
  	"ever_sold" boolean DEFAULT false,
  	"vitrine" boolean DEFAULT false,
  	"vitrine_planned" numeric,
  	"season_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_products_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "products_locales" (
  	"title" varchar,
  	"slug" varchar,
  	"summary" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "products_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer,
  	"allergens_id" integer
  );
  
  CREATE TABLE "_products_v_version_variants" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"size_inches" numeric,
  	"portions_min" numeric,
  	"portions_max" numeric,
  	"unit_weight_grams" numeric,
  	"price_cents" numeric,
  	"sku" varchar,
  	"pack_count" numeric,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_version_variants_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_products_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_category_id" integer,
  	"version_production_category" "enum__products_v_version_production_category",
  	"version_allergens_verified_by_id" integer,
  	"version_allergens_verified_at" timestamp(3) with time zone,
  	"version_tax_class" "enum__products_v_version_tax_class" DEFAULT 'pending',
  	"version_lead_time_hours" numeric DEFAULT 0,
  	"version_availability" "enum__products_v_version_availability" DEFAULT 'instock',
  	"version_sold_out_until" timestamp(3) with time zone,
  	"version_availability_date" timestamp(3) with time zone,
  	"version_online_orderable" boolean DEFAULT false,
  	"version_capacity_units" numeric,
  	"version_production_offset_days" numeric,
  	"version_cake_message_max" numeric,
  	"version_ever_sold" boolean DEFAULT false,
  	"version_vitrine" boolean DEFAULT false,
  	"version_vitrine_planned" numeric,
  	"version_season_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__products_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__products_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_products_v_locales" (
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_summary" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_products_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer,
  	"allergens_id" integer
  );
  
  CREATE TABLE "seasons_pickup_dates" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "seasons" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"mode" "enum_seasons_mode" DEFAULT 'date-first',
  	"preorder_opens_at" timestamp(3) with time zone,
  	"preorder_closes_at" timestamp(3) with time zone,
  	"active" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "seasons_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "pages_sections_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "pages_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"answer" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "pages_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"tier" "enum_pages_tier" DEFAULT 'core',
  	"condition" varchar,
  	"hero_id" integer,
  	"author" varchar DEFAULT 'L’équipe Coco Vanille',
  	"content_updated_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "pages_locales" (
  	"title" varchar,
  	"description" varchar,
  	"h1" varchar,
  	"answer" varchar,
  	"change_note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_version_sections_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_version_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"answer" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_version_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_key" varchar,
  	"version_tier" "enum__pages_v_version_tier" DEFAULT 'core',
  	"version_condition" varchar,
  	"version_hero_id" integer,
  	"version_author" varchar DEFAULT 'L’équipe Coco Vanille',
  	"version_content_updated_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__pages_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_pages_v_locales" (
  	"version_title" varchar,
  	"version_description" varchar,
  	"version_h1" varchar,
  	"version_answer" varchar,
  	"version_change_note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "redirects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"from" varchar NOT NULL,
  	"to" varchar NOT NULL,
  	"code" "enum_redirects_code" DEFAULT '301',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "orders_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"product_id" integer,
  	"variant_index" numeric,
  	"title" varchar NOT NULL,
  	"variant_label" varchar,
  	"qty" numeric NOT NULL,
  	"unit_price_cents" numeric NOT NULL,
  	"tax_class" varchar,
  	"message" varchar,
  	"production_category" varchar,
  	"units" numeric,
  	"production_date" varchar
  );
  
  CREATE TABLE "orders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"number" numeric,
  	"status" "enum_orders_status" DEFAULT 'pending_payment' NOT NULL,
  	"source" "enum_orders_source" DEFAULT 'web',
  	"locale" "enum_orders_locale" DEFAULT 'fr',
  	"customer_first_name" varchar NOT NULL,
  	"customer_last_name" varchar,
  	"customer_phone" varchar,
  	"customer_email" varchar,
  	"customer_language" "enum_orders_customer_language" DEFAULT 'fr',
  	"pickup_date" timestamp(3) with time zone,
  	"pickup_window_start" varchar,
  	"pickup_window_end" varchar,
  	"pickup_code" varchar,
  	"hold_expires_at" timestamp(3) with time zone,
  	"access_token" varchar,
  	"request_id" integer,
  	"totals_subtotal_cents" numeric,
  	"totals_gst_cents" numeric,
  	"totals_qst_cents" numeric,
  	"totals_total_cents" numeric,
  	"totals_deposit_cents" numeric,
  	"totals_balance_cents" numeric,
  	"payment_provider" "enum_orders_payment_provider" DEFAULT 'none',
  	"payment_kind" "enum_orders_payment_kind" DEFAULT 'full',
  	"payment_reference" varchar,
  	"payment_status" "enum_orders_payment_status" DEFAULT 'none',
  	"payment_amount_cents" numeric,
  	"payment_paid_at" timestamp(3) with time zone,
  	"payment_refund_due_by" timestamp(3) with time zone,
  	"allergy_note" varchar,
  	"consent_terms_accepted_at" timestamp(3) with time zone,
  	"consent_terms_version" varchar,
  	"consent_binding_language" "enum_orders_consent_binding_language",
  	"consent_review_request" boolean DEFAULT false,
  	"consent_marketing" boolean DEFAULT false,
  	"consent_birthday_reminder" boolean DEFAULT false,
  	"consent_analytics" boolean DEFAULT false,
  	"consent_text_version" varchar,
  	"attribution" jsonb,
  	"box_token" varchar,
  	"contract_sent_at" timestamp(3) with time zone,
  	"timeline" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "requests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"status" "enum_requests_status" DEFAULT 'new',
  	"source" "enum_requests_source" DEFAULT 'web',
  	"occasion" varchar NOT NULL,
  	"guests" numeric,
  	"event_date" timestamp(3) with time zone NOT NULL,
  	"flavour" varchar,
  	"cake_message" varchar,
  	"details" varchar,
  	"has_allergy" boolean DEFAULT false,
  	"customer_first_name" varchar NOT NULL,
  	"customer_last_name" varchar,
  	"customer_phone" varchar,
  	"customer_email" varchar,
  	"customer_language" "enum_requests_customer_language" DEFAULT 'fr',
  	"answer_by" timestamp(3) with time zone,
  	"production_category" "enum_requests_production_category" DEFAULT 'gateaux',
  	"capacity_units" numeric DEFAULT 1,
  	"quote_subtotal_cents" numeric,
  	"quote_tax_class" "enum_requests_quote_tax_class",
  	"quote_gst_cents" numeric,
  	"quote_qst_cents" numeric,
  	"quote_total_cents" numeric,
  	"quote_deposit_percent" numeric,
  	"quote_deposit_cents" numeric,
  	"quote_balance_cents" numeric,
  	"quote_valid_until" timestamp(3) with time zone,
  	"quote_payment_link" varchar,
  	"quote_sent_at" timestamp(3) with time zone,
  	"payment_provider" "enum_requests_payment_provider" DEFAULT 'none',
  	"payment_reference" varchar,
  	"payment_status" "enum_requests_payment_status" DEFAULT 'none',
  	"payment_paid_at" timestamp(3) with time zone,
  	"consent_terms_accepted_at" timestamp(3) with time zone,
  	"consent_terms_version" varchar,
  	"consent_binding_language" "enum_requests_consent_binding_language",
  	"access_token" varchar,
  	"order_id" integer,
  	"attribution" jsonb,
  	"timeline" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "requests_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"request_photos_id" integer
  );
  
  CREATE TABLE "request_photos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumb_url" varchar,
  	"sizes_thumb_width" numeric,
  	"sizes_thumb_height" numeric,
  	"sizes_thumb_mime_type" varchar,
  	"sizes_thumb_filesize" numeric,
  	"sizes_thumb_filename" varchar
  );
  
  CREATE TABLE "capacity_pools_per_weekday" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"day" "enum_capacity_pools_per_weekday_day" NOT NULL,
  	"capacity" numeric NOT NULL
  );
  
  CREATE TABLE "capacity_pools_overrides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"capacity" numeric NOT NULL
  );
  
  CREATE TABLE "capacity_pools" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"production_category" varchar NOT NULL,
  	"unit" "enum_capacity_pools_unit" DEFAULT 'items',
  	"default_per_day" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "messages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"channel" "enum_messages_channel" NOT NULL,
  	"kind" "enum_messages_kind" DEFAULT 'transactional',
  	"template" varchar NOT NULL,
  	"to" varchar NOT NULL,
  	"language" "enum_messages_language" DEFAULT 'fr',
  	"subject" varchar,
  	"body" varchar,
  	"html" varchar,
  	"attachments" jsonb,
  	"order_id" integer,
  	"request_id" integer,
  	"send_after" timestamp(3) with time zone,
  	"status" "enum_messages_status" DEFAULT 'queued',
  	"provider_id" varchar,
  	"attempts" numeric DEFAULT 0,
  	"error" varchar,
  	"sent_at" timestamp(3) with time zone,
  	"segments" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "reviews" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"platform" "enum_reviews_platform" DEFAULT 'google',
  	"external_id" varchar,
  	"author" varchar NOT NULL,
  	"rating" numeric NOT NULL,
  	"text" varchar,
  	"language" "enum_reviews_language" DEFAULT 'fr',
  	"received_at" timestamp(3) with time zone NOT NULL,
  	"reply_draft" varchar,
  	"reply" varchar,
  	"replied_at" timestamp(3) with time zone,
  	"status" "enum_reviews_status" DEFAULT 'unanswered',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "audit_log" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"actor_id" integer,
  	"device" varchar,
  	"ip" varchar,
  	"action" varchar NOT NULL,
  	"entity" varchar,
  	"entity_id" varchar,
  	"summary" varchar,
  	"before" jsonb,
  	"after" jsonb,
  	"result" jsonb,
  	"key" varchar,
  	"undo_until" timestamp(3) with time zone,
  	"undone_at" timestamp(3) with time zone,
  	"undo_of" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "questions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"language" "enum_questions_language" DEFAULT 'fr',
  	"source" "enum_questions_source" DEFAULT 'comptoir',
  	"status" "enum_questions_status" DEFAULT 'new',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"allergens_id" integer,
  	"categories_id" integer,
  	"products_id" integer,
  	"seasons_id" integer,
  	"pages_id" integer,
  	"redirects_id" integer,
  	"orders_id" integer,
  	"requests_id" integer,
  	"request_photos_id" integer,
  	"capacity_pools_id" integer,
  	"messages_id" integer,
  	"reviews_id" integer,
  	"audit_log_id" integer,
  	"questions_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "business_same_as" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL,
  	"verified" boolean
  );
  
  CREATE TABLE "business_languages_served" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_business_languages_served",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "business" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar DEFAULT 'Pâtisserie Coco Vanille' NOT NULL,
  	"legal_name" varchar,
  	"neq" varchar,
  	"phone" varchar,
  	"phone_display" varchar,
  	"email" varchar,
  	"address_street" varchar,
  	"address_city" varchar DEFAULT 'Granby',
  	"address_region" varchar DEFAULT 'QC',
  	"address_postal_code" varchar,
  	"address_country" varchar DEFAULT 'CA',
  	"geo_lat" numeric,
  	"geo_lng" numeric,
  	"google_cid" varchar,
  	"google_kgmid" varchar,
  	"google_place_id" varchar,
  	"google_review_link" varchar,
  	"google_rating" numeric,
  	"google_review_count" numeric,
  	"google_rating_as_of" timestamp(3) with time zone,
  	"price_range" varchar,
  	"privacy_officer_name" varchar,
  	"privacy_officer_title" varchar,
  	"privacy_officer_email" varchar,
  	"mapaq_permit" varchar,
  	"seats" numeric,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "business_locales" (
  	"category_sentence" varchar,
  	"parking" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "business_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "shop_hours" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"day" "enum_shop_hours_day" NOT NULL,
  	"opens" varchar NOT NULL,
  	"closes" varchar NOT NULL
  );
  
  CREATE TABLE "shop_special_days" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"state" "enum_shop_special_days_state" DEFAULT 'to_confirm',
  	"opens" varchar,
  	"closes" varchar
  );
  
  CREATE TABLE "shop_special_days_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shop" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"closure_active" boolean DEFAULT false,
  	"closure_reason" "enum_shop_closure_reason",
  	"closure_until" timestamp(3) with time zone,
  	"busy_extra_minutes" numeric DEFAULT 0,
  	"busy_until" timestamp(3) with time zone,
  	"online_pause_active" boolean DEFAULT false,
  	"online_pause_until" timestamp(3) with time zone,
  	"ordering_enabled" boolean DEFAULT false,
  	"ordering_next_day_cutoff" varchar,
  	"ordering_window_minutes" numeric DEFAULT 15,
  	"ordering_max_per_window" numeric DEFAULT 4,
  	"ordering_max_days_ahead" numeric DEFAULT 30,
  	"ordering_deposit_percent" numeric,
  	"ordering_quote_valid_hours" numeric DEFAULT 72,
  	"ordering_terms_version" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "shop_locales" (
  	"closure_message" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "allergens_locales" ADD CONSTRAINT "allergens_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."allergens"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_locales" ADD CONSTRAINT "categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_variants" ADD CONSTRAINT "products_variants_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_variants_locales" ADD CONSTRAINT "products_variants_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_variants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_allergens_verified_by_id_users_id_fk" FOREIGN KEY ("allergens_verified_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_season_id_seasons_id_fk" FOREIGN KEY ("season_id") REFERENCES "public"."seasons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_locales" ADD CONSTRAINT "products_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_allergens_fk" FOREIGN KEY ("allergens_id") REFERENCES "public"."allergens"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_variants" ADD CONSTRAINT "_products_v_version_variants_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_variants_locales" ADD CONSTRAINT "_products_v_version_variants_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_version_variants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_parent_id_products_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_category_id_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_allergens_verified_by_id_users_id_fk" FOREIGN KEY ("version_allergens_verified_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_season_id_seasons_id_fk" FOREIGN KEY ("version_season_id") REFERENCES "public"."seasons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_locales" ADD CONSTRAINT "_products_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_allergens_fk" FOREIGN KEY ("allergens_id") REFERENCES "public"."allergens"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "seasons_pickup_dates" ADD CONSTRAINT "seasons_pickup_dates_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."seasons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "seasons_locales" ADD CONSTRAINT "seasons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."seasons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_sections_list" ADD CONSTRAINT "pages_sections_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_sections" ADD CONSTRAINT "pages_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_faq" ADD CONSTRAINT "pages_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_id_media_id_fk" FOREIGN KEY ("hero_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_sections_list" ADD CONSTRAINT "_pages_v_version_sections_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_version_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_sections" ADD CONSTRAINT "_pages_v_version_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_faq" ADD CONSTRAINT "_pages_v_version_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_hero_id_media_id_fk" FOREIGN KEY ("version_hero_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_request_id_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."requests"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "requests" ADD CONSTRAINT "requests_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "requests_rels" ADD CONSTRAINT "requests_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."requests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "requests_rels" ADD CONSTRAINT "requests_rels_request_photos_fk" FOREIGN KEY ("request_photos_id") REFERENCES "public"."request_photos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "capacity_pools_per_weekday" ADD CONSTRAINT "capacity_pools_per_weekday_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."capacity_pools"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "capacity_pools_overrides" ADD CONSTRAINT "capacity_pools_overrides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."capacity_pools"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "messages" ADD CONSTRAINT "messages_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "messages" ADD CONSTRAINT "messages_request_id_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."requests"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_allergens_fk" FOREIGN KEY ("allergens_id") REFERENCES "public"."allergens"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_seasons_fk" FOREIGN KEY ("seasons_id") REFERENCES "public"."seasons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirects_fk" FOREIGN KEY ("redirects_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_orders_fk" FOREIGN KEY ("orders_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_requests_fk" FOREIGN KEY ("requests_id") REFERENCES "public"."requests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_request_photos_fk" FOREIGN KEY ("request_photos_id") REFERENCES "public"."request_photos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_capacity_pools_fk" FOREIGN KEY ("capacity_pools_id") REFERENCES "public"."capacity_pools"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_messages_fk" FOREIGN KEY ("messages_id") REFERENCES "public"."messages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_reviews_fk" FOREIGN KEY ("reviews_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_audit_log_fk" FOREIGN KEY ("audit_log_id") REFERENCES "public"."audit_log"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_questions_fk" FOREIGN KEY ("questions_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "business_same_as" ADD CONSTRAINT "business_same_as_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."business"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "business_languages_served" ADD CONSTRAINT "business_languages_served_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."business"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "business_locales" ADD CONSTRAINT "business_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."business"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "business_texts" ADD CONSTRAINT "business_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."business"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shop_hours" ADD CONSTRAINT "shop_hours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shop"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shop_special_days" ADD CONSTRAINT "shop_special_days_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shop"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shop_special_days_locales" ADD CONSTRAINT "shop_special_days_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shop_special_days"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shop_locales" ADD CONSTRAINT "shop_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shop"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE INDEX "media_sizes_og_sizes_og_filename_idx" ON "media" USING btree ("sizes_og_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "media_locales_parent_id_idx" ON "media_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "allergens_code_idx" ON "allergens" USING btree ("code");
  CREATE INDEX "allergens_updated_at_idx" ON "allergens" USING btree ("updated_at");
  CREATE INDEX "allergens_created_at_idx" ON "allergens" USING btree ("created_at");
  CREATE UNIQUE INDEX "allergens_locales_locale_parent_id_unique" ON "allergens_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "allergens_locales_parent_id_idx" ON "allergens_locales" USING btree ("_parent_id");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE INDEX "categories_slug_idx" ON "categories_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "categories_locales_locale_parent_id_unique" ON "categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "categories_locales_parent_id_idx" ON "categories_locales" USING btree ("_parent_id");
  CREATE INDEX "products_variants_order_idx" ON "products_variants" USING btree ("_order");
  CREATE INDEX "products_variants_parent_id_idx" ON "products_variants" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "products_variants_locales_locale_parent_id_unique" ON "products_variants_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_variants_locales_parent_id_idx" ON "products_variants_locales" USING btree ("_parent_id");
  CREATE INDEX "products_category_idx" ON "products" USING btree ("category_id");
  CREATE INDEX "products_allergens_verified_allergens_verified_by_idx" ON "products" USING btree ("allergens_verified_by_id");
  CREATE INDEX "products_season_idx" ON "products" USING btree ("season_id");
  CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE INDEX "products__status_idx" ON "products" USING btree ("_status");
  CREATE INDEX "products_slug_idx" ON "products_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "products_locales_locale_parent_id_unique" ON "products_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_locales_parent_id_idx" ON "products_locales" USING btree ("_parent_id");
  CREATE INDEX "products_rels_order_idx" ON "products_rels" USING btree ("order");
  CREATE INDEX "products_rels_parent_idx" ON "products_rels" USING btree ("parent_id");
  CREATE INDEX "products_rels_path_idx" ON "products_rels" USING btree ("path");
  CREATE INDEX "products_rels_media_id_idx" ON "products_rels" USING btree ("media_id");
  CREATE INDEX "products_rels_allergens_id_idx" ON "products_rels" USING btree ("allergens_id");
  CREATE INDEX "_products_v_version_variants_order_idx" ON "_products_v_version_variants" USING btree ("_order");
  CREATE INDEX "_products_v_version_variants_parent_id_idx" ON "_products_v_version_variants" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_products_v_version_variants_locales_locale_parent_id_unique" ON "_products_v_version_variants_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_version_variants_locales_parent_id_idx" ON "_products_v_version_variants_locales" USING btree ("_parent_id");
  CREATE INDEX "_products_v_parent_idx" ON "_products_v" USING btree ("parent_id");
  CREATE INDEX "_products_v_version_version_category_idx" ON "_products_v" USING btree ("version_category_id");
  CREATE INDEX "_products_v_version_allergens_verified_version_allergens_idx" ON "_products_v" USING btree ("version_allergens_verified_by_id");
  CREATE INDEX "_products_v_version_version_season_idx" ON "_products_v" USING btree ("version_season_id");
  CREATE INDEX "_products_v_version_version_updated_at_idx" ON "_products_v" USING btree ("version_updated_at");
  CREATE INDEX "_products_v_version_version_created_at_idx" ON "_products_v" USING btree ("version_created_at");
  CREATE INDEX "_products_v_version_version__status_idx" ON "_products_v" USING btree ("version__status");
  CREATE INDEX "_products_v_created_at_idx" ON "_products_v" USING btree ("created_at");
  CREATE INDEX "_products_v_updated_at_idx" ON "_products_v" USING btree ("updated_at");
  CREATE INDEX "_products_v_snapshot_idx" ON "_products_v" USING btree ("snapshot");
  CREATE INDEX "_products_v_published_locale_idx" ON "_products_v" USING btree ("published_locale");
  CREATE INDEX "_products_v_latest_idx" ON "_products_v" USING btree ("latest");
  CREATE INDEX "_products_v_version_version_slug_idx" ON "_products_v_locales" USING btree ("version_slug","_locale");
  CREATE UNIQUE INDEX "_products_v_locales_locale_parent_id_unique" ON "_products_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_locales_parent_id_idx" ON "_products_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_products_v_rels_order_idx" ON "_products_v_rels" USING btree ("order");
  CREATE INDEX "_products_v_rels_parent_idx" ON "_products_v_rels" USING btree ("parent_id");
  CREATE INDEX "_products_v_rels_path_idx" ON "_products_v_rels" USING btree ("path");
  CREATE INDEX "_products_v_rels_media_id_idx" ON "_products_v_rels" USING btree ("media_id");
  CREATE INDEX "_products_v_rels_allergens_id_idx" ON "_products_v_rels" USING btree ("allergens_id");
  CREATE INDEX "seasons_pickup_dates_order_idx" ON "seasons_pickup_dates" USING btree ("_order");
  CREATE INDEX "seasons_pickup_dates_parent_id_idx" ON "seasons_pickup_dates" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "seasons_key_idx" ON "seasons" USING btree ("key");
  CREATE INDEX "seasons_updated_at_idx" ON "seasons" USING btree ("updated_at");
  CREATE INDEX "seasons_created_at_idx" ON "seasons" USING btree ("created_at");
  CREATE UNIQUE INDEX "seasons_locales_locale_parent_id_unique" ON "seasons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "seasons_locales_parent_id_idx" ON "seasons_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_sections_list_order_idx" ON "pages_sections_list" USING btree ("_order");
  CREATE INDEX "pages_sections_list_parent_id_idx" ON "pages_sections_list" USING btree ("_parent_id");
  CREATE INDEX "pages_sections_list_locale_idx" ON "pages_sections_list" USING btree ("_locale");
  CREATE INDEX "pages_sections_order_idx" ON "pages_sections" USING btree ("_order");
  CREATE INDEX "pages_sections_parent_id_idx" ON "pages_sections" USING btree ("_parent_id");
  CREATE INDEX "pages_sections_locale_idx" ON "pages_sections" USING btree ("_locale");
  CREATE INDEX "pages_faq_order_idx" ON "pages_faq" USING btree ("_order");
  CREATE INDEX "pages_faq_parent_id_idx" ON "pages_faq" USING btree ("_parent_id");
  CREATE INDEX "pages_faq_locale_idx" ON "pages_faq" USING btree ("_locale");
  CREATE UNIQUE INDEX "pages_key_idx" ON "pages" USING btree ("key");
  CREATE INDEX "pages_hero_idx" ON "pages" USING btree ("hero_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_locales_parent_id_idx" ON "pages_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_sections_list_order_idx" ON "_pages_v_version_sections_list" USING btree ("_order");
  CREATE INDEX "_pages_v_version_sections_list_parent_id_idx" ON "_pages_v_version_sections_list" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_sections_list_locale_idx" ON "_pages_v_version_sections_list" USING btree ("_locale");
  CREATE INDEX "_pages_v_version_sections_order_idx" ON "_pages_v_version_sections" USING btree ("_order");
  CREATE INDEX "_pages_v_version_sections_parent_id_idx" ON "_pages_v_version_sections" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_sections_locale_idx" ON "_pages_v_version_sections" USING btree ("_locale");
  CREATE INDEX "_pages_v_version_faq_order_idx" ON "_pages_v_version_faq" USING btree ("_order");
  CREATE INDEX "_pages_v_version_faq_parent_id_idx" ON "_pages_v_version_faq" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_faq_locale_idx" ON "_pages_v_version_faq" USING btree ("_locale");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_key_idx" ON "_pages_v" USING btree ("version_key");
  CREATE INDEX "_pages_v_version_version_hero_idx" ON "_pages_v" USING btree ("version_hero_id");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_snapshot_idx" ON "_pages_v" USING btree ("snapshot");
  CREATE INDEX "_pages_v_published_locale_idx" ON "_pages_v" USING btree ("published_locale");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_pages_v_locales_locale_parent_id_unique" ON "_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_locales_parent_id_idx" ON "_pages_v_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");
  CREATE INDEX "redirects_updated_at_idx" ON "redirects" USING btree ("updated_at");
  CREATE INDEX "redirects_created_at_idx" ON "redirects" USING btree ("created_at");
  CREATE INDEX "orders_items_order_idx" ON "orders_items" USING btree ("_order");
  CREATE INDEX "orders_items_parent_id_idx" ON "orders_items" USING btree ("_parent_id");
  CREATE INDEX "orders_items_product_idx" ON "orders_items" USING btree ("product_id");
  CREATE UNIQUE INDEX "orders_number_idx" ON "orders" USING btree ("number");
  CREATE INDEX "orders_status_idx" ON "orders" USING btree ("status");
  CREATE INDEX "orders_pickup_date_idx" ON "orders" USING btree ("pickup_date");
  CREATE INDEX "orders_access_token_idx" ON "orders" USING btree ("access_token");
  CREATE INDEX "orders_request_idx" ON "orders" USING btree ("request_id");
  CREATE INDEX "orders_payment_payment_reference_idx" ON "orders" USING btree ("payment_reference");
  CREATE INDEX "orders_box_token_idx" ON "orders" USING btree ("box_token");
  CREATE INDEX "orders_updated_at_idx" ON "orders" USING btree ("updated_at");
  CREATE INDEX "orders_created_at_idx" ON "orders" USING btree ("created_at");
  CREATE INDEX "requests_status_idx" ON "requests" USING btree ("status");
  CREATE INDEX "requests_event_date_idx" ON "requests" USING btree ("event_date");
  CREATE INDEX "requests_payment_payment_reference_idx" ON "requests" USING btree ("payment_reference");
  CREATE INDEX "requests_access_token_idx" ON "requests" USING btree ("access_token");
  CREATE INDEX "requests_order_idx" ON "requests" USING btree ("order_id");
  CREATE INDEX "requests_updated_at_idx" ON "requests" USING btree ("updated_at");
  CREATE INDEX "requests_created_at_idx" ON "requests" USING btree ("created_at");
  CREATE INDEX "requests_rels_order_idx" ON "requests_rels" USING btree ("order");
  CREATE INDEX "requests_rels_parent_idx" ON "requests_rels" USING btree ("parent_id");
  CREATE INDEX "requests_rels_path_idx" ON "requests_rels" USING btree ("path");
  CREATE INDEX "requests_rels_request_photos_id_idx" ON "requests_rels" USING btree ("request_photos_id");
  CREATE INDEX "request_photos_updated_at_idx" ON "request_photos" USING btree ("updated_at");
  CREATE INDEX "request_photos_created_at_idx" ON "request_photos" USING btree ("created_at");
  CREATE UNIQUE INDEX "request_photos_filename_idx" ON "request_photos" USING btree ("filename");
  CREATE INDEX "request_photos_sizes_thumb_sizes_thumb_filename_idx" ON "request_photos" USING btree ("sizes_thumb_filename");
  CREATE INDEX "capacity_pools_per_weekday_order_idx" ON "capacity_pools_per_weekday" USING btree ("_order");
  CREATE INDEX "capacity_pools_per_weekday_parent_id_idx" ON "capacity_pools_per_weekday" USING btree ("_parent_id");
  CREATE INDEX "capacity_pools_overrides_order_idx" ON "capacity_pools_overrides" USING btree ("_order");
  CREATE INDEX "capacity_pools_overrides_parent_id_idx" ON "capacity_pools_overrides" USING btree ("_parent_id");
  CREATE INDEX "capacity_pools_updated_at_idx" ON "capacity_pools" USING btree ("updated_at");
  CREATE INDEX "capacity_pools_created_at_idx" ON "capacity_pools" USING btree ("created_at");
  CREATE INDEX "messages_order_idx" ON "messages" USING btree ("order_id");
  CREATE INDEX "messages_request_idx" ON "messages" USING btree ("request_id");
  CREATE INDEX "messages_status_idx" ON "messages" USING btree ("status");
  CREATE INDEX "messages_updated_at_idx" ON "messages" USING btree ("updated_at");
  CREATE INDEX "messages_created_at_idx" ON "messages" USING btree ("created_at");
  CREATE INDEX "reviews_external_id_idx" ON "reviews" USING btree ("external_id");
  CREATE INDEX "reviews_received_at_idx" ON "reviews" USING btree ("received_at");
  CREATE INDEX "reviews_status_idx" ON "reviews" USING btree ("status");
  CREATE INDEX "reviews_updated_at_idx" ON "reviews" USING btree ("updated_at");
  CREATE INDEX "reviews_created_at_idx" ON "reviews" USING btree ("created_at");
  CREATE INDEX "audit_log_actor_idx" ON "audit_log" USING btree ("actor_id");
  CREATE INDEX "audit_log_action_idx" ON "audit_log" USING btree ("action");
  CREATE INDEX "audit_log_entity_id_idx" ON "audit_log" USING btree ("entity_id");
  CREATE UNIQUE INDEX "audit_log_key_idx" ON "audit_log" USING btree ("key");
  CREATE INDEX "audit_log_updated_at_idx" ON "audit_log" USING btree ("updated_at");
  CREATE INDEX "audit_log_created_at_idx" ON "audit_log" USING btree ("created_at");
  CREATE INDEX "questions_updated_at_idx" ON "questions" USING btree ("updated_at");
  CREATE INDEX "questions_created_at_idx" ON "questions" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_allergens_id_idx" ON "payload_locked_documents_rels" USING btree ("allergens_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_seasons_id_idx" ON "payload_locked_documents_rels" USING btree ("seasons_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_redirects_id_idx" ON "payload_locked_documents_rels" USING btree ("redirects_id");
  CREATE INDEX "payload_locked_documents_rels_orders_id_idx" ON "payload_locked_documents_rels" USING btree ("orders_id");
  CREATE INDEX "payload_locked_documents_rels_requests_id_idx" ON "payload_locked_documents_rels" USING btree ("requests_id");
  CREATE INDEX "payload_locked_documents_rels_request_photos_id_idx" ON "payload_locked_documents_rels" USING btree ("request_photos_id");
  CREATE INDEX "payload_locked_documents_rels_capacity_pools_id_idx" ON "payload_locked_documents_rels" USING btree ("capacity_pools_id");
  CREATE INDEX "payload_locked_documents_rels_messages_id_idx" ON "payload_locked_documents_rels" USING btree ("messages_id");
  CREATE INDEX "payload_locked_documents_rels_reviews_id_idx" ON "payload_locked_documents_rels" USING btree ("reviews_id");
  CREATE INDEX "payload_locked_documents_rels_audit_log_id_idx" ON "payload_locked_documents_rels" USING btree ("audit_log_id");
  CREATE INDEX "payload_locked_documents_rels_questions_id_idx" ON "payload_locked_documents_rels" USING btree ("questions_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "business_same_as_order_idx" ON "business_same_as" USING btree ("_order");
  CREATE INDEX "business_same_as_parent_id_idx" ON "business_same_as" USING btree ("_parent_id");
  CREATE INDEX "business_languages_served_order_idx" ON "business_languages_served" USING btree ("order");
  CREATE INDEX "business_languages_served_parent_idx" ON "business_languages_served" USING btree ("parent_id");
  CREATE UNIQUE INDEX "business_locales_locale_parent_id_unique" ON "business_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "business_locales_parent_id_idx" ON "business_locales" USING btree ("_parent_id");
  CREATE INDEX "business_texts_order_parent" ON "business_texts" USING btree ("order","parent_id");
  CREATE INDEX "shop_hours_order_idx" ON "shop_hours" USING btree ("_order");
  CREATE INDEX "shop_hours_parent_id_idx" ON "shop_hours" USING btree ("_parent_id");
  CREATE INDEX "shop_special_days_order_idx" ON "shop_special_days" USING btree ("_order");
  CREATE INDEX "shop_special_days_parent_id_idx" ON "shop_special_days" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "shop_special_days_locales_locale_parent_id_unique" ON "shop_special_days_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shop_special_days_locales_parent_id_idx" ON "shop_special_days_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "shop_locales_locale_parent_id_unique" ON "shop_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shop_locales_parent_id_idx" ON "shop_locales" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }) {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "allergens" CASCADE;
  DROP TABLE "allergens_locales" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "categories_locales" CASCADE;
  DROP TABLE "products_variants" CASCADE;
  DROP TABLE "products_variants_locales" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "products_locales" CASCADE;
  DROP TABLE "products_rels" CASCADE;
  DROP TABLE "_products_v_version_variants" CASCADE;
  DROP TABLE "_products_v_version_variants_locales" CASCADE;
  DROP TABLE "_products_v" CASCADE;
  DROP TABLE "_products_v_locales" CASCADE;
  DROP TABLE "_products_v_rels" CASCADE;
  DROP TABLE "seasons_pickup_dates" CASCADE;
  DROP TABLE "seasons" CASCADE;
  DROP TABLE "seasons_locales" CASCADE;
  DROP TABLE "pages_sections_list" CASCADE;
  DROP TABLE "pages_sections" CASCADE;
  DROP TABLE "pages_faq" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_locales" CASCADE;
  DROP TABLE "_pages_v_version_sections_list" CASCADE;
  DROP TABLE "_pages_v_version_sections" CASCADE;
  DROP TABLE "_pages_v_version_faq" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_locales" CASCADE;
  DROP TABLE "redirects" CASCADE;
  DROP TABLE "orders_items" CASCADE;
  DROP TABLE "orders" CASCADE;
  DROP TABLE "requests" CASCADE;
  DROP TABLE "requests_rels" CASCADE;
  DROP TABLE "request_photos" CASCADE;
  DROP TABLE "capacity_pools_per_weekday" CASCADE;
  DROP TABLE "capacity_pools_overrides" CASCADE;
  DROP TABLE "capacity_pools" CASCADE;
  DROP TABLE "messages" CASCADE;
  DROP TABLE "reviews" CASCADE;
  DROP TABLE "audit_log" CASCADE;
  DROP TABLE "questions" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "business_same_as" CASCADE;
  DROP TABLE "business_languages_served" CASCADE;
  DROP TABLE "business" CASCADE;
  DROP TABLE "business_locales" CASCADE;
  DROP TABLE "business_texts" CASCADE;
  DROP TABLE "shop_hours" CASCADE;
  DROP TABLE "shop_special_days" CASCADE;
  DROP TABLE "shop_special_days_locales" CASCADE;
  DROP TABLE "shop" CASCADE;
  DROP TABLE "shop_locales" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_users_ui_language";
  DROP TYPE "public"."enum_categories_production_category";
  DROP TYPE "public"."enum_products_production_category";
  DROP TYPE "public"."enum_products_tax_class";
  DROP TYPE "public"."enum_products_availability";
  DROP TYPE "public"."enum_products_status";
  DROP TYPE "public"."enum__products_v_version_production_category";
  DROP TYPE "public"."enum__products_v_version_tax_class";
  DROP TYPE "public"."enum__products_v_version_availability";
  DROP TYPE "public"."enum__products_v_version_status";
  DROP TYPE "public"."enum__products_v_published_locale";
  DROP TYPE "public"."enum_seasons_mode";
  DROP TYPE "public"."enum_pages_tier";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_version_tier";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum__pages_v_published_locale";
  DROP TYPE "public"."enum_redirects_code";
  DROP TYPE "public"."enum_orders_status";
  DROP TYPE "public"."enum_orders_source";
  DROP TYPE "public"."enum_orders_locale";
  DROP TYPE "public"."enum_orders_customer_language";
  DROP TYPE "public"."enum_orders_payment_provider";
  DROP TYPE "public"."enum_orders_payment_kind";
  DROP TYPE "public"."enum_orders_payment_status";
  DROP TYPE "public"."enum_orders_consent_binding_language";
  DROP TYPE "public"."enum_requests_status";
  DROP TYPE "public"."enum_requests_source";
  DROP TYPE "public"."enum_requests_customer_language";
  DROP TYPE "public"."enum_requests_production_category";
  DROP TYPE "public"."enum_requests_quote_tax_class";
  DROP TYPE "public"."enum_requests_payment_provider";
  DROP TYPE "public"."enum_requests_payment_status";
  DROP TYPE "public"."enum_requests_consent_binding_language";
  DROP TYPE "public"."enum_capacity_pools_per_weekday_day";
  DROP TYPE "public"."enum_capacity_pools_unit";
  DROP TYPE "public"."enum_messages_channel";
  DROP TYPE "public"."enum_messages_kind";
  DROP TYPE "public"."enum_messages_language";
  DROP TYPE "public"."enum_messages_status";
  DROP TYPE "public"."enum_reviews_platform";
  DROP TYPE "public"."enum_reviews_language";
  DROP TYPE "public"."enum_reviews_status";
  DROP TYPE "public"."enum_questions_language";
  DROP TYPE "public"."enum_questions_source";
  DROP TYPE "public"."enum_questions_status";
  DROP TYPE "public"."enum_business_languages_served";
  DROP TYPE "public"."enum_shop_hours_day";
  DROP TYPE "public"."enum_shop_special_days_state";
  DROP TYPE "public"."enum_shop_closure_reason";`)
}
