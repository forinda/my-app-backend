import { z } from 'zod';

export const memberUpdatePersonalOrgProfileSchema = z.object({
  tax_id: z.string(),
  country: z.string(),
  state: z.string(),
  city: z.string(),
  address: z.string(),
  zip_code: z.string(),
  national_id: z.string(),
  currency: z.string().default('KSH'),
  organization_id: z.coerce.number().positive()
});
