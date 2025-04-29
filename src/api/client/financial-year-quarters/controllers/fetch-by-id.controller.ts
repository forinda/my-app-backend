import { BaseGetController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';
import { FetchFinancialYearQuarterByIdService } from '../services/fetch-by-id.service';
import { createHttpResponse } from '@/common/utils/responder';

@Controller()
export class FetchFinancialYearQuarterByIdController extends BaseGetController {
  @inject(FetchFinancialYearQuarterByIdService)
  private service: FetchFinancialYearQuarterByIdService;

  @ApiControllerMethod({
    auth: true
  })
  async get({ req, res }: ApiRequestContext) {
    const id = Number(req.params.id);
    const financial_year_id = Number(req.params.financial_year_id);
    const result = await this.service.get(id, financial_year_id);

    return createHttpResponse(res, { ...result, statusCode: result.status });
  }
}
