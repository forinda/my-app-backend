import { OrgTimeLogCategory } from '@/db/schema';
import { useDrizzle } from '@/db';
import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import { paginator, type ApiPaginationParams } from '@/common/utils/pagination';
import { and, asc, eq, ilike, or } from 'drizzle-orm';
import type { FilterTimeLogCategoryType } from '../schema/schema';

@dependency()
export class FetchTimeLogCategoriesService {
  async get(
    organization_id: number,
    filter: FilterTimeLogCategoryType,
    _?: ApiPaginationParams
  ) {
    const db = useDrizzle();
    const filters = [];
    const orgCondition = eq(
      OrgTimeLogCategory.organization_id,
      organization_id
    );

    if (filter?.q) {
      filters.push(
        or(
          ilike(OrgTimeLogCategory.name, `%${filter.q}%`),
          ilike(OrgTimeLogCategory.description, `%${filter.q}%`)
        )
      );
    }
    if (filter?.color) {
      filters.push(eq(OrgTimeLogCategory.color, filter.color));
    }

    const finalFilter = and(orgCondition, ...filters);
    const totalItems = await db.$count(OrgTimeLogCategory, finalFilter);
    const categories = await db.query.OrgTimeLogCategory.findMany({
      where: finalFilter,
      limit: _?.limit,
      offset: _?.offset,
      orderBy: [asc(OrgTimeLogCategory.created_at)]
    });

    return {
      ...paginator(categories, totalItems, _!),
      message: 'Categories fetched successfully',
      status: HttpStatus.OK
    };
  }
}
