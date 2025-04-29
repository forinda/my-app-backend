import { BaseGetController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';
import { GenerateInvoiceNumberService } from '../services/generate-invoice-number.service';
import { createHttpResponse } from '@/common/utils/responder';
import { z } from 'zod';

// Schema for invoice number generator options
const generateInvoiceNumberSchema = z.object({
  prefix: z.string().optional()
});

@Controller()
export class GenerateInvoiceNumberController extends BaseGetController {
  @inject(GenerateInvoiceNumberService)
  private service: GenerateInvoiceNumberService;

  @ApiControllerMethod({
    auth: true,
    bodyBindOrgId: true,
    querySchema: generateInvoiceNumberSchema
  })
  async get({ res, organization_id, query }: ApiRequestContext) {
    const prefix = query?.prefix || 'INV';
    const result = await this.service.generate(organization_id!, prefix);

    return createHttpResponse(res, { ...result, statusCode: result.status });
  }
}
