CREATE TYPE "public"."organization_size_enum" AS ENUM('1-10 employees', '11-50 employees', '51-200 employees', '201-500 employees', '501-1000 employees', '1000+ employees');--> statement-breakpoint
CREATE TYPE "public"."orgmember_role_enum" AS ENUM('Admin', 'Member', 'Manager', 'Owner', 'Guest');--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "industry" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "size" "organization_size_enum" DEFAULT '1-10 employees' NOT NULL;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "website" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "contact_email" varchar;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "contact_phone" varchar;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "contact_address" varchar;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "location" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "organization_members" ADD COLUMN "role" "orgmember_role_enum" DEFAULT 'Member';