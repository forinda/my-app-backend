import { OrganizationFinancialYearQuarter } from '@/db/schema';
import { useDrizzle } from '@/db';
import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import { and, eq, isNull } from 'drizzle-orm';
import { ApiError } from '@/common/errors/base';

@dependency()
export class FetchFinancialYearQuarterByIdService {
  async get(id: number, financial_year_id: number) {
    const db = useDrizzle();

    const quarter = await db.query.OrganizationFinancialYearQuarter.findFirst({
      where: and(
        eq(OrganizationFinancialYearQuarter.id, id),
        eq(
          OrganizationFinancialYearQuarter.organization_financial_year_id,
          financial_year_id
        ),
        isNull(OrganizationFinancialYearQuarter.deleted_at)
      )
    });

    if (!quarter) {
      throw new ApiError(
        'Financial year quarter not found',
        HttpStatus.NOT_FOUND,
        {}
      );
    }

    return {
      data: quarter,
      message: 'Financial year quarter fetched successfully',
      status: HttpStatus.OK
    };
  }
}
