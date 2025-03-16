ALTER TABLE "organization_subscriptions" ADD COLUMN "currency" varchar DEFAULT 'KES' NOT NULL;--> statement-breakpoint
ALTER TABLE "organization_subscriptions" ADD COLUMN "trial_period_days" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "organization_subscriptions" ADD COLUMN "cta" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "organization_subscriptions" ADD CONSTRAINT "organization_subscriptions_name_unique" UNIQUE("name");