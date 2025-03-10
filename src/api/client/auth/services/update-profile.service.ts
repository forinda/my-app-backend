import { injectable } from 'inversify';
import { Dependency } from '@/common/di';
import type { TransactionContext } from '@/common/decorators/service-transaction';
import { TransactionalService } from '@/common/decorators/service-transaction';
import { HttpStatus } from '@/common/http';
import { User } from '@/db/schema';
import { eq, or } from 'drizzle-orm';
import { formatKenyanPhone } from '@/common/utils/phone-number-format';
import type { UpdateUserProfileInput } from '../schema/schema';
import { ApiError } from '@/common/errors/base';

@injectable()
@Dependency()
export class UpdateUserProfileService {
  @TransactionalService()
  async update({
    data,
    transaction
  }: TransactionContext<UpdateUserProfileInput>) {
    if (data.phone_number) {
      data.phone_number = formatKenyanPhone(data.phone_number);
    }
    const filterExistingUserQuery = or(
      eq(User.email, data.email),
      eq(User.username, data.username),
      eq(User.phone_number, data.phone_number)
    );
    const existingUser = await transaction!.query.User.findFirst({
      where: filterExistingUserQuery
    });

    if (existingUser && existingUser.uuid !== data.user_id) {
      const emailMatch = existingUser.email === data.email;
      const usernameMatch = existingUser.username === data.username;
      const phoneMatch = existingUser.phone_number === data.phone_number;
      let message = 'User already exists';

      if (emailMatch) {
        message = 'Email already exists';
      }
      if (usernameMatch) {
        message = 'Username already exists';
      }
      if (phoneMatch) {
        message = 'Phone number already exists';
      }

      throw new ApiError(message, HttpStatus.BAD_REQUEST, {});
    }

    await transaction!
      .update(User)
      .set(data)
      .where(eq(User.uuid, data.user_id))
      .returning()
      .execute();

    return {
      status: HttpStatus.OK,
      data: {},
      message: 'Profile updated successfully'
    };
  }
}
