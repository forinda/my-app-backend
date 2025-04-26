CREATE TYPE "public"."invoice_status_enum" AS ENUM('paid', 'unpaid', 'overdue', 'pending', 'approved');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organization_user_invoice" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "organization_user_invoice_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"organization_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"invoice_number" varchar NOT NULL,
	"invoice_status" "invoice_status_enum" NOT NULL,
	"invoice_date" date NOT NULL,
	"due_date" date NOT NULL,
	"amount" numeric(16, 2) NOT NULL,
	"paid_amount" numeric(16, 2) NOT NULL,
	"financial_year_quarter_id" integer NOT NULL,
	"created_by" integer NOT NULL,
	"updated_by" integer NOT NULL,
	"approved_by" integer,
	"approved_at" date,
	"paid_by" integer,
	"paid_at" date,
	"deleted_by" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "organization_user_invoice_organization_id_user_id_invoice_number_unique" UNIQUE("organization_id","user_id","invoice_number")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_user_invoice" ADD CONSTRAINT "organization_user_invoice_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_user_invoice" ADD CONSTRAINT "organization_user_invoice_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_user_invoice" ADD CONSTRAINT "organization_user_invoice_financial_year_quarter_id_organization_financial_year_quarters_id_fk" FOREIGN KEY ("financial_year_quarter_id") REFERENCES "public"."organization_financial_year_quarters"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_user_invoice" ADD CONSTRAINT "organization_user_invoice_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_user_invoice" ADD CONSTRAINT "organization_user_invoice_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_user_invoice" ADD CONSTRAINT "organization_user_invoice_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_user_invoice" ADD CONSTRAINT "organization_user_invoice_paid_by_users_id_fk" FOREIGN KEY ("paid_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_user_invoice" ADD CONSTRAINT "organization_user_invoice_deleted_by_users_id_fk" FOREIGN KEY ("deleted_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
