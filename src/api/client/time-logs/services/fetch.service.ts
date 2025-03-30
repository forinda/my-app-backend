import { DepartmentTitle, OrgUserTimeLog } from '@/db/schema';
import { useDrizzle } from '@/db';
import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import type { ApiPaginationParams } from '@/common/utils/pagination';
import { asc, eq } from 'drizzle-orm';

@dependency()
export class FetchTimeLogService {
  async get(organization_id: number, _?: ApiPaginationParams) {
    const db = useDrizzle();
    const titles = await db.query.OrgUserTimeLog.findMany({
      where: eq(OrgUserTimeLog.organization_id, organization_id),
      with: {
        project: {
          columns: {
            id: true,
            name: true
          }
        },
        task: {
          columns: {
            id: true,
            title: true,
            ref: true
          }
        },
        category: {
          columns: {
            id: true,
            name: true
          }
        }
      },
      limit: _?.limit,
      offset: _?.offset,
      orderBy: [asc(DepartmentTitle.created_at)]
    });

    return {
      data: titles,
      message: 'Timelogs fetched successfully',
      status: HttpStatus.OK
    };
  }
}
