import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_roles" AS ENUM('system-admin', 'admin', 'user', 'designer');
  CREATE TYPE "public"."enum_teams_members_role" AS ENUM('owner', 'member');
  CREATE TYPE "public"."enum_plans_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__plans_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_templates_visibility" AS ENUM('private', 'public', 'unlisted');
  CREATE TYPE "public"."enum__templates_v_version_visibility" AS ENUM('private', 'public', 'unlisted');
  CREATE TYPE "public"."enum_invitations_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__invitations_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"username" varchar NOT NULL,
  	"name" varchar,
  	"avatar_asset_id" integer,
  	"meta" jsonb,
  	"is_deleted" boolean,
  	"deleted_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"owner_id" integer,
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
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_tablet_url" varchar,
  	"sizes_tablet_width" numeric,
  	"sizes_tablet_height" numeric,
  	"sizes_tablet_mime_type" varchar,
  	"sizes_tablet_filesize" numeric,
  	"sizes_tablet_filename" varchar
  );
  
  CREATE TABLE "media_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer
  );
  
  CREATE TABLE "teams_members_role" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_teams_members_role",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "teams_members" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"member_id" integer
  );
  
  CREATE TABLE "teams" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "plans" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"slug" varchar,
  	"features" jsonb,
  	"price_cents" numeric,
  	"currency" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_plans_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_plans_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_features" jsonb,
  	"version_price_cents" numeric,
  	"version_currency" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__plans_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "tags" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "templates" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"slug" varchar,
  	"visibility" "enum_templates_visibility" DEFAULT 'private',
  	"cover_asset_id" integer,
  	"thumbnail_asset_id" integer,
  	"data" jsonb DEFAULT '{}'::jsonb,
  	"meta" jsonb DEFAULT '{}'::jsonb,
  	"owner_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "templates_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer,
  	"tags_id" integer
  );
  
  CREATE TABLE "_templates_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar NOT NULL,
  	"version_description" varchar,
  	"version_slug" varchar,
  	"version_visibility" "enum__templates_v_version_visibility" DEFAULT 'private',
  	"version_cover_asset_id" integer,
  	"version_thumbnail_asset_id" integer,
  	"version_data" jsonb DEFAULT '{}'::jsonb,
  	"version_meta" jsonb DEFAULT '{}'::jsonb,
  	"version_owner_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_templates_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer,
  	"tags_id" integer
  );
  
  CREATE TABLE "invitations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"thumbnail_asset_id" integer,
  	"data" jsonb DEFAULT '{}'::jsonb,
  	"meta" jsonb DEFAULT '{}'::jsonb,
  	"owner_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_invitations_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "invitations_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer,
  	"tags_id" integer
  );
  
  CREATE TABLE "_invitations_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_thumbnail_asset_id" integer,
  	"version_data" jsonb DEFAULT '{}'::jsonb,
  	"version_meta" jsonb DEFAULT '{}'::jsonb,
  	"version_owner_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__invitations_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_invitations_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer,
  	"tags_id" integer
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
  	"teams_id" integer,
  	"plans_id" integer,
  	"tags_id" integer,
  	"templates_id" integer,
  	"invitations_id" integer
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
  
  ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users" ADD CONSTRAINT "users_avatar_asset_id_media_id_fk" FOREIGN KEY ("avatar_asset_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media_rels" ADD CONSTRAINT "media_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_rels" ADD CONSTRAINT "media_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "teams_members_role" ADD CONSTRAINT "teams_members_role_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."teams_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "teams_members" ADD CONSTRAINT "teams_members_member_id_users_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "teams_members" ADD CONSTRAINT "teams_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_plans_v" ADD CONSTRAINT "_plans_v_parent_id_plans_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."plans"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "templates" ADD CONSTRAINT "templates_cover_asset_id_media_id_fk" FOREIGN KEY ("cover_asset_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "templates" ADD CONSTRAINT "templates_thumbnail_asset_id_media_id_fk" FOREIGN KEY ("thumbnail_asset_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "templates" ADD CONSTRAINT "templates_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "templates_rels" ADD CONSTRAINT "templates_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_rels" ADD CONSTRAINT "templates_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_rels" ADD CONSTRAINT "templates_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_templates_v" ADD CONSTRAINT "_templates_v_parent_id_templates_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."templates"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_templates_v" ADD CONSTRAINT "_templates_v_version_cover_asset_id_media_id_fk" FOREIGN KEY ("version_cover_asset_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_templates_v" ADD CONSTRAINT "_templates_v_version_thumbnail_asset_id_media_id_fk" FOREIGN KEY ("version_thumbnail_asset_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_templates_v" ADD CONSTRAINT "_templates_v_version_owner_id_users_id_fk" FOREIGN KEY ("version_owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_templates_v_rels" ADD CONSTRAINT "_templates_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_templates_v_rels" ADD CONSTRAINT "_templates_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_templates_v_rels" ADD CONSTRAINT "_templates_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "invitations" ADD CONSTRAINT "invitations_thumbnail_asset_id_media_id_fk" FOREIGN KEY ("thumbnail_asset_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "invitations" ADD CONSTRAINT "invitations_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "invitations_rels" ADD CONSTRAINT "invitations_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."invitations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "invitations_rels" ADD CONSTRAINT "invitations_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "invitations_rels" ADD CONSTRAINT "invitations_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_invitations_v" ADD CONSTRAINT "_invitations_v_parent_id_invitations_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."invitations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_invitations_v" ADD CONSTRAINT "_invitations_v_version_thumbnail_asset_id_media_id_fk" FOREIGN KEY ("version_thumbnail_asset_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_invitations_v" ADD CONSTRAINT "_invitations_v_version_owner_id_users_id_fk" FOREIGN KEY ("version_owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_invitations_v_rels" ADD CONSTRAINT "_invitations_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_invitations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_invitations_v_rels" ADD CONSTRAINT "_invitations_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_invitations_v_rels" ADD CONSTRAINT "_invitations_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_teams_fk" FOREIGN KEY ("teams_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_plans_fk" FOREIGN KEY ("plans_id") REFERENCES "public"."plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_templates_fk" FOREIGN KEY ("templates_id") REFERENCES "public"."templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_invitations_fk" FOREIGN KEY ("invitations_id") REFERENCES "public"."invitations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "users_username_idx" ON "users" USING btree ("username");
  CREATE INDEX "users_avatar_asset_idx" ON "users" USING btree ("avatar_asset_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_owner_idx" ON "media" USING btree ("owner_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_tablet_sizes_tablet_filename_idx" ON "media" USING btree ("sizes_tablet_filename");
  CREATE INDEX "media_rels_order_idx" ON "media_rels" USING btree ("order");
  CREATE INDEX "media_rels_parent_idx" ON "media_rels" USING btree ("parent_id");
  CREATE INDEX "media_rels_path_idx" ON "media_rels" USING btree ("path");
  CREATE INDEX "media_rels_tags_id_idx" ON "media_rels" USING btree ("tags_id");
  CREATE INDEX "teams_members_role_order_idx" ON "teams_members_role" USING btree ("order");
  CREATE INDEX "teams_members_role_parent_idx" ON "teams_members_role" USING btree ("parent_id");
  CREATE INDEX "teams_members_order_idx" ON "teams_members" USING btree ("_order");
  CREATE INDEX "teams_members_parent_id_idx" ON "teams_members" USING btree ("_parent_id");
  CREATE INDEX "teams_members_member_idx" ON "teams_members" USING btree ("member_id");
  CREATE INDEX "teams_updated_at_idx" ON "teams" USING btree ("updated_at");
  CREATE INDEX "teams_created_at_idx" ON "teams" USING btree ("created_at");
  CREATE INDEX "plans_updated_at_idx" ON "plans" USING btree ("updated_at");
  CREATE INDEX "plans_created_at_idx" ON "plans" USING btree ("created_at");
  CREATE INDEX "plans__status_idx" ON "plans" USING btree ("_status");
  CREATE INDEX "_plans_v_parent_idx" ON "_plans_v" USING btree ("parent_id");
  CREATE INDEX "_plans_v_version_version_updated_at_idx" ON "_plans_v" USING btree ("version_updated_at");
  CREATE INDEX "_plans_v_version_version_created_at_idx" ON "_plans_v" USING btree ("version_created_at");
  CREATE INDEX "_plans_v_version_version__status_idx" ON "_plans_v" USING btree ("version__status");
  CREATE INDEX "_plans_v_created_at_idx" ON "_plans_v" USING btree ("created_at");
  CREATE INDEX "_plans_v_updated_at_idx" ON "_plans_v" USING btree ("updated_at");
  CREATE INDEX "_plans_v_latest_idx" ON "_plans_v" USING btree ("latest");
  CREATE UNIQUE INDEX "tags_slug_idx" ON "tags" USING btree ("slug");
  CREATE INDEX "tags_updated_at_idx" ON "tags" USING btree ("updated_at");
  CREATE INDEX "tags_created_at_idx" ON "tags" USING btree ("created_at");
  CREATE UNIQUE INDEX "templates_slug_idx" ON "templates" USING btree ("slug");
  CREATE INDEX "templates_cover_asset_idx" ON "templates" USING btree ("cover_asset_id");
  CREATE INDEX "templates_thumbnail_asset_idx" ON "templates" USING btree ("thumbnail_asset_id");
  CREATE INDEX "templates_owner_idx" ON "templates" USING btree ("owner_id");
  CREATE INDEX "templates_updated_at_idx" ON "templates" USING btree ("updated_at");
  CREATE INDEX "templates_created_at_idx" ON "templates" USING btree ("created_at");
  CREATE INDEX "templates_rels_order_idx" ON "templates_rels" USING btree ("order");
  CREATE INDEX "templates_rels_parent_idx" ON "templates_rels" USING btree ("parent_id");
  CREATE INDEX "templates_rels_path_idx" ON "templates_rels" USING btree ("path");
  CREATE INDEX "templates_rels_media_id_idx" ON "templates_rels" USING btree ("media_id");
  CREATE INDEX "templates_rels_tags_id_idx" ON "templates_rels" USING btree ("tags_id");
  CREATE INDEX "_templates_v_parent_idx" ON "_templates_v" USING btree ("parent_id");
  CREATE INDEX "_templates_v_version_version_slug_idx" ON "_templates_v" USING btree ("version_slug");
  CREATE INDEX "_templates_v_version_version_cover_asset_idx" ON "_templates_v" USING btree ("version_cover_asset_id");
  CREATE INDEX "_templates_v_version_version_thumbnail_asset_idx" ON "_templates_v" USING btree ("version_thumbnail_asset_id");
  CREATE INDEX "_templates_v_version_version_owner_idx" ON "_templates_v" USING btree ("version_owner_id");
  CREATE INDEX "_templates_v_version_version_updated_at_idx" ON "_templates_v" USING btree ("version_updated_at");
  CREATE INDEX "_templates_v_version_version_created_at_idx" ON "_templates_v" USING btree ("version_created_at");
  CREATE INDEX "_templates_v_created_at_idx" ON "_templates_v" USING btree ("created_at");
  CREATE INDEX "_templates_v_updated_at_idx" ON "_templates_v" USING btree ("updated_at");
  CREATE INDEX "_templates_v_rels_order_idx" ON "_templates_v_rels" USING btree ("order");
  CREATE INDEX "_templates_v_rels_parent_idx" ON "_templates_v_rels" USING btree ("parent_id");
  CREATE INDEX "_templates_v_rels_path_idx" ON "_templates_v_rels" USING btree ("path");
  CREATE INDEX "_templates_v_rels_media_id_idx" ON "_templates_v_rels" USING btree ("media_id");
  CREATE INDEX "_templates_v_rels_tags_id_idx" ON "_templates_v_rels" USING btree ("tags_id");
  CREATE UNIQUE INDEX "invitations_slug_idx" ON "invitations" USING btree ("slug");
  CREATE INDEX "invitations_thumbnail_asset_idx" ON "invitations" USING btree ("thumbnail_asset_id");
  CREATE INDEX "invitations_owner_idx" ON "invitations" USING btree ("owner_id");
  CREATE INDEX "invitations_updated_at_idx" ON "invitations" USING btree ("updated_at");
  CREATE INDEX "invitations_created_at_idx" ON "invitations" USING btree ("created_at");
  CREATE INDEX "invitations__status_idx" ON "invitations" USING btree ("_status");
  CREATE INDEX "invitations_rels_order_idx" ON "invitations_rels" USING btree ("order");
  CREATE INDEX "invitations_rels_parent_idx" ON "invitations_rels" USING btree ("parent_id");
  CREATE INDEX "invitations_rels_path_idx" ON "invitations_rels" USING btree ("path");
  CREATE INDEX "invitations_rels_media_id_idx" ON "invitations_rels" USING btree ("media_id");
  CREATE INDEX "invitations_rels_tags_id_idx" ON "invitations_rels" USING btree ("tags_id");
  CREATE INDEX "_invitations_v_parent_idx" ON "_invitations_v" USING btree ("parent_id");
  CREATE INDEX "_invitations_v_version_version_slug_idx" ON "_invitations_v" USING btree ("version_slug");
  CREATE INDEX "_invitations_v_version_version_thumbnail_asset_idx" ON "_invitations_v" USING btree ("version_thumbnail_asset_id");
  CREATE INDEX "_invitations_v_version_version_owner_idx" ON "_invitations_v" USING btree ("version_owner_id");
  CREATE INDEX "_invitations_v_version_version_updated_at_idx" ON "_invitations_v" USING btree ("version_updated_at");
  CREATE INDEX "_invitations_v_version_version_created_at_idx" ON "_invitations_v" USING btree ("version_created_at");
  CREATE INDEX "_invitations_v_version_version__status_idx" ON "_invitations_v" USING btree ("version__status");
  CREATE INDEX "_invitations_v_created_at_idx" ON "_invitations_v" USING btree ("created_at");
  CREATE INDEX "_invitations_v_updated_at_idx" ON "_invitations_v" USING btree ("updated_at");
  CREATE INDEX "_invitations_v_latest_idx" ON "_invitations_v" USING btree ("latest");
  CREATE INDEX "_invitations_v_rels_order_idx" ON "_invitations_v_rels" USING btree ("order");
  CREATE INDEX "_invitations_v_rels_parent_idx" ON "_invitations_v_rels" USING btree ("parent_id");
  CREATE INDEX "_invitations_v_rels_path_idx" ON "_invitations_v_rels" USING btree ("path");
  CREATE INDEX "_invitations_v_rels_media_id_idx" ON "_invitations_v_rels" USING btree ("media_id");
  CREATE INDEX "_invitations_v_rels_tags_id_idx" ON "_invitations_v_rels" USING btree ("tags_id");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_teams_id_idx" ON "payload_locked_documents_rels" USING btree ("teams_id");
  CREATE INDEX "payload_locked_documents_rels_plans_id_idx" ON "payload_locked_documents_rels" USING btree ("plans_id");
  CREATE INDEX "payload_locked_documents_rels_tags_id_idx" ON "payload_locked_documents_rels" USING btree ("tags_id");
  CREATE INDEX "payload_locked_documents_rels_templates_id_idx" ON "payload_locked_documents_rels" USING btree ("templates_id");
  CREATE INDEX "payload_locked_documents_rels_invitations_id_idx" ON "payload_locked_documents_rels" USING btree ("invitations_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_roles" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_rels" CASCADE;
  DROP TABLE "teams_members_role" CASCADE;
  DROP TABLE "teams_members" CASCADE;
  DROP TABLE "teams" CASCADE;
  DROP TABLE "plans" CASCADE;
  DROP TABLE "_plans_v" CASCADE;
  DROP TABLE "tags" CASCADE;
  DROP TABLE "templates" CASCADE;
  DROP TABLE "templates_rels" CASCADE;
  DROP TABLE "_templates_v" CASCADE;
  DROP TABLE "_templates_v_rels" CASCADE;
  DROP TABLE "invitations" CASCADE;
  DROP TABLE "invitations_rels" CASCADE;
  DROP TABLE "_invitations_v" CASCADE;
  DROP TABLE "_invitations_v_rels" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_users_roles";
  DROP TYPE "public"."enum_teams_members_role";
  DROP TYPE "public"."enum_plans_status";
  DROP TYPE "public"."enum__plans_v_version_status";
  DROP TYPE "public"."enum_templates_visibility";
  DROP TYPE "public"."enum__templates_v_version_visibility";
  DROP TYPE "public"."enum_invitations_status";
  DROP TYPE "public"."enum__invitations_v_version_status";`)
}
