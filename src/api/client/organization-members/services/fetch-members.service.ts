import { inject } from 'inversify';
import { Organization } from '@/db/schema';
import { useDrizzle } from '@/db';
import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import { UUID } from '@/common/utils/uuid';
import { eq, sql } from 'drizzle-orm';
import type { FilterOrganizationmembersType } from '../schema';
import { paginator, type ApiPaginationParams } from '@/common/utils/pagination';

const ERROR_MESSAGES = {
  ORGANIZATION_NOT_FOUND: 'Organization not found',
  MEMBERS_FETCH_SUCCESS: 'Organization members fetched successfully',
  INVALID_UUID: 'Invalid organization ID'
};

@dependency()
export class FetchOrganizationMembersService {
  @inject(UUID) private uuid: UUID;

  async get(
    filter: FilterOrganizationmembersType,
    pagination: ApiPaginationParams
  ) {
    // Validate input
    this.validateInput(filter);

    const db = useDrizzle();

    const organization = await db.query.Organization.findFirst({
      where: eq(Organization.uuid, filter.current_organization_id!)
    });

    if (!organization) {
      return {
        data: [],
        message: ERROR_MESSAGES.ORGANIZATION_NOT_FOUND,
        status: HttpStatus.NOT_FOUND
      };
    }
    const { rows: members, rowCount } = await this.fetchMembers(
      db,
      filter,
      pagination
    );

    return {
      ...paginator(members, rowCount!, pagination),
      message: ERROR_MESSAGES.MEMBERS_FETCH_SUCCESS,
      status: HttpStatus.OK
    };
  }

  private validateInput(filter: FilterOrganizationmembersType) {
    if (!filter.current_organization_id) {
      throw new Error(ERROR_MESSAGES.INVALID_UUID);
    }
    this.uuid.validateUUID(filter.current_organization_id, {
      throwError: true
    });
  }

  private async fetchMembers(
    db: ReturnType<typeof useDrizzle>,
    filter: FilterOrganizationmembersType,
    pagination: ApiPaginationParams
  ) {
    const query = await this.buildMembersQuery(filter, db, pagination);

    return await db.execute(query);
  }

  private async buildMembersQuery(
    filter: FilterOrganizationmembersType,
    db: ReturnType<typeof useDrizzle>,
    pagination: ApiPaginationParams
  ) {
    const conditions = [sql`ORG.uuid = ${filter.current_organization_id}`];

    // Add search condition
    if (filter.q) {
      conditions.push(sql`(
        U.first_name ILIKE ${`%${filter.q}%`} OR
        U.last_name ILIKE ${`%${filter.q}%`} OR
        U.username ILIKE ${`%${filter.q}%`} OR
        U.email ILIKE ${`%${filter.q}%`}
      )`);
    }

    // Add filter conditions
    if (filter.is_active !== undefined) {
      conditions.push(sql`MEM.is_active = ${filter.is_active}`);
    }

    if (filter.department_id) {
      // conditions.push(sql`MEM.department_id = ${filter.department_id}`);
      const departmentsQuery = sql`
        select
        dm.user_id,
        dm.department_id
      from
        department_members as dm
        inner join departments dp on dp.id = dm.department_id
        and dp.uuid = ${filter.department_id}
      `;
      const { rows } = await db.execute<{
        user_id: number;
        department_id: number;
      }>(departmentsQuery);

      if (rows.length > 0) {
        const userIds = rows.map((row) => row.user_id);

        if (filter.existing_department_member_action === 'exclude') {
          conditions.push(
            sql`MEM.user_id NOT IN (${sql.join(userIds, sql`, `)})`
          );
        } else if (filter.existing_department_member_action === 'include') {
          conditions.push(sql`MEM.user_id IN (${sql.join(userIds, sql`, `)})`);
        }
      }
    }

    if (filter.designation_id) {
      conditions.push(sql`MEM.designation_id = ${filter.designation_id}`);
    }
    if (filter.workspace_id) {
      const membersQuery = sql<{
        user_id: number;
        workspace_id: number;
      }>`
          select
            wm.user_id,
            wm.workspace_id
          from
            organization_workspace_members as wm
            inner join organization_workspaces ws on wm.workspace_id = ws.id
            and ws.uuid = ${filter.workspace_id}
  `;
      const { rows } = await db.execute<{
        user_id: number;
        workspace_id: number;
      }>(membersQuery);

      if (filter.existing_workspace_member_action === 'exclude') {
        conditions.push(
          sql`MEM.user_id NOT IN (${sql.join(
            rows.map((row) => row.user_id),
            sql`, `
          )})`
        );
      } else if (filter.existing_workspace_member_action === 'include') {
        conditions.push(
          sql`MEM.user_id IN (${sql.join(
            rows.map((row) => row.user_id),
            sql`, `
          )})`
        );
      }
    }

    const conditionsSql = sql.join(conditions, sql` AND `);

    const whereClause = sql`WHERE ${conditionsSql}`;

    return sql`
      SELECT
        MEM.id,
        MEM.user_id,
        MEM.role,
        MEM.is_active,
        MEM.organization_id,
        MEM.date_joined,
        MEM.designation_id,
        MEM.department_id,
        COUNT(*) OVER() AS total_count,
        JSON_BUILD_OBJECT(
          'id', U.id,
          'first_name', U.first_name,
          'last_name', U.last_name,
          'username', U.username,
          'email', U.email,
          'avatar', U.avatar,
          'is_admin', U.is_admin
        ) AS user,
        JSON_BUILD_OBJECT(
          'id', DEP.id,
          'name', DEP.name,
          'description', DEP.description
        ) AS department,
        JSON_BUILD_OBJECT(
          'id', DES.id,
          'name', DES.name,
          'description', DES.description
        ) AS designation
      FROM
        organization_members MEM
        LEFT JOIN departments DEP ON DEP.id = MEM.department_id
        LEFT JOIN organization_member_designations DES ON DES.id = MEM.designation_id
        LEFT JOIN users U ON U.id = MEM.user_id
        INNER JOIN organizations ORG ON ORG.id = MEM.organization_id
      ${whereClause}
      ORDER BY
        LOWER(U.first_name) ASC
      LIMIT ${pagination.limit ?? Number.MAX_SAFE_INTEGER}
      OFFSET ${pagination.offset ?? 0}
    `;
  }
}
