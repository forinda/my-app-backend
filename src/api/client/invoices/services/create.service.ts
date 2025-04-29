import type { InsertOrganizationUserInvoiceInterface } from '@/db/schema';
import {
  OrganizationMember,
  OrgUserInvoice,
  OrgUserInvoiceItem
} from '@/db/schema';
import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import { and, eq, isNull } from 'drizzle-orm';
import { ApiError } from '@/common/errors/base';
import {
  TransactionalService,
  type TransactionContext
} from '@/common/decorators/service-transaction';
import type { NewInvoicePayload } from '../schema/schema';
import { inject } from 'inversify';
import { SingleUserInvoiceProcessor } from '../utils/single-user-invoice-processor';

@dependency()
export class CreateInvoiceService {
  @inject(SingleUserInvoiceProcessor)
  private readonly singleUserInvoiceProcessor: SingleUserInvoiceProcessor;
  @TransactionalService()
  async create({ data, transaction }: TransactionContext<NewInvoicePayload>) {
    // Extract invoice items from the payload

    const organizationMembers =
      await transaction!.query.OrganizationMember.findMany({
        where: and(
          eq(OrganizationMember.organization_id, data.organization_id),
          eq(OrganizationMember.is_active, true),
          isNull(OrganizationMember.deleted_at)
        )
      });

    if (!organizationMembers || organizationMembers.length === 0) {
      throw new ApiError(
        'No active organization members found',
        HttpStatus.NOT_FOUND,
        {}
      );
    }
    let numberOfInvoices = 0;

    for (const [_, member] of organizationMembers.entries()) {
      const user = await this.singleUserInvoiceProcessor.processInvoiceForUser(
        {
          organization_id: data.organization_id,
          user_id: member.user_id,
          financial_quarter_id: data.financial_quarter_id
        },
        transaction!
      );

      if (user) {
        const invoiceData: InsertOrganizationUserInvoiceInterface = {
          amount: '' + user.total_invoice_amount,
          created_by: data.created_by!,
          due_date: data.due_date,
          financial_year_id: data.financial_year_id!,
          financial_year_quarter_id: data.financial_quarter_id,
          invoice_date: new Date().toISOString(),
          invoice_number: user.invoice_number,
          invoice_status: 'pending',
          tax_amount: '' + 0,
          user_id: user.user_id,
          paid_amount: '' + 0,
          discount_amount: '' + 0,
          updated_by: data.updated_by!,
          notes: data.notes,
          organization_id: data.organization_id
        };
        const [invoice] = await transaction!
          .insert(OrgUserInvoice)
          .values(invoiceData)
          .returning()
          .execute();

        const invoiceItems = user.invoice_items.map((item) => ({
          ...item,
          amount: '' + item.amount,
          organization_invoice_id: invoice.id,
          created_by: data.created_by!,
          updated_by: data.updated_by!,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));

        await transaction!
          .insert(OrgUserInvoiceItem)
          .values(invoiceItems)
          .execute();
        numberOfInvoices = _ + 1;
      }
    }

    return {
      data: {},
      message: `Invoices created successfully for ${numberOfInvoices} users`,
      status: HttpStatus.CREATED
    };
  }
}
