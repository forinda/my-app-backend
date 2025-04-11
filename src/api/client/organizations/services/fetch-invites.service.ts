import { OrganizationInvite } from '@/db/schema';
import { useDrizzle } from '@/db';
import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import type { ApiPaginationParams } from '@/common/utils/pagination';
import type { SQL } from 'drizzle-orm';
import { and, eq, ilike, or } from 'drizzle-orm';
import type { FetchOrganizationInvitesInputType } from '../schema/schema';

@dependency()
export class FetchOrganizationInvitesService {
  async get(
    organization_id: number,
    filters: FetchOrganizationInvitesInputType,
    _?: ApiPaginationParams
  ) {
    const db = useDrizzle();
    const orgCondition = eq(
      OrganizationInvite.organization_id,
      organization_id
    );
    const conditions: SQL<any>[] = [];

    if (filters.designation_id) {
      conditions.push(
        eq(OrganizationInvite.designation_id, filters.designation_id)
      );
    }
    if (filters.role) {
      conditions.push(eq(OrganizationInvite.role, filters.role));
    }
    if (filters.status) {
      conditions.push(eq(OrganizationInvite.status, filters.status));
    }
    if (filters.q) {
      const likeQuery = `%${filters.q}%`;

      conditions.push(or(ilike(OrganizationInvite.email, likeQuery))!);
    }
    const invites = await db.query.OrganizationInvite.findMany({
      where: and(orgCondition, ...conditions),
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
