import { BaseGetController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';
import { FetchTimeLogCategoriesService } from '../services/fetch.service';
import { createHttpResponse } from '@/common/utils/responder';

@Controller()
export class FetchTimeLogCategoriesController extends BaseGetController {
  @inject(FetchTimeLogCategoriesService)
  private service: FetchTimeLogCategoriesService;

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
