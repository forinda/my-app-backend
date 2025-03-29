import { OrgProject } from '@/db/schema';
import { useDrizzle } from '@/db';
import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import { eq } from 'drizzle-orm';
import { inject } from 'inversify';
import { UUID } from '@/common/utils/uuid';

@dependency()
export class FetchProjectByIdService {
  @inject(UUID) private uuid: UUID;
  async get(project_id: string) {
    const db = useDrizzle();

    this.uuid.validateUUID(project_id, { throwError: true });
    const depts = await db.query.OrgProject.findFirst({
      where: eq(OrgProject.uuid, project_id),
      with: {
        members: {
          columns: {
            id: true,
            user_id: true,
            project_id: true,
            created_at: true
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
        tasks: {
          columns: {
            id: true,
            title: true,
            ref: true,
            description: true,
            status: true,
            priority: true,
            due_date: true,
            created_at: true
          }
        },
        category: {
          columns: {
            id: true,
            name: true,
            description: true
          }
        }
      }
    });

    return {
      data: depts,
      message: 'Project fetched successfully',
      status: HttpStatus.OK
    };
  }
}
