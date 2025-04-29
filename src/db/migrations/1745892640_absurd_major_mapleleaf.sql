CREATE TYPE "public"."invoice_payment_method_enum" AS ENUM('credit_card', 'bank_transfer', 'cash', 'cheque', 'paypal');--> statement-breakpoint
ALTER TABLE "organization_user_invoice" ADD COLUMN "financial_year_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "organization_user_invoice" ADD COLUMN "payment_method" "invoice_payment_method_enum" DEFAULT 'bank_transfer';--> statement-breakpoint
ALTER TABLE "organization_user_invoice" ADD COLUMN "notes" varchar DEFAULT '';--> statement-breakpoint
ALTER TABLE "organization_user_invoice" ADD COLUMN "tax_amount" numeric(16, 2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE "organization_user_invoice" ADD COLUMN "discount_amount" numeric(16, 2) DEFAULT '0';--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_user_invoice" ADD CONSTRAINT "organization_user_invoice_financial_year_id_organization_financial_years_id_fk" FOREIGN KEY ("financial_year_id") REFERENCES "public"."organization_financial_years"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
