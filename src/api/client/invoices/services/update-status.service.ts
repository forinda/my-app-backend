import { OrgUserInvoice } from '@/db/schema';
import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import { and, eq } from 'drizzle-orm';
import { ApiError } from '@/common/errors/base';
import {
  TransactionalService,
  type TransactionContext
} from '@/common/decorators/service-transaction';
import type { UpdateInvoiceStatusPayload } from '../schema/schema';

@dependency()
export class UpdateInvoiceStatusService {
  @TransactionalService()
  async update({
    data,
    transaction,
    params
  }: TransactionContext<UpdateInvoiceStatusPayload> & {
    params: { id: number; organization_id: number };
  }) {
    const { id, organization_id } = params;

    // Check if invoice exists
    const existingInvoice = await transaction!.query.OrgUserInvoice.findFirst({
      where: and(
        eq(OrgUserInvoice.id, id),
        eq(OrgUserInvoice.organization_id, organization_id)
      )
    });

    if (!existingInvoice) {
      throw new ApiError('Invoice not found', HttpStatus.NOT_FOUND, {});
    }

    // Special validation for paid status
    if (data.status === 'paid' && !data.paid_date) {
      data.paid_date = new Date().toISOString().split('T')[0]; // Set current date if not provided
    }

    // Update the invoice status
    // const [updatedInvoice] =
    await transaction!
      .update(OrgUserInvoice)
      .set({
        invoice_status: data.status,
        updated_at: new Date().toISOString()
      })
      .where(eq(OrgUserInvoice.id, id))
      .returning();

    // Fetch the updated invoice with items
    const refreshedInvoice = await transaction!.query.OrgUserInvoice.findFirst({
      where: eq(OrgUserInvoice.id, id),
      with: {
        items: true,
        financial_year: true,
        organization: true
      }
    });

    return {
      data: refreshedInvoice,
      message: `Invoice status updated to ${data.status}`,
      status: HttpStatus.OK
    };
  }
}
