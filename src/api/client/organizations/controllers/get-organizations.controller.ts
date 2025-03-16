import { BaseGetController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';
import { FetchUserOrganizationsService } from '../services/get-organizations.service';
import { createHttpResponse } from '@/common/utils/responder';

@Controller()
export class FetchOrganizationsController extends BaseGetController {
  @inject(FetchUserOrganizationsService)
  private service: FetchUserOrganizationsService;

  @ApiControllerMethod({
    paginate: true,
    auth: true
  })
  async get({ res, pagination, user }: ApiRequestContext) {
    const feed = await this.service.get(user!.id!, pagination);

    return createHttpResponse(res, { ...feed, statusCode: feed.status });
  }
}
