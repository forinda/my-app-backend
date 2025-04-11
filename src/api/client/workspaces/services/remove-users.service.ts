import type { RemoveUsersFromWorkspacePayload } from '../schema/schema';

import { and, eq, inArray } from 'drizzle-orm';

import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import {
  TransactionalService,
  type TransactionContext
} from '@/common/decorators/service-transaction';
import { ApiError } from '@/common/errors/base';
import { OrgWorkspace, OrgWorkspaceMember } from '@/db/schema';

@dependency()
export class RemoveUserFromWorkspaceService {
  @TransactionalService()
  async create({
    data,
    transaction
  }: TransactionContext<RemoveUsersFromWorkspacePayload>) {
    const existingWorkspace = await transaction!.query.OrgWorkspace.findFirst({
      where: and(
        eq(OrgWorkspace.uuid, data.workspace_id),
        eq(OrgWorkspace.organization_id, data.organization_id)
      )
    });

    if (!existingWorkspace) {
      throw new ApiError('Workspace not found', HttpStatus.NOT_FOUND, {});
    }

    const exisingMembers = await transaction!.query.OrgWorkspaceMember.findMany(
      {
        where: and(
          eq(OrgWorkspaceMember.workspace_id, existingWorkspace.id),
          eq(OrgWorkspaceMember.is_active, true),
          inArray(OrgWorkspaceMember.user_id, data.users)
        )
      }
    );

    if (exisingMembers.length) {
      // Filter to retain only members who are in the workspace
      data.users = data.users.filter((id) =>
        exisingMembers.some((m) => m.user_id === id)
      );
    }

    if (!data.users.length) {
      throw new ApiError(
        'Users not found in workspace',
        HttpStatus.NOT_FOUND,
        {}
      );
    }

    await transaction!
      .update(OrgWorkspaceMember)
      .set({
        is_active: false
      })
      .where(
        and(
          eq(OrgWorkspaceMember.workspace_id, existingWorkspace.id),
          inArray(OrgWorkspaceMember.user_id, data.users)
        )
      );

    return {
      data: {},
      status: HttpStatus.OK,
      message: 'Users removed successfully'
    };
  }
}
