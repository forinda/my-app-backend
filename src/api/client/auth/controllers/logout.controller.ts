import { BasePostController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import { HttpStatus } from '@/common/http';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';

import { createHttpResponse } from '@/common/utils/responder';
import { Config } from '@/common/config';

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: User logout
 *     description: Logout the current user and clear session cookie. Requires a valid session cookie.
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logged out"
 *                 status:
 *                   type: integer
 *                   example: 200
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               description: Clears the session cookie
 *       401:
 *         description: Unauthorized - Invalid or expired session cookie
 */
@Controller()
export class UserLogoutController extends BasePostController {
  @inject(Config) private conf: Config;

  @ApiControllerMethod()
  async post({ res }: ApiRequestContext) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { maxAge: _, ...other } = this.conf.cookieOpts;

    res.clearCookie(this.conf.conf.SESSION_COOKIE_NAME, other);

    return createHttpResponse(res, {
      statusCode: HttpStatus.OK,
      message: 'Logged out'
    });
  }
}
