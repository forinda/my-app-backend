import { Department } from '@/db/schema';
import { useDrizzle } from '@/db';
import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import { eq } from 'drizzle-orm';

@dependency()
export class FetchDepartmentByIdService {
  async get(organization_id: number, department_id: string) {
    const db = useDrizzle();

    const depts = await db.query.Department.findFirst({
      where: eq(Department.uuid, department_id),
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
              // with: {}
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
        }
      }
    });

    return {
      data: depts,
      message: 'Department fetched successfully',
      status: HttpStatus.OK
    };
  }
}
