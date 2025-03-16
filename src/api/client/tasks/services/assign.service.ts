import { inject } from 'inversify';
import type { AssignTaskPayload } from '../schema/schema';

import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import {
  TransactionalService,
  type TransactionContext
} from '@/common/decorators/service-transaction';
import { OrgTask } from '@/db/schema';
import { TaskCreationAndUpdateCheckUtil } from '../utils/task-creation-checks';
import { eq } from 'drizzle-orm';

@dependency()
export class AssignTaskService {
  @inject(TaskCreationAndUpdateCheckUtil)
  private taskCreationChecks: TaskCreationAndUpdateCheckUtil;
  @TransactionalService()
  async assign({ data, transaction }: TransactionContext<AssignTaskPayload>) {
    await this.taskCreationChecks.runAssignChecks(transaction!)(data);
    await transaction!
      .update(OrgTask)
      .set({ assignee_id: data.assignee_id })
      .where(eq(OrgTask.id, data.task_id))
      .returning()
      .execute();

    return {
      data: {},
      status: HttpStatus.OK,
      message: 'Task assigned successfully'
    };
  }
}
