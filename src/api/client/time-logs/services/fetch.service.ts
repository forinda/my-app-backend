import { DepartmentTitle, OrgUserTimeLog } from '@/db/schema';
import { useDrizzle } from '@/db';
import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import type { ApiPaginationParams } from '@/common/utils/pagination';
import type { SQL } from 'drizzle-orm';
import { and, asc, eq, ilike, or } from 'drizzle-orm';
import type { FetchTimeLogType } from '../schema/schema';

@dependency()
export class FetchTimeLogService {
  async get(
    organization_id: number,
    query: FetchTimeLogType,
    _?: ApiPaginationParams
  ) {
    const db = useDrizzle();

    const Where: SQL<unknown>[] = [];
    const {
      owner_id,
      task_id,
      project_id,
      invoice_status,
      approval_status,
      q
    } = query;

    if (owner_id) {
      Where.push(eq(OrgUserTimeLog.created_by, owner_id));
    }
    if (task_id) {
      Where.push(eq(OrgUserTimeLog.task_id, task_id));
    }
    if (project_id) {
      Where.push(eq(OrgUserTimeLog.project_id, project_id));
    }
    if (invoice_status) {
      Where.push(eq(OrgUserTimeLog.invoice_status, invoice_status));
    }
    if (approval_status) {
      Where.push(eq(OrgUserTimeLog.approval_status, approval_status));
    }
    if (q) {
      const searchQuery = `%${q}%`;

      Where.push(or(ilike(OrgUserTimeLog.description, searchQuery))!);
    }

    const titles = await db.query.OrgUserTimeLog.findMany({
      where: and(eq(OrgUserTimeLog.organization_id, organization_id), ...Where),
      with: {
        project: {
          columns: {
            id: true,
            name: true
          }
        },
        task: {
          columns: {
            id: true,
            title: true,
            ref: true
          }
        },
        category: {
          columns: {
            id: true,
            name: true
          }
        },
        creator: {
          columns: { first_name: true, last_name: true }
        },
        task_payer: {
          columns: {
            id: true,
            first_name: true,
            last_name: true
          }
        },
        task_invoicer: {
          columns: {
            id: true,
            first_name: true,
            last_name: true
          }
        }
      },
      limit: _?.limit,
      offset: _?.offset,
      orderBy: [asc(DepartmentTitle.created_at)]
    });

    return {
      data: titles,
      message: 'Timelogs fetched successfully',
      status: HttpStatus.OK
    };
  }
}
