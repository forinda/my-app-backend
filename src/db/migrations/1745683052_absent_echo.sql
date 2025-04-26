CREATE TYPE "public"."financial_year_quarter_type_enum" AS ENUM('Q1', 'Q2', 'Q3', 'Q4');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organization_financial_year_quarters" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "organization_financial_year_quarters_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"organization_financial_year_id" integer NOT NULL,
	"quarter" "financial_year_quarter_type_enum" NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"created_by" integer NOT NULL,
	"updated_by" integer NOT NULL,
	"deleted_by" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "organization_financial_year_quarters_organization_financial_year_id_quarter_unique" UNIQUE("organization_financial_year_id","quarter")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_financial_year_quarters" ADD CONSTRAINT "organization_financial_year_quarters_organization_financial_year_id_organization_financial_years_id_fk" FOREIGN KEY ("organization_financial_year_id") REFERENCES "public"."organization_financial_years"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_financial_year_quarters" ADD CONSTRAINT "organization_financial_year_quarters_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_financial_year_quarters" ADD CONSTRAINT "organization_financial_year_quarters_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_financial_year_quarters" ADD CONSTRAINT "organization_financial_year_quarters_deleted_by_users_id_fk" FOREIGN KEY ("deleted_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
