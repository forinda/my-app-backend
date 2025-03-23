import { BaseGetController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';
import { createHttpResponse } from '@/common/utils/responder';
import { FetchWorkspaceByIdService } from '../services/fetch-by-id.service';

@Controller()
export class FetchWorkspaceByIdController extends BaseGetController {
  @inject(FetchWorkspaceByIdService)
  private service: FetchWorkspaceByIdService;

  @ApiControllerMethod({
    paginate: true,
    auth: true,
    bodyBindOrgId: true,
    pathParamTransform: {
      id: 'workspace_id'
    }
  })
  async get({ res, params }: ApiRequestContext) {
    const feed = await this.service.get(params!.workspace_id);

    return createHttpResponse(res, { ...feed, statusCode: feed.status });
  }
}
