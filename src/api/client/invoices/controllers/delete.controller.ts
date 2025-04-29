import { BaseDeleteController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';
import { DeleteInvoiceService } from '../services/delete.service';
import { createHttpResponse } from '@/common/utils/responder';
import { userAudit } from '@/common/utils/user-request-audit';
import type { DeleteInvoicePayload } from '../schema/schema';
import { deleteInvoiceSchema } from '../schema/schema';

@Controller()
export class DeleteInvoiceController extends BaseDeleteController {
  @inject(DeleteInvoiceService)
  private service: DeleteInvoiceService;

  @ApiControllerMethod({
    auth: true,
    bodyBindOrgId: true,
    audit: userAudit('delete'),
    bodySchema: deleteInvoiceSchema,
    pathParamTransform: {
      id: 'invoice_id'
    }
  })
  async delete({ res, body }: ApiRequestContext<DeleteInvoicePayload>) {
    const result = await this.service.delete({
      data: body!
    });

    return createHttpResponse(res, { ...result, statusCode: result.status });
  }
}
