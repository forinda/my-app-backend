import { BaseGetController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';
import { FetchFinancialYearQuartersService } from '../services/fetch.service';
import { createHttpResponse } from '@/common/utils/responder';

@Controller()
export class FetchFinancialYearQuartersController extends BaseGetController {
  @inject(FetchFinancialYearQuartersService)
  private service: FetchFinancialYearQuartersService;

  @ApiControllerMethod({
    paginate: true,
    auth: true
  })
  async get({ req, res, pagination }: ApiRequestContext) {
    const financial_year_id = Number(req.params.financial_year_id);
    const result = await this.service.get(financial_year_id, pagination);

    return createHttpResponse(res, { ...result, statusCode: result.status });
  }
}
