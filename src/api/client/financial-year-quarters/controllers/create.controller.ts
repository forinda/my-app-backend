import { BasePostController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';
import { CreateFinancialYearQuarterService } from '../services/create.service';
import { createHttpResponse } from '@/common/utils/responder';
import { newFinancialYearQuarterSchema } from '../schema/schema';
import { userAudit } from '@/common/utils/user-request-audit';

@Controller()
export class NewFinancialYearQuarterController extends BasePostController {
  @inject(CreateFinancialYearQuarterService)
  private service: CreateFinancialYearQuarterService;

  @ApiControllerMethod({
    auth: true,
    bodySchema: newFinancialYearQuarterSchema,
    audit: userAudit('create'),
    bodyBindOrgId: true
  })
  async post({ res, body }: ApiRequestContext) {
    const result = await this.service.create({
      data: body!
    });

    return createHttpResponse(res, { ...result, statusCode: result.status });
  }
}
