import { BaseGetController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import { HttpStatus } from '@/common/http';
import type { ApiRequestContext } from '@/common/interfaces/controller';

import { createHttpResponse } from '@/common/utils/responder';
import type { LoginUserInput } from '../schema/schema';

/**
 * @swagger
 * /auth/session:
 *   get:
 *     summary: Get current session
 *     description: Retrieve the current user's session information. Requires a valid session cookie.
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Session retrieved successfully
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *                 access:
 *                   type: boolean
 *                 status:
 *                   type: integer
 *       401:
 *         description: Unauthorized - Invalid or expired session cookie
 */
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
