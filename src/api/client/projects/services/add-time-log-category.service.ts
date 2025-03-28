import type { AddProjectTimeLogCategoryPayload } from '../schema/schema';
import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import {
  TransactionalService,
  type TransactionContext
} from '@/common/decorators/service-transaction';
import { and, eq, inArray } from 'drizzle-orm';
import type { InsertOrgProjectTimeLogCategoryInterface } from '@/db/schema';
import { OrgProject, OrgProjectTimeLogCategory } from '@/db/schema';
import { ApiError } from '@/common/errors/base';

@dependency()
export class AddProjectTimeLogCategoryService {
  @TransactionalService()
  async create({
    data,
    transaction
  }: TransactionContext<AddProjectTimeLogCategoryPayload>) {
    const project = await transaction!.query.OrgProject.findFirst({
      where: and(
        eq(OrgProject.organization_id, data.organization_id),
        eq(OrgProject.uuid, data.project_id)
      )
    });

    if (!project) {
      throw new ApiError('Project not found', HttpStatus.NOT_FOUND);
    }
    const existingCategories =
      await transaction!.query.OrgProjectTimeLogCategory.findMany({
        where: and(
          eq(OrgProjectTimeLogCategory.project_id, project.id),
          eq(OrgProjectTimeLogCategory.organization_id, data.organization_id),
          inArray(
            OrgProjectTimeLogCategory.task_log_category_id,
            data.category_ids
          )
        )
      });

    const ids_to_activate = existingCategories
      .filter((category) => !category.is_active)
      .map((category) => category.id);
    const ids_to_deactivate = existingCategories
      .filter((category) => category.is_active)
      .map((category) => category.id);

    if (ids_to_activate.length > 0) {
      data.category_ids = data.category_ids.filter(
        (id) => !ids_to_activate.includes(id)
      );

      await transaction!
        .update(OrgProjectTimeLogCategory)
        .set({ is_active: true, updated_by: data.updated_by })
        .where(inArray(OrgProjectTimeLogCategory.id, ids_to_activate))
        .execute();
    }

    if (ids_to_deactivate.length > 0) {
      data.category_ids = data.category_ids.filter(
        (id) => !ids_to_deactivate.includes(id)
      );
      await transaction!
        .update(OrgProjectTimeLogCategory)
        .set({ is_active: false, updated_by: data.updated_by })
        .where(inArray(OrgProjectTimeLogCategory.id, ids_to_deactivate))
        .execute();
    }

    const dataToInsert: InsertOrgProjectTimeLogCategoryInterface[] =
      data.category_ids.map((category_id) => ({
        organization_id: data.organization_id,
        project_id: project.id,
        category_id,
        created_by: data.created_by,
        updated_by: data.updated_by,
        is_active: true,
        task_log_category_id: category_id
      }));

    await transaction!
      .insert(OrgProjectTimeLogCategory)
      .values(dataToInsert)
      .execute();

    return {
      data: {},
      status: HttpStatus.CREATED,
      message: 'Time log category added successfully'
    };
  }
}
