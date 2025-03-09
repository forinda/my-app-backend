import { BasePostController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import { Dependency } from '@/common/di';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject, injectable } from 'inversify';

import type { UnAssignTaskPayload } from '../schema/schema';
import { unAssignTaskSchema } from '../schema/schema';
import { userAudit } from '@/common/utils/user-request-audit';
import { createHttpResponse } from '@/common/utils/responder';
import { UnAssignTaskService } from '../services/unassign.service';

@injectable()
@Dependency()
@Controller()
export class UnAssignTaskController extends BasePostController {
  @inject(UnAssignTaskService)
  private service: UnAssignTaskService;
  @ApiControllerMethod({
    bodySchema: unAssignTaskSchema,
    pathParamTransform: {
      id: 'task_id'
    },
    auth: true,
    audit: userAudit('update'),
    bodyBindOrgId: true
  })
  async post({ res, body }: ApiRequestContext<UnAssignTaskPayload>) {
    const feedback = await this.service.unassign({ data: body! });

    return createHttpResponse(res, {
      ...feedback,
      statusCode: feedback.status
    });
  }
}
