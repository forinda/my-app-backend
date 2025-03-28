import { OrgProject } from '@/db/schema';
import { useDrizzle } from '@/db';
import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import type { ApiPaginationParams } from '@/common/utils/pagination';
import { and, asc, eq, ilike, or } from 'drizzle-orm';
import type { FetchProjectCategoryQueryPayload } from '../schema/schema';

@dependency()
export class FetchProjectsService {
  async get(
    organization_id: number,
    filters: FetchProjectCategoryQueryPayload,
    pagination?: ApiPaginationParams
  ) {
    const db = useDrizzle();
    const { limit, offset } = pagination || {};

    const filterOptions = [];

    if (filters?.category_id) {
      filterOptions.push(eq(OrgProject.category_id, filters.category_id));
    }

    if (filters?.q) {
      const searchQuery = `%${filters.q}%`;

      filterOptions.push(
        or(
          ilike(OrgProject.name, searchQuery),
          ilike(OrgProject.description, searchQuery)
        )
      );
    }

    // Build the final filter condition
    const finalFilter = and(
      eq(OrgProject.organization_id, organization_id),
      ...filterOptions
    );

    // Fetch projects with pagination and related members
    const projects = await db.query.OrgProject.findMany({
      where: finalFilter,
      with: {
        members: {
          with: {
            user: {
              columns: {
                username: true,
                email: true,
                first_name: true,
                last_name: true,
                phone_number: true,
                avatar: true
              }
            }
          }
        },
        category: {
          columns: {
            id: true,
            name: true
          }
        },
        tasks: {
          columns: {
            id: true,
            status: true,
            start_date: true,
            due_date: true,
            end_date: true,
            story_points: true
          }
        }
      },
      limit,
      offset,
      orderBy: [asc(OrgProject.created_at)]
    });

    return {
      data: projects,
      message: 'Projects fetched successfully',
      status: HttpStatus.OK
    };
  }
}
