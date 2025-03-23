CREATE TYPE "public"."workspace_template_enum" AS ENUM('blank', 'team', 'project', 'creative');--> statement-breakpoint
ALTER TABLE "organization_workspaces" DROP CONSTRAINT "organization_workspaces_department_id_organizations_id_fk";
--> statement-breakpoint
ALTER TABLE "organization_workspaces" ADD COLUMN "template" "workspace_template_enum" DEFAULT 'blank';--> statement-breakpoint
ALTER TABLE "organization_workspaces" DROP COLUMN IF EXISTS "department_id";