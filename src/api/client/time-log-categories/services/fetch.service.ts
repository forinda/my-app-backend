import { injectable } from 'inversify';
import { OrgTimeLogCategory } from '@/db/schema';
import { useDrizzle } from '@/db';
import { HttpStatus } from '@/common/http';
import { Dependency } from '@/common/di';
import type { ApiPaginationParams } from '@/common/utils/pagination';
import { asc, eq } from 'drizzle-orm';

@injectable()
@Dependency()
export class FetchTimeLogCategoriesService {
  async get(organization_id: number, _?: ApiPaginationParams) {
    const db = useDrizzle();
    const categories = await db.query.OrgTimeLogCategory.findMany({
      where: eq(OrgTimeLogCategory.organization_id, organization_id),
      limit: _?.limit,
      offset: _?.offset,
      orderBy: [asc(OrgTimeLogCategory.created_at)]
    });

    return {
      data: categories,
      message: 'Categories fetched successfully',
      status: HttpStatus.OK
    };
  }
}
