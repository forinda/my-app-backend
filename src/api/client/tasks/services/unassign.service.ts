import { inject, injectable } from 'inversify';
import type { UnAssignTaskPayload } from '../schema/schema';

import { HttpStatus } from '@/common/http';
import { Dependency } from '@/common/di';
import {
  TransactionalService,
  type TransactionContext
} from '@/common/decorators/service-transaction';
import { OrgTask } from '@/db/schema';
import { TaskCreationAndUpdateCheckUtil } from '../utils/task-creation-checks';
import { eq } from 'drizzle-orm';

@injectable()
@Dependency()
export class UnAssignTaskService {
  @inject(TaskCreationAndUpdateCheckUtil)
  private taskCreationChecks: TaskCreationAndUpdateCheckUtil;
  @TransactionalService()
  async unassign({
    data,
    transaction
  }: TransactionContext<UnAssignTaskPayload>) {
    await this.taskCreationChecks.runUnAssignChecks(transaction!)(data);
    await transaction!
      .update(OrgTask)
      .set({ assignee_id: null })
      .where(eq(OrgTask.id, data.task_id))
      .returning()
      .execute();

    return {
      data: {},
      status: HttpStatus.OK,
      message: 'Task unassigned successfully'
    };
  }
}
