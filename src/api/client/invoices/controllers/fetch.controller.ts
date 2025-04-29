import { BaseGetController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';
import { FetchInvoicesService } from '../services/fetch.service';
import { createHttpResponse } from '@/common/utils/responder';
import { filterInvoiceSchema } from '../schema/schema';

@Controller()
export class FetchInvoicesController extends BaseGetController {
  @inject(FetchInvoicesService)
  private service: FetchInvoicesService;

  @ApiControllerMethod({
    paginate: true,
    auth: true,
    bodyBindOrgId: true,
    querySchema: filterInvoiceSchema
  })
  async get({ res, pagination, organization_id, query }: ApiRequestContext) {
    const result = await this.service.get(organization_id!, query, pagination);

    return createHttpResponse(res, { ...result, statusCode: result.status });
  }
}
