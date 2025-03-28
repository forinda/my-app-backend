import {
  OrgProject,
  OrgProjectTimeLogCategory,
  OrgTimeLogCategory
} from '@/db/schema';
import { useDrizzle } from '@/db';
import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import type { ApiPaginationParams } from '@/common/utils/pagination';
import { and, eq, ilike, or } from 'drizzle-orm';
import type { FetchProjectTimeCategoriesPayload } from '../schema/schema';

@dependency()
export class FetchProjectsTimeCategoriesService {
  async get(
    organization_id: number,
    filters: Partial<FetchProjectTimeCategoriesPayload>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _pagination: ApiPaginationParams
  ) {
    const db = useDrizzle();
    // const { limit, offset } = pagination;

    // Find the project
    const project = await db.query.OrgProject.findFirst({
      where: and(
        eq(OrgProject.organization_id, organization_id),
        eq(OrgProject.uuid, filters.project_id!)
      ),
      columns: {
        id: true,
        name: true,
        description: true,
        category_id: true,
        uuid: true
      }
    });

    if (!project) {
      return {
        data: null,
        message: 'Project not found',
        status: HttpStatus.NOT_FOUND
      };
    }

    // Build filters for categories
    const categoryFilters = [];

    if (filters?.q) {
      const searchQuery = `%${filters.q}%`;

      categoryFilters.push(
        or(
          ilike(OrgTimeLogCategory.name, searchQuery),
          ilike(OrgTimeLogCategory.description, searchQuery)
        )
      );
    }

    // Fetch categories with joined time log categories
    // const categories = await db
    //   .select({
    //     project_time_category: OrgProjectTimeLogCategory,
    //     time_log_category: OrgTimeLogCategory
    //   })
    //   .from(OrgProjectTimeLogCategory)
    //   .leftJoin(
    //     OrgTimeLogCategory,
    //     eq(
    //       OrgProjectTimeLogCategory.task_log_category_id,
    //       OrgTimeLogCategory.id
    //     )
    //   )
    //   .where(
    //     and(
    //       eq(OrgProjectTimeLogCategory.project_id, project.id),
    //       ...categoryFilters
    //     )
    //   )
    //   .limit(limit)
    //   .offset(offset)
    //   .orderBy(
    //     asc(OrgProjectTimeLogCategory.created_at),
    //     asc(OrgTimeLogCategory.name)
    //   );
    const categories = await db.query.OrgProjectTimeLogCategory.findMany({
      where: and(
        eq(OrgProjectTimeLogCategory.project_id, project.id),
        ...categoryFilters
      ),
      columns: {
        id: true,
        task_log_category_id: true,
        is_active: true,
        project_id: true
      }
    });

    return {
      data: categories,
      message: 'Project time categories fetched successfully',
      status: HttpStatus.OK
    };
  }
}
