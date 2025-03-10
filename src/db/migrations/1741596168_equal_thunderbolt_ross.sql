ALTER TABLE "organization_task_project_categories" RENAME TO "organization_project_time_log_categories";--> statement-breakpoint
ALTER TABLE "organization_project_time_log_categories" DROP CONSTRAINT "organization_task_project_categories_organization_id_project_id_task_log_category_id_unique";--> statement-breakpoint
ALTER TABLE "organization_project_time_log_categories" DROP CONSTRAINT "organization_task_project_categories_organization_id_organizations_id_fk";
--> statement-breakpoint
ALTER TABLE "organization_project_time_log_categories" DROP CONSTRAINT "organization_task_project_categories_project_id_organization_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "organization_project_time_log_categories" DROP CONSTRAINT "organization_task_project_categories_task_log_category_id_organization_time_log_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "organization_project_time_log_categories" DROP CONSTRAINT "organization_task_project_categories_created_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "organization_project_time_log_categories" DROP CONSTRAINT "organization_task_project_categories_updated_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "organization_project_time_log_categories" DROP CONSTRAINT "organization_task_project_categories_deleted_by_users_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_project_time_log_categories" ADD CONSTRAINT "organization_project_time_log_categories_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_project_time_log_categories" ADD CONSTRAINT "organization_project_time_log_categories_project_id_organization_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."organization_projects"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_project_time_log_categories" ADD CONSTRAINT "organization_project_time_log_categories_task_log_category_id_organization_time_log_categories_id_fk" FOREIGN KEY ("task_log_category_id") REFERENCES "public"."organization_time_log_categories"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_project_time_log_categories" ADD CONSTRAINT "organization_project_time_log_categories_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_project_time_log_categories" ADD CONSTRAINT "organization_project_time_log_categories_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_project_time_log_categories" ADD CONSTRAINT "organization_project_time_log_categories_deleted_by_users_id_fk" FOREIGN KEY ("deleted_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "organization_project_time_log_categories" ADD CONSTRAINT "organization_project_time_log_categories_organization_id_project_id_task_log_category_id_unique" UNIQUE("organization_id","project_id","task_log_category_id");