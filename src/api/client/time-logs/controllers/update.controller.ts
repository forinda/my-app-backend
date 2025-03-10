import { BasePutController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import { Dependency } from '@/common/di';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject, injectable } from 'inversify';

import type { UpdateTimeLogType } from '../schema/schema';
import { updateTimeLogSchema } from '../schema/schema';
import { UpdateTimeLogService } from '../services/update.service';
import { userAudit } from '@/common/utils/user-request-audit';
import { createHttpResponse } from '@/common/utils/responder';

@injectable()
@Dependency()
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
  async put({ res, body }: ApiRequestContext<UpdateTimeLogType>) {
    const feedback = await this.service.update({ data: body! });

    return createHttpResponse(res, {
      ...feedback,
      statusCode: feedback.status
    });
  }
}
