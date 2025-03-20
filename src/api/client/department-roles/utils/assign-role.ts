import { dependency } from '@/common/di';

@dependency()
export class AssignRoleUtil {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async assignRole(_data: any) {
    console.log('Assigning role to user');
  }
}
