CREATE TYPE "public"."user_employment_type_enum" AS ENUM('full_time', 'part_time', 'contract', 'internship');--> statement-breakpoint
CREATE TYPE "public"."user_salary_type_enum" AS ENUM('monthly', 'hourly');--> statement-breakpoint
ALTER TABLE "organization_members" ADD COLUMN "tax_id" varchar;--> statement-breakpoint
ALTER TABLE "organization_members" ADD COLUMN "country" varchar;--> statement-breakpoint
ALTER TABLE "organization_members" ADD COLUMN "state" varchar;--> statement-breakpoint
ALTER TABLE "organization_members" ADD COLUMN "city" varchar;--> statement-breakpoint
ALTER TABLE "organization_members" ADD COLUMN "address" varchar;--> statement-breakpoint
ALTER TABLE "organization_members" ADD COLUMN "zip_code" varchar;--> statement-breakpoint
ALTER TABLE "organization_members" ADD COLUMN "starting_salary" numeric(16, 2);--> statement-breakpoint
ALTER TABLE "organization_members" ADD COLUMN "current_salary" numeric(16, 2);--> statement-breakpoint
ALTER TABLE "organization_members" ADD COLUMN "currency" varchar DEFAULT 'KSH';--> statement-breakpoint
ALTER TABLE "organization_members" ADD COLUMN "salary_type" "user_salary_type_enum" DEFAULT 'monthly';--> statement-breakpoint
ALTER TABLE "organization_members" ADD COLUMN "national_id" varchar;--> statement-breakpoint
ALTER TABLE "organization_members" ADD COLUMN "employment_type" "user_employment_type_enum" DEFAULT 'full_time';--> statement-breakpoint
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_organization_id_tax_id_unique" UNIQUE("organization_id","tax_id");--> statement-breakpoint
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_organization_id_national_id_unique" UNIQUE("organization_id","national_id");--> statement-breakpoint
ALTER TABLE "organization_workspaces" ADD CONSTRAINT "organization_workspaces_organization_id_name_unique" UNIQUE("organization_id","name");--> statement-breakpoint
ALTER TABLE "organization_projects" ADD CONSTRAINT "organization_projects_organization_id_name_unique" UNIQUE("organization_id","name");--> statement-breakpoint
ALTER TABLE "organization_tasks" ADD CONSTRAINT "organization_tasks_organization_id_title_unique" UNIQUE("organization_id","title");