import { BasePostController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import { Dependency } from '@/common/di';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject, injectable } from 'inversify';

import type { AssignTaskPayload } from '../schema/schema';
import { newTaskSchema } from '../schema/schema';
import { userAudit } from '@/common/utils/user-request-audit';
import { createHttpResponse } from '@/common/utils/responder';
import { AssignTaskService } from '../services/asign.service';

@injectable()
@Dependency()
@Controller()
export class AssignTaskController extends BasePostController {
  @inject(AssignTaskService)
  private service: AssignTaskService;
  @ApiControllerMethod({
    bodySchema: newTaskSchema,
    pathParamTransform: {
      id: 'task_id'
    },
    auth: true,
    audit: userAudit('create'),
    bodyBindOrgId: true
  })
  async post({ res, body }: ApiRequestContext<AssignTaskPayload>) {
    const feedback = await this.service.assign({ data: body! });

    return createHttpResponse(res, {
      ...feedback,
      statusCode: feedback.status
    });
  }
}
