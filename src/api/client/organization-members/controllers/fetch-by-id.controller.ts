import { BaseGetController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';
import { createHttpResponse } from '@/common/utils/responder';
import { FetchOrganizationMemberByIdService } from '../services/fetch-by-id.service';
import { fetchSingleOrganizationMemberSchema } from '../schema';

@Controller()
export class FetchOrganizationMemberByIdController extends BaseGetController {
  @inject(FetchOrganizationMemberByIdService)
  private service: FetchOrganizationMemberByIdService;

  @ApiControllerMethod({
    auth: true,
    querySchema: fetchSingleOrganizationMemberSchema
  })
  async get({ res, organization_id, query }: ApiRequestContext) {
    const feed = await this.service.get(organization_id!, query!);

    return createHttpResponse(res, { ...feed, statusCode: feed.status });
  }
}
