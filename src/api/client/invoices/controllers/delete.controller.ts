import { BaseDeleteController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';
import { DeleteInvoiceService } from '../services/delete.service';
import { createHttpResponse } from '@/common/utils/responder';

@Controller()
export class DeleteInvoiceController extends BaseDeleteController {
  @inject(DeleteInvoiceService)
  private service: DeleteInvoiceService;

  @ApiControllerMethod({
    auth: true,
    bodyBindUser: true,
    bodyBindOrgId: true
  })
  async delete({ req, res, user, organization_id }: ApiRequestContext) {
    const id = Number(req.params.id);

    const result = await this.service.delete({
      params: { id, organization_id: organization_id! },
      user_id: user!.id
    });

    return createHttpResponse(res, { ...result, statusCode: result.status });
  }
}
