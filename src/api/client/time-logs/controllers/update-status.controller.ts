import { BasePutController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';

import type { UpdateTimelogStatusType } from '../schema/schema';
import { updateTimelogStatusSchema } from '../schema/schema';
import { userAudit } from '@/common/utils/user-request-audit';
import { createHttpResponse } from '@/common/utils/responder';
import { UpdateTimeLogStatusService } from '../services/update-status.service';

@Controller()
export class UpdateTimeLogStatusController extends BasePutController {
  @inject(UpdateTimeLogStatusService)
  private service: UpdateTimeLogStatusService;
  @ApiControllerMethod({
    bodySchema: updateTimelogStatusSchema,
    auth: true,
    bodyBindOrgId: true,
    audit: userAudit('update')
  })
  async put({ res, body, user }: ApiRequestContext<UpdateTimelogStatusType>) {
    const feedback = await this.service.update({
      data: { ...body!, current_user_id: user!.id! }
    });

    return createHttpResponse(res, {
      ...feedback,
      statusCode: feedback.status
    });
  }
}
