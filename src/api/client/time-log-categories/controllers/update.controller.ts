import { BasePutController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import { Dependency } from '@/common/di';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject, injectable } from 'inversify';

import type { UpdateTimeLogCategoryType } from '../schema/schema';
import { updateTimeLogCategorySchema } from '../schema/schema';
import { UpdateTimeLogCategoryService } from '../services/update.service';
import { userAudit } from '@/common/utils/user-request-audit';
import { createHttpResponse } from '@/common/utils/responder';

@injectable()
@Dependency()
@Controller()
export class UpdateProjectCategoryController extends BasePutController {
  @inject(UpdateTimeLogCategoryService)
  private service: UpdateTimeLogCategoryService;
  @ApiControllerMethod({
    bodySchema: updateTimeLogCategorySchema,
    auth: true,
    bodyBindOrgId: true,
    pathParamTransform: {
      id: 'category_id'
    },
    audit: userAudit('update')
  })
  async put({ res, body }: ApiRequestContext<UpdateTimeLogCategoryType>) {
    const feedback = await this.service.update({ data: body! });

    return createHttpResponse(res, {
      ...feedback,
      statusCode: feedback.status
    });
  }
}
