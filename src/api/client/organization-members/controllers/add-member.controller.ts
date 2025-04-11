import { BasePostController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';

import { AddOrganizationMemberService } from '../services/add.service';
import { userAudit } from '@/common/utils/user-request-audit';
import { type AddMemberToOrRemoveFromOrganizationType } from '../schema';
import { addMemberToOrRemoveFromOrgSchema } from '../schema/addMemberToOrRemoveFromOrgSchema';
import { createHttpResponse } from '@/common/utils/responder';

@Controller()
export class AddOrganizationMemberController extends BasePostController {
  @inject(AddOrganizationMemberService)
  private service: AddOrganizationMemberService;
  @ApiControllerMethod({
    bodySchema: addMemberToOrRemoveFromOrgSchema,
    auth: true,
    audit: userAudit('create'),
    bodyBindOrgId: true
  })
  async post({
    res,
    body
  }: ApiRequestContext<AddMemberToOrRemoveFromOrganizationType>) {
    const feedback = await this.service.add({ data: body! });

    return createHttpResponse(res, {
      ...feedback,
      statusCode: feedback.status
    });
  }
}
