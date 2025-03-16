import { BasePutController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';

import { createHttpResponse } from '@/common/utils/responder';
import type { UpdateUserProfileInput } from '../schema/schema';
import { updateUserProfileSchema } from '../schema/schema';
import { UpdateUserProfileService } from '../services/update-profile.service';
import { userAudit } from '@/common/utils/user-request-audit';

@Controller()
export class UpdateUserProfileController extends BasePutController {
  @inject(UpdateUserProfileService) private service: UpdateUserProfileService;

  @ApiControllerMethod({
    bodySchema: updateUserProfileSchema,
    injectIpInBody: true,
    audit: userAudit('update'),
    auth: true,
    pathParamTransform: {
      id: 'user_id'
    }
  })
  async put({ res, body }: ApiRequestContext<UpdateUserProfileInput>) {
    const feed = await this.service.update({ data: body! });

    return createHttpResponse(res, { ...feed, statusCode: feed.status });
  }
}
