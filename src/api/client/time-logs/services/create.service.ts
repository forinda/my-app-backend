import { inject } from 'inversify';
import type { CreateTimeLogType } from '../schema/schema';

import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import {
  TransactionalService,
  type TransactionContext
} from '@/common/decorators/service-transaction';
import { OrgUserTimeLog } from '@/db/schema';
import { TimeLogPrerequisiteProcessor } from '../utils/prerequisite-checks';

@dependency()
export class CreateTimeLogService {
  @inject(TimeLogPrerequisiteProcessor)
  private readonly _prerequisiteProcessor: TimeLogPrerequisiteProcessor;
  @TransactionalService()
  async create({
    data,
    transaction
  }: TransactionContext<CreateTimeLogType & { current_user_id: number }>) {
    await this._prerequisiteProcessor.processPreCreation(data, transaction!);
    await transaction!
      .insert(OrgUserTimeLog)
      .values({ ...data, user_id: data.current_user_id })
      .returning()
      .execute();

    return {
      data: {},
      status: HttpStatus.CREATED,
      message: 'Time log created successfully'
    };
  }
}
