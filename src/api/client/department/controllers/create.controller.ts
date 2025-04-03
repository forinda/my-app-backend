import { BasePostController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';

import type { NewDepartmentPayload } from '../schema/schema';
import { newDepartmentSchema } from '../schema/schema';
import { DepartmentCreationService } from '../services/create.service';
import { userAudit } from '@/common/utils/user-request-audit';
import { createHttpResponse } from '@/common/utils/responder';

/**
 * @swagger
 * /departments:
 *   post:
 *     summary: Create a new department
 *     description: Create a new department in the organization
 *     tags: [Departments]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/octet-stream:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - organization_id
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the department
 *                 minLength: 2
 *                 maxLength: 255
 *               description:
 *                 type: string
 *                 description: Description of the department
 *                 minLength: 3
 *                 maxLength: 255
 *               organization_id:
 *                 type: integer
 *                 description: ID of the organization
 *     responses:
 *       201:
 *         description: Department created successfully
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
 *       409:
 *         description: Department with same name already exists
 *         content:
 *           application/octet-stream:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
@Controller()
export class NewDepartmentController extends BasePostController {
  @inject(DepartmentCreationService)
  private service: DepartmentCreationService;
  @ApiControllerMethod({
    bodySchema: newDepartmentSchema,
    pathParamTransform: {},
    auth: true,
    audit: userAudit('create'),
    bodyBindOrgId: true
  })
  async post({ res, body }: ApiRequestContext<NewDepartmentPayload>) {
    const feedback = await this.service.create({ data: body! });

    return createHttpResponse(res, {
      ...feedback,
      statusCode: feedback.status
    });
  }
}
