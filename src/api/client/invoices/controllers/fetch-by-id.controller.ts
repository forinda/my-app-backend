import { BaseGetController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';
import { FetchInvoiceByIdService } from '../services/fetch-by-id.service';
import { createHttpResponse } from '@/common/utils/responder';

@Controller()
export class FetchInvoiceByIdController extends BaseGetController {
  @inject(FetchInvoiceByIdService)
  private service: FetchInvoiceByIdService;

  @ApiControllerMethod({
    auth: true,
    bodyBindOrgId: true
  })
  async get({ req, res, organization_id }: ApiRequestContext) {
    const id = Number(req.params.id);
    const result = await this.service.get(id, organization_id!);

    return createHttpResponse(res, { ...result, statusCode: result.status });
  }
}
