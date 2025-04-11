import { z } from 'zod';

export const respondToOrgInviteSchema = z.object({
  invite_id: z.coerce.number().positive(),
  action: z.enum(['accepted', 'rejected'])
});
