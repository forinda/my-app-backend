import { Organization, OrganizationMember } from '@/db/schema';
import { useDrizzle } from '@/db';
import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import { asc, eq, inArray } from 'drizzle-orm';

@dependency()
export class FetchOrganizationByIdService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async get(user_id: number, org_id: string) {
    const db = useDrizzle();
    const organizationmembers = await db.query.OrganizationMember.findMany({
      where: eq(OrganizationMember.user_id, user_id)
    });

    if (organizationmembers.length === 0) {
      return {
        data: null,
        message: 'No organizations found',
        status: HttpStatus.OK
      };
    }
    const organizationIds = organizationmembers.map(
      (organizationmember) => organizationmember.organization_id
    );
    const organizations = await db.query.Organization.findFirst({
      where: inArray(Organization.id, organizationIds),
      with: {
        workspaces: {
          columns: { name: true, id: true, is_active: true, description: true },
          with: {
            members: {
              columns: {
                id: true,
                user_id: true,
                is_active: true
              },
              with: {
                user: {
                  columns: {
                    first_name: true,
                    last_name: true,
                    username: true,
                    avatar: true,
                    email: true
                  }
                }
              }
            }
          }
        },
        members: {
          columns: {
            role: true,
            user_id: true,
            is_active: true,
            date_joined: true
          },
          with: {
            user: {
              columns: {
                first_name: true,
                last_name: true,
                username: true,
                avatar: true,
                email: true
              }
            },
            department: {
              columns: {
                name: true,
                id: true
              }
            }
          }
        },
        projects: {
          columns: {
            name: true,
            id: true,
            is_active: true
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
