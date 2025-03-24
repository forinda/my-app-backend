import { OrgProjectCategory } from '@/db/schema';
import { useDrizzle } from '@/db';
import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import type { ApiPaginationParams } from '@/common/utils/pagination';
import { asc, eq } from 'drizzle-orm';

@dependency()
export class FetchProjectCategoriesService {
  async get(organization_id: number, _?: ApiPaginationParams) {
    const db = useDrizzle();
    const categories = await db.query.OrgProjectCategory.findMany({
      where: eq(OrgProjectCategory.organization_id, organization_id),
      with: {
        projects: {
          columns: {
            id: true,
            name: true,
            description: true,
            created_at: true
          }
        }
      },
      limit: _?.limit,
      offset: _?.offset,
      orderBy: [asc(OrgProjectCategory.created_at)]
    });

    return {
      data: categories,
      message: 'Categories fetched successfully',
      status: HttpStatus.OK
    };
  }
}
