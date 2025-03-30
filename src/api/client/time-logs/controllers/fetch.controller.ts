import { BaseGetController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';
import { FetchTimeLogService } from '../services/fetch.service';
import { createHttpResponse } from '@/common/utils/responder';
import { fetchTimeLogSchema } from '../schema/schema';

@Controller()
export class FetchTimeLogController extends BaseGetController {
  @inject(FetchTimeLogService)
  private service: FetchTimeLogService;

  @ApiControllerMethod({
    paginate: true,
    auth: true,
    bodyBindOrgId: true,
    querySchema: fetchTimeLogSchema
  })
  async get({ res, pagination, organization_id }: ApiRequestContext) {
    const feed = await this.service.get(organization_id!, pagination);

    return createHttpResponse(res, { ...feed, statusCode: feed.status });
  }
}
