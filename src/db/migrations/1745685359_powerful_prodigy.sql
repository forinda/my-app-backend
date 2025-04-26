CREATE TABLE IF NOT EXISTS "organization_user_invoice_items" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "organization_user_invoice_items_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"organization_invoice_id" integer NOT NULL,
	"task_log_id" integer NOT NULL,
	"amount" numeric(16, 2) NOT NULL,
	CONSTRAINT "organization_user_invoice_items_organization_invoice_id_task_log_id_unique" UNIQUE("organization_invoice_id","task_log_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_user_invoice_items" ADD CONSTRAINT "organization_user_invoice_items_organization_invoice_id_organization_user_invoice_id_fk" FOREIGN KEY ("organization_invoice_id") REFERENCES "public"."organization_user_invoice"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_user_invoice_items" ADD CONSTRAINT "organization_user_invoice_items_task_log_id_org_user_time_logs_id_fk" FOREIGN KEY ("task_log_id") REFERENCES "public"."org_user_time_logs"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
