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

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: User registration
 *     description: Register a new user. Sets a session cookie upon successful registration.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - email
 *               - username
 *               - password
 *               - phone_number
 *             properties:
 *               first_name:
 *                 type: string
 *                 description: User's first name
 *               last_name:
 *                 type: string
 *                 description: User's last name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               username:
 *                 type: string
 *                 description: User's username
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 description: User's password (must contain at least one lowercase, uppercase, number, and special character)
 *               gender:
 *                 type: string
 *                 enum: [Male, Female, Other]
 *                 default: Other
 *                 description: User's gender
 *               phone_number:
 *                 type: string
 *                 description: User's phone number
 *     responses:
 *       201:
 *         description: User registered successfully
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
 *         description: Invalid input data
 *       409:
 *         description: User already exists
 */
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
