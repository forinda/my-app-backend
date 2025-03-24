import type { NewProjectPayload } from '../schema/schema';

import { and, eq } from 'drizzle-orm';

import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import {
  TransactionalService,
  type TransactionContext
} from '@/common/decorators/service-transaction';
import { ApiError } from '@/common/errors/base';
import type {
  InsertOrgProjectInterface,
  InsertOrgProjectMemberInterface
} from '@/db/schema';
import { OrgProject, OrgProjectCategory, OrgProjectMember } from '@/db/schema';

@dependency()
export class CreateProjectService {
  @TransactionalService()
  async create({ data, transaction }: TransactionContext<NewProjectPayload>) {
    const existingProject = await transaction!.query.OrgProject.findFirst({
      where: and(
        eq(OrgProject.name, data.name),
        eq(OrgProject.organization_id, data.organization_id)
      )
    });

    if (existingProject) {
      throw new ApiError(
        'Project with same name already exists',
        HttpStatus.CONFLICT,
        {}
      );
    }

    const category = await transaction!.query.OrgProjectCategory.findFirst({
      where: and(
        eq(OrgProjectCategory.id, data.category_id),
        eq(OrgProjectCategory.organization_id, data.organization_id)
      )
    });

    if (!category) {
      throw new ApiError('Category not found', HttpStatus.NOT_FOUND, {});
    }

    const created = (
      await transaction!
        .insert(OrgProject)
        .values(data as InsertOrgProjectInterface)
        .returning()
        .execute()
    )[0];
    const user_to_add: InsertOrgProjectMemberInterface = {
      project_id: created.id,
      user_id: data.created_by!,
      created_by: data.created_by!,
      updated_by: data.created_by!,
      is_active: true
    };

    // Add user to project
    await transaction!.insert(OrgProjectMember).values(user_to_add).execute();

    return {
      data: {},
      status: HttpStatus.CREATED,
      message: 'Project created successfully'
    };
  }
}
