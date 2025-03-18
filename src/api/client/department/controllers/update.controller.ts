import { BasePutController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';

import type { UpdateDepartmentPayload } from '../schema/schema';
import { updateDepartmentSchema } from '../schema/schema';
import { UpdateDepartmentService } from '../services/update.service';
import { userAudit } from '@/common/utils/user-request-audit';
import { createHttpResponse } from '@/common/utils/responder';

@Controller()
export class UpdateDepartmentController extends BasePutController {
  @inject(UpdateDepartmentService)
  private service: UpdateDepartmentService;
  @ApiControllerMethod({
    audit: userAudit('update'),
    auth: true,
    bodyBindOrgId: true,
    bodySchema: updateDepartmentSchema,
    pathParamTransform: {
      id: 'department_id'
    }
  })
  async put({ res, body }: ApiRequestContext<UpdateDepartmentPayload>) {
    const feedback = await this.service.update({ data: body! });

    return createHttpResponse(res, {
      ...feedback,
      statusCode: feedback.status
    });
  }
}
