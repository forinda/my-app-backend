import { OrgUserInvoice } from '@/db/schema';
import { useDrizzle } from '@/db';
import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import { type ApiPaginationParams, paginator } from '@/common/utils/pagination';
import { and, between, desc, eq, gte, isNull, lte } from 'drizzle-orm';
import type { FilterInvoicePayload } from '../schema/schema';

@dependency()
export class FetchInvoicesService {
  async get(
    organization_id: number,
    filters?: FilterInvoicePayload,
    pagination?: ApiPaginationParams
  ) {
    const db = useDrizzle();

    // Build where conditions dynamically
    const whereConditions = [
      eq(OrgUserInvoice.organization_id, organization_id),
      isNull(OrgUserInvoice.deleted_at)
    ];

    // Apply filters if provided
    if (filters) {
      if (filters.financial_year_id) {
        whereConditions.push(
          eq(OrgUserInvoice.financial_year_id, filters.financial_year_id)
        );
      }

      //   if (filters.client_name) {
      //     whereConditions.push(
      //       ilike(OrgUserInvoice.client_name, `%${filters.client_name}%`)
      //     );
      //   }

      //   if (filters.client_email) {
      //     whereConditions.push(
      //       ilike(OrgUserInvoice.client_email, `%${filters.client_email}%`)
      //     );
      //   }

      if (filters.status) {
        whereConditions.push(eq(OrgUserInvoice.invoice_status, filters.status));
      }

      if (filters.start_date && filters.end_date) {
        whereConditions.push(
          between(
            OrgUserInvoice.invoice_date,
            filters.start_date,
            filters.end_date
          )
        );
      } else if (filters.start_date) {
        whereConditions.push(
          gte(OrgUserInvoice.invoice_date, filters.start_date)
        );
      } else if (filters.end_date) {
        whereConditions.push(
          lte(OrgUserInvoice.invoice_date, filters.end_date)
        );
      }

      if (
        filters.min_amount !== undefined &&
        filters.max_amount !== undefined
      ) {
        whereConditions.push(
          between(
            OrgUserInvoice.amount,
            filters.min_amount.toString(),
            filters.max_amount.toString()
          )
        );
      } else if (filters.min_amount !== undefined) {
        whereConditions.push(
          gte(OrgUserInvoice.amount, filters.min_amount.toString())
        );
      } else if (filters.max_amount !== undefined) {
        whereConditions.push(
          lte(OrgUserInvoice.amount, filters.max_amount.toString())
        );
      }
    }

    const fetchCondition = and(...whereConditions);

    const totalItems = await db.$count(OrgUserInvoice, fetchCondition);

    const invoices = await db.query.OrgUserInvoice.findMany({
      where: fetchCondition,
      with: {
        items: true,
        financial_year: true
      },
      limit: pagination?.limit,
      offset: pagination?.offset,
      orderBy: [desc(OrgUserInvoice.created_at)]
    });

    return {
      ...paginator(invoices, totalItems, pagination!),
      message: 'Invoices fetched successfully',
      status: HttpStatus.OK
    };
  }
}
