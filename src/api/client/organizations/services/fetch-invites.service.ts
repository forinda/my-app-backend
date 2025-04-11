import { OrganizationInvite } from '@/db/schema';
import { useDrizzle } from '@/db';
import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import type { ApiPaginationParams } from '@/common/utils/pagination';
import { eq } from 'drizzle-orm';

@dependency()
export class FetchOrganizationInvitesService {
  async get(organization_id: number, _?: ApiPaginationParams) {
    const db = useDrizzle();
    const invites = await db.query.OrganizationInvite.findMany({
      where: eq(OrganizationInvite.organization_id, organization_id),
      with: {
        designation: {
          columns: {
            id: true,
            name: true
          }
        },
        user: {
          columns: {
            id: true,
            first_name: true,
            last_name: true
          }
        },
        creator: {
          columns: {
            id: true,
            first_name: true,
            last_name: true
          }
        }
      },
      limit: _?.limit,
      offset: _?.offset
    });

    if (invites.length === 0) {
      return {
        data: [],
        message: 'No invites found',
        status: HttpStatus.NOT_FOUND
      };
    }

    return {
      data: invites,
      message: 'Organizations fetched successfully',
      status: HttpStatus.OK
    };
  }
}
