import { OrganizationFinancialYear } from '@/db/schema';
import { useDrizzle } from '@/db';
import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import { type ApiPaginationParams, paginator } from '@/common/utils/pagination';
import { and, asc, eq, isNull, like } from 'drizzle-orm';
import type { FilterFinancialYearPayload } from '../schema/schema';

@dependency()
export class FetchFinancialYearsService {
  async get(
    organization_id: number,
    filters?: FilterFinancialYearPayload,
    pagination?: ApiPaginationParams
  ) {
    const db = useDrizzle();

    // Build where conditions dynamically
    const whereConditions = [
      eq(OrganizationFinancialYear.organization_id, organization_id),
      isNull(OrganizationFinancialYear.deleted_at)
    ];

    if (filters?.financial_year_type) {
      whereConditions.push(
        eq(
          OrganizationFinancialYear.financial_year_type,
          filters.financial_year_type
        )
      );
    }

    if (filters?.year) {
      whereConditions.push(
        like(OrganizationFinancialYear.financial_year, `%${filters.year}%`)
      );
    }

    const fetchCondition = and(...whereConditions);

    const totalItems = await db.$count(
      OrganizationFinancialYear,
      fetchCondition
    );

    const financialYears = await db.query.OrganizationFinancialYear.findMany({
      where: fetchCondition,
      with: { quarters: true },
      limit: pagination?.limit,
      offset: pagination?.offset,
      orderBy: [asc(OrganizationFinancialYear.created_at)]
    });

    return {
      ...paginator(financialYears, totalItems, pagination!),
      message: 'Financial years fetched successfully',
      status: HttpStatus.OK
    };
  }
}
