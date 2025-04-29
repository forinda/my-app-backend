import { OrganizationFinancialYear } from '@/db/schema';
import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import { and, eq } from 'drizzle-orm';
import { ApiError } from '@/common/errors/base';
import {
  TransactionalService,
  type TransactionContext
} from '@/common/decorators/service-transaction';
import type { DeleteFinancialYearPayload } from '../schema/schema';

@dependency()
export class DeleteFinancialYearService {
  @TransactionalService()
  async delete({
    transaction,
    data
  }: TransactionContext<DeleteFinancialYearPayload>) {
    // Check if financial year exists
    const existingFY =
      await transaction!.query.OrganizationFinancialYear.findFirst({
        where: and(
          eq(OrganizationFinancialYear.id, data.financial_year_id),
          eq(OrganizationFinancialYear.organization_id, data.organization_id)
        )
      });

    if (!existingFY) {
      throw new ApiError('Financial year not found', HttpStatus.NOT_FOUND, {});
    }

    const [deletedFY] = await transaction!
      .update(OrganizationFinancialYear)
      .set({
        deleted_by: data.deleted_by,
        deleted_at: new Date().toISOString()
      })
      .where(
        and(
          eq(OrganizationFinancialYear.id, data.financial_year_id),
          eq(OrganizationFinancialYear.organization_id, data.organization_id)
        )
      )
      .returning();

    return {
      data: deletedFY,
      message: 'Financial year deleted successfully',
      status: HttpStatus.OK
    };
  }
}
