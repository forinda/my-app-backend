import { BaseGetController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';
import { FetchProjectCategoriesService } from '../services/fetch.service';
import { createHttpResponse } from '@/common/utils/responder';

@Controller()
export class FetchProjectCategoriesController extends BaseGetController {
  @inject(FetchProjectCategoriesService)
  private service: FetchProjectCategoriesService;

  @ApiControllerMethod({
    paginate: true,
    auth: true,
    bodyBindOrgId: true
  })
  async get({ res, pagination, organization_id }: ApiRequestContext) {
    const feed = await this.service.get(organization_id!, pagination);

    return createHttpResponse(res, { ...feed, statusCode: feed.status });
  }
}
