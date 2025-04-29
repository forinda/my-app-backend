import { OrganizationInvoice, OrganizationInvoiceItem } from '@/db/schema';
import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import { and, eq, sql } from 'drizzle-orm';
import { ApiError } from '@/common/errors/base';
import {
  TransactionalService,
  type TransactionContext
} from '@/common/decorators/service-transaction';
import type { NewInvoicePayload } from '../schema/schema';
import type {
  InsertOrganizationInvoiceInterface,
  InsertOrganizationInvoiceItemInterface
} from '@/db/schema/org-invoices';

@dependency()
export class CreateInvoiceService {
  @TransactionalService()
  async create({ data, transaction }: TransactionContext<NewInvoicePayload>) {
    // Extract invoice items from the payload
    const { items, ...invoiceData } = data;

    // Generate invoice number if not provided
    if (!invoiceData.invoice_number) {
      // Get the current year for the prefix
      const currentYear = new Date().getFullYear();

      // Find the last invoice number for this year and organization
      const yearPrefix = `INV-${currentYear}-`;

      // Get the max invoice number that matches the prefix
      const result = await transaction!.execute(
        sql`SELECT MAX(invoice_number) as max_number FROM organization_invoices 
            WHERE organization_id = ${invoiceData.organization_id} 
            AND invoice_number LIKE ${yearPrefix + '%'}`
      );

      let maxNumber = 0;

      if (result.length > 0 && result[0].max_number) {
        // Extract the numeric part after the prefix
        const lastNumber = result[0].max_number.substring(yearPrefix.length);

        maxNumber = parseInt(lastNumber, 10) || 0;
      }

      // Create the new invoice number with padded zeros (e.g., INV-2023-00001)
      invoiceData.invoice_number = `${yearPrefix}${String(maxNumber + 1).padStart(5, '0')}`;
    } else {
      // If invoice number is provided, check for duplicates
      const existingInvoice =
        await transaction!.query.OrganizationInvoice.findFirst({
          where: and(
            eq(OrganizationInvoice.organization_id, data.organization_id),
            eq(OrganizationInvoice.invoice_number, invoiceData.invoice_number)
          )
        });

      if (existingInvoice) {
        throw new ApiError(
          'Invoice with same number already exists',
          HttpStatus.CONFLICT,
          {}
        );
      }
    }

    // Create the invoice
    const [invoice] = await transaction!
      .insert(OrganizationInvoice)
      .values({
        ...invoiceData,
        created_at: new Date(),
        updated_at: new Date()
      } as InsertOrganizationInvoiceInterface)
      .returning();

    // Create invoice items
    const invoiceItemsData = items.map((item) => ({
      ...item,
      invoice_id: invoice.id,
      created_by: data.created_by!,
      updated_by: data.updated_by!,
      created_at: new Date(),
      updated_at: new Date()
    })) as InsertOrganizationInvoiceItemInterface[];

    await transaction!.insert(OrganizationInvoiceItem).values(invoiceItemsData);

    // Fetch the complete invoice with items
    const createdInvoice =
      await transaction!.query.OrganizationInvoice.findFirst({
        where: eq(OrganizationInvoice.id, invoice.id),
        with: {
          items: true
        }
      });

    return {
      data: createdInvoice,
      message: 'Invoice created successfully',
      status: HttpStatus.CREATED
    };
  }
}
