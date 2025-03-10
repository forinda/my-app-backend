import { Dependency } from '@/common/di';
import { injectable } from 'inversify';
import type { CreateTimeLogType, UpdateTimeLogType } from '../schema/schema';
import type { DrizzleTransaction } from '@/db';
import { and, eq } from 'drizzle-orm';
import {
  OrgProject,
  OrgProjectMember,
  OrgProjectTimeLogCategory,
  OrgTimeLogCategory,
  OrgUserTimeLog
} from '@/db/schema';
import { ApiError } from '@/common/errors/base';
import { HttpStatus } from '@/common/http';

type CreatePayload = CreateTimeLogType & {
  current_user_id: number;
};

type UpdatePayload = UpdateTimeLogType & {
  current_user_id: number;
};

@injectable()
@Dependency()
export class TimeLogPrerequisiteProcessor {
  private async checkUserProjectAccess(
    payload: CreatePayload | UpdatePayload,
    transaction: DrizzleTransaction
  ) {
    // Check if the user has access to the project
    const project = await transaction.query.OrgProject.findFirst({
      where: and(
        eq(OrgProject.id, payload.project_id),
        eq(OrgProject.organization_id, payload.organization_id)
      )
    });

    if (!project) {
      throw new ApiError('Project not found', HttpStatus.NOT_FOUND, {});
    }
    if (!project.is_active) {
      throw new ApiError('Project is not active', HttpStatus.CONFLICT, {});
    }
    const projectMember = await transaction.query.OrgProjectMember.findFirst({
      where: and(
        eq(OrgProjectMember.project_id, payload.project_id),
        eq(OrgProjectMember.user_id, payload.current_user_id)
        // eq(OrgProjectMember, true)
      )
    });

    if (!projectMember) {
      throw new ApiError(
        `User does not have access to the project(${project.name})`,
        HttpStatus.FORBIDDEN,
        {}
      );
    }
    if (!projectMember.is_active) {
      throw new ApiError(
        `User does not have access to the project(${project.name})`,
        HttpStatus.FORBIDDEN,
        {}
      );
    }

    const timeLogCategory =
      await transaction.query.OrgTimeLogCategory.findFirst({
        where: and(
          eq(OrgTimeLogCategory.id, payload.task_log_category_id),
          eq(OrgTimeLogCategory.organization_id, payload.organization_id)
        )
      });

    if (!timeLogCategory) {
      throw new ApiError(
        'Time log category not found',
        HttpStatus.NOT_FOUND,
        {}
      );
    }
    const projectTimeLogCategory =
      await transaction.query.OrgProjectTimeLogCategory.findFirst({
        where: and(
          eq(OrgProjectTimeLogCategory.project_id, payload.project_id),
          eq(
            OrgProjectTimeLogCategory.task_log_category_id,
            payload.task_log_category_id
          )
        )
      });

    if (!projectTimeLogCategory) {
      throw new ApiError(
        'Time log category not found in the project',
        HttpStatus.NOT_FOUND,
        {}
      );
    }
    if (!projectTimeLogCategory.is_active) {
      throw new ApiError(
        'Time log category is not active in the project',
        HttpStatus.CONFLICT,
        {}
      );
    }
  }

  private checkIfWorkDateIsTwoDayAgo(
    payload: Pick<CreatePayload, 'work_date'>
  ) {
    const workDate = new Date(payload.work_date);
    const twoDaysAgo = new Date();

    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    if (workDate < twoDaysAgo) {
      throw new ApiError(
        'You can only log time for the last two days',
        HttpStatus.BAD_REQUEST,
        {}
      );
    }
    if (workDate > new Date()) {
      throw new ApiError(
        'You can only log time for the last two days',
        HttpStatus.BAD_REQUEST,
        {}
      );
    }
  }

  public async processPreCreation(
    payload: CreatePayload,
    transaction: DrizzleTransaction
  ) {
    await this.checkUserProjectAccess(payload, transaction);
    this.checkIfWorkDateIsTwoDayAgo(payload);
  }
  public async processPreUpdate(
    payload: UpdatePayload,
    transaction: DrizzleTransaction
  ) {
    const timeLog = await transaction.query.OrgUserTimeLog.findFirst({
      where: and(
        eq(OrgUserTimeLog.id, payload.time_log_id),
        eq(OrgUserTimeLog.organization_id, payload.organization_id)
      )
    });

    if (!timeLog) {
      throw new ApiError('Time log not found', HttpStatus.NOT_FOUND, {});
    }
    if (timeLog.invoice_status !== 'pending') {
      throw new ApiError(
        'Time log is already invoiced',
        HttpStatus.BAD_REQUEST,
        {}
      );
    }
    await this.checkUserProjectAccess(payload, transaction);
    this.checkIfWorkDateIsTwoDayAgo(payload);
  }
}
