import { and, eq, ne } from 'drizzle-orm';

import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import {
  TransactionalService,
  type TransactionContext
} from '@/common/decorators/service-transaction';
import { Organization, OrganizationMember, User } from '@/db/schema';
import type { UpdatePersonalOrgProfileType } from '../schema';
import { ApiError } from '@/common/errors/base';

@dependency()
export class UpdateOrgPersonalProfileService {
  @TransactionalService()
  async update({
    data,
    transaction
  }: TransactionContext<
    UpdatePersonalOrgProfileType & {
      current_user_id: number;
    }
  >) {
    const existingOrg = await transaction!.query.Organization.findFirst({
      where: eq(Organization.id, data.organization_id)
    });

    if (!existingOrg) {
      throw new ApiError('Organization not found', HttpStatus.NOT_FOUND, {});
    }
    const existingUser = await transaction!.query.User.findFirst({
      where: eq(User.id, data.current_user_id)
    });

    if (!existingUser) {
      throw new ApiError('User not found', HttpStatus.NOT_FOUND, {});
    }
    const existingOrgMember =
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
    const update = {
      ...existingOrgMember,
      ...data
    };

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
      message: `Profile updated successfully`
    };
  }
}
