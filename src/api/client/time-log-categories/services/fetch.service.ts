import {
  OrgProject,
  OrgProjectTimeLogCategory,
  OrgTimeLogCategory
} from '@/db/schema';
import type { DbType } from '@/db';
import { useDrizzle } from '@/db';
import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import { paginator, type ApiPaginationParams } from '@/common/utils/pagination';
import type { SQL } from 'drizzle-orm';
import { inArray } from 'drizzle-orm';
import { and, asc, eq, ilike, or } from 'drizzle-orm';
import type { FilterTimeLogCategoryType } from '../schema/schema';

@dependency()
export class FetchTimeLogCategoriesService {
  private buildColumns(fields?: string) {
    if (!fields) return undefined;

    return fields
      .split(',')
      .map((field) => field.trim())
      .reduce(
        (acc, field) => {
          acc[field] = true;

          return acc;
        },
        {} as Record<string, boolean>
      );
  }

  private buildConditions(db: DbType) {
    return async function (org_id: number, filter: FilterTimeLogCategoryType) {
      const filters: SQL[] = [];
      const orgCondition = eq(OrgTimeLogCategory.organization_id, org_id);

      if (filter?.q) {
        filters.push(
          or(
            ilike(OrgTimeLogCategory.name, `%${filter.q}%`),
            ilike(OrgTimeLogCategory.description, `%${filter.q}%`)
          )!
        );
      }
      if (filter?.color) {
        filters.push(eq(OrgTimeLogCategory.color, filter.color));
      }
      if (filter.project_id) {
        const project = await db.query.OrgProject.findFirst({
          where: and(
            eq(OrgProject.organization_id, org_id),
            eq(OrgProject.uuid, filter.project_id)
          ),
          columns: {
            id: true,
            organization_id: true
          }
        });

        if (!project) {
          return;
        }
        const categories = await db.query.OrgProjectTimeLogCategory.findMany({
          where: and(
            eq(OrgProjectTimeLogCategory.project_id, project.id),
            eq(OrgProjectTimeLogCategory.organization_id, org_id),
            eq(OrgProjectTimeLogCategory.is_active, true)
          ),
          columns: {
            task_log_category_id: true
          }
        });

        filters.push(
          inArray(
            OrgTimeLogCategory.id,
            categories.map((c) => c.task_log_category_id)
          )
        );
      }

      return and(orgCondition, ...filters);
    };
  }
  async get(
    organization_id: number,
    filter: FilterTimeLogCategoryType,
    _?: ApiPaginationParams
  ) {
    const db = useDrizzle();

    const columns = this.buildColumns(filter.fields);
    const queryFilters = await this.buildConditions(db)(
      organization_id,
      filter
    );
    // const finalFilter =
    const totalItems = await db.$count(OrgTimeLogCategory, queryFilters!);
    const categories = await db.query.OrgTimeLogCategory.findMany({
      where: queryFilters!,
      columns,
      limit: filter.all ? undefined : _?.limit,
      offset: filter.all ? undefined : _?.offset,
      orderBy: [asc(OrgTimeLogCategory.created_at)]
    });

    return {
      ...paginator(categories, totalItems, _!),
      message: 'Categories fetched successfully',
      status: HttpStatus.OK
    };
  }
}
