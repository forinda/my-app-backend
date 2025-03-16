import type { AddTaskCommentPayload } from '../schema/schema';

import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import {
  TransactionalService,
  type TransactionContext
} from '@/common/decorators/service-transaction';
import { and, eq } from 'drizzle-orm';
import { OrgTask, OrgTaskComment } from '@/db/schema';
import { ApiError } from '@/common/errors/base';

@dependency()
export class AddTaskCommentService {
  @TransactionalService()
  async add({ data, transaction }: TransactionContext<AddTaskCommentPayload>) {
    const task = await transaction!.query.OrgTask.findFirst({
      where: and(
        eq(OrgTask.id, data.task_id),
        eq(OrgTask.organization_id, data.organization_id)
      )
    });

    if (!task) {
      throw new ApiError('Task not found', HttpStatus.NOT_FOUND);
    }
    await transaction!.insert(OrgTaskComment).values(data).execute();

    return {
      data: {},
      status: HttpStatus.CREATED,
      message: 'Comment added successfully'
    };
  }
}
