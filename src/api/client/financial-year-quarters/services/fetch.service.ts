import { OrganizationFinancialYearQuarter } from '@/db/schema';
import { useDrizzle } from '@/db';
import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import { type ApiPaginationParams, paginator } from '@/common/utils/pagination';
import { and, asc, eq, isNull } from 'drizzle-orm';

@dependency()
export class FetchFinancialYearQuartersService {
  async get(financial_year_id: number, pagination?: ApiPaginationParams) {
    const db = useDrizzle();

    const fetchCondition = and(
      eq(
        OrganizationFinancialYearQuarter.organization_financial_year_id,
        financial_year_id
      ),
      isNull(OrganizationFinancialYearQuarter.deleted_at)
    );

    const totalItems = await db.$count(
      OrganizationFinancialYearQuarter,
      fetchCondition
    );

    const quarters = await db.query.OrganizationFinancialYearQuarter.findMany({
      where: fetchCondition,
      limit: pagination?.limit,
      offset: pagination?.offset,
      orderBy: [asc(OrganizationFinancialYearQuarter.created_at)]
    });

    // Get the related financial year to include in the response
    const financialYear = await db.query.OrganizationFinancialYear.findFirst({
      where: eq(
        OrganizationFinancialYearQuarter.organization_financial_year_id,
        financial_year_id
      )
    });

    return {
      ...paginator(quarters, totalItems, pagination!),
      financialYear: financialYear || null,
      message: 'Financial year quarters fetched successfully',
      status: HttpStatus.OK
    };
  }
}
