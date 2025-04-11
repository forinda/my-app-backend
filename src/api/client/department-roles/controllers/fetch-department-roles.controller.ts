import { BaseGetController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';
import { FetchDepartmentRolesService } from '../services/fetch-department-roles.service';
import { createHttpResponse } from '@/common/utils/responder';
import { getDepartmentUserRoleSchema } from '../schema/schema';

@Controller()
export class FetchDepartmentRolesController extends BaseGetController {
  @inject(FetchDepartmentRolesService)
  private service: FetchDepartmentRolesService;

  @ApiControllerMethod({
    querySchema: getDepartmentUserRoleSchema,
    paginate: true,
    auth: true,
    bodyBindOrgId: true
  })
  async get({ res, query, pagination, organization_id }: ApiRequestContext) {
    const feedback = await this.service.get(
      organization_id!,
      query!,
      pagination
    );

    return createHttpResponse(res, {
      ...feedback,
      statusCode: feedback.status
    });
  }
}
