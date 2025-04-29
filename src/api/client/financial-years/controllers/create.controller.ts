import { BasePostController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';
import { CreateFinancialYearService } from '../services/create.service';
import { createHttpResponse } from '@/common/utils/responder';
import { newFinancialYearSchema } from '../schema/schema';
import { userAudit } from '@/common/utils/user-request-audit';

@Controller()
export class NewFinancialYearController extends BasePostController {
  @inject(CreateFinancialYearService)
  private service: CreateFinancialYearService;

  @ApiControllerMethod({
    auth: true,
    bodySchema: newFinancialYearSchema,
    bodyBindOrgId: true,
    audit: userAudit('create')
  })
  async post({ res, body }: ApiRequestContext) {
    const result = await this.service.create({ data: body });

    return createHttpResponse(res, { ...result, statusCode: result.status });
  }
}
