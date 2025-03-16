import { OrgSubscription } from '@/db/schema';
import { useDrizzle } from '@/db';
import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import { asc } from 'drizzle-orm';
import type { TransactionContext } from '@/common/decorators/service-transaction';
import { TransactionalService } from '@/common/decorators/service-transaction';
import { inject } from 'inversify';
import { SetupSubscriptionPlansUtil } from '../utils/setup-plans';

@dependency()
export class FetchSubscriptionPlansService {
  @inject(SetupSubscriptionPlansUtil)
  private setupPlans: SetupSubscriptionPlansUtil;
  @TransactionalService()
  async get({ transaction }: TransactionContext<undefined>) {
    const db = useDrizzle();
    const existing = await transaction?.$count(OrgSubscription);

    if (!existing || (existing && existing === 0)) {
      await this.setupPlans.setupPlans(transaction!);
    }
    const depts = await db.query.OrgSubscription.findMany({
      columns: {
        id: true,
        name: true,
        description: true,
        maximum_users: true,
        maximum_projects: true,
        per_user_monthly_price: true,
        annual_discount: true,
        currency: true,
        trial_period_days: true,
        type: true,
        cta: true,
        is_popular: true
      },
      with: {
        subscriptionFeatures: {
          with: {
            feature: {
              columns: {
                id: true,
                name: true,
                description: true,
                is_active: true
              }
            }
          }
        }
      },
      // limit: _?.limit,
      // offset: _?.offset,
      orderBy: [asc(OrgSubscription.per_user_monthly_price)]
    });

    return {
      data: depts,
      message: 'Workspaces fetched successfully',
      status: HttpStatus.OK
    };
  }
}
