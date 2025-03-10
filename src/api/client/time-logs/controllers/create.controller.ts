import { BasePostController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import { Dependency } from '@/common/di';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject, injectable } from 'inversify';

import type { CreateTimeLogType } from '../schema/schema';
import { newTimeLogSchema } from '../schema/schema';
import { CreateTimeLogService } from '../services/create.service';
import { userAudit } from '@/common/utils/user-request-audit';
import { createHttpResponse } from '@/common/utils/responder';

@injectable()
@Dependency()
@Controller()
export class CreateTimeLogController extends BasePostController {
  @inject(CreateTimeLogService)
  private service: CreateTimeLogService;
  @ApiControllerMethod({
    bodySchema: newTimeLogSchema,
    auth: true,
    bodyBindOrgId: true,
    audit: userAudit('create')
  })
  async post({ res, body, user }: ApiRequestContext<CreateTimeLogType>) {
    const feedback = await this.service.create({
      data: { ...body!, current_user_id: user!.id! }
    });

    return createHttpResponse(res, {
      ...feedback,
      statusCode: feedback.status
    });
  }
}
