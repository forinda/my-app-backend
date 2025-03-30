import { useDrizzle } from '@/db';
import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import type { SQL } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import { inject } from 'inversify';
import { UUID } from '@/common/utils/uuid';
import type { FetchWorkspaceMembersPayload } from '../schema/schema';
import type { ApiPaginationParams } from '@/common/utils/pagination';
import type { SelectOrgProjectMemberInterface } from '@/db/schema';

@dependency()
export class FetchWorkspaceMembersService {
  @inject(UUID) private uuid: UUID;

  async get(
    workspace_id: string,
    filter: FetchWorkspaceMembersPayload,
    pagination: ApiPaginationParams
  ) {
    const db = useDrizzle();

    this.uuid.validateUUID(workspace_id, { throwError: true });

    type WorkspaceMemberType = {
      first_name: string;
      last_name: string;
      avatar: string;
      is_active: boolean;
      role: SelectOrgProjectMemberInterface['role'];
      user_id: number;
      email: string;
      username: string;
    };

    let query: SQL<WorkspaceMemberType[]>;

    if (filter.project_id) {
      // Query with project members information
      query = sql<WorkspaceMemberType[]>`
        WITH workspace AS (
          SELECT uuid, id, name
          FROM organization_workspaces
          WHERE uuid = ${workspace_id}
        ),
        project AS (
          SELECT id, uuid, name, is_active
          FROM organization_projects
          WHERE uuid = ${filter.project_id}
        ),
        workspace_members AS (
          SELECT
            u.first_name,
            u.last_name,
            u.avatar,
            u.id AS user_id,
            u.email,
            u.username,
            mem.is_active AS is_active_in_workspace,
            mem.role AS workspace_role
          FROM organization_workspace_members AS mem
          INNER JOIN workspace AS ws ON ws.id = mem.workspace_id
          INNER JOIN users AS u ON u.id = mem.user_id
        ),
        project_members AS (
          SELECT
            pm.user_id,
            pm.is_active AS active_in_project,
            pm.role AS project_role
          FROM organization_project_members pm
          INNER JOIN project pr ON pr.id = pm.project_id
        ),
        members AS (
          SELECT
          wm.*,
          pm.active_in_project,
          pm.project_role
          FROM workspace_members wm
          LEFT JOIN project_members pm ON pm.user_id = wm.user_id
          WHERE pm.user_id IS NOT NULL
        )
        SELECT * FROM members
        `;
    } else {
      // Basic workspace members query
      query = sql<WorkspaceMemberType[]>`
        WITH workspace AS (
          SELECT uuid, id, name
          FROM organization_workspaces
          WHERE uuid = ${workspace_id}
        ),
        members AS (
          SELECT
            u.first_name, u.last_name, u.avatar,
            u.id AS user_id, u.email, u.username,
            mem.is_active as is_active_in_workspace,
            mem.role AS workspace_role,
            NULL AS active_in_project,
            NULL AS project_role
          FROM organization_workspace_members AS mem
          INNER JOIN workspace AS ws ON ws.id = mem.workspace_id
          LEFT JOIN users AS u ON u.id = mem.user_id
        )
        SELECT * FROM members`;
    }

    const whereConditions: SQL[] = [];

    // Active filter
    if (filter.is_active_in_workspace !== undefined) {
      // whereConditions.push(sql`is_active = ${filter.is_active_in_workspace}`);
      whereConditions.push(
        sql`is_active_in_workspace = ${filter.is_active_in_workspace}`
      );
    }
    // Project active filter
    if (filter.is_active_in_project !== undefined) {
      whereConditions.push(
        sql`active_in_project = ${filter.is_active_in_project}`
      );
    }

    // Search filter
    if (filter.q) {
      whereConditions.push(
        sql`(first_name ILIKE ${`%${filter.q}%`}
          OR last_name ILIKE ${`%${filter.q}%`}
          OR email ILIKE ${`%${filter.q}%`}
          OR username ILIKE ${`%${filter.q}%`})`
      );
    }

    if (whereConditions.length > 0) {
      query = sql`${query} WHERE ${sql.join(whereConditions, sql` AND `)}`;
    }

    // Ordering
    query = sql`${query} ORDER BY user_id DESC`;

    // Pagination
    if (pagination.page && pagination.limit) {
      const offset = (pagination.page - 1) * pagination.limit;

      query = sql`${query} LIMIT ${pagination.limit} OFFSET ${offset}`;
    }

    // Execute the query
    const results = await db.execute<WorkspaceMemberType>(query);

    // console.log('results', results.rows);

    return {
      data: results.rows,
      message: 'Workspace members fetched successfully',
      status: HttpStatus.OK
    };
  }
}
