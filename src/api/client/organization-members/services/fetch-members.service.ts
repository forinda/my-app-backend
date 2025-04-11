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
    const query = this.buildMembersQuery(filter, pagination);

    return await db.execute(query);
  }

  private buildMembersQuery(
    filter: FilterOrganizationmembersType,
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
      conditions.push(sql`MEM.department_id = ${filter.department_id}`);
    }

    if (filter.designation_id) {
      conditions.push(sql`MEM.designation_id = ${filter.designation_id}`);
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
