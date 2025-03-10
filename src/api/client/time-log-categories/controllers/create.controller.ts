import { BasePostController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import { Dependency } from '@/common/di';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject, injectable } from 'inversify';

import type { CreateTimeLogCategoryType } from '../schema/schema';
import { newTimeLogCategorySchema } from '../schema/schema';
import { CreateTimeLogCategoryService } from '../services/create.service';
import { userAudit } from '@/common/utils/user-request-audit';
import { createHttpResponse } from '@/common/utils/responder';

@injectable()
@Dependency()
@Controller()
export class CreateTimeLogCategoryController extends BasePostController {
  @inject(CreateTimeLogCategoryService)
  private service: CreateTimeLogCategoryService;
  @ApiControllerMethod({
    bodySchema: newTimeLogCategorySchema,
    auth: true,
    bodyBindOrgId: true,
    audit: userAudit('create')
  })
  async post({ res, body }: ApiRequestContext<CreateTimeLogCategoryType>) {
    const feedback = await this.service.create({ data: body! });

    return createHttpResponse(res, {
      ...feedback,
      statusCode: feedback.status
    });
  }
}
