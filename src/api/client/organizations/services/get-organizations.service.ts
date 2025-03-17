import { Organization, OrganizationMember } from '@/db/schema';
import { useDrizzle } from '@/db';
import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import type { ApiPaginationParams } from '@/common/utils/pagination';
import { asc, eq, inArray } from 'drizzle-orm';

@dependency()
export class FetchUserOrganizationsService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async get(user_id: number, _?: ApiPaginationParams) {
    const db = useDrizzle();
    const organizationmembers = await db.query.OrganizationMember.findMany({
      where: eq(OrganizationMember.user_id, user_id)
    });

    if (organizationmembers.length === 0) {
      return {
        data: [],
        message: 'No organizations found',
        status: HttpStatus.OK
      };
    }
    const organizationIds = organizationmembers.map(
      (organizationmember) => organizationmember.organization_id
    );
    const organizations = await db.query.Organization.findMany({
      where: inArray(Organization.id, organizationIds),
      with: {
        workspaces: {
          columns: { name: true }
        },
        members: {
          columns: {
            role: true,
            user_id: true
          }
        }
      },
      orderBy: [asc(Organization.name)]
    });

    return {
      data: organizations,
      message: 'Organizations fetched successfully',
      status: HttpStatus.OK
    };
  }
}
