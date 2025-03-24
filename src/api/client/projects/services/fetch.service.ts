import { OrgProject } from '@/db/schema';
import { useDrizzle } from '@/db';
import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import type { ApiPaginationParams } from '@/common/utils/pagination';
import { and, asc, eq, ilike, or } from 'drizzle-orm';
import type { BareObject } from '@/common/interfaces/helpers';
import { inject } from 'inversify';
import { SchemaValidator } from '@/common/schema/validator';
import { fetchProjectCategoryQuerySchema } from '../schema/schema';

@dependency()
export class FetchProjectsService {
  @inject(SchemaValidator) private validator: SchemaValidator;

  async get(
    organization_id: number,
    query: BareObject,
    pagination?: ApiPaginationParams
  ) {
    const db = useDrizzle();
    const { limit, offset } = pagination || {};

    // Validate and extract filter options from the query
    const filters = this.validator.validate(
      fetchProjectCategoryQuerySchema,
      query
    );
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
      with: { members: true },
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
