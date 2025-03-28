import { BaseGetController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';
import { FetchProjectsService } from '../services/fetch.service';
import { createHttpResponse } from '@/common/utils/responder';
import { fetchProjectCategoryQuerySchema } from '../schema/schema';

@Controller()
export class FetchProjectController extends BaseGetController {
  @inject(FetchProjectsService)
  private service: FetchProjectsService;

  @ApiControllerMethod({
    paginate: true,
    auth: true,
    bodyBindOrgId: true,
    querySchema: fetchProjectCategoryQuerySchema
  })
  async get({ res, pagination, organization_id, query }: ApiRequestContext) {
    const feed = await this.service.get(organization_id!, query!, pagination);

    return createHttpResponse(res, { ...feed, statusCode: feed.status });
  }
}
