import { BaseGetController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';
import { createHttpResponse } from '@/common/utils/responder';
import { FetchProjectByIdService } from '../services/fetch-by-id.service';

@Controller()
export class FetchProjectByIdController extends BaseGetController {
  @inject(FetchProjectByIdService)
  private service: FetchProjectByIdService;

  @ApiControllerMethod({
    paginate: true,
    auth: true,
    bodyBindOrgId: true,
    pathParamTransform: {
      id: 'project_id'
    }
  })
  async get({ res, params }: ApiRequestContext) {
    const feed = await this.service.get(params!.project_id);

    return createHttpResponse(res, { ...feed, statusCode: feed.status });
  }
}
