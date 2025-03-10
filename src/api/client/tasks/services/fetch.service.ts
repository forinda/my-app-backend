import { injectable } from 'inversify';
import { OrgTask } from '@/db/schema';
import { useDrizzle } from '@/db';
import { HttpStatus } from '@/common/http';
import { Dependency } from '@/common/di';
import type { ApiPaginationParams } from '@/common/utils/pagination';
import { asc, eq } from 'drizzle-orm';

@injectable()
@Dependency()
export class FetchTasksService {
  async get(organization_id: number, _?: ApiPaginationParams) {
    const db = useDrizzle();

    const depts = await db.query.OrgTask.findMany({
      where: eq(OrgTask.organization_id, organization_id),
      with: {
        parent: true,
        subtasks: true,
        assignee: true,
        comments: true
      },
      limit: _?.limit,
      offset: _?.offset,
      orderBy: [asc(OrgTask.created_at)]
    });

    return {
      data: depts,
      message: 'Tasks fetched successfully',
      status: HttpStatus.OK
    };
  }
}
