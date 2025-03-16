import { getTableTimestamps } from '@/common/utils/drizzle';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import {
  decimal,
  integer,
  pgEnum,
  pgTable,
  text,
  uuid,
  varchar
} from 'drizzle-orm/pg-core';
import { OrgSubscriptionFeature } from './org-subscription-feature';

export const subscriptionTypes = pgEnum('org_subscription_enum_types', [
  'starter',
  'team',
  'business',
  'enterprise'
]);

export const OrgSubscription = pgTable('organization_subscriptions', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  uuid: uuid().defaultRandom().unique().notNull(),
  name: varchar().notNull().unique(),
  description: text().notNull(),
  maximum_users: decimal().notNull(),
  maximum_projects: decimal().notNull(),
  per_user_monthly_price: integer().notNull(),
  annual_discount: decimal({
    precision: 5,
    scale: 2
  }).notNull(),
  currency: varchar().notNull().default('KES'),
  trial_period_days: integer().notNull(),
  type: subscriptionTypes().notNull().default('starter'),
  cta: varchar().notNull(),
  ...getTableTimestamps()
});

export const orgSubscriptionRelations = relations(
  OrgSubscription,
  ({ many }) => ({
    features: many(OrgSubscriptionFeature)
  })
);

export interface SelectOrgSubscriptionInterface
  extends InferSelectModel<typeof OrgSubscription> {}

export interface InsertOrgSubscriptionInterface
  extends InferInsertModel<typeof OrgSubscription> {}
