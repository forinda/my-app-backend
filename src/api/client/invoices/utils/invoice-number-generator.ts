import { dependency } from '@/common/di';
import { convertToNumber } from '@/common/utils/numbers';
import type { DrizzleTransaction } from '@/db';
import { OrgUserInvoice } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

@dependency()
export class InvoiceNumberGenerator {
  async generateInvoiceNumber(
    organization_id: number,
    transaction: DrizzleTransaction
  ) {
    const invoiceCount = await transaction.$count(
      OrgUserInvoice,
      eq(OrgUserInvoice.organization_id, organization_id)
    );

    if (invoiceCount === 0) {
      return `INV-0001`;
    } else {
      const lastInvoice = await transaction.query.OrgUserInvoice.findFirst({
        columns: {
          invoice_number: true,
          organization_id: true
        },
        where: eq(OrgUserInvoice.organization_id, organization_id),
        orderBy: [desc(OrgUserInvoice.created_at)]
      });

      return `INV-${String(convertToNumber(lastInvoice!.invoice_number.split('-')[1]) + 1).padStart(4, '0')}`;
    }
  }
}
