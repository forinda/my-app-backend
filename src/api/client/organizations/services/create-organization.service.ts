import type { CreateOrganizationInputType } from '../schema/schema';

import { eq } from 'drizzle-orm';

import { HttpStatus } from '@/common/http';
import { dependency } from '@/common/di';
import {
  TransactionalService,
  type TransactionContext
} from '@/common/decorators/service-transaction';
import { ApiError } from '@/common/errors/base';
import type { InsertOrganizationInterface } from '@/db/schema';
import { Organization, OrganizationMember } from '@/db/schema';
import { Avatar } from '@/common/utils/avatar';
import { inject } from 'inversify';

@dependency()
export class CreateOrganizationService {
  @inject(Avatar) private avatar: Avatar;
  @TransactionalService()
  async create({
    data,
    transaction
  }: TransactionContext<CreateOrganizationInputType>) {
    const exisiting = await transaction!.query.Organization.findFirst({
      where: eq(Organization.name, data.name)
    });

    if (exisiting) {
      throw new ApiError(
        'Organization with same name already exists',
        HttpStatus.CONFLICT,
        {}
      );
    }
    (data as any)['logo'] = this.avatar.generateOrgLogo(data.name);

    const organization = (
      await transaction!
        .insert(Organization)
        .values(data as InsertOrganizationInterface)
        .returning()
        .execute()
    )[0];

    await transaction!.insert(OrganizationMember).values({
      user_id: organization!.created_by,
      organization_id: organization.id,
      updated_by: organization!.created_by,
      role: 'Owner',
      date_joined: new Date().toISOString(),
      created_by: organization!.created_by
    });

    return {
      data: organization,
      status: HttpStatus.CREATED,
      message: 'Organization created successfully'
    };
  }
}
