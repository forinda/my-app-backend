import { OrganizationInvoice } from '@/db/schema';
import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import { and, eq } from 'drizzle-orm';
import { ApiError } from '@/common/errors/base';
import {
  TransactionalService,
  type TransactionContext
} from '@/common/decorators/service-transaction';

@dependency()
export class DeleteInvoiceService {
  @TransactionalService()
  async delete({
    transaction,
    params,
    user_id
  }: TransactionContext<{}> & {
    params: { id: number; organization_id: number };
    user_id: number;
  }) {
    const { id, organization_id } = params;

    // Check if invoice exists
    const existingInvoice =
      await transaction!.query.OrganizationInvoice.findFirst({
        where: and(
          eq(OrganizationInvoice.id, id),
          eq(OrganizationInvoice.organization_id, organization_id)
        )
      });

    if (!existingInvoice) {
      throw new ApiError('Invoice not found', HttpStatus.NOT_FOUND, {});
    }

    // Check if invoice is already paid
    if (existingInvoice.status === 'paid') {
      throw new ApiError(
        'Cannot delete a paid invoice',
        HttpStatus.CONFLICT,
        {}
      );
    }

    // Soft delete the invoice
    const [deletedInvoice] = await transaction!
      .update(OrganizationInvoice)
      .set({
        deleted_by: user_id,
        deleted_at: new Date()
      })
      .where(eq(OrganizationInvoice.id, id))
      .returning();

    return {
      data: deletedInvoice,
      message: 'Invoice deleted successfully',
      status: HttpStatus.OK
    };
  }
}
