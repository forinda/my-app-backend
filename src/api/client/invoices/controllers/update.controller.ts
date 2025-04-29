import { BasePutController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';
import { UpdateInvoiceService } from '../services/update.service';
import { createHttpResponse } from '@/common/utils/responder';
import { updateInvoiceSchema } from '../schema/schema';

@Controller()
export class UpdateInvoiceController extends BasePutController {
  @inject(UpdateInvoiceService)
  private service: UpdateInvoiceService;

  @ApiControllerMethod({
    auth: true,
    bodySchema: updateInvoiceSchema,
    bodyBindUser: true,
    bodyBindOrgId: true
  })
  async put({ req, res, body, organization_id }: ApiRequestContext) {
    const id = Number(req.params.id);

    const result = await this.service.update({
      data: body,
      params: { id, organization_id: organization_id! }
    });

    return createHttpResponse(res, { ...result, statusCode: result.status });
  }
}
