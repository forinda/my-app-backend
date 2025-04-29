import type { UpdateTimelogStatusType } from '../schema/schema';
import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import {
  TransactionalService,
  type TransactionContext
} from '@/common/decorators/service-transaction';
import { OrgUserTimeLog } from '@/db/schema';
import { eq, and, inArray, ne, notInArray } from 'drizzle-orm';
import { ApiError } from '@/common/errors/base';

@dependency()
export class UpdateTimeLogStatusService {
  @TransactionalService()
  async update({
    data,
    transaction
  }: TransactionContext<
    UpdateTimelogStatusType & { current_user_id: number }
  >) {
    const timeLogs = await transaction!.query.OrgUserTimeLog.findMany({
      where: and(
        inArray(OrgUserTimeLog.id, data.timelog_ids),
        eq(OrgUserTimeLog.organization_id, data.organization_id),
        notInArray(OrgUserTimeLog.invoice_status, ['invoiced', 'paid'])
      )
    });
    const allTasksOfCurrentUser = timeLogs.filter(
      (timeLog) => timeLog.user_id === data.current_user_id
    );

    if (allTasksOfCurrentUser.length > 0) {
      throw new ApiError(
        'You are not allowed to update status of your own time logs',
        HttpStatus.FORBIDDEN
      );
    }

    await transaction!
      .update(OrgUserTimeLog)
      .set({
        approval_status: data.status,
        updated_by: data.updated_by
      })
      .where(
        and(
          inArray(OrgUserTimeLog.id, data.timelog_ids),
          eq(OrgUserTimeLog.organization_id, data.organization_id),
          ne(OrgUserTimeLog.approval_status, data.status)
        )
      )
      .execute();

    return {
      data: {},
      status: HttpStatus.OK,
      message: 'Time log status updated successfully'
    };
  }
}
