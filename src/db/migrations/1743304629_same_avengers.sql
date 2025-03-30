CREATE TYPE "public"."org_workspace_member_role_enum" AS ENUM('Admin', 'Member', 'Moderator');--> statement-breakpoint
CREATE TYPE "public"."org_project_member_role_enum" AS ENUM('Admin', 'Member', 'Moderator');--> statement-breakpoint
ALTER TABLE "organization_workspace_members" ADD COLUMN "role" "org_workspace_member_role_enum" DEFAULT 'Member' NOT NULL;--> statement-breakpoint
ALTER TABLE "organization_project_members" ADD COLUMN "role" "org_project_member_role_enum" DEFAULT 'Member' NOT NULL;