import { OrgProjectCategory } from '@/db/schema';
import { useDrizzle } from '@/db';
import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import { eq } from 'drizzle-orm';

@dependency()
export class FetchProjectCategoryByIdService {
  async get(project_category_id: number) {
    const db = useDrizzle();

    const data = await db.query.OrgProjectCategory.findFirst({
      where: eq(OrgProjectCategory.id, project_category_id),
      with: {
        projects: {
          with: {
            members: {
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
            },
            category: {
              columns: {
                id: true,
                name: true,
                description: true
              }
            }
          }
        }
      }
    });

    return {
      data: data,
      message: 'Project Category fetched successfully',
      status: HttpStatus.OK
    };
  }
}
