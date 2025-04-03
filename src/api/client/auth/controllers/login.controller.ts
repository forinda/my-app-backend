import { BasePostController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import { HttpStatus } from '@/common/http';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';
import { LoginUserService } from '../services/login.service';
import { createHttpResponse } from '@/common/utils/responder';
import type { LoginUserInput } from '../schema/schema';
import { loginUserSchema } from '../schema/schema';

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate user with email/username and password. Sets a session cookie upon successful login.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - emailOrUsername
 *               - password
 *             properties:
 *               emailOrUsername:
 *                 type: string
 *                 description: User's email, phone number, or username
 *               password:
 *                 type: string
 *                 description: User's password
 *               rememberMe:
 *                 type: boolean
 *                 description: Whether to remember the user's session
 *                 default: false
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *                 status:
 *                   type: integer
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               description: Session cookie containing the authentication token
 *       400:
 *         description: Invalid credentials
 *       401:
 *         description: Unauthorized
 */
@Controller()
export class LoginUserController extends BasePostController {
  @inject(LoginUserService) private service: LoginUserService;

  @ApiControllerMethod({
    bodySchema: loginUserSchema,
    injectIpInBody: true
  })
  async post({ res, body }: ApiRequestContext<LoginUserInput>) {
    const { expiry, otherCookieOptions, signedSession, cookieName, ...rest } =
      await this.service.login({
        data: body!
      });

    res.cookie(cookieName!, signedSession, {
      ...otherCookieOptions,
      sameSite: otherCookieOptions!.sameSite || 'lax',
      expires: expiry
    });

    return createHttpResponse(res, {
      statusCode: HttpStatus.OK,
      ...rest
    });
  }
}
