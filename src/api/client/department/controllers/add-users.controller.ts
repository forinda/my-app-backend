import { BasePostController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';

import type { AddUsersToDepartmentPayload } from '../schema/schema';
import { addUsersToDepartmentSchema } from '../schema/schema';
import { userAudit } from '@/common/utils/user-request-audit';
import { AddUserToDepartmentService } from '../services/add-users.service';
import { createHttpResponse } from '@/common/utils/responder';

/**
 * @swagger
 * /departments/add-member/{id}:
 *   post:
 *     summary: Add users to department
 *     description: Add one or more users to a department
 *     tags: [Departments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Department UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/octet-stream:
 *           schema:
 *             type: object
 *             required:
 *               - user_ids
 *             properties:
 *               user_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Array of user IDs to add to the department
 *     responses:
 *       200:
 *         description: Users added to department successfully
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *                 status:
 *                   type: integer
 *       400:
 *         description: Bad request
 *         content:
 *           application/octet-stream:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/octet-stream:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/octet-stream:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Department not found
 *         content:
 *           application/octet-stream:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
@Controller()
export class AddUserToDepartmentController extends BasePostController {
  @inject(AddUserToDepartmentService)
  private service: AddUserToDepartmentService;
  @ApiControllerMethod({
    bodySchema: addUsersToDepartmentSchema,
    pathParamTransform: {
      id: 'department_id'
    },
    auth: true,
    audit: userAudit('create'),
    bodyBindOrgId: true
  })
  async post({ res, body }: ApiRequestContext<AddUsersToDepartmentPayload>) {
    const feedback = await this.service.create({ data: body! });

    return createHttpResponse(res, {
      ...feedback,
      statusCode: feedback.status
    });
  }
}
