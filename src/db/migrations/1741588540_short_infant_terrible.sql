CREATE TABLE IF NOT EXISTS "organization_task_project_categories" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "organization_task_project_categories_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"organization_id" integer NOT NULL,
	"project_id" integer NOT NULL,
	"task_log_category_id" integer NOT NULL,
	"created_by" integer NOT NULL,
	"updated_by" integer NOT NULL,
	"deleted_by" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "organization_task_project_categories_organization_id_project_id_task_log_category_id_unique" UNIQUE("organization_id","project_id","task_log_category_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_task_project_categories" ADD CONSTRAINT "organization_task_project_categories_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_task_project_categories" ADD CONSTRAINT "organization_task_project_categories_project_id_organization_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."organization_projects"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_task_project_categories" ADD CONSTRAINT "organization_task_project_categories_task_log_category_id_organization_task_log_categories_id_fk" FOREIGN KEY ("task_log_category_id") REFERENCES "public"."organization_task_log_categories"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_task_project_categories" ADD CONSTRAINT "organization_task_project_categories_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_task_project_categories" ADD CONSTRAINT "organization_task_project_categories_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_task_project_categories" ADD CONSTRAINT "organization_task_project_categories_deleted_by_users_id_fk" FOREIGN KEY ("deleted_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
