import { z } from 'zod';
import { orgMemberRoleSchema } from './orgMemberRoleSchema';

export const addMemberToOrRemoveFromOrgSchema = z.object({
  organization_id: z.coerce
    .number({ message: 'Organization ID is required' })
    .positive(),
  emails: z
    .array(z.string().email().toLowerCase().trim().nonempty(), {
      message: 'Emails is required'
    })
    .min(1, 'At least one user is required'),
  designation_id: z.coerce.number().positive(),
  role: orgMemberRoleSchema.default('Member'),
  created_by: z.coerce.number().positive(),
  updated_by: z.coerce.number().positive()
});
