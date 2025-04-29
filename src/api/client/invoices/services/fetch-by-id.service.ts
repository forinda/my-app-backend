import { OrganizationInvoice } from '@/db/schema';
import { useDrizzle } from '@/db';
import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import { and, eq, isNull } from 'drizzle-orm';
import { ApiError } from '@/common/errors/base';

@dependency()
export class FetchInvoiceByIdService {
  async get(id: number, organization_id: number) {
    const db = useDrizzle();

    const invoice = await db.query.OrganizationInvoice.findFirst({
      where: and(
        eq(OrganizationInvoice.id, id),
        eq(OrganizationInvoice.organization_id, organization_id),
        isNull(OrganizationInvoice.deleted_at)
      ),
      with: {
        items: true,
        financial_year: true,
        organization: {
          columns: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            logo: true
          }
        },
        creator: {
          columns: {
            id: true,
            first_name: true,
            last_name: true,
            email: true
          }
        }
      }
    });

    if (!invoice) {
      throw new ApiError('Invoice not found', HttpStatus.NOT_FOUND, {});
    }

    return {
      data: invoice,
      message: 'Invoice fetched successfully',
      status: HttpStatus.OK
    };
  }
}
