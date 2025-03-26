import { OrgTask } from '@/db/schema';
import { useDrizzle } from '@/db';
import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import { and, eq } from 'drizzle-orm';
import { inject } from 'inversify';
import { UUID } from '@/common/utils/uuid';

@dependency()
export class FetchTaskByIdService {
  @inject(UUID) private _: UUID;
  async get(organization_id: number, task_id: string) {
    this._.validateUUID(task_id, { throwError: true });
    const db = useDrizzle();
    const filterCondition = and(
      eq(OrgTask.uuid, task_id),
      eq(OrgTask.organization_id, organization_id)
    );
    const data = await db.query.OrgTask.findFirst({
      where: filterCondition,
      with: {
        parent: true,
        sub_tasks: {
          columns: {
            id: true,
            title: true,
            description: true,
            status: true,
            created_at: true
          }
        },
        assignee: {
          columns: {
            id: true,
            username: true,
            first_name: true,
            last_name: true,
            email: true,
            avatar: true
          }
        },
        comments: {
          columns: {
            id: true,
            text: true,
            created_at: true,
            task_id: true
          },
          with: {
            creator: {
              columns: {
                first_name: true,
                last_name: true,
                avatar: true
              }
            }
          }
        },
        project: {
          columns: {
            id: true,
            name: true,
            description: true,
            start_date: true,
            end_date: true
          }
        },
        workspace: {
          columns: {
            id: true,
            name: true
          }
        },
        creator: {
          columns: {
            id: true,
            username: true,
            first_name: true,
            last_name: true,
            email: true,
            avatar: true
          }
        }
      }
    });

    return {
      data,
      message: 'Task fetched successfully',
      status: HttpStatus.OK
    };
  }
}
