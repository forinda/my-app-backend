import { injectable } from 'inversify';
import type { CreateTimeLogType } from '../schema/schema';

import { and, eq } from 'drizzle-orm';

import { HttpStatus } from '@/common/http';
import { Dependency } from '@/common/di';
import {
  TransactionalService,
  type TransactionContext
} from '@/common/decorators/service-transaction';
import { ApiError } from '@/common/errors/base';
import type { InsertDepartmentTitleInterface } from '@/db/schema';
import { DepartmentTitle } from '@/db/schema';

@injectable()
@Dependency()
export class CreateTimeLogService {
  @TransactionalService()
  async create({ data, transaction }: TransactionContext<CreateTimeLogType>) {
    const exisiting = await transaction!.query.OrgUserTimeLog.findFirst({
      where: and(
        eq(DepartmentTitle.name, data.name),
        eq(DepartmentTitle.organization_id, data.organization_id!)
      )
    });

    return {
      data: {},
      status: HttpStatus.CREATED,
      message: 'Time log created successfully'
    };
  }
}
