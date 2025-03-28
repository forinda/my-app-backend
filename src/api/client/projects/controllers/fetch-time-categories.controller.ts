import { BaseGetController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';
import { createHttpResponse } from '@/common/utils/responder';
import { fetchProjectTimeCategoriesSchema } from '../schema/schema';
import { FetchProjectsTimeCategoriesService } from '../services/fetch-time-categories.service';
// import { Logger } from '@/common/logger';

@Controller()
export class FetchProjectTimeCategoriesController extends BaseGetController {
  @inject(FetchProjectsTimeCategoriesService)
  private service: FetchProjectsTimeCategoriesService;
  // @inject(Logger)
  // private logger: Logger;

  @ApiControllerMethod({
    paginate: true,
    auth: true,
    bodyBindOrgId: true,
    querySchema: fetchProjectTimeCategoriesSchema
  })
  async get({ res, pagination, organization_id, query }: ApiRequestContext) {
    // this.logger.info('Fetching project time categories');
    const feed = await this.service.get(organization_id!, query!, pagination!);

    return createHttpResponse(res, { ...feed, statusCode: feed.status });
  }
}
