ALTER TABLE "department_user_roles" ADD COLUMN "is_head" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "departments" ADD COLUMN "head_id" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "departments" ADD CONSTRAINT "departments_head_id_users_id_fk" FOREIGN KEY ("head_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
