import { OrgTask } from '@/db/schema';
import { useDrizzle } from '@/db';
import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import { paginator, type ApiPaginationParams } from '@/common/utils/pagination';
import { and, asc, between, eq, ilike, or } from 'drizzle-orm';
import type { FilterTasksPayload } from '../schema/schema';

@dependency()
export class FetchTasksService {
  async get(
    organization_id: number,
    query: FilterTasksPayload,
    _?: ApiPaginationParams
  ) {
    const db = useDrizzle();
    const fiters = [];
    const orgCondition = eq(OrgTask.organization_id, organization_id);

    if (query?.project_id) {
      fiters.push(eq(OrgTask.project_id, query.project_id));
    }
    if (query?.workspace_id) {
      fiters.push(eq(OrgTask.workspace_id, query.workspace_id));
    }
    if (query?.assignee_id) {
      fiters.push(eq(OrgTask.assignee_id, query.assignee_id));
    }
    if (query?.status) {
      fiters.push(eq(OrgTask.status, query.status));
    }
    if (query?.priority) {
      fiters.push(eq(OrgTask.priority, query.priority));
    }
    if (query?.parent_id) {
      fiters.push(eq(OrgTask.parent_id, query.parent_id));
    }
    if (query?.q) {
      fiters.push(
        or(
          ilike(OrgTask.title, `%${query.q}%`),
          ilike(OrgTask.description, `%${query.q}%`)
        )
      );
    }
    if (query?.start_date && !query?.end_date) {
      fiters.push(eq(OrgTask.start_date, query.start_date));
    }
    if (query?.end_date && !query?.start_date) {
      fiters.push(eq(OrgTask.end_date, query.end_date));
    }
    if (query?.start_date && query?.end_date) {
      fiters.push(
        between(OrgTask.start_date, query.start_date, query.end_date)
      );
    }
    const finalFilter = and(orgCondition, ...fiters);

    const totalItems = await db.$count(OrgTask, finalFilter);
    const data = await db.query.OrgTask.findMany({
      where: finalFilter,
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
