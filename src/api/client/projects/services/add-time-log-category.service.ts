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
    const db = transaction!; // Non-null assertion is safe here due to @TransactionalService

    // 1. Validate project exists
    const project = await db.query.OrgProject.findFirst({
      where: and(
        eq(OrgProject.organization_id, data.organization_id),
        eq(OrgProject.uuid, data.project_id)
      )
    });

    if (!project) {
      throw new ApiError('Project not found', HttpStatus.NOT_FOUND);
    }

    // 2. Check existing categories
    const existingCategories = await db
      .select()
      .from(OrgProjectTimeLogCategory)
      .where(
        and(
          eq(OrgProjectTimeLogCategory.project_id, project.id),
          eq(OrgProjectTimeLogCategory.organization_id, data.organization_id),
          inArray(
            OrgProjectTimeLogCategory.task_log_category_id,
            data.category_ids
          )
        )
      );

    // 3. Categorize existing records
    const activeIds = new Set<number>();
    const inactiveIds = new Set<number>();

    existingCategories.forEach((category) => {
      (category.is_active ? activeIds : inactiveIds).add(category.id);
    });

    // 4. Process updates for existing records
    const updates: Promise<any>[] = [];

    if (inactiveIds.size > 0) {
      // Activate inactive categories
      updates.push(
        db
          .update(OrgProjectTimeLogCategory)
          .set({
            is_active: true,
            updated_by: data.updated_by
            // updated_at: new Date()
          })
          .where(inArray(OrgProjectTimeLogCategory.id, [...inactiveIds]))
          .execute()
      );

      // Filter out these categories from insert list
      data.category_ids = data.category_ids.filter(
        (id) =>
          !existingCategories.some(
            (c) => c.task_log_category_id === id && !c.is_active
          )
      );
    }

    if (activeIds.size > 0) {
      // Deactivate active categories (if business logic requires)
      // Note: This might not be needed depending on your requirements
      updates.push(
        db
          .update(OrgProjectTimeLogCategory)
          .set({
            is_active: false,
            updated_by: data.updated_by
            // updated_at: new Date()
          })
          .where(inArray(OrgProjectTimeLogCategory.id, [...activeIds]))
          .execute()
      );

      // Filter out these categories from insert list
      data.category_ids = data.category_ids.filter(
        (id) =>
          !existingCategories.some(
            (c) => c.task_log_category_id === id && c.is_active
          )
      );
    }

    // Wait for all updates to complete
    await Promise.all(updates);

    // 5. Insert new categories (if any remain)
    if (data.category_ids.length > 0) {
      const newCategories: InsertOrgProjectTimeLogCategoryInterface[] =
        data.category_ids.map((category_id) => ({
          organization_id: data.organization_id,
          project_id: project.id,
          task_log_category_id: category_id,
          created_by: data.created_by,
          updated_by: data.updated_by,
          is_active: true
        }));

      await db
        .insert(OrgProjectTimeLogCategory)
        .values(newCategories)
        .execute();
    }

    return {
      data: null,
      status: HttpStatus.CREATED,
      message: 'Time log categories processed successfully'
    };
  }
}
