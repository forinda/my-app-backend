import { OrgUserInvoice } from '@/db/schema';
import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import { and, eq } from 'drizzle-orm';
import { ApiError } from '@/common/errors/base';
import {
  TransactionalService,
  type TransactionContext
} from '@/common/decorators/service-transaction';
import type { DeleteInvoicePayload } from '../schema/schema';

@dependency()
export class DeleteInvoiceService {
  @TransactionalService()
  async delete({
    transaction,
    data
  }: TransactionContext<DeleteInvoicePayload>) {
    // Check if invoice exists
    const existingInvoice = await transaction!.query.OrgUserInvoice.findFirst({
      where: and(
        eq(OrgUserInvoice.id, data.invoice_id),
        eq(OrgUserInvoice.organization_id, data.organization_id)
      )
    });

    if (!existingInvoice) {
      throw new ApiError('Invoice not found', HttpStatus.NOT_FOUND, {});
    }

    // Check if invoice is already paid
    if (existingInvoice.invoice_status === 'paid') {
      throw new ApiError(
        'Cannot delete a paid invoice',
        HttpStatus.CONFLICT,
        {}
      );
    }

    // Soft delete the invoice
    const [deletedInvoice] = await transaction!
      .update(OrgUserInvoice)
      .set({
        deleted_by: data.deleted_by!,
        deleted_at: new Date().toISOString()
      })
      .where(eq(OrgUserInvoice.id, data.invoice_id))
      .returning();

    return {
      data: deletedInvoice,
      message: 'Invoice deleted successfully',
      status: HttpStatus.OK
    };
  }
}
