import { BaseGetController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import { inject } from 'inversify';
import { FetchSubscriptionPlansService } from '../services/fetch.service';
import { createHttpResponse } from '@/common/utils/responder';
import type { ApiRequestContext } from '@/common/interfaces/controller';

@Controller()
export class FetchSubscriptionPlansController extends BaseGetController {
  @inject(FetchSubscriptionPlansService)
  private service: FetchSubscriptionPlansService;

  @ApiControllerMethod()
  async get({ res }: ApiRequestContext) {
    const feed = await this.service.get({});

    return createHttpResponse(res, { ...feed, statusCode: feed.status });
  }
}
