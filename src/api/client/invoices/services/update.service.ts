import { OrgUserInvoice } from '@/db/schema';
import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import { and, eq } from 'drizzle-orm';
import { ApiError } from '@/common/errors/base';
import {
  TransactionalService,
  type TransactionContext
} from '@/common/decorators/service-transaction';
import type { UpdateInvoicePayload } from '../schema/schema';

@dependency()
export class UpdateInvoiceService {
  @TransactionalService()
  async update({
    data,
    transaction,
    params
  }: TransactionContext<UpdateInvoicePayload> & {
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

    // Check if invoice is already finalized (paid, partially_paid)
    if (existingInvoice.invoice_status === 'paid') {
      throw new ApiError(
        'Cannot update a paid or partially paid invoice',
        HttpStatus.CONFLICT,
        {}
      );
    }

    // If invoice number is being changed, check for duplicates
    // if (
    //   data.invoice_number &&
    //   data.invoice_number !== existingInvoice.invoice_number
    // ) {
    //   const duplicateInvoiceNumber =
    //     await transaction!.query.OrgUserInvoice.findFirst({
    //       where: and(
    //         eq(OrgUserInvoice.organization_id, organization_id),
    //         eq(OrgUserInvoice.invoice_number, data.invoice_number),
    //         eq(OrgUserInvoice.id, id) // not the current invoice
    //       )
    //     });

    //   if (duplicateInvoiceNumber) {
    //     throw new ApiError(
    //       'Invoice with that number already exists',
    //       HttpStatus.CONFLICT,
    //       {}
    //     );
    //   }
    // }

    // Extract items if included

    // Update the invoice
    // const [updatedInvoice] =
    await transaction!
      .update(OrgUserInvoice)
      .set({
        ...data,
        updated_at: new Date().toISOString()
      } as any)
      .where(eq(OrgUserInvoice.id, id))
      .returning();

    // Update invoice items if provided

    // Fetch the updated invoice with items
    const refreshedInvoice = await transaction!.query.OrgUserInvoice.findFirst({
      where: eq(OrgUserInvoice.id, id),
      with: {
        items: true,
        financial_year: true
      }
    });

    return {
      data: refreshedInvoice,
      message: 'Invoice updated successfully',
      status: HttpStatus.OK
    };
  }
}
