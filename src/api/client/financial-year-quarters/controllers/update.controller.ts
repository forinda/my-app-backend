import { BasePutController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';
import { UpdateFinancialYearQuarterService } from '../services/update.service';
import { createHttpResponse } from '@/common/utils/responder';
import type { UpdateFinancialYearQuarterPayload } from '../schema/schema';
import { updateFinancialYearQuarterSchema } from '../schema/schema';
import { userAudit } from '@/common/utils/user-request-audit';

@Controller()
export class UpdateFinancialYearQuarterController extends BasePutController {
  @inject(UpdateFinancialYearQuarterService)
  private service: UpdateFinancialYearQuarterService;

  @ApiControllerMethod({
    auth: true,
    bodySchema: updateFinancialYearQuarterSchema,
    bodyBindOrgId: true,
    audit: userAudit('update'),
    pathParamTransform: {
      id: 'quarter_id'
    }
  })
  async put({
    res,
    body
  }: ApiRequestContext<UpdateFinancialYearQuarterPayload>) {
    const result = await this.service.update({
      data: body!
    });

    return createHttpResponse(res, { ...result, statusCode: result.status });
  }
}
