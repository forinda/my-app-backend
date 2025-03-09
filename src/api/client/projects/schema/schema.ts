import z from 'zod';

const projectTypeSchema = z.enum(['paid', 'free', 'test', 'trial']);

export const newProjectSchema = z.object({
  name: z
    .string({
      message: 'Name is required'
    })
    .nonempty({
      message: 'Name cannot be empty'
    })
    .min(2, {
      message: 'Name must be at least 3 characters long'
    })
    .max(255, {
      message: 'Name must be at most 255 characters long'
    }),
  project_type: projectTypeSchema,
  category_id: z.number({
    message: 'Please select a category'
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
  created_by: z.number({}).optional(),
  updated_by: z.number({}).optional(),
  organization_id: z.number({
    message: 'Organization ID is required'
  })
});

export const updateProjectSchema = z.object({
  project_id: z.string({
    message: 'ID is required'
  }),
  name: z
    .string({
      message: 'Name is required'
    })
    .min(2, {
      message: 'Name must be at least 3 characters long'
    })
    .max(255, {
      message: 'Name must be at most 255 characters long'
    })
    .optional(),
  description: z
    .string({
      message: 'Description is required'
    })
    .min(3, {
      message: 'Description must be at least 3 characters long'
    })
    .max(255, {
      message: 'Description must be at most 255 characters long'
    })
    .optional(),
  updated_by: z.number({}).optional(),
  organization_id: z.number({
    message: 'Organization ID is required'
  })
});

export const addUsersToProjectSchema = z.object({
  project_id: z.number({
    message: 'Department ID is required'
  }),
  users: z
    .array(
      z.number({
        message: 'User ID is required'
      })
    )
    .min(1, {
      message: 'At least one user is required'
    }),
  created_by: z.number({}),
  updated_by: z.number({}),
  organization_id: z.number({
    message: 'Organization ID is required'
  })
});

export const removeUsersFromProjectSchema = z.object({
  project_id: z.number({
    message: 'Project ID is required'
  }),
  users: z
    .array(
      z.number({
        message: 'User ID is required'
      })
    )
    .min(1, {
      message: 'At least one user is required'
    }),
  updated_by: z.number({}),
  organization_id: z.number({
    message: 'Organization ID is required'
  })
});

// export const getOrganizationMember``

export type NewProjectPayload = z.infer<typeof newProjectSchema>;

export type UpdateProjectPayload = z.infer<typeof updateProjectSchema>;

export type AddUsersToProjectPayload = z.infer<typeof addUsersToProjectSchema>;

export type RemoveUsersFromProjectPayload = z.infer<
  typeof removeUsersFromProjectSchema
>;
