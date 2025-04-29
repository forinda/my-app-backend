import { OrganizationFinancialYear } from '@/db/schema';
import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import { and, eq, ne } from 'drizzle-orm';
import { ApiError } from '@/common/errors/base';
import {
  TransactionalService,
  type TransactionContext
} from '@/common/decorators/service-transaction';
import type { UpdateFinancialYearPayload } from '../schema/schema';

@dependency()
export class UpdateFinancialYearService {
  @TransactionalService()
  async update({
    data,
    transaction
  }: TransactionContext<UpdateFinancialYearPayload>) {
    // Check if financial year exists
    const existingFY =
      await transaction!.query.OrganizationFinancialYear.findFirst({
        where: eq(OrganizationFinancialYear.id, data.financial_year_id)
      });

    if (!existingFY) {
      throw new ApiError('Financial year not found', HttpStatus.NOT_FOUND, {});
    }

    // Check if new name would create a duplicate
    if (data.financial_year) {
      const duplicateName =
        await transaction!.query.OrganizationFinancialYear.findFirst({
          where: and(
            eq(
              OrganizationFinancialYear.organization_id,
              existingFY.organization_id
            ),
            eq(OrganizationFinancialYear.financial_year, data.financial_year),
            ne(OrganizationFinancialYear.id, data.financial_year_id) // not equal to the current id
          )
        });

      if (duplicateName) {
        throw new ApiError(
          'Financial year with that name already exists',
          HttpStatus.CONFLICT,
          {}
        );
      }
    }

    // Update the financial year
    const [updatedFY] = await transaction!
      .update(OrganizationFinancialYear)
      .set({
        ...data,
        updated_at: new Date().toISOString()
      })
      .where(eq(OrganizationFinancialYear.id, data.financial_year_id))
      .returning();

    return {
      data: updatedFY,
      message: 'Financial year updated successfully',
      status: HttpStatus.OK
    };
  }
}
