import { BaseDeleteController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';
import { DeleteFinancialYearService } from '../services/delete.service';
import { createHttpResponse } from '@/common/utils/responder';
import { userAudit } from '@/common/utils/user-request-audit';
import type { DeleteFinancialYearPayload } from '../schema/schema';

@Controller()
export class DeleteFinancialYearController extends BaseDeleteController {
  @inject(DeleteFinancialYearService)
  private service: DeleteFinancialYearService;

  @ApiControllerMethod({
    auth: true,
    audit: userAudit('delete'),
    pathParamTransform: {
      id: 'financial_year_id'
    }
  })
  async delete({ res, body }: ApiRequestContext<DeleteFinancialYearPayload>) {
    const result = await this.service.delete({
      data: body!
    });

    return createHttpResponse(res, { ...result, statusCode: result.status });
  }
}
