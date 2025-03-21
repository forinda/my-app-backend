import { BaseGetController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';
import { createHttpResponse } from '@/common/utils/responder';
import { FetchDepartmentMembersService } from '../services/fetch-members.service';

@Controller()
export class FetchDepartmentMembersController extends BaseGetController {
  @inject(FetchDepartmentMembersService)
  private service: FetchDepartmentMembersService;

  @ApiControllerMethod({
    paginate: true,
    auth: true,
    bodyBindOrgId: true,
    pathParamTransform: {
      id: 'department_id'
    }
  })
  async get({ res, params }: ApiRequestContext) {
    const feed = await this.service.get(params!.department_id);

    return createHttpResponse(res, { ...feed, statusCode: feed.status });
  }
}
