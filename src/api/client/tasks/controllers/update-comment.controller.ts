import { BasePutController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';

import type { UpdateTaskCommentPayload } from '../schema/schema';
import { updateTaskSchema } from '../schema/schema';
import { userAudit } from '@/common/utils/user-request-audit';
import { createHttpResponse } from '@/common/utils/responder';
import { UpdateTaskCommentService } from '../services/update-comment.service';

@Controller()
export class UpdateTaskCommentController extends BasePutController {
  @inject(UpdateTaskCommentService)
  private service: UpdateTaskCommentService;
  @ApiControllerMethod({
    audit: userAudit('update'),
    auth: true,
    bodyBindOrgId: true,
    bodySchema: updateTaskSchema,
    pathParamTransform: {
      id: 'workspace_id'
    }
  })
  async put({ res, body, user }: ApiRequestContext<UpdateTaskCommentPayload>) {
    const feedback = await this.service.update({
      data: { ...body!, current_user_id: user!.id! }
    });

    return createHttpResponse(res, {
      ...feedback,
      statusCode: feedback.status
    });
  }
}
