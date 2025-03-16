import type { UpdateTimeLogCategoryType } from '../schema/schema';

import { and, eq, ne } from 'drizzle-orm';

import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import {
  TransactionalService,
  type TransactionContext
} from '@/common/decorators/service-transaction';
import { ApiError } from '@/common/errors/base';
import { OrgTimeLogCategory } from '@/db/schema';

@dependency()
export class UpdateTimeLogCategoryService {
  @TransactionalService()
  async update({
    data,
    transaction
  }: TransactionContext<UpdateTimeLogCategoryType>) {
    const exisiting = await transaction!.query.OrgTimeLogCategory.findFirst({
      where: eq(OrgTimeLogCategory.id, data.category_id)
    });

    if (!exisiting) {
      throw new ApiError('Category not found', HttpStatus.NOT_FOUND, {});
    }

    const otherWithSameName =
      await transaction!.query.DepartmentTitle.findFirst({
        where: and(
          eq(OrgTimeLogCategory.name, data.name!),
          eq(OrgTimeLogCategory.organization_id, data.organization_id!),
          ne(OrgTimeLogCategory.id, data.category_id)
        )
      });

    if (otherWithSameName) {
      throw new ApiError(
        'Category same name already exists',
        HttpStatus.CONFLICT,
        {}
      );
    }

    await transaction!
      .update(OrgTimeLogCategory)
      .set(data)
      .where(eq(OrgTimeLogCategory.id, data.category_id))
      .execute();

    return {
      data: {},
      status: HttpStatus.OK,
      message: 'Category updated successfully'
    };
  }
}
