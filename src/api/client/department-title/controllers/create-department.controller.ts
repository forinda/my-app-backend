import { BasePostController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';

import type { DepartmentTitleCreationRequest } from '../schema/schema';
import { newDepartmentTitleSchema } from '../schema/schema';
import { CreateNewDepartmentTitleService } from '../services/create-department-title.service';
import { userAudit } from '@/common/utils/user-request-audit';
import { createHttpResponse } from '@/common/utils/responder';

@Controller()
export class CreateDepartmentTitleController extends BasePostController {
  @inject(CreateNewDepartmentTitleService)
  private service: CreateNewDepartmentTitleService;
  @ApiControllerMethod({
    bodySchema: newDepartmentTitleSchema,
    auth: true,
    bodyBindOrgId: true,
    audit: userAudit('create')
  })
  async post({ res, body }: ApiRequestContext<DepartmentTitleCreationRequest>) {
    const feedback = await this.service.create({ data: body! });

    return createHttpResponse(res, {
      ...feedback,
      statusCode: feedback.status
    });
  }
}
