import { injectable } from 'inversify';
import type { UpdateTimeLogType } from '../schema/schema';
import { HttpStatus } from '@/common/http';
import { Dependency } from '@/common/di';
import {
  TransactionalService,
  type TransactionContext
} from '@/common/decorators/service-transaction';
import { ApiError } from '@/common/errors/base';
import { OrgUserTimeLog } from '@/db/schema';
import { eq } from 'drizzle-orm';

@injectable()
@Dependency()
export class UpdateTimeLogService {
  @TransactionalService()
  async update({
    data: { time_log_id: title_id, ...data },
    transaction
  }: TransactionContext<UpdateTimeLogType>) {
    const exisiting = await transaction!.query.OrgUserTimeLog.findFirst({
      where: eq(OrgUserTimeLog.id, title_id)
    });

    return {
      data: {},
      status: HttpStatus.OK,
      message: 'Time log updated successfully'
    };
  }
}
