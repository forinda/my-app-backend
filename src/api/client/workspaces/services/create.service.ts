import type { NewWorkspacePayload } from '../schema/schema';

import { and, eq } from 'drizzle-orm';

import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import {
  TransactionalService,
  type TransactionContext
} from '@/common/decorators/service-transaction';
import { ApiError } from '@/common/errors/base';
import type { InsertOrgWorkspaceInterface } from '@/db/schema';
import { OrgWorkspace } from '@/db/schema';

@dependency()
export class CreateWorkspaceService {
  @TransactionalService()
  async create({ data, transaction }: TransactionContext<NewWorkspacePayload>) {
    const foundWorkspace = await transaction!.query.OrgWorkspace.findFirst({
      where: and(
        eq(OrgWorkspace.name, data.name),
        eq(OrgWorkspace.organization_id, data.organization_id)
      )
    });

    if (foundWorkspace) {
      throw new ApiError(
        'Workspace with same name already exists',
        HttpStatus.CONFLICT,
        {}
      );
    }

    await transaction!
      .insert(OrgWorkspace)
      .values(data as InsertOrgWorkspaceInterface)
      .returning()
      .execute();

    return {
      data: {},
      status: HttpStatus.CREATED,
      message: 'Workspace created successfully'
    };
  }
}
