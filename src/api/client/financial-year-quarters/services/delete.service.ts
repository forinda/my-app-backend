import { OrganizationFinancialYearQuarter } from '@/db/schema';
import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import { and, eq } from 'drizzle-orm';
import { ApiError } from '@/common/errors/base';
import {
  TransactionalService,
  type TransactionContext
} from '@/common/decorators/service-transaction';
import type { DeleteFinancialYearQuarterPayload } from '../../financial-years/schema/schema';

@dependency()
export class DeleteFinancialYearQuarterService {
  @TransactionalService()
  async delete({
    transaction,
    data
  }: TransactionContext<DeleteFinancialYearQuarterPayload>) {
    // Check if quarter exists for this financial year
    const existingQuarter =
      await transaction!.query.OrganizationFinancialYearQuarter.findFirst({
        where: and(
          eq(OrganizationFinancialYearQuarter.id, data.quarter_id),
          eq(
            OrganizationFinancialYearQuarter.organization_financial_year_id,
            data.financial_year_id
          )
        )
      });

    if (!existingQuarter) {
      throw new ApiError(
        'Financial year quarter not found',
        HttpStatus.NOT_FOUND,
        {}
      );
    }

    // Soft delete the quarter
    const [deletedQuarter] = await transaction!
      .update(OrganizationFinancialYearQuarter)
      .set({
        deleted_by: data.deleted_by,
        deleted_at: new Date().toISOString()
      })
      .where(eq(OrganizationFinancialYearQuarter.id, data.quarter_id))
      .returning();

    return {
      data: deletedQuarter,
      message: 'Financial year quarter deleted successfully',
      status: HttpStatus.OK
    };
  }
}
