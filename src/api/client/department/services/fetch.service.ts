import { Department } from '@/db/schema';
import { useDrizzle } from '@/db';
import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import { type ApiPaginationParams, paginator } from '@/common/utils/pagination';
import { asc, eq } from 'drizzle-orm';

@dependency()
export class FetchDepartmentService {
  async get(organization_id: number, _?: ApiPaginationParams) {
    const db = useDrizzle();

    const fetchCondition = eq(Department.organization_id, organization_id);
    const totalItems = await db.$count(Department, fetchCondition);
    const depts = await db.query.Department.findMany({
      where: fetchCondition,
      with: {
        members: {
          columns: {
            id: true,
            user_id: true,
            department_id: true
          },
          with: {
            user: {
              columns: {
                username: true,
                email: true,
                first_name: true,
                last_name: true,
                phone_number: true,
                avatar: true,
                gender: true
              }
            }
          }
        },
        user_roles: {
          columns: {
            id: true,
            user_id: true,
            is_active: true,
            start_date: true,
            end_date: true,
            role_title_id: true,
            created_at: true
          },
          with: {
            role_title: {
              columns: {
                id: true,
                name: true
              }
            },
            user: {
              columns: {
                first_name: true,
                last_name: true
              }
            }
          }
        },
        head: {
          columns: {
            id: true,
            avatar: true,
            username: true,
            first_name: true,
            last_name: true
          }
        }
      },
      limit: _?.limit,
      offset: _?.offset,
      orderBy: [asc(Department.created_at)]
    });

    return {
      ...paginator(depts, totalItems, _!),
      // data: depts,
      message: 'Departments fetched successfully',
      status: HttpStatus.OK
    };
  }
}
