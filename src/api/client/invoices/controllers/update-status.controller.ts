import { BasePatchController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';
import { UpdateInvoiceStatusService } from '../services/update-status.service';
import { createHttpResponse } from '@/common/utils/responder';
import { updateInvoiceStatusSchema } from '../schema/schema';

@Controller()
export class UpdateInvoiceStatusController extends BasePatchController {
  @inject(UpdateInvoiceStatusService)
  private service: UpdateInvoiceStatusService;

  @ApiControllerMethod({
    auth: true,
    bodySchema: updateInvoiceStatusSchema,
    bodyBindUser: true,
    bodyBindOrgId: true
  })
  async patch({ req, res, body, organization_id }: ApiRequestContext) {
    const id = Number(req.params.id);

    const result = await this.service.update({
      data: body,
      params: { id, organization_id: organization_id! }
    });

    return createHttpResponse(res, { ...result, statusCode: result.status });
  }
}
