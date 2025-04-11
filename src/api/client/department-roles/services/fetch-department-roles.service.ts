import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import type { ApiPaginationParams } from '@/common/utils/pagination';
import { useDrizzle } from '@/db';
import { and, eq } from 'drizzle-orm';
import { DepartmentUserRole, Department } from '@/db/schema';
import type { GetDepartmentUserRoleRequest } from '../schema/schema';

@dependency()
export class FetchDepartmentRolesService {
  async get(
    organization_id: number,
    query: GetDepartmentUserRoleRequest,
    pagination?: ApiPaginationParams
  ) {
    const db = useDrizzle();
    const { department_id, is_active, is_head } = query;

    const department = await db.query.Department.findFirst({
      where: and(
        eq(Department.uuid, department_id!),
        eq(Department.organization_id, organization_id)
      )
    });

    if (!department) {
      return {
        data: [],
        message: 'Department not found',
        status: HttpStatus.NOT_FOUND
      };
    }

    const roles = await db.query.DepartmentUserRole.findMany({
      where: and(
        eq(DepartmentUserRole.department_id, department.id),
        ...(is_active !== undefined
          ? [eq(DepartmentUserRole.is_active, is_active)]
          : []),
        ...(is_head !== undefined
          ? [eq(DepartmentUserRole.is_head, is_head)]
          : [])
      ),
      with: {
        // user: true,
        // role_title: true
        department: {
          columns: {
            name: true,
            uuid: true
          }
        },
        role_title: {
          columns: {
            name: true,
            id: true
          }
        },
        user: {
          columns: {
            first_name: true,
            last_name: true,
            email: true,
            avatar: true,
            id: true
          }
        }
      },
      limit: pagination?.limit,
      offset: pagination?.offset
    });

    return {
      data: roles,
      message: 'Department roles fetched successfully',
      status: HttpStatus.OK
    };
  }
}
