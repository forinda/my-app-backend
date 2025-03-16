import { BasePostController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';
import type { AddProjectTimeLogCategoryPayload } from '../schema/schema';
import { addUsersToProjectSchema } from '../schema/schema';
import { userAudit } from '@/common/utils/user-request-audit';
import { createHttpResponse } from '@/common/utils/responder';
import { AddProjectTimeLogCategoryService } from '../services/add-time-log-category.service';

@Controller()
export class AddProjectTimeLogCategoryController extends BasePostController {
  @inject(AddProjectTimeLogCategoryService)
  private service: AddProjectTimeLogCategoryService;
  @ApiControllerMethod({
    bodySchema: addUsersToProjectSchema,
    auth: true,
    audit: userAudit('create'),
    bodyBindOrgId: true
  })
  async post({
    res,
    body
  }: ApiRequestContext<AddProjectTimeLogCategoryPayload>) {
    const feedback = await this.service.create({ data: body! });

    return createHttpResponse(res, {
      ...feedback,
      statusCode: feedback.status
    });
  }
}
