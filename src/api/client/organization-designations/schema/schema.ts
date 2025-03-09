import z from 'zod';

export const createOrgDesignationSchema = z.object({
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
  organization_id: z.coerce.number({}).positive(),
  created_by: z.coerce.number({}).positive().optional(),
  updated_by: z.coerce.number({}).positive().optional()
});

export const updateOrganizationDesignationSchema = z.object({
  designation_id: z.number({
    message: 'Designation ID is required'
  }),
  organization_id: z
    .number({
      message: 'Organization ID is required'
    })
    .positive(),
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
  updated_by: z.number({}).positive()
});

export type CreateOrganizationDesignationInputType = z.infer<
  typeof createOrgDesignationSchema
>;

export type UpdateOrganizationDesignationInputType = z.infer<
  typeof updateOrganizationDesignationSchema
>;
