import { BaseGetController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';
import { createHttpResponse } from '@/common/utils/responder';
import { FetchOrganizationByIdService } from '../services/fetch-by-id.service';

@Controller()
export class FetchOrganizationByIdController extends BaseGetController {
  @inject(FetchOrganizationByIdService)
  private service: FetchOrganizationByIdService;

  @ApiControllerMethod({
    auth: true,
    pathParamTransform: {
      id: 'organization_id'
    }
  })
  async get({ res, query, user }: ApiRequestContext) {
    const feed = await this.service.get(
      user!.id!,
      (query as any)?.['organization_id']
    );

    return createHttpResponse(res, { ...feed, statusCode: feed.status });
  }
}
