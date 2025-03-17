ALTER TABLE "organization_workspaces" ADD COLUMN "department_id" integer;--> statement-breakpoint
ALTER TABLE "organization_workspaces" ADD COLUMN "is_private" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "organization_workspaces" ADD COLUMN "is_chat_enabled" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "organization_workspaces" ADD COLUMN "is_task_management_enabled" boolean DEFAULT true NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_workspaces" ADD CONSTRAINT "organization_workspaces_department_id_organizations_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."organizations"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
