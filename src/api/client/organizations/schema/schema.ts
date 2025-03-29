import { companySizes } from '@/common/constants/company-sizes';
import { taskRefFormatSchema } from '@/common/schema/task-ref';
import { validatePhone } from '@/common/utils/phone-number-format';
import z from 'zod';

export const companySizeSchema = z.enum(companySizes);

export const createOrganizationSchema = z.object({
  name: z
    .string({
      message: 'Name is required'
    })
    .nonempty({
      message: 'Name cannot be empty'
    })
    .min(3, {
      message: 'Name must be at least 3 characters long'
    })
    .max(255, {
      message: 'Name must be at most 255 characters long'
    })
    .trim(),
  description: z
    .string({
      message: 'Description is required'
    })
    .min(3, {
      message: 'Description must be at least 3 characters long'
    })
    .max(255, {
      message: 'Description must be at most 255 characters long'
    }),
  industry: z.string(),
  size: companySizeSchema.default('1-10 employees'),
  website: z.coerce
    .string({})
    .url({
      message: 'Website URL is invalid'
    })
    .optional(),
  contact_email: z.string().email().optional(),
  contact_phone: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (value && value.length > 1) {
          return validatePhone.validate(value);
        }

        return true;
      },
      {
        message: validatePhone.message
      }
    ),
  contact_address: z.string(),
  location: z.string(),
  task_ref_format: taskRefFormatSchema,
  created_by: z.coerce.number({}).positive().optional(),
  updated_by: z.coerce.number({}).positive().optional()
});

export const updateOrganizationSchema = z.object({
  organization_id: z
    .string({
      message: 'Organization ID is required'
    })
    .nonempty({
      message: 'Organization ID cannot be empty'
    }),
  name: z
    .string({
      message: 'Name is required'
    })
    .min(3, {
      message: 'Name must be at least 3 characters long'
    })
    .max(255, {
      message: 'Name must be at most 255 characters long'
    }),
  description: z
    .string({
      message: 'Description is required'
    })
    .min(3, {
      message: 'Description must be at least 3 characters long'
    })
    .max(255, {
      message: 'Description must be at most 255 characters long'
    }),
  industry: z.string().optional(),
  size: companySizeSchema.default('1-10 employees'),
  website: z.coerce
    .string({})
    .url({
      message: 'Website URL is invalid'
    })
    .optional(),
  contact_email: z.string().email().optional(),
  contact_phone: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (value && value.length > 1) {
          return validatePhone.validate(value);
        }

        return true;
      },
      {
        message: validatePhone.message
      }
    ),
  contact_address: z.string(),
  task_ref_format: taskRefFormatSchema,
  location: z.string(),
  updated_by: z.coerce.number({}).positive()
});

export type CreateOrganizationInputType = z.infer<
  typeof createOrganizationSchema
>;

export type UpdateOrganizationInputType = z.infer<
  typeof updateOrganizationSchema
>;
