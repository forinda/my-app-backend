import { BasePutController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';

import type { UpdateDepartmentTitleRequest } from '../schema/schema';
import { updateDepartmentTitleSchema } from '../schema/schema';
import { UpdateDepartmentService } from '../services/update-department.service';
import { userAudit } from '@/common/utils/user-request-audit';
import { createHttpResponse } from '@/common/utils/responder';

@Controller()
export class UpdateDepartmentTitleController extends BasePutController {
  @inject(UpdateDepartmentService)
  private service: UpdateDepartmentService;
  @ApiControllerMethod({
    bodySchema: updateDepartmentTitleSchema,
    auth: true,
    bodyBindOrgId: true,
    pathParamTransform: {
      id: 'title_id'
    },
    audit: userAudit('update')
  })
  async put({ res, body }: ApiRequestContext<UpdateDepartmentTitleRequest>) {
    const feedback = await this.service.update({ data: body! });

    return createHttpResponse(res, {
      ...feedback,
      statusCode: feedback.status
    });
  }
}
