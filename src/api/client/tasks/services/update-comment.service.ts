import type { UpdateTaskCommentPayload } from '../schema/schema';
import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import {
  TransactionalService,
  type TransactionContext
} from '@/common/decorators/service-transaction';
import { eq } from 'drizzle-orm';
import { OrgTaskComment } from '@/db/schema';
import { ApiError } from '@/common/errors/base';

@dependency()
export class UpdateTaskCommentService {
  @TransactionalService()
  async update({
    data,
    transaction
  }: TransactionContext<
    UpdateTaskCommentPayload & {
      current_user_id: number;
    }
  >) {
    const comment = await transaction!.query.OrgTaskComment.findFirst({
      where: eq(OrgTaskComment.id, data.comment_id)
    });

    // if (!task) {
    //   throw new ApiError('Task not found', HttpStatus.NOT_FOUND);
    // }
    if (!comment) {
      throw new ApiError('Comment not found', HttpStatus.NOT_FOUND);
    }
    if (comment.created_by !== data.current_user_id) {
      throw new ApiError(
        'You are not allowed to update this comment',
        HttpStatus.FORBIDDEN
      );
    }

    await transaction!.update(OrgTaskComment).set(data).execute();

    return {
      data: {},
      status: HttpStatus.OK,
      message: 'Comment updated successfully'
    };
  }
}
