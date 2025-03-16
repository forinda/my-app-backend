ALTER TABLE "organization_subscriptions" ALTER COLUMN "maximum_users" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "organization_subscriptions" ALTER COLUMN "maximum_projects" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "organization_subscriptions" ALTER COLUMN "annual_discount" SET DATA TYPE numeric(5, 2);