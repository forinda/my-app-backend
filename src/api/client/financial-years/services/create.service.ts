import { OrganizationFinancialYear } from '@/db/schema';
import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import { and, eq } from 'drizzle-orm';
import { ApiError } from '@/common/errors/base';
import {
  TransactionalService,
  type TransactionContext
} from '@/common/decorators/service-transaction';
import type { NewFinancialYearPayload } from '../schema/schema';
import type { InsertOrganizationFinancialYearInterface } from '@/db/schema/org-financial-years';

@dependency()
export class CreateFinancialYearService {
  @TransactionalService()
  async create({
    data,
    transaction
  }: TransactionContext<NewFinancialYearPayload>) {
    // Check if financial year with the same name exists for this organization
    const existingFY =
      await transaction!.query.OrganizationFinancialYear.findFirst({
        where: and(
          eq(OrganizationFinancialYear.organization_id, data.organization_id),
          eq(OrganizationFinancialYear.financial_year, data.financial_year)
        )
      });

    if (existingFY) {
      throw new ApiError(
        'Financial year with same name already exists',
        HttpStatus.CONFLICT,
        {}
      );
    }

    // Create the financial year
    const financialYear = (
      await transaction!
        .insert(OrganizationFinancialYear)
        .values(data as InsertOrganizationFinancialYearInterface)
        .returning()
        .execute()
    )[0];

    return {
      data: financialYear,
      message: 'Financial year created successfully',
      status: HttpStatus.CREATED
    };
  }
}
