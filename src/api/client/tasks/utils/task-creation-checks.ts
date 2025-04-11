import type { DrizzleTransaction } from '@/db';
import type {
  AssignTaskPayload,
  NewTaskPayload,
  UnAssignTaskPayload,
  UpdateTaskPayload
} from '../schema/schema';
import { ApiError } from '@/common/errors/base';
import { HttpStatus } from '@/common/http';
import type { SelectOrgWorkspaceInterface } from '@/db/schema';
import {
  OrgTask,
  OrgProject,
  OrgWorkspace,
  OrgProjectMember,
  Organization
} from '@/db/schema';
import { and, eq, ne } from 'drizzle-orm';

import { dependency } from '@/common/di';

type ActionTypes = 'create' | 'update';

@dependency()
export class TaskCreationAndUpdateCheckUtil {
  private runCommonChecks(transaction: DrizzleTransaction) {
    return async (data: NewTaskPayload | UpdateTaskPayload) => {
      let workspace: SelectOrgWorkspaceInterface | undefined = undefined;

      if (data.parent_id) {
        const parentTask = await transaction!.query.OrgTask.findFirst({
          where: and(
            eq(OrgTask.id, data.parent_id),
            eq(OrgTask.organization_id, data.organization_id)
          )
        });

        if (!parentTask) {
          throw new ApiError('Parent task not found', HttpStatus.NOT_FOUND, {});
        }
      }
      if (data.project_id) {
        const project = await transaction!.query.OrgProject.findFirst({
          where: and(
            eq(OrgProject.id, data.project_id),
            eq(OrgProject.organization_id, data.organization_id)
          )
        });

        if (!project) {
          throw new ApiError('Project not found', HttpStatus.NOT_FOUND, {});
        }
      }
      if (data.workspace_id) {
        workspace = await transaction!.query.OrgWorkspace.findFirst({
          where: and(
            eq(OrgWorkspace.uuid, data.workspace_id),
            eq(OrgWorkspace.organization_id, data.organization_id)
          )
        });

        if (!workspace) {
          throw new ApiError('Workspace not found', HttpStatus.NOT_FOUND, {});
        }
      }
      // Check dates
      if (data.due_date && data.start_date) {
        if (data.due_date < data.start_date) {
          throw new ApiError(
            'Due date cannot be less than start date',
            HttpStatus.BAD_REQUEST,
            {}
          );
        }
      }
      if (data.end_date && data.start_date) {
        if (data.end_date < data.start_date) {
          throw new ApiError(
            'End date cannot be less than start date',
            HttpStatus.BAD_REQUEST,
            {}
          );
        }
      }
      if (data.assignee_id) {
        const assignee = await transaction!.query.OrganizationMember.findFirst({
          where: eq(OrgProjectMember.id, data.assignee_id)
        });

        if (!assignee) {
          throw new ApiError('Assignee not found', HttpStatus.NOT_FOUND, {});
        }
      }

      return {
        workspace
      };
    };
  }
  private runCreationChecks(transaction: DrizzleTransaction) {
    return async (data: NewTaskPayload) => {
      const foundOrgTask = await transaction!.query.OrgTask.findFirst({
        where: and(
          eq(OrgTask.title, data.title),
          eq(OrgTask.organization_id, data.organization_id)
        )
      });

      if (foundOrgTask) {
        throw new ApiError(
          'Task with same title already exists',
          HttpStatus.CONFLICT,
          {}
        );
      }
      const org = await transaction!.query.Organization.findFirst({
        where: eq(Organization.id, data.organization_id),
        columns: { id: true, task_ref_format: true, wc_task_count: true }
      });

      if (!org) {
        throw new ApiError('Organization not found', HttpStatus.NOT_FOUND, {});
      }

      return {
        task_ref_format: org.task_ref_format,
        ref_count: org.wc_task_count
      };
    };
  }

  private generateNextTaskRef(transaction: DrizzleTransaction) {
    return async function (
      task_ref_format: string,
      ref_count: number,
      org_id: number
    ) {
      const replaceble = /{{id}}/g;
      const nextCount = ref_count + 1;

      await transaction!
        .update(Organization)
        .set({ wc_task_count: nextCount })
        .where(eq(Organization.id, org_id));

      return task_ref_format
        .replace(replaceble, nextCount.toString())
        .padStart(4, '0');
    };
  }
  private runUpdateChecks(transaction: DrizzleTransaction) {
    return async (data: UpdateTaskPayload) => {
      const foundOrgTask = await transaction!.query.OrgTask.findFirst({
        where: and(
          eq(OrgTask.title, data.title),
          eq(OrgTask.organization_id, data.organization_id),
          ne(OrgTask.id, data.task_id)
        )
      });

      if (foundOrgTask) {
        throw new ApiError(
          'Task with same title already exists',
          HttpStatus.CONFLICT,
          {}
        );
      }
    };
  }
  public runCreationOrUpdateChecks(
    type: ActionTypes,
    transaction: DrizzleTransaction
  ) {
    return async (data: NewTaskPayload | UpdateTaskPayload) => {
      const result = await this.runCommonChecks(transaction)(data);

      // const
      if (type === 'create') {
        const { task_ref_format, ref_count } = await this.runCreationChecks(
          transaction
        )(data as NewTaskPayload);
        const nextRef = await this.generateNextTaskRef(transaction)(
          task_ref_format,
          ref_count!,
          data.organization_id
        );

        return { ...result, nextRef };
      }
      await this.runUpdateChecks(transaction)(data as UpdateTaskPayload);

      return { ...result, nextRef: undefined };
    };
  }

  public runAssignChecks(transaction: DrizzleTransaction) {
    return async (data: AssignTaskPayload) => {
      if (data.assignee_id) {
        const assignee = await transaction!.query.OrganizationMember.findFirst({
          where: eq(OrgProjectMember.user_id, data.assignee_id)
        });

        if (!assignee) {
          throw new ApiError('Assignee not found', HttpStatus.NOT_FOUND, {});
        }
      }
      const task = await transaction!.query.OrgTask.findFirst({
        where: and(
          eq(OrgTask.id, data.task_id),
          eq(OrgTask.organization_id, data.organization_id)
        )
      });

      if (!task) {
        throw new ApiError('Task not found', HttpStatus.NOT_FOUND, {});
      }
    };
  }

  public runUnAssignChecks(transaction: DrizzleTransaction) {
    return async (data: UnAssignTaskPayload) => {
      const task = await transaction!.query.OrgTask.findFirst({
        where: and(
          eq(OrgTask.id, data.task_id),
          eq(OrgTask.organization_id, data.organization_id)
        )
      });

      if (!task) {
        throw new ApiError('Task not found', HttpStatus.NOT_FOUND, {});
      }
    };
  }
}
