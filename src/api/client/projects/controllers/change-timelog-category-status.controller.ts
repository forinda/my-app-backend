import { BasePostController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import { Dependency } from '@/common/di';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject, injectable } from 'inversify';

import type { ActivateOrDeactivateProjectTimeLogCategoryPayload } from '../schema/schema';
import { addUsersToProjectSchema } from '../schema/schema';
import { userAudit } from '@/common/utils/user-request-audit';
import { createHttpResponse } from '@/common/utils/responder';
import { ActivateOrDeactivateProjectTimeLogService } from '../services/change-timelog-category-status.service';

@injectable()
@Dependency()
@Controller()
export class ActivateOrDeactivateProjectTimeLogController extends BasePostController {
  @inject(ActivateOrDeactivateProjectTimeLogService)
  private service: ActivateOrDeactivateProjectTimeLogService;
  @ApiControllerMethod({
    bodySchema: addUsersToProjectSchema,
    auth: true,
    audit: userAudit('update'),
    bodyBindOrgId: true
  })
  async post({
    res,
    body
  }: ApiRequestContext<ActivateOrDeactivateProjectTimeLogCategoryPayload>) {
    const feedback = await this.service.changeStatus({ data: body! });

    return createHttpResponse(res, {
      ...feedback,
      statusCode: feedback.status
    });
  }
}
