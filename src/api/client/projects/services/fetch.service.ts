import { OrgProject } from '@/db/schema';
import { useDrizzle } from '@/db';
import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import type { ApiPaginationParams } from '@/common/utils/pagination';
import { and, asc, eq, ilike, or } from 'drizzle-orm';
import type { FetchProjectCategoryQueryPayload } from '../schema/schema';

@dependency()
export class FetchProjectsService {
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

  private buildConditions(
    organization_id: number,
    filters: FetchProjectCategoryQueryPayload
  ) {
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
    if (filters.project_id) {
      filterOptions.push(eq(OrgProject.uuid, filters.project_id));
    }

    return and(
      eq(OrgProject.organization_id, organization_id),
      ...filterOptions
    );
  }

  private buildRelations(
    shouldBuild: Pick<
      FetchProjectCategoryQueryPayload,
      'relations'
    >['relations']
  ) {
    const parsed = JSON.parse(
      (shouldBuild as unknown as string) ?? 'true'
    ) as boolean;

    console.log({ parsed });

    if (!parsed) return undefined;

    return {
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
    };
  }
  async get(
    organization_id: number,
    filters: FetchProjectCategoryQueryPayload,
    pagination?: ApiPaginationParams
  ) {
    const db = useDrizzle();
    const { limit, offset } = pagination || {};

    const finalFilter = this.buildConditions(organization_id, filters);
    const columns = this.buildColumns(filters.fields);
    const relations = this.buildRelations(filters.relations);
    // Fetch projects with pagination and related members
    const projects = await db.query.OrgProject.findMany({
      where: finalFilter,
      columns,
      with: relations,
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
