import { BasePostController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';
import { createHttpResponse } from '@/common/utils/responder';
import type { RegisterUserInput } from '../schema/schema';
import { registerUserSchema } from '../schema/schema';
import { RegisterUserService } from '../services/register.service';

@Controller()
export class RegisterUserController extends BasePostController {
  @inject(RegisterUserService) private service: RegisterUserService;

  @ApiControllerMethod({
    bodySchema: registerUserSchema,
    injectIpInBody: true
  })
  async post({ res, body }: ApiRequestContext<RegisterUserInput>) {
    const feed = await this.service.create({ data: body! });

    return createHttpResponse(res, { ...feed, statusCode: feed.status });
  }
}
