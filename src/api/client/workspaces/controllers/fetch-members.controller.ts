import { BaseGetController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';
import { createHttpResponse } from '@/common/utils/responder';
import { FetchWorkspaceMembersService } from '../services/fetch-members.service';
import { fetchWorkspacemembersSchema } from '../schema/schema';

@Controller()
export class FetchWorkspaceMembersController extends BaseGetController {
  @inject(FetchWorkspaceMembersService)
  private service: FetchWorkspaceMembersService;

  @ApiControllerMethod({
    paginate: true,
    auth: true,
    bodyBindOrgId: true,
    pathParamTransform: {
      id: 'workspace_id'
    },
    querySchema: fetchWorkspacemembersSchema
  })
  async get({ res, params, query, pagination }: ApiRequestContext) {
    const feed = await this.service.get(
      params!.workspace_id,
      query!,
      pagination!
    );

    return createHttpResponse(res, { ...feed, statusCode: feed.status });
  }
}
