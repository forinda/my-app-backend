import type { FinancialYearType } from '@/db/schema';
import {
  OrganizationFinancialYear,
  OrganizationFinancialYearQuarter
} from '@/db/schema';
import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import { and, eq, isNull } from 'drizzle-orm';
import { ApiError } from '@/common/errors/base';
import {
  TransactionalService,
  type TransactionContext
} from '@/common/decorators/service-transaction';
import type { NewFinancialYearQuarterPayload } from '../schema/schema';
import type { InsertOrganizationFinancialYearQuarterInterface } from '@/db/schema/org-financial-year-quarter';

@dependency()
export class CreateFinancialYearQuarterService {
  @TransactionalService()
  async create({
    data,
    transaction
  }: TransactionContext<NewFinancialYearQuarterPayload>) {
    // Get the financial year to check its type

    const financialYear =
      await transaction!.query.OrganizationFinancialYear.findFirst({
        where: and(
          eq(OrganizationFinancialYear.id, data.financial_year_id),
          eq(OrganizationFinancialYear.organization_id, data.organization_id)
        )
      });

    if (!financialYear) {
      throw new ApiError('Financial year not found', HttpStatus.NOT_FOUND, {});
    }

    // Check if a quarter with the same name already exists for this financial year
    const existingQuarter =
      await transaction!.query.OrganizationFinancialYearQuarter.findFirst({
        where: and(
          eq(
            OrganizationFinancialYearQuarter.organization_financial_year_id,
            data.financial_year_id
          ),
          eq(OrganizationFinancialYearQuarter.quarter, data.quarter)
        )
      });

    if (existingQuarter) {
      throw new ApiError(
        'Quarter already exists for this financial year',
        HttpStatus.CONFLICT,
        {}
      );
    }

    // Count existing quarters to validate against the financial year type

    const quarterCount = await transaction!.$count(
      OrganizationFinancialYearQuarter,
      and(
        eq(
          OrganizationFinancialYearQuarter.organization_financial_year_id,
          data.financial_year_id
        ),
        isNull(OrganizationFinancialYearQuarter.deleted_at)
      )
    );

    // Validate based on financial year type
    const quarterLimit = getQuarterLimitByFyType(
      financialYear.financial_year_type
    );

    if (quarterCount >= quarterLimit) {
      throw new ApiError(
        `Cannot add more than ${quarterLimit} quarters for ${financialYear.financial_year_type} financial year`,
        HttpStatus.BAD_REQUEST,
        {}
      );
    }
    const quarterData: InsertOrganizationFinancialYearQuarterInterface = {
      organization_financial_year_id: data.financial_year_id,
      //   organization_id: data.organization_id,
      quarter: data.quarter,
      start_date: data.start_date,
      end_date: data.end_date,
      created_by: data.created_by!,
      updated_by: data.updated_by!,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    // Create the quarter
    const [quarter] = await transaction!
      .insert(OrganizationFinancialYearQuarter)
      .values(quarterData)
      .returning()
      .execute();

    return {
      data: quarter,
      message: 'Financial year quarter created successfully',
      status: HttpStatus.CREATED
    };
  }
}

// Helper function to determine quarter limit based on financial year type
function getQuarterLimitByFyType(financialYearType: FinancialYearType): number {
  switch (financialYearType) {
    case 'quarterly':
      return 4; // Q1, Q2, Q3, Q4

    case 'biannual':
      return 2; // First half, Second half

    case 'annual':
      return 1; // Full year

    default:
      return 4;
  }
}
