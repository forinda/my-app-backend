import { BasePostController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';
import { CreateInvoiceService } from '../services/create.service';
import { createHttpResponse } from '@/common/utils/responder';
import { newInvoiceSchema } from '../schema/schema';

@Controller()
export class NewInvoiceController extends BasePostController {
  @inject(CreateInvoiceService)
  private service: CreateInvoiceService;

  @ApiControllerMethod({
    auth: true,
    bodySchema: newInvoiceSchema,
    bodyBindOrgId: true,
    bodyBindUser: true
  })
  async post({ res, body }: ApiRequestContext) {
    const result = await this.service.create({ data: body });

    return createHttpResponse(res, { ...result, statusCode: result.status });
  }
}
