import { injectable } from 'inversify';
import type { ActivateOrDeactivateProjectTimeLogCategoryPayload } from '../schema/schema';

import { HttpStatus } from '@/common/http';
import { Dependency } from '@/common/di';
import {
  TransactionalService,
  type TransactionContext
} from '@/common/decorators/service-transaction';
import { and, eq } from 'drizzle-orm';
import { OrgProjectTimeLogCategory } from '@/db/schema';
import { ApiError } from '@/common/errors/base';

@injectable()
@Dependency()
export class ActivateOrDeactivateProjectTimeLogService {
  @TransactionalService()
  async changeStatus({
    data,
    transaction
  }: TransactionContext<ActivateOrDeactivateProjectTimeLogCategoryPayload>) {
    const timeLogCategory =
      await transaction!.query.OrgProjectTimeLogCategory.findFirst({
        where: and(
          eq(OrgProjectTimeLogCategory.project_id, data.project_id),
          eq(OrgProjectTimeLogCategory.task_log_category_id, data.category_id),
          eq(OrgProjectTimeLogCategory.organization_id, data.organization_id)
        )
      });

    if (!timeLogCategory) {
      throw new ApiError('Time log category not found', HttpStatus.NOT_FOUND);
    }
    await transaction!
      .update(OrgProjectTimeLogCategory)
      .set({
        is_active: data.is_active,
        updated_by: data.updated_by
      })
      .where(
        and(
          eq(OrgProjectTimeLogCategory.project_id, data.project_id),
          eq(OrgProjectTimeLogCategory.task_log_category_id, data.category_id),
          eq(OrgProjectTimeLogCategory.organization_id, data.organization_id)
        )
      )
      .execute();

    return {
      data: {},
      status: HttpStatus.OK,
      message: 'Time log category status updated successfully'
    };
  }
}
