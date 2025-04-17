import { inject } from 'inversify';
import { and, eq, ne } from 'drizzle-orm';

import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import {
  TransactionalService,
  type TransactionContext
} from '@/common/decorators/service-transaction';
import { Organization, OrganizationMember, User } from '@/db/schema';
import type { InitializeUserOrganizationProfileType } from '../schema';
import { ApiError } from '@/common/errors/base';
import { UUID } from '@/common/utils/uuid';
import { convertToNumber } from '@/common/utils/numbers';

@dependency()
export class InitOrgMemberProfileService {
  @inject(UUID) private uuid: UUID;
  @TransactionalService()
  async init({
    data,
    transaction
  }: TransactionContext<InitializeUserOrganizationProfileType>) {
    this.uuid.validateUUID(data.employee_user_id);
    const existingOrg = await transaction!.query.Organization.findFirst({
      where: eq(Organization.id, data.organization_id)
    });

    if (!existingOrg) {
      throw new ApiError('Organization not found', HttpStatus.NOT_FOUND, {});
    }
    const existingUser = await transaction!.query.User.findFirst({
      where: eq(User.uuid, data.employee_user_id)
    });

    if (!existingUser) {
      throw new ApiError('User not found', HttpStatus.NOT_FOUND, {});
    }
    const { ...existingOrgMember } =
      await transaction!.query.OrganizationMember.findFirst({
        where: and(
          eq(OrganizationMember.organization_id, data.organization_id),
          eq(OrganizationMember.user_id, existingUser.id)
        )
      });

    if (!existingOrgMember) {
      throw new ApiError(
        'User is not a member of the organization',
        HttpStatus.NOT_FOUND,
        {}
      );
    }
    if (!existingOrgMember.is_active) {
      throw new ApiError(
        'User is not an active member of the organization',
        HttpStatus.NOT_FOUND,
        {}
      );
    }

    if (existingOrgMember.starting_salary !== null) {
      delete (data as any).starting_salary;
    }
    if (existingOrgMember.current_salary !== null) {
      delete (data as any).current_salary;
    }
    if (data.tax_id) {
      const existingTaxId =
        await transaction!.query.OrganizationMember.findFirst({
          where: and(
            eq(OrganizationMember.tax_id, data.tax_id),
            eq(OrganizationMember.organization_id, data.organization_id),
            ne(OrganizationMember.user_id, existingUser.id)
          )
        });

      if (existingTaxId) {
        throw new ApiError('Tax ID already exists', HttpStatus.CONFLICT, {});
      }
    }
    if (data.national_id) {
      const existingNationalId =
        await transaction!.query.OrganizationMember.findFirst({
          where: and(
            eq(OrganizationMember.national_id, data.national_id),
            eq(OrganizationMember.organization_id, data.organization_id),
            ne(OrganizationMember.user_id, existingUser.id)
          )
        });

      if (existingNationalId) {
        throw new ApiError(
          'National ID already exists',
          HttpStatus.CONFLICT,
          {}
        );
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, ...initialState } = existingOrgMember;
    const update = {
      ...initialState,
      ...data,
      starting_salary: convertToNumber(
        existingOrgMember.starting_salary
          ? existingOrgMember.starting_salary
          : data.starting_salary
      ) as unknown as string,
      current_salary: convertToNumber(
        existingOrgMember.current_salary
          ? existingOrgMember.current_salary
          : data.starting_salary
      ) as unknown as string
    };

    if (
      Number.isNaN(update.starting_salary) ||
      Number.isNaN(update.current_salary)
    ) {
      throw new ApiError('Invalid salary value', HttpStatus.BAD_REQUEST, {});
    }

    await transaction!
      .update(OrganizationMember)
      .set(update)
      .where(
        and(
          eq(OrganizationMember.organization_id, data.organization_id),
          eq(OrganizationMember.user_id, existingUser.id)
        )
      )
      .execute();

    return {
      data: {},
      status: HttpStatus.OK,
      message: `Successfully updated organization member`
    };
  }
}
