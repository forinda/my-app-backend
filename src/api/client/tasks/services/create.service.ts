import { inject, injectable } from 'inversify';
import type { NewTaskPayload } from '../schema/schema';

import { HttpStatus } from '@/common/http';
import { Dependency } from '@/common/di';
import {
  TransactionalService,
  type TransactionContext
} from '@/common/decorators/service-transaction';
import type { InsertOrgTaskInterface } from '@/db/schema';
import { OrgTask } from '@/db/schema';
import { TaskCreationAndUpdateCheckUtil } from '../utils/task-creation-checks';

@injectable()
@Dependency()
export class CreateTaskService {
  @inject(TaskCreationAndUpdateCheckUtil)
  private taskCreationChecks: TaskCreationAndUpdateCheckUtil;
  @TransactionalService()
  async create({ data, transaction }: TransactionContext<NewTaskPayload>) {
    await this.taskCreationChecks.runCreationOrUpdateChecks(
      'create',
      transaction!
    )(data);
    await transaction!
      .insert(OrgTask)
      .values(data as InsertOrgTaskInterface)
      .returning()
      .execute();

    return {
      data: {},
      status: HttpStatus.CREATED,
      message: 'Task created successfully'
    };
  }
}
