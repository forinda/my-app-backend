import { OrganizationFinancialYear } from '@/db/schema';
import { useDrizzle } from '@/db';
import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import { and, eq, isNull } from 'drizzle-orm';
import { ApiError } from '@/common/errors/base';

@dependency()
export class FetchFinancialYearByIdService {
  async get(id: number, organization_id: number) {
    const db = useDrizzle();

    const financialYear = await db.query.OrganizationFinancialYear.findFirst({
      where: and(
        eq(OrganizationFinancialYear.id, id),
        eq(OrganizationFinancialYear.organization_id, organization_id),
        isNull(OrganizationFinancialYear.deleted_at)
      ),
      with: {
        quarters: true
      }
    });

    if (!financialYear) {
      throw new ApiError('Financial year not found', HttpStatus.NOT_FOUND, {});
    }

    return {
      data: financialYear,
      message: 'Financial year fetched successfully',
      status: HttpStatus.OK
    };
  }
}
