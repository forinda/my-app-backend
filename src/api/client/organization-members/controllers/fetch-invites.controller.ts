import { BaseGetController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';
import { createHttpResponse } from '@/common/utils/responder';
import { FetchOrganizationMemberInvitesService } from '../services/fetch-invites.service';

@Controller()
export class FetchOrganizationMemberInvitesController extends BaseGetController {
  @inject(FetchOrganizationMemberInvitesService)
  private service: FetchOrganizationMemberInvitesService;

  @ApiControllerMethod({
    paginate: true,
    auth: true
  })
  async get({ res, pagination, user }: ApiRequestContext) {
    const feed = await this.service.get({ user_id: user!.id }, pagination!);

    return createHttpResponse(res, { ...feed, statusCode: feed.status });
  }
}
