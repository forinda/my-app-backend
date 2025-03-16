import { dependency } from '@/common/di';
import type { DrizzleTransaction } from '@/db';
import { inject } from 'inversify';
import { subscriptionPlans } from './plans';
import { and, eq } from 'drizzle-orm';
import {
  Organization,
  OrgFeatureSubscriptionMapping,
  OrgSubscription,
  OrgSubscriptionFeature
} from '@/db/schema';
import { PayloadValidator } from '@/common/schema/validator';
import {
  CreateSubscriptionFeatureSchema,
  CreateSubscriptionPlanSchema
} from '../schema/schema';

@dependency()
export class SetupSubscriptionPlansUtil {
  @inject(PayloadValidator) private validator: PayloadValidator;

  async setupPlans(transaction: DrizzleTransaction) {
    for (const { features, ...plan } of Object.values(subscriptionPlans)) {
      let existing = await transaction.query.OrgSubscription.findFirst({
        where: eq(OrgSubscription.name, plan.name)
      });

      if (!existing) {
        existing = (
          await transaction
            .insert(OrgSubscription)
            .values(this.validator.validate(CreateSubscriptionPlanSchema, plan))
            .returning()
            .execute()
        )[0];
      }
      if (features) {
        for (const feature of Object.values(features)) {
          let existingFeature =
            await transaction.query.OrgSubscriptionFeature.findFirst({
              where: eq(Organization.name, feature.name)
            });

          if (!existingFeature) {
            existingFeature = (
              await transaction
                .insert(OrgSubscriptionFeature)
                .values(
                  this.validator.validate(
                    CreateSubscriptionFeatureSchema,
                    feature
                  )
                )
                .returning()
                .execute()
            )[0];
          }
          const mapping =
            await transaction.query.OrgFeatureSubscriptionMapping.findFirst({
              where: and(
                eq(
                  OrgFeatureSubscriptionMapping.org_subscription_id,
                  existing.id
                ),
                eq(
                  OrgFeatureSubscriptionMapping.org_subscription_feature_id,
                  existingFeature.id
                )
              )
            });

          if (!mapping) {
            await transaction
              .insert(OrgFeatureSubscriptionMapping)
              .values({
                org_subscription_id: existing.id,
                org_subscription_feature_id: existingFeature.id
              })
              .execute();
          }
        }
      }
    }
  }
}
