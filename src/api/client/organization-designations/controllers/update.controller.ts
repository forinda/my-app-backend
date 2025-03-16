import { BasePutController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';

import type { UpdateOrganizationDesignationInputType } from '../schema/schema';
import { updateOrganizationDesignationSchema } from '../schema/schema';
import { userAudit } from '@/common/utils/user-request-audit';
import { UpdateOrganizationService } from '../services/update.service';
import { createHttpResponse } from '@/common/utils/responder';

@Controller()
export class UpdateOrganizationDesignationController extends BasePutController {
  @inject(UpdateOrganizationService)
  private service: UpdateOrganizationService;
  @ApiControllerMethod({
    bodySchema: updateOrganizationDesignationSchema,
    audit: userAudit('update'),
    auth: true,
    pathParamTransform: {
      id: 'designation_id'
    },
    bodyBindOrgId: true
  })
  async put({
    res,
    body
  }: ApiRequestContext<UpdateOrganizationDesignationInputType>) {
    const feedback = await this.service.update({
      data: body!
    });

    return createHttpResponse(res, {
      ...feedback,
      statusCode: feedback.status
    });
  }
}
