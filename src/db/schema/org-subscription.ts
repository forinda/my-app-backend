import { getTableTimestamps } from '@/common/utils/drizzle';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import {
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
  name: varchar().notNull(),
  description: text().notNull(),
  maximum_users: integer().notNull(),
  maximum_projects: integer().notNull(),
  per_user_monthly_price: integer().notNull(),
  annual_discount: integer().notNull(),
  type: subscriptionTypes().notNull().default('starter'),
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
