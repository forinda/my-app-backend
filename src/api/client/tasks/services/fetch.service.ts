import { OrgProject, OrgTask } from '@/db/schema';
import { useDrizzle } from '@/db';
import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import { paginator, type ApiPaginationParams } from '@/common/utils/pagination';
import type { SQL } from 'drizzle-orm';
import { and, asc, between, eq, ilike, or } from 'drizzle-orm';
import type { FilterTasksPayload } from '../schema/schema';

@dependency()
export class FetchTasksService {
  private async fetchProjectIdByUuid(organization_id: number, uuid: string) {
    const db = useDrizzle();
    const project = await db.query.OrgProject.findFirst({
      where: and(
        eq(OrgProject.organization_id, organization_id),
        eq(OrgProject.uuid, uuid)
      ),
      columns: { id: true, organization_id: true }
    });

    return project;
  }

  private buildFilters(
    organization_id: number,
    project_id: number,
    query: FilterTasksPayload
  ) {
    const filters: SQL[] = [];

    if (query.project_id) {
      filters.push(eq(OrgTask.project_id, project_id));
    }
    if (query.workspace_id) {
      filters.push(eq(OrgTask.workspace_id, query.workspace_id));
    }
    if (query.assignee_id) {
      filters.push(eq(OrgTask.assignee_id, query.assignee_id));
    }
    if (query.status) {
      filters.push(eq(OrgTask.status, query.status));
    }
    if (query.priority) {
      filters.push(eq(OrgTask.priority, query.priority));
    }
    if (query.parent_id) {
      filters.push(eq(OrgTask.parent_id, query.parent_id));
    }
    if (query.q) {
      const qs = or(
        ilike(OrgTask.title, `%${query.q!}%`),
        ilike(OrgTask.description, `%${query.q!}%`),
        ilike(OrgTask.ref, `%${query.q!}%`)
      );

      filters.push(qs!);
    }
    if (query.start_date && query.end_date) {
      filters.push(
        between(OrgTask.start_date, query.start_date, query.end_date)
      );
    } else {
      if (query.start_date) {
        filters.push(eq(OrgTask.start_date, query.start_date));
      }
      if (query.end_date) {
        filters.push(eq(OrgTask.end_date, query.end_date));
      }
    }

    return and(eq(OrgTask.organization_id, organization_id), ...filters);
  }

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

  private buildRelations() {
    return {
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
    };
  }

  async get(
    organization_id: number,
    query: FilterTasksPayload,
    pagination?: ApiPaginationParams
  ) {
    const db = useDrizzle();
    let projectId: number | undefined;

    // Handle project UUID to ID conversion if needed
    if (query.project_id) {
      const project = await this.fetchProjectIdByUuid(
        organization_id,
        query.project_id
      );

      if (!project) {
        return {
          data: [],
          total: 0,
          message: 'Project not found',
          status: HttpStatus.NOT_FOUND
        };
      }
      projectId = project.id;
    }

    const finalFilter = this.buildFilters(organization_id, projectId!, query);
    const columns = this.buildColumns(query.fields);
    const relations = JSON.parse(
      (query.relations as unknown as string) ?? 'false'
    )!
      ? this.buildRelations()
      : {};

    const [totalItems, data] = await Promise.all([
      db.$count(OrgTask, finalFilter),
      db.query.OrgTask.findMany({
        where: finalFilter,
        columns,
        with: relations,
        limit: pagination?.limit,
        offset: pagination?.offset,
        orderBy: [asc(OrgTask.created_at)]
      })
    ]);

    return {
      ...paginator(data, totalItems, pagination!),
      message: 'Tasks fetched successfully',
      status: HttpStatus.OK
    };
  }
}
