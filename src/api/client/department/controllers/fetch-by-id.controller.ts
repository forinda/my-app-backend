import { BaseGetController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';
import { createHttpResponse } from '@/common/utils/responder';
import { FetchDepartmentByIdService } from '../services/fetch-by-id.service';

@Controller()
export class FetchDepartmentByIdController extends BaseGetController {
  @inject(FetchDepartmentByIdService)
  private service: FetchDepartmentByIdService;

  @ApiControllerMethod({
    paginate: true,
    auth: true,
    bodyBindOrgId: true,
    pathParamTransform: {
      id: 'department_id'
    }
  })
  async get({ res, params, organization_id }: ApiRequestContext) {
    const feed = await this.service.get(
      organization_id!,
      params!.department_id
    );

    return createHttpResponse(res, { ...feed, statusCode: feed.status });
  }
}
