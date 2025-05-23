import { BasePutController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';

import type { UpdateTimeLogType } from '../schema/schema';
import { updateTimeLogSchema } from '../schema/schema';
import { UpdateTimeLogService } from '../services/update.service';
import { userAudit } from '@/common/utils/user-request-audit';
import { createHttpResponse } from '@/common/utils/responder';

@Controller()
export class UpdateTimeLogController extends BasePutController {
  @inject(UpdateTimeLogService)
  private service: UpdateTimeLogService;
  @ApiControllerMethod({
    bodySchema: updateTimeLogSchema,
    auth: true,
    bodyBindOrgId: true,
    pathParamTransform: {
      id: 'time_log_id'
    },
    audit: userAudit('update')
  })
  async put({ res, body, user }: ApiRequestContext<UpdateTimeLogType>) {
    const feedback = await this.service.update({
      data: { ...body!, current_user_id: user!.id! }
    });

    return createHttpResponse(res, {
      ...feedback,
      statusCode: feedback.status
    });
  }
}
