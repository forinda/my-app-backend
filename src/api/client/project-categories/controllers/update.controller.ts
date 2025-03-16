import { BasePutController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';

import type { UpdateProjectCategoryPayloadType } from '../schema/schema';
import { updateProjectCategorySchema } from '../schema/schema';
import { UpdateProjectCategoryService } from '../services/update.service';
import { userAudit } from '@/common/utils/user-request-audit';
import { createHttpResponse } from '@/common/utils/responder';

@Controller()
export class UpdateProjectCategoryController extends BasePutController {
  @inject(UpdateProjectCategoryService)
  private service: UpdateProjectCategoryService;
  @ApiControllerMethod({
    bodySchema: updateProjectCategorySchema,
    auth: true,
    bodyBindOrgId: true,
    pathParamTransform: {
      id: 'category_id'
    },
    audit: userAudit('update')
  })
  async put({
    res,
    body
  }: ApiRequestContext<UpdateProjectCategoryPayloadType>) {
    const feedback = await this.service.update({ data: body! });

    return createHttpResponse(res, {
      ...feedback,
      statusCode: feedback.status
    });
  }
}
