import { dependency } from '@/common/di';
import { ApiError } from '@/common/errors/base';
import { HttpStatus } from '@/common/http';
import { Logger } from '@/common/logger';
import type { DrizzleTransaction } from '@/db';
import { OrganizationMember, OrgUserTimeLog } from '@/db/schema';
import { and, eq, isNull } from 'drizzle-orm';
import { inject } from 'inversify';
import { InvoiceNumberGenerator } from './invoice-number-generator';
import { convertToNumber } from '@/common/utils/numbers';

type UserToProcess = {
  user_id: number;
  organization_id: number;
  financial_quarter_id?: number;
  financial_year_id?: number;
};

@dependency()
export class SingleUserInvoiceProcessor {
  @inject(Logger) private readonly logger: Logger;
  @inject(InvoiceNumberGenerator)
  private readonly invoiceNumberGenerator: InvoiceNumberGenerator;

  private async checkIfUserExists(
    user_id: number,
    organization_id: number,
    transaction: DrizzleTransaction
  ) {
    const userExists = await transaction.query.OrganizationMember.findFirst({
      where: and(
        eq(OrganizationMember.is_active, true),
        eq(OrganizationMember.user_id, user_id),
        eq(OrganizationMember.organization_id, organization_id),
        isNull(OrganizationMember.deleted_at)
      ),
      with: {
        user: {
          columns: {
            id: true,
            first_name: true,
            last_name: true
          }
        }
      }
    });

    return userExists;
  }

  async processInvoiceForUser(
    data: UserToProcess,
    transaction: DrizzleTransaction
  ) {
    const exists = await this.checkIfUserExists(
      data.user_id,
      data.organization_id,
      transaction
    );

    if (!exists) {
      this.logger.log(
        `User with ID ${data.user_id} does not exist in organization ${data.organization_id}.`
      );
      // throw new Error('User does not exist.');
    }
    const financialYear =
      await transaction.query.OrganizationFinancialYear.findFirst({
        where: and(
          eq(OrganizationMember.user_id, data.user_id),
          eq(OrganizationMember.organization_id, data.organization_id),
          isNull(OrganizationMember.deleted_at)
        ),
        with: {
          quarters: true
        }
      });

    if (!financialYear) {
      this.logger.log(
        `Financial year not found for user ${data.user_id} in organization ${data.organization_id}.`
      );
      throw new Error('Financial year not found.');
    }
    const quarterExist = financialYear.quarters.some(
      (quarter) => quarter.id === data.financial_quarter_id
    );

    if (!quarterExist) {
      this.logger.log(
        `Quarter with ID ${data.financial_quarter_id} does not exist for user ${data.user_id} in organization ${data.organization_id}.`
      );
      throw new ApiError('Quarter does not exist.', HttpStatus.BAD_REQUEST, {
        user_id: data.user_id,
        organization_id: data.organization_id
      });
    }

    const nextInvoiceNumber =
      await this.invoiceNumberGenerator.generateInvoiceNumber(
        data.organization_id,
        transaction
      );
    const invoiceItems = await transaction.query.OrgUserTimeLog.findMany({
      where: and(
        eq(OrgUserTimeLog.user_id, data.user_id),
        eq(OrgUserTimeLog.approval_status, 'invoiced'),
        eq(OrgUserTimeLog.organization_id, data.organization_id),
        isNull(OrgUserTimeLog.deleted_at)
      )
    });
    const hourlyRate = convertToNumber(exists?.current_salary);

    if (Number.isNaN(hourlyRate) || hourlyRate <= 1) {
      const name = `${exists?.user.first_name} ${exists?.user.last_name}`;

      this.logger.log(`Hourly rate is invalid for user: ${name}`);
      throw new ApiError(
        `Looks like salary profile has not been created for ${name}. Hourly rate is invalid.`,
        HttpStatus.BAD_REQUEST,
        {
          user_id: data.user_id,
          organization_id: data.organization_id
        }
      );
    }

    const invoiceitems = invoiceItems.map((item) => ({
      amount:
        this.convertTimeToHours('' + item.hours, '' + item.minutes) *
        hourlyRate,
      task_log_id: item.id
    }));

    const totalInvoiceAmount = invoiceitems.reduce(
      (acc, item) => acc + item.amount,
      0
    );

    return {
      ...data,
      invoice_number: nextInvoiceNumber,
      invoice_items: invoiceitems,
      total_invoice_amount: totalInvoiceAmount
    };
  }

  private convertTimeToHours(hours: string, minutes: string): number {
    return convertToNumber(hours) + convertToNumber(minutes) / 60;
  }
}
