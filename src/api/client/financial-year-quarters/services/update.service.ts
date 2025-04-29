import {
  OrganizationFinancialYear,
  OrganizationFinancialYearQuarter
} from '@/db/schema';
import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import { and, eq, ne } from 'drizzle-orm';
import { ApiError } from '@/common/errors/base';
import {
  TransactionalService,
  type TransactionContext
} from '@/common/decorators/service-transaction';
import type { UpdateFinancialYearQuarterPayload } from '../schema/schema';

@dependency()
export class UpdateFinancialYearQuarterService {
  @TransactionalService()
  async update({
    data,
    transaction
  }: TransactionContext<UpdateFinancialYearQuarterPayload>) {
    // Check if quarter exists for this financial year
    const existingQuarter =
      await transaction!.query.OrganizationFinancialYearQuarter.findFirst({
        where: and(
          eq(OrganizationFinancialYearQuarter.id, data.quarter_id),
          eq(
            OrganizationFinancialYearQuarter.organization_financial_year_id,
            data.organization_financial_year_id
          )
        )
      });

    const financialYear =
      await transaction!.query.OrganizationFinancialYear.findFirst({
        where: eq(
          OrganizationFinancialYear.id,
          data.organization_financial_year_id
        )
      });

    if (!existingQuarter) {
      throw new ApiError(
        'Financial year quarter not found',
        HttpStatus.NOT_FOUND,
        {}
      );
    }

    // If quarter type is being changed, check for uniqueness
    if (data.quarter && data.quarter !== existingQuarter.quarter) {
      const duplicateQuarter =
        await transaction!.query.OrganizationFinancialYearQuarter.findFirst({
          where: and(
            eq(
              OrganizationFinancialYearQuarter.organization_financial_year_id,
              data.organization_financial_year_id
            ),
            eq(OrganizationFinancialYearQuarter.quarter, data.quarter),
            ne(OrganizationFinancialYearQuarter.id, data.quarter_id) // not equal to current ID
          )
        });

      if (duplicateQuarter) {
        throw new ApiError(
          'Quarter with that name already exists for this financial year',
          HttpStatus.CONFLICT,
          {}
        );
      }
    }
    // Check if the start and end dates are valid and within the financial year range
    const startDate = new Date(data.start_date!);
    const endDate = new Date(data.end_date!);
    const fyStartDate = new Date(financialYear!.start_date);
    const fyEndDate = new Date(financialYear!.end_date);

    if (startDate < fyStartDate || endDate > fyEndDate) {
      throw new ApiError(
        'Quarter dates must be within the financial year range',
        HttpStatus.BAD_REQUEST,
        {}
      );
    }
    // Update the quarter
    const [updatedQuarter] = await transaction!
      .update(OrganizationFinancialYearQuarter)
      .set({
        ...data,
        updated_at: new Date().toISOString()
      })
      .where(eq(OrganizationFinancialYearQuarter.id, data.quarter_id))
      .returning();

    return {
      data: updatedQuarter,
      message: 'Financial year quarter updated successfully',
      status: HttpStatus.OK
    };
  }
}
