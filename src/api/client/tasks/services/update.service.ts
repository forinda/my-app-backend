import { inject } from 'inversify';
import type { UpdateTaskPayload } from '../schema/schema';

import { eq } from 'drizzle-orm';

import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import {
  TransactionalService,
  type TransactionContext
} from '@/common/decorators/service-transaction';
import type { InsertOrgTaskInterface } from '@/db/schema';
import { OrgTask } from '@/db/schema';
import { TaskCreationAndUpdateCheckUtil } from '../utils/task-creation-checks';

@dependency()
export class UpdateTaskService {
  @inject(TaskCreationAndUpdateCheckUtil)
  private taskCreationChecks: TaskCreationAndUpdateCheckUtil;
  @TransactionalService()
  async update({ data, transaction }: TransactionContext<UpdateTaskPayload>) {
    const res = await this.taskCreationChecks.runCreationOrUpdateChecks(
      'update',
      transaction!
    )(data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { task_id: _, ...rest } = data;

    await transaction!
      .update(OrgTask)
      .set({
        ...rest,
        workspace_id: res.workspace!.id
      } as InsertOrgTaskInterface)
      .where(eq(OrgTask.id, data.task_id!))
      .execute();

    return {
      data: {},
      status: HttpStatus.OK,
      message: 'Task updated successfully'
    };
  }
}
