import { Organization, OrganizationMember, User } from '@/db/schema';
import { useDrizzle } from '@/db';
import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import { and, eq } from 'drizzle-orm';
import type { FetchSingleOrganizationMemberType } from '../schema';

@dependency()
export class FetchOrganizationMemberByIdService {
  async get(org_id: number, filter: FetchSingleOrganizationMemberType) {
    const db = useDrizzle();

    const org = await db.query.Organization.findFirst({
      where: eq(Organization.id, org_id),
      columns: {
        id: true,
        name: true,
        is_active: true
      }
    });

    if (!org) {
      return {
        message: 'Organization not found',
        status: HttpStatus.NOT_FOUND
      };
    }
    const existingUser = await db.query.User.findFirst({
      where: eq(User.uuid, filter.user_id!),
      columns: {
        id: true,
        uuid: true
      }
    });

    if (!existingUser) {
      return {
        message: 'User not found',
        status: HttpStatus.NOT_FOUND
      };
    }
    const user_id = existingUser.id;
    const member = await db.query.OrganizationMember.findFirst({
      where: and(
        eq(OrganizationMember.user_id, user_id!),
        eq(OrganizationMember.organization_id, org_id)
      ),
      with: {
        department: {
          columns: {
            id: true,
            name: true
          }
        },
        designation: {
          columns: {
            id: true,
            name: true,
            is_active: true
          }
        },
        organization: {
          columns: {
            id: true,
            name: true,
            is_active: true
          }
        },
        user: {
          columns: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            avatar: true,
            uuid: true
          }
        }
      }
    });

    return {
      data: member,
      message: 'Organization member fetched successfully',
      status: HttpStatus.OK
    };
  }
}
