import { BaseGetController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject } from 'inversify';
import { FetchDepartmentService } from '../services/fetch.service';
import { createHttpResponse } from '@/common/utils/responder';

/**
 * @swagger
 * /departments:
 *   get:
 *     summary: Get all departments
 *     description: Retrieve a list of all departments for the organization
 *     tags: [Departments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of departments retrieved successfully
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Department'
 *                 message:
 *                   type: string
 *                 status:
 *                   type: integer
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
 */
@Controller()
export class FetchDepartmentsController extends BaseGetController {
  @inject(FetchDepartmentService)
  private service: FetchDepartmentService;

  @ApiControllerMethod({
    paginate: true,
    auth: true,
    bodyBindOrgId: true
  })
  async get({ res, pagination, organization_id }: ApiRequestContext) {
    const feed = await this.service.get(organization_id!, pagination);

    return createHttpResponse(res, { ...feed, statusCode: feed.status });
  }
}
