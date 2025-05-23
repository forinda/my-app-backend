import { BasePostController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';

import { userAudit } from '@/common/utils/user-request-audit';
import type { InitializeUserOrganizationProfileType } from '../schema';
import { initializeUserOrgProfileSchema } from '../schema/initializeUserOrgProfileSchema';
import { createHttpResponse } from '@/common/utils/responder';
import { InitOrgMemberProfileService } from '../services/init-member-profile.service';

@Controller()
export class InitOrgMemberProfileController extends BasePostController {
  @inject(InitOrgMemberProfileService)
  private service: InitOrgMemberProfileService;
  @ApiControllerMethod({
    bodySchema: initializeUserOrgProfileSchema,
    auth: true,
    audit: userAudit('update'),
    bodyBindOrgId: true,
    pathParamTransform: {
      id: 'employee_user_id'
    }
  })
  async post({
    res,
    body
  }: ApiRequestContext<InitializeUserOrganizationProfileType>) {
    const feedback = await this.service.init({ data: body! });

    return createHttpResponse(res, {
      ...feedback,
      statusCode: feedback.status
    });
  }
}
