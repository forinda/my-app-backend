CREATE TYPE "public"."org_user_time_log_approval_status" AS ENUM('pending', 'invoiced', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."org_user_time_log_invoice_status" AS ENUM('pending', 'invoiced', 'rejected', 'paid');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "org_user_time_logs" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "org_user_time_logs_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"organization_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"project_id" integer NOT NULL,
	"task_id" integer NOT NULL,
	"task_log_category_id" integer NOT NULL,
	"description" text NOT NULL,
	"hours" integer NOT NULL,
	"minutes" integer NOT NULL,
	"approval_status" "org_user_time_log_approval_status",
	"approved_by" integer,
	"approved_at" timestamp,
	"invoice_status" "org_user_time_log_invoice_status",
	"invoiced_by" integer,
	"invoiced_at" timestamp,
	"paid_by" integer,
	"paid_at" timestamp,
	"created_by" integer NOT NULL,
	"updated_by" integer NOT NULL,
	"deleted_by" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "org_user_time_logs" ADD CONSTRAINT "org_user_time_logs_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "org_user_time_logs" ADD CONSTRAINT "org_user_time_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "org_user_time_logs" ADD CONSTRAINT "org_user_time_logs_project_id_organization_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."organization_projects"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "org_user_time_logs" ADD CONSTRAINT "org_user_time_logs_task_id_organization_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."organization_tasks"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "org_user_time_logs" ADD CONSTRAINT "org_user_time_logs_task_log_category_id_organization_task_log_categories_id_fk" FOREIGN KEY ("task_log_category_id") REFERENCES "public"."organization_task_log_categories"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "org_user_time_logs" ADD CONSTRAINT "org_user_time_logs_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "org_user_time_logs" ADD CONSTRAINT "org_user_time_logs_invoiced_by_users_id_fk" FOREIGN KEY ("invoiced_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "org_user_time_logs" ADD CONSTRAINT "org_user_time_logs_paid_by_users_id_fk" FOREIGN KEY ("paid_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "org_user_time_logs" ADD CONSTRAINT "org_user_time_logs_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "org_user_time_logs" ADD CONSTRAINT "org_user_time_logs_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "org_user_time_logs" ADD CONSTRAINT "org_user_time_logs_deleted_by_users_id_fk" FOREIGN KEY ("deleted_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
