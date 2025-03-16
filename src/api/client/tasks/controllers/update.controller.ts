import { BasePutController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';

import type { UpdateTaskPayload } from '../schema/schema';
import { updateTaskSchema } from '../schema/schema';
import { UpdateTaskService } from '../services/update.service';
import { userAudit } from '@/common/utils/user-request-audit';
import { createHttpResponse } from '@/common/utils/responder';

@Controller()
export class UpdateTaskController extends BasePutController {
  @inject(UpdateTaskService)
  private service: UpdateTaskService;
  @ApiControllerMethod({
    audit: userAudit('update'),
    auth: true,
    bodyBindOrgId: true,
    bodySchema: updateTaskSchema,
    pathParamTransform: {
      id: 'workspace_id'
    }
  })
  async put({ res, body }: ApiRequestContext<UpdateTaskPayload>) {
    const feedback = await this.service.update({ data: body! });

    return createHttpResponse(res, {
      ...feedback,
      statusCode: feedback.status
    });
  }
}
