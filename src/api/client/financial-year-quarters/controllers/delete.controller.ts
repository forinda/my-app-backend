import { BaseDeleteController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';
import { DeleteFinancialYearQuarterService } from '../services/delete.service';
import { createHttpResponse } from '@/common/utils/responder';
import { userAudit } from '@/common/utils/user-request-audit';
import type { DeleteFinancialYearQuarterPayload } from '../../financial-years/schema/schema';
import { deleteFinancialYearQuarterSchema } from '../../financial-years/schema/schema';

@Controller()
export class DeleteFinancialYearQuarterController extends BaseDeleteController {
  @inject(DeleteFinancialYearQuarterService)
  private service: DeleteFinancialYearQuarterService;

  @ApiControllerMethod({
    auth: true,
    audit: userAudit('delete'),
    bodySchema: deleteFinancialYearQuarterSchema,
    bodyBindOrgId: true,
    pathParamTransform: {
      id: 'quarter_id'
    }
  })
  async delete({
    res,
    body
  }: ApiRequestContext<DeleteFinancialYearQuarterPayload>) {
    const result = await this.service.delete({
      data: body!
    });

    return createHttpResponse(res, { ...result, statusCode: result.status });
  }
}
