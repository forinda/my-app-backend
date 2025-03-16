import { BasePostController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';
import { createHttpResponse } from '@/common/utils/responder';
import { RemoveOrganizationMemberService } from '../services/remove-member.service';
import type { AddMemberToOrRemoveFromOrganizationType } from '../schema';
import { addMemberToOrRemoveFromOrgSchema } from '../schema';

@Controller()
export class RemoveOrganizationMembersController extends BasePostController {
  @inject(RemoveOrganizationMemberService)
  private service: RemoveOrganizationMemberService;

  @ApiControllerMethod({
    auth: true,
    bodySchema: addMemberToOrRemoveFromOrgSchema
  })
  async post({
    res,
    body: data
  }: ApiRequestContext<AddMemberToOrRemoveFromOrganizationType>) {
    const feed = await this.service.remove({
      data: data!
    });

    return createHttpResponse(res, { ...feed, statusCode: feed.status });
  }
}
