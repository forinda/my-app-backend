import { BaseGetController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';
import { FetchFinancialYearsService } from '../services/fetch.service';
import { createHttpResponse } from '@/common/utils/responder';
import { filterFinancialYearSchema } from '../schema/schema';

@Controller()
export class FetchFinancialYearsController extends BaseGetController {
  @inject(FetchFinancialYearsService)
  private service: FetchFinancialYearsService;

  @ApiControllerMethod({
    paginate: true,
    auth: true,
    bodyBindOrgId: true,
    querySchema: filterFinancialYearSchema
  })
  async get({ res, pagination, organization_id, query }: ApiRequestContext) {
    const result = await this.service.get(organization_id!, query, pagination);

    return createHttpResponse(res, { ...result, statusCode: result.status });
  }
}
