import { inject } from 'inversify';
import type { UpdateTimeLogType } from '../schema/schema';
import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import {
  TransactionalService,
  type TransactionContext
} from '@/common/decorators/service-transaction';
import { OrgUserTimeLog } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { TimeLogPrerequisiteProcessor } from '../utils/prerequisite-checks';

@dependency()
export class UpdateTimeLogService {
  @inject(TimeLogPrerequisiteProcessor)
  private readonly _prerequisiteProcessor: TimeLogPrerequisiteProcessor;
  @TransactionalService()
  async update({
    data,
    transaction
  }: TransactionContext<UpdateTimeLogType & { current_user_id: number }>) {
    await this._prerequisiteProcessor.processPreUpdate(data, transaction!);

    await transaction!
      .update(OrgUserTimeLog)
      .set(data)
      .where(eq(OrgUserTimeLog.id, data.time_log_id))
      .execute();

    return {
      data: {},
      status: HttpStatus.OK,
      message: 'Time log updated successfully'
    };
  }
}
