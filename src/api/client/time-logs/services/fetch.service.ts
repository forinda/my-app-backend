import { injectable } from 'inversify';
import { DepartmentTitle, OrgUserTimeLog } from '@/db/schema';
import { useDrizzle } from '@/db';
import { HttpStatus } from '@/common/http';
import { Dependency } from '@/common/di';
import type { ApiPaginationParams } from '@/common/utils/pagination';
import { and, asc, eq, sql } from 'drizzle-orm';

@injectable()
@Dependency()
export class FetchTimeLogService {
  async get(organization_id: number, _?: ApiPaginationParams) {
    const db = useDrizzle();
    const titles = await db.query.OrgUserTimeLog.findMany({
      where: and(
        eq(OrgUserTimeLog.organization_id, organization_id),
        eq(OrgUserTimeLog.deleted_at, sql`NULL`)
      ),
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
