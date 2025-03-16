import { BaseGetController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import { HttpStatus } from '@/common/http';
import type { ApiRequestContext } from '@/common/interfaces/controller';

import { createHttpResponse } from '@/common/utils/responder';
import type { LoginUserInput } from '../schema/schema';

@Controller()
export class GetUserSessionController extends BaseGetController {
  @ApiControllerMethod({ auth: true })
  async get({ user, res }: ApiRequestContext<LoginUserInput>) {
    if (!user) {
      return createHttpResponse(res, {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Invalid token',
        access: false
      });
    }

    return createHttpResponse(res, {
      statusCode: HttpStatus.OK,
      data: user,
      message: 'Token is valid',
      access: true
    });
  }
}
