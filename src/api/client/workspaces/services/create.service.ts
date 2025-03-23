import type { NewWorkspacePayload } from '../schema/schema';

import { and, eq } from 'drizzle-orm';

import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import {
  TransactionalService,
  type TransactionContext
} from '@/common/decorators/service-transaction';
import { ApiError } from '@/common/errors/base';
import type {
  InsertOrgWorkspaceInterface,
  InsertOrgWorkspaceMemberInterface
} from '@/db/schema';
import { OrgWorkspace, OrgWorkspaceMember } from '@/db/schema';

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

    const createdWorkspace = (
      await transaction!
        .insert(OrgWorkspace)
        .values(data as InsertOrgWorkspaceInterface)
        .returning()
        .execute()
    )[0];
    const userToAdd: InsertOrgWorkspaceMemberInterface = {
      workspace_id: createdWorkspace.id,
      user_id: data.created_by!,
      is_active: true,
      created_by: data.created_by!,
      updated_by: data.created_by!
    };

    // Add user to workspace
    await transaction!
      .insert(OrgWorkspaceMember)
      .values(userToAdd)
      .returning()
      .execute();

    return {
      data: {},
      status: HttpStatus.CREATED,
      message: 'Workspace created successfully'
    };
  }
}
