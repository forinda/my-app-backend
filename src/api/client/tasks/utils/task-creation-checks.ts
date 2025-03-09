import type { DrizzleTransaction } from '@/db';
import type {
  AssignTaskPayload,
  NewTaskPayload,
  UnAssignTaskPayload,
  UpdateTaskPayload
} from '../schema/schema';
import { ApiError } from '@/common/errors/base';
import { HttpStatus } from '@/common/http';
import {
  OrgTask,
  OrgProject,
  OrgWorkspace,
  OrgProjectMember
} from '@/db/schema';
import { and, eq, ne } from 'drizzle-orm';
import { injectable } from 'inversify';
import { Dependency } from '@/common/di';

type ActionTypes = 'create' | 'update';

@injectable()
@Dependency()
export class TaskCreationAndUpdateCheckUtil {
  private runCommonChecks(transaction: DrizzleTransaction) {
    return async (data: NewTaskPayload | UpdateTaskPayload) => {
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
        const workspace = await transaction!.query.OrgWorkspace.findFirst({
          where: and(
            eq(OrgWorkspace.id, data.workspace_id),
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
      await this.runCommonChecks(transaction)(data);
      await (type === 'create'
        ? this.runCreationChecks(transaction)(data as NewTaskPayload)
        : this.runUpdateChecks(transaction)(data as UpdateTaskPayload));
    };
  }

  public runAssignChecks(transaction: DrizzleTransaction) {
    return async (data: AssignTaskPayload) => {
      if (data.assignee_id) {
        const assignee = await transaction!.query.OrganizationMember.findFirst({
          where: eq(OrgProjectMember.id, data.assignee_id)
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
