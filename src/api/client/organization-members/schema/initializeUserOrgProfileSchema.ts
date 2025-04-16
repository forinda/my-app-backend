import { z } from 'zod';
import { employmentTypeSchema } from './employmentTypeSchema';
import { salaryTypeSchema } from './salaryTypeSchema';

export const initializeUserOrgProfileSchema = z.object({
  organization_id: z.coerce.number().positive(),
  designation_id: z.coerce.number().positive(),
  employee_user_id: z.coerce
    .string()
    .nonempty({ message: 'User ID is required' }),
  tax_id: z.string(),
  country: z.string(),
  state: z.string(),
  city: z.string(),
  address: z.string(),
  zip_code: z.string(),
  national_id: z.string(),
  currency: z.string().default('KSH'),
  starting_salary: z.number().positive().default(0),
  salary_type: salaryTypeSchema.default('hourly'),
  employment_type: employmentTypeSchema.default('full_time'),
  updated_by: z.coerce.number().positive()
});
