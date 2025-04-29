import { OrganizationInvoice } from '@/db/schema';
import { useDrizzle } from '@/db';
import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import { type ApiPaginationParams, paginator } from '@/common/utils/pagination';
import {
  and,
  asc,
  between,
  desc,
  eq,
  gte,
  ilike,
  isNull,
  lte
} from 'drizzle-orm';
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
      eq(OrganizationInvoice.organization_id, organization_id),
      isNull(OrganizationInvoice.deleted_at)
    ];

    // Apply filters if provided
    if (filters) {
      if (filters.financial_year_id) {
        whereConditions.push(
          eq(OrganizationInvoice.financial_year_id, filters.financial_year_id)
        );
      }

      if (filters.client_name) {
        whereConditions.push(
          ilike(OrganizationInvoice.client_name, `%${filters.client_name}%`)
        );
      }

      if (filters.client_email) {
        whereConditions.push(
          ilike(OrganizationInvoice.client_email, `%${filters.client_email}%`)
        );
      }

      if (filters.status) {
        whereConditions.push(eq(OrganizationInvoice.status, filters.status));
      }

      if (filters.start_date && filters.end_date) {
        whereConditions.push(
          between(
            OrganizationInvoice.issue_date,
            filters.start_date,
            filters.end_date
          )
        );
      } else if (filters.start_date) {
        whereConditions.push(
          gte(OrganizationInvoice.issue_date, filters.start_date)
        );
      } else if (filters.end_date) {
        whereConditions.push(
          lte(OrganizationInvoice.issue_date, filters.end_date)
        );
      }

      if (
        filters.min_amount !== undefined &&
        filters.max_amount !== undefined
      ) {
        whereConditions.push(
          between(
            OrganizationInvoice.total_amount,
            filters.min_amount.toString(),
            filters.max_amount.toString()
          )
        );
      } else if (filters.min_amount !== undefined) {
        whereConditions.push(
          gte(OrganizationInvoice.total_amount, filters.min_amount.toString())
        );
      } else if (filters.max_amount !== undefined) {
        whereConditions.push(
          lte(OrganizationInvoice.total_amount, filters.max_amount.toString())
        );
      }
    }

    const fetchCondition = and(...whereConditions);

    const totalItems = await db.$count(OrganizationInvoice, fetchCondition);

    const invoices = await db.query.OrganizationInvoice.findMany({
      where: fetchCondition,
      with: {
        items: true,
        financial_year: true
      },
      limit: pagination?.limit,
      offset: pagination?.offset,
      orderBy: [desc(OrganizationInvoice.created_at)]
    });

    return {
      ...paginator(invoices, totalItems, pagination!),
      message: 'Invoices fetched successfully',
      status: HttpStatus.OK
    };
  }
}
