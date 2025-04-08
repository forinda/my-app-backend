import { BasePutController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';

import type { UpdateDepartmentPayload } from '../schema/schema';
import { updateDepartmentSchema } from '../schema/schema';
import { UpdateDepartmentService } from '../services/update.service';
import { userAudit } from '@/common/utils/user-request-audit';
import { createHttpResponse } from '@/common/utils/responder';

/**
 * @swagger
 * /departments/{id}:
 *   put:
 *     summary: Update department
 *     description: Update an existing department
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
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated name of the department
 *                 minLength: 2
 *                 maxLength: 255
 *               description:
 *                 type: string
 *                 description: Updated description of the department
 *                 minLength: 3
 *                 maxLength: 255
 *               organization_id:
 *                 type: integer
 *                 description: ID of the organization
 *     responses:
 *       200:
 *         description: Department updated successfully
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
export class UpdateDepartmentController extends BasePutController {
  @inject(UpdateDepartmentService)
  private service: UpdateDepartmentService;
  @ApiControllerMethod({
    audit: userAudit('update'),
    auth: true,
    bodyBindOrgId: true,
    bodySchema: updateDepartmentSchema,
    pathParamTransform: {
      id: 'department_id'
    }
  })
  async put({ res, body }: ApiRequestContext<UpdateDepartmentPayload>) {
    const feedback = await this.service.update({ data: body! });

    return createHttpResponse(res, {
      ...feedback,
      statusCode: feedback.status
    });
  }
}
