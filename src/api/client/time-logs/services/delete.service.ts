import type { DeleteTimeLogType } from '../schema/schema';
import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import {
  TransactionalService,
  type TransactionContext
} from '@/common/decorators/service-transaction';
import { OrgUserTimeLog } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { ApiError } from '@/common/errors/base';

@dependency()
export class DeleteTimeLogService {
  @TransactionalService()
  async update({
    data,
    transaction
  }: TransactionContext<DeleteTimeLogType & { current_user_id: number }>) {
    const timeLog = await transaction!.query.OrgUserTimeLog.findFirst({
      where: and(
        eq(OrgUserTimeLog.id, data.time_log_id),
        eq(OrgUserTimeLog.organization_id, data.organization_id),
        eq(OrgUserTimeLog.user_id, data.current_user_id)
      )
    });

    if (!timeLog) {
      throw new ApiError('Time log not found', HttpStatus.NOT_FOUND);
    }
    await transaction!
      .update(OrgUserTimeLog)
      .set({
        deleted_by: data.deleted_by,
        deleted_at: new Date().toISOString()
      })
      .where(eq(OrgUserTimeLog.id, data.time_log_id))
      .execute();

    return {
      data: {},
      status: HttpStatus.OK,
      message: 'Time log deleted successfully'
    };
  }
}
