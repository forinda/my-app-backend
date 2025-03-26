import { OrgTask } from '@/db/schema';
import { useDrizzle } from '@/db';
import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import { paginator, type ApiPaginationParams } from '@/common/utils/pagination';
import { asc, eq } from 'drizzle-orm';

@dependency()
export class FetchTasksService {
  async get(organization_id: number, _?: ApiPaginationParams) {
    const db = useDrizzle();
    const filterCondition = eq(OrgTask.organization_id, organization_id);
    const totalItems = await db.$count(OrgTask, filterCondition);
    const data = await db.query.OrgTask.findMany({
      where: filterCondition,
      with: {
        parent: true,
        sub_tasks: {
          columns: {
            id: true,
            title: true,
            description: true,
            status: true,
            created_at: true
          }
        },
        assignee: {
          columns: {
            id: true,
            username: true,
            first_name: true,
            last_name: true,
            email: true,
            avatar: true
          }
        },
        comments: {
          columns: {
            id: true,
            text: true,
            created_at: true,
            task_id: true
          },
          with: {
            creator: {
              columns: {
                first_name: true,
                last_name: true,
                avatar: true
              }
            }
          }
        },
        project: {
          columns: {
            id: true,
            name: true,
            description: true,
            start_date: true,
            end_date: true
          }
        },
        workspace: {
          columns: {
            id: true,
            name: true
          }
        },
        creator: {
          columns: {
            id: true,
            username: true,
            first_name: true,
            last_name: true,
            email: true,
            avatar: true
          }
        }
      },
      limit: _?.limit,
      offset: _?.offset,
      orderBy: [asc(OrgTask.created_at)]
    });

    return {
      ...paginator(data, totalItems, _!),
      message: 'Tasks fetched successfully',
      status: HttpStatus.OK
    };
  }
}
