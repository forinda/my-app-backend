import { Department, DepartmentMember } from '@/db/schema';
import { useDrizzle } from '@/db';
import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import { eq } from 'drizzle-orm';
import { inject } from 'inversify';
import { UUID } from '@/common/utils/uuid';

@dependency()
export class FetchDepartmentMembersService {
  @inject(UUID) private uuid: UUID;
  async get(department_id: string) {
    const db = useDrizzle();

    this.uuid.validateUUID(department_id, { throwError: true });
    const dept = await db.query.Department.findFirst({
      where: eq(Department.uuid, department_id),
      columns: {
        id: true,
        name: true
      }
    });

    if (!dept) {
      return {
        data: null,
        message: 'Department not found',
        status: HttpStatus.NOT_FOUND
      };
    }

    const members = await db.query.DepartmentMember.findMany({
      where: eq(DepartmentMember.department_id, dept.id),
      with: {
        user: {
          columns: {
            username: true,
            email: true,
            first_name: true,
            last_name: true,
            phone_number: true,
            avatar: true
          }
        }
      }
    });

    return {
      data: members,
      message: 'Department members fetched successfully',
      status: HttpStatus.OK
    };
  }
}
