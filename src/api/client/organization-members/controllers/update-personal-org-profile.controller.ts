import { BasePutController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';

import { userAudit } from '@/common/utils/user-request-audit';
import type { InitializeUserOrganizationProfileType } from '../schema';
import { memberUpdatePersonalOrgProfileSchema } from '../schema/memberUpdatePersonalOrgProfileSchema';
import { createHttpResponse } from '@/common/utils/responder';
import { UpdateOrgPersonalProfileService } from '../services/update-personal-org-profile.service';

@Controller()
export class UpdateOrgPersonalProfileController extends BasePutController {
  @inject(UpdateOrgPersonalProfileService)
  private service: UpdateOrgPersonalProfileService;
  @ApiControllerMethod({
    bodySchema: memberUpdatePersonalOrgProfileSchema,
    auth: true,
    audit: userAudit('update'),
    bodyBindOrgId: true
  })
  async put({
    res,
    body,
    user
  }: ApiRequestContext<InitializeUserOrganizationProfileType>) {
    const feedback = await this.service.update({
      data: { ...body!, current_user_id: user!.id! }!
    });

    return createHttpResponse(res, {
      ...feedback,
      statusCode: feedback.status
    });
  }
}
