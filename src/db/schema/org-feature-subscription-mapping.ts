import { integer, pgTable, unique } from 'drizzle-orm/pg-core';
import { OrgSubscription } from './org-subscription';
import {
  foreignKeyConstraints,
  getTableTimestamps
} from '@/common/utils/drizzle';
import { OrgSubscriptionFeature } from './org-subscription-feature';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { relations } from 'drizzle-orm';

export const OrgFeatureSubscriptionMapping = pgTable(
  'org_feature_subscription_mapping',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    org_subscription_id: integer().references(
      () => OrgSubscription.id,
      foreignKeyConstraints
    ),
    org_subscription_feature_id: integer().references(
      () => OrgSubscriptionFeature.id,
      foreignKeyConstraints
    ),
    ...getTableTimestamps()
  },
  (table) => [
    unique().on(table.org_subscription_id, table.org_subscription_feature_id)
  ]
);

export const orgFeatureSubscriptionMappingRelations = relations(
  OrgFeatureSubscriptionMapping,
  ({ one }) => ({
    subscription: one(OrgSubscription, {
      fields: [OrgFeatureSubscriptionMapping.org_subscription_id],
      references: [OrgSubscription.id]
    }),
    feature: one(OrgSubscriptionFeature, {
      fields: [OrgFeatureSubscriptionMapping.org_subscription_feature_id],
      references: [OrgSubscriptionFeature.id]
    })
  })
);

export interface SelectOrgFeatureSubscriptionMappingInterface
  extends InferSelectModel<typeof OrgFeatureSubscriptionMapping> {}

export interface InsertOrgFeatureSubscriptionMappingInterface
  extends InferInsertModel<typeof OrgFeatureSubscriptionMapping> {}
