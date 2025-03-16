import type { AddProjectTimeLogCategoryPayload } from '../schema/schema';

import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import {
  TransactionalService,
  type TransactionContext
} from '@/common/decorators/service-transaction';
import { and, eq } from 'drizzle-orm';
import { OrgProjectTimeLogCategory } from '@/db/schema';
import { ApiError } from '@/common/errors/base';

@dependency()
export class AddProjectTimeLogCategoryService {
  @TransactionalService()
  async create({
    data,
    transaction
  }: TransactionContext<AddProjectTimeLogCategoryPayload>) {
    const timeLogCategory =
      await transaction!.query.OrgProjectTimeLogCategory.findFirst({
        where: and(
          eq(OrgProjectTimeLogCategory.project_id, data.project_id),
          eq(OrgProjectTimeLogCategory.task_log_category_id, data.category_id),
          eq(OrgProjectTimeLogCategory.organization_id, data.organization_id)
        )
      });

    if (timeLogCategory) {
      throw new ApiError(
        'Time log category already exists',
        HttpStatus.CONFLICT
      );
    }
    await transaction!
      .insert(OrgProjectTimeLogCategory)
      .values({
        ...data,
        organization_id: data.organization_id,
        task_log_category_id: data.category_id,
        is_active: true
      })
      .execute();

    return {
      data: {},
      status: HttpStatus.CREATED,
      message: 'Time log category added successfully'
    };
  }
}
