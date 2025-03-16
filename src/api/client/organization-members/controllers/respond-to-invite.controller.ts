import { BasePostController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';

import { userAudit } from '@/common/utils/user-request-audit';
import type { RespondToOrgInviteType } from '../schema';
import { respondToOrgInviteSchema } from '../schema';
import { RespondToOrgInviteService } from '../services/respond-to-invite.service';
import { createHttpResponse } from '@/common/utils/responder';

@Controller()
export class RespondToOrgInviteController extends BasePostController {
  @inject(RespondToOrgInviteService)
  private service: RespondToOrgInviteService;
  @ApiControllerMethod({
    bodySchema: respondToOrgInviteSchema,
    auth: true,
    audit: userAudit('create'),
    bodyBindOrgId: true,
    pathParamTransform: {
      id: 'invite_id'
    }
  })
  async post({ res, body }: ApiRequestContext<RespondToOrgInviteType>) {
    const feedback = await this.service.add({ data: body! });

    return createHttpResponse(res, {
      ...feedback,
      statusCode: feedback.status
    });
  }
}
