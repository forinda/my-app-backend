import { dependency } from '../di';
import crypto from 'crypto';
// export function generateAvatar(first_name: string, last_name: string) {
//   return `https://avatar.iran.liara.run/username?username=${first_name}+${last_name}`;
// }

@dependency()
export class Avatar {
  generateAvatar(first_name: string, last_name: string) {
    return `https://avatar.iran.liara.run/username?username=${first_name}+${last_name}`;
  }

  generateOrgLogo(name: string) {
    const orgName = name.replace(/\s/g, '+');
    const md5Hash = crypto.createHash('md5').update(orgName).digest('hex');

    return `https://robohash.org/${md5Hash}?gravatar=hashed&size=500x500&bgset=bg1&ignoreext=false`;
  }
}
