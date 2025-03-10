import { BaseGetController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import { Dependency } from '@/common/di';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject, injectable } from 'inversify';
import { FetchTimeLogService } from '../services/fetch.service';
import { createHttpResponse } from '@/common/utils/responder';

@injectable()
@Dependency()
@Controller()
export class FetchTimeLogController extends BaseGetController {
  @inject(FetchTimeLogService)
  private service: FetchTimeLogService;

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
