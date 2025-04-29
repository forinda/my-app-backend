import { OrganizationInvoice, OrganizationInvoiceItem } from '@/db/schema';
import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import { and, eq } from 'drizzle-orm';
import { ApiError } from '@/common/errors/base';
import {
  TransactionalService,
  type TransactionContext
} from '@/common/decorators/service-transaction';
import type { UpdateInvoicePayload } from '../schema/schema';
import type { InsertOrganizationInvoiceItemInterface } from '@/db/schema/org-invoices';

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

    // Check if invoice is already finalized (paid, partially_paid)
    if (
      existingInvoice.status === 'paid' ||
      existingInvoice.status === 'partially_paid'
    ) {
      throw new ApiError(
        'Cannot update a paid or partially paid invoice',
        HttpStatus.CONFLICT,
        {}
      );
    }

    // If invoice number is being changed, check for duplicates
    if (
      data.invoice_number &&
      data.invoice_number !== existingInvoice.invoice_number
    ) {
      const duplicateInvoiceNumber =
        await transaction!.query.OrganizationInvoice.findFirst({
          where: and(
            eq(OrganizationInvoice.organization_id, organization_id),
            eq(OrganizationInvoice.invoice_number, data.invoice_number),
            eq(OrganizationInvoice.id, id, true) // not the current invoice
          )
        });

      if (duplicateInvoiceNumber) {
        throw new ApiError(
          'Invoice with that number already exists',
          HttpStatus.CONFLICT,
          {}
        );
      }
    }

    // Extract items if included
    const { items, ...invoiceData } = data;

    // Update the invoice
    const [updatedInvoice] = await transaction!
      .update(OrganizationInvoice)
      .set({
        ...invoiceData,
        updated_at: new Date()
      })
      .where(eq(OrganizationInvoice.id, id))
      .returning();

    // Update invoice items if provided
    if (items && items.length > 0) {
      // Delete existing items
      await transaction!
        .delete(OrganizationInvoiceItem)
        .where(eq(OrganizationInvoiceItem.invoice_id, id));

      // Insert new items
      const invoiceItemsData = items.map((item) => ({
        ...item,
        invoice_id: id,
        created_by: data.updated_by!,
        updated_by: data.updated_by!,
        created_at: new Date(),
        updated_at: new Date()
      })) as InsertOrganizationInvoiceItemInterface[];

      await transaction!
        .insert(OrganizationInvoiceItem)
        .values(invoiceItemsData);
    }

    // Fetch the updated invoice with items
    const refreshedInvoice =
      await transaction!.query.OrganizationInvoice.findFirst({
        where: eq(OrganizationInvoice.id, id),
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
