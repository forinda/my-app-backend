import { BasePutController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';
import { UpdateFinancialYearService } from '../services/update.service';
import { createHttpResponse } from '@/common/utils/responder';
import type { UpdateFinancialYearPayload } from '../schema/schema';
import { updateFinancialYearSchema } from '../schema/schema';
import { userAudit } from '@/common/utils/user-request-audit';

@Controller()
export class UpdateFinancialYearController extends BasePutController {
  @inject(UpdateFinancialYearService)
  private service: UpdateFinancialYearService;

  @ApiControllerMethod({
    auth: true,
    bodySchema: updateFinancialYearSchema,
    audit: userAudit('update'),
    pathParamTransform: {
      id: 'financial_year_id'
    }
  })
  async put({ res, body }: ApiRequestContext<UpdateFinancialYearPayload>) {
    const result = await this.service.update({
      data: body!
    });

    return createHttpResponse(res, { ...result, statusCode: result.status });
  }
}
