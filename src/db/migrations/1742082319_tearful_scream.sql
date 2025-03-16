CREATE TYPE "public"."org_subscription_enum_types" AS ENUM('starter', 'team', 'business', 'enterprise');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organization_subscriptions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "organization_subscriptions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"description" text NOT NULL,
	"maximum_users" integer NOT NULL,
	"maximum_projects" integer NOT NULL,
	"per_user_monthly_price" integer NOT NULL,
	"type" "org_subscription_enum_types" DEFAULT 'starter' NOT NULL,
	CONSTRAINT "organization_subscriptions_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
ALTER TABLE "organization_project_time_log_categories" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;