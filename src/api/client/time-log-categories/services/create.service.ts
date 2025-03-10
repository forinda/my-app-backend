import { injectable } from 'inversify';
import type { CreateTimeLogCategoryType } from '../schema/schema';

import { and, eq } from 'drizzle-orm';

import { HttpStatus } from '@/common/http';
import { Dependency } from '@/common/di';
import {
  TransactionalService,
  type TransactionContext
} from '@/common/decorators/service-transaction';
import { ApiError } from '@/common/errors/base';
import type { InsertProjectCategoryInterface } from '@/db/schema';
import { OrgTimeLogCategory } from '@/db/schema';

@injectable()
@Dependency()
export class CreateTimeLogCategoryService {
  @TransactionalService()
  async create({
    data,
    transaction
  }: TransactionContext<CreateTimeLogCategoryType>) {
    const exisiting = await transaction!.query.OrgTimeLogCategory.findFirst({
      where: and(
        eq(OrgTimeLogCategory.name, data.name),
        eq(OrgTimeLogCategory.organization_id, data.organization_id!)
      )
    });

    if (exisiting) {
      throw new ApiError(
        'Category with same name already exists',
        HttpStatus.CONFLICT,
        {}
      );
    }

    const category = (
      await transaction!
        .insert(OrgTimeLogCategory)
        .values(data as InsertProjectCategoryInterface)
        .returning()
        .execute()
    )[0];

    return {
      data: category,
      status: HttpStatus.CREATED,
      message: 'Category created successfully'
    };
  }
}
