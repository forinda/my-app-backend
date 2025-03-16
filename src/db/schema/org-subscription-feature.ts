import { getTableTimestamps } from '@/common/utils/drizzle';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { boolean, integer, pgTable, text, varchar } from 'drizzle-orm/pg-core';

export const OrgSubscriptionFeature = pgTable('org_subscription_features', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull().unique(),
  description: text().notNull(),
  is_active: boolean().notNull().default(true),
  ...getTableTimestamps()
});

export interface SelectOrgSubscriptionFeatureInterface
  extends InferSelectModel<typeof OrgSubscriptionFeature> {}

export interface InsertOrgSubscriptionFeatureInterface
  extends InferInsertModel<typeof OrgSubscriptionFeature> {}
