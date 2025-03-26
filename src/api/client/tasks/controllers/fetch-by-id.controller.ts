import { BaseGetController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';
import { createHttpResponse } from '@/common/utils/responder';
import { FetchTaskByIdService } from '../services/fetch-by-id.service';

@Controller()
export class FetchTaskByIdController extends BaseGetController {
  @inject(FetchTaskByIdService)
  private service: FetchTaskByIdService;

  @ApiControllerMethod({
    auth: true,
    bodyBindOrgId: true,
    pathParamTransform: {
      id: 'task_id'
    }
  })
  async get({ res, organization_id, params }: ApiRequestContext) {
    const feed = await this.service.get(organization_id!, params!.task_id);

    return createHttpResponse(res, { ...feed, statusCode: feed.status });
  }
}
