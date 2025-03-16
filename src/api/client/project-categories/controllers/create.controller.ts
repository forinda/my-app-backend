import { BasePostController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';

import type { CreateProductCategoryPayloadType } from '../schema/schema';
import { newProjectCategorySchema } from '../schema/schema';
import { CreateProjectCategoryService } from '../services/create.service';
import { userAudit } from '@/common/utils/user-request-audit';
import { createHttpResponse } from '@/common/utils/responder';

@Controller()
export class CreateProjectCategoryController extends BasePostController {
  @inject(CreateProjectCategoryService)
  private service: CreateProjectCategoryService;
  @ApiControllerMethod({
    bodySchema: newProjectCategorySchema,
    auth: true,
    bodyBindOrgId: true,
    audit: userAudit('create')
  })
  async post({
    res,
    body
  }: ApiRequestContext<CreateProductCategoryPayloadType>) {
    const feedback = await this.service.create({ data: body! });

    return createHttpResponse(res, {
      ...feedback,
      statusCode: feedback.status
    });
  }
}
