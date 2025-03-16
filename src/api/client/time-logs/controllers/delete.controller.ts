import { BaseDeleteController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';
import type { DeleteTimeLogType } from '../schema/schema';
import { deleteTimeLogSchema } from '../schema/schema';
import { userAudit } from '@/common/utils/user-request-audit';
import { createHttpResponse } from '@/common/utils/responder';
import { DeleteTimeLogService } from '../services/delete.service';

@Controller()
export class DeleteTimeLogController extends BaseDeleteController {
  @inject(DeleteTimeLogService)
  private service: DeleteTimeLogService;
  @ApiControllerMethod({
    bodySchema: deleteTimeLogSchema,
    auth: true,
    bodyBindOrgId: true,
    pathParamTransform: {
      id: 'time_log_id'
    },
    audit: userAudit('delete')
  })
  async delete({ res, body, user }: ApiRequestContext<DeleteTimeLogType>) {
    const feedback = await this.service.update({
      data: { ...body!, current_user_id: user!.id! }
    });

    return createHttpResponse(res, {
      ...feedback,
      statusCode: feedback.status
    });
  }
}
