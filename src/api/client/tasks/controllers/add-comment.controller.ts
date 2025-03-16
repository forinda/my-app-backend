import { BasePutController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';
import type { AddTaskCommentPayload } from '../schema/schema';
import { updateTaskSchema } from '../schema/schema';
import { userAudit } from '@/common/utils/user-request-audit';
import { createHttpResponse } from '@/common/utils/responder';
import { AddTaskCommentService } from '../services/add-comment.service';

@Controller()
export class AddTaskCommentController extends BasePutController {
  @inject(AddTaskCommentService)
  private service: AddTaskCommentService;
  @ApiControllerMethod({
    audit: userAudit('create'),
    auth: true,
    bodyBindOrgId: true,
    bodySchema: updateTaskSchema
  })
  async put({ res, body }: ApiRequestContext<AddTaskCommentPayload>) {
    const feedback = await this.service.add({ data: body! });

    return createHttpResponse(res, {
      ...feedback,
      statusCode: feedback.status
    });
  }
}
