import { BaseGetController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';
import { createHttpResponse } from '@/common/utils/responder';
import { FetchProjectCategoryByIdService } from '../services/fetch-by-id.service';

@Controller()
export class FetchProjectCategoryByIdController extends BaseGetController {
  @inject(FetchProjectCategoryByIdService)
  private service: FetchProjectCategoryByIdService;

  @ApiControllerMethod({
    paginate: true,
    auth: true,
    bodyBindOrgId: true,
    pathParamTransform: {
      id: 'project_category_id'
    }
  })
  async get({ res, params }: ApiRequestContext) {
    const feed = await this.service.get(+params!.project_category_id);

    return createHttpResponse(res, { ...feed, statusCode: feed.status });
  }
}
