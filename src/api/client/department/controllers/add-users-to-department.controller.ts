import { BasePostController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';

import type { AddUsersToDepartmentPayload } from '../schema/schema';
import { addUsersToDepartmentSchema } from '../schema/schema';
import { userAudit } from '@/common/utils/user-request-audit';
import { AddUserToDepartmentService } from '../services/add-users-to-department.service';
import { createHttpResponse } from '@/common/utils/responder';

@Controller()
export class AddUserToDepartmentController extends BasePostController {
  @inject(AddUserToDepartmentService)
  private service: AddUserToDepartmentService;
  @ApiControllerMethod({
    bodySchema: addUsersToDepartmentSchema,
    pathParamTransform: {
      id: 'department_id'
    },
    auth: true,
    audit: userAudit('create'),
    bodyBindOrgId: true
  })
  async post({ res, body }: ApiRequestContext<AddUsersToDepartmentPayload>) {
    const feedback = await this.service.create({ data: body! });

    return createHttpResponse(res, {
      ...feedback,
      statusCode: feedback.status
    });
  }
}
