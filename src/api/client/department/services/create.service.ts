import type { NewDepartmentPayload } from '../schema/schema';

import { and, eq } from 'drizzle-orm';

import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import {
  TransactionalService,
  type TransactionContext
} from '@/common/decorators/service-transaction';
import { ApiError } from '@/common/errors/base';
import type { InsertOrganizationDepartmentInterface } from '@/db/schema';
import { Department } from '@/db/schema';

@dependency()
export class DepartmentCreationService {
  @TransactionalService()
  async create({
    data,
    transaction
  }: TransactionContext<NewDepartmentPayload>) {
    const existingDept = await transaction!.query.Department.findFirst({
      where: and(
        eq(Department.name, data.name),
        eq(Department.organization_id, data.organization_id)
      )
    });

    if (existingDept) {
      throw new ApiError(
        'Department with same name already exists',
        HttpStatus.CONFLICT,
        {}
      );
    }

    await transaction!
      .insert(Department)
      .values(data as InsertOrganizationDepartmentInterface)
      .returning()
      .execute();

    return {
      data: {},
      status: HttpStatus.CREATED,
      message: 'Department created successfully'
    };
  }
}
