import type { TransactionContext } from '@/common/decorators/service-transaction';
import { TransactionalService } from '@/common/decorators/service-transaction';
import { dependency } from '@/common/di';

import type { ValidateSwitchOrganizationInput } from '../schema/schema';
import { eq } from 'drizzle-orm';
import { AuthSession } from '@/db/schema';

@dependency()
export class SetCurrentOrganizationSessionIdService {
  @TransactionalService()
  async set(
    payload: TransactionContext<
      ValidateSwitchOrganizationInput & { user_id: string }
    >
  ) {
    const { data, transaction } = payload;
    const userSession = await transaction!.query.AuthSession.findFirst({
      where: eq(AuthSession.auth_session_user_id, data.user_id)
    });

    if (!userSession) {
      return {
        status: 404,
        message: 'User not found'
      };
    }

    await transaction!.update(AuthSession).set({
      auth_session_organization_id: data.organization_id
    });

    return {
      status: 200,
      message: 'Organization set successfully'
    };
  }
}
