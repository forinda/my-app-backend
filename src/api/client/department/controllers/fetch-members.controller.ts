import { BaseGetController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';
import { createHttpResponse } from '@/common/utils/responder';
import { FetchDepartmentMembersService } from '../services/fetch-members.service';

/**
 * @swagger
 * /departments/{id}/members:
 *   get:
 *     summary: Get department members
 *     description: Retrieve all members of a specific department
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
 *     responses:
 *       200:
 *         description: Department members retrieved successfully
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: Member ID
 *                       user_id:
 *                         type: integer
 *                         description: User ID
 *                       department_id:
 *                         type: integer
 *                         description: Department ID
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         description: When the user was added to the department
 *                       user:
 *                         type: object
 *                         properties:
 *                           username:
 *                             type: string
 *                           email:
 *                             type: string
 *                           first_name:
 *                             type: string
 *                           last_name:
 *                             type: string
 *                           phone_number:
 *                             type: string
 *                           avatar:
 *                             type: string
 *                           gender:
 *                             type: string
 *                 message:
 *                   type: string
 *                 status:
 *                   type: integer
 *       400:
 *         description: Invalid UUID format
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
export class FetchDepartmentMembersController extends BaseGetController {
  @inject(FetchDepartmentMembersService)
  private service: FetchDepartmentMembersService;

  @ApiControllerMethod({
    paginate: true,
    auth: true,
    bodyBindOrgId: true,
    pathParamTransform: {
      id: 'department_id'
    }
  })
  async get({ res, params }: ApiRequestContext) {
    const feed = await this.service.get(params!.department_id);

    return createHttpResponse(res, { ...feed, statusCode: feed.status });
  }
}
