import { OrganizationFinancialYear } from '@/db/schema';
import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import { and, between, eq } from 'drizzle-orm';
import { ApiError } from '@/common/errors/base';
import {
  TransactionalService,
  type TransactionContext
} from '@/common/decorators/service-transaction';
import type { NewFinancialYearPayload } from '../schema/schema';
import moment from 'moment';

@dependency()
export class CreateFinancialYearService {
  @TransactionalService()
  async create({
    data,
    transaction
  }: TransactionContext<NewFinancialYearPayload>) {
    const preExistingFY =
      await transaction!.query.OrganizationFinancialYear.findFirst({
        where: and(
          eq(OrganizationFinancialYear.organization_id, data.organization_id),
          between(
            OrganizationFinancialYear.start_date,
            moment(data.start_date).toISOString(),
            moment(data.end_date).toISOString()
          ),
          between(
            OrganizationFinancialYear.end_date,
            moment(data.start_date).toISOString(),
            moment(data.end_date).toISOString()
          )
        )
      });

    if (preExistingFY) {
      throw new ApiError(
        'Financial year with same date range already exists',
        HttpStatus.CONFLICT,
        {}
      );
    }
    // Check if start date is before end date
    if (moment(data.start_date).isAfter(moment(data.end_date))) {
      throw new ApiError(
        'Start date cannot be after end date',
        HttpStatus.BAD_REQUEST,
        {}
      );
    }
    // Check if start date is in the future
    // if (moment(data.start_date).isBefore(moment().startOf('day'))) {
    //   throw new ApiError(
    //     'Start date cannot be in the past',
    //     HttpStatus.BAD_REQUEST,
    //     {}
    //   );
    // }
    // Check if financial year with the same name exists for this organization
    const existingFY =
      await transaction!.query.OrganizationFinancialYear.findFirst({
        where: and(
          eq(OrganizationFinancialYear.organization_id, data.organization_id),
          eq(OrganizationFinancialYear.financial_year, data.financial_year)
        )
      });

    if (existingFY) {
      throw new ApiError(
        'Financial year with same name already exists',
        HttpStatus.CONFLICT,
        {}
      );
    }

    // Create the financial year
    const [financialYear] = await transaction!
      .insert(OrganizationFinancialYear)
      .values({
        ...data,
        created_by: data.created_by!,
        updated_by: data.created_by!
      })
      .returning()
      .execute();

    return {
      data: financialYear,
      message: 'Financial year created successfully',
      status: HttpStatus.CREATED
    };
  }
}
