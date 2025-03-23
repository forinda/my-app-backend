import { OrgWorkspace } from '@/db/schema';
import { useDrizzle } from '@/db';
import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import { eq } from 'drizzle-orm';
import { inject } from 'inversify';
import { UUID } from '@/common/utils/uuid';

@dependency()
export class FetchWorkspaceByIdService {
  @inject(UUID) private uuid: UUID;
  async get(workspace_id: string) {
    const db = useDrizzle();

    this.uuid.validateUUID(workspace_id);
    const depts = await db.query.OrgWorkspace.findFirst({
      where: eq(OrgWorkspace.uuid, workspace_id),
      with: {
        members: {
          columns: {
            id: true,
            user_id: true,
            workspace_id: true,
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
        }
      }
    });

    return {
      data: depts,
      message: 'Workspace fetched successfully',
      status: HttpStatus.OK
    };
  }
}
