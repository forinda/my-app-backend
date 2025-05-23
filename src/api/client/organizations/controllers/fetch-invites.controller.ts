import { BaseGetController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';
import { createHttpResponse } from '@/common/utils/responder';
import { FetchOrganizationInvitesService } from '../services/fetch-invites.service';
import { fetchOrganizationInvitesSchema } from '../schema/schema';

@Controller()
export class FetchOrganizationInvitesController extends BaseGetController {
  @inject(FetchOrganizationInvitesService)
  private service: FetchOrganizationInvitesService;

  @ApiControllerMethod({
    paginate: true,
    auth: true,
    querySchema: fetchOrganizationInvitesSchema
  })
  async get({ res, pagination, organization_id, query }: ApiRequestContext) {
    const feed = await this.service.get(organization_id!, query!, pagination);

    return createHttpResponse(res, { ...feed, statusCode: feed.status });
  }
}
