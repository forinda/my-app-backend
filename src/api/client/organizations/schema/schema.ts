import z from 'zod';

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
  updated_by: z.coerce.number({}).positive()
});

export type CreateOrganizationInputType = z.infer<
  typeof createOrganizationSchema
>;

export type UpdateOrganizationInputType = z.infer<
  typeof updateOrganizationSchema
>;
