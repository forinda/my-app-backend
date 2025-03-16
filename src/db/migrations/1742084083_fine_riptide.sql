CREATE TABLE IF NOT EXISTS "org_feature_subscription_mapping" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "org_feature_subscription_mapping_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"org_subscription_id" integer,
	"org_subscription_feature_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "org_feature_subscription_mapping_org_subscription_id_org_subscription_feature_id_unique" UNIQUE("org_subscription_id","org_subscription_feature_id")
);
--> statement-breakpoint
ALTER TABLE "org_subscription_features" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "organization_subscriptions" ADD COLUMN "annual_discount" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "org_feature_subscription_mapping" ADD CONSTRAINT "org_feature_subscription_mapping_org_subscription_id_organization_subscriptions_id_fk" FOREIGN KEY ("org_subscription_id") REFERENCES "public"."organization_subscriptions"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "org_feature_subscription_mapping" ADD CONSTRAINT "org_feature_subscription_mapping_org_subscription_feature_id_org_subscription_features_id_fk" FOREIGN KEY ("org_subscription_feature_id") REFERENCES "public"."org_subscription_features"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
