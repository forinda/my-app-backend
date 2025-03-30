import { searchQueryStringSchema } from '@/common/schema/search-query-string';
import z from 'zod';

const projectTypeSchema = z.enum(['paid', 'free', 'test', 'trial']);
const projectMemberRoleSchema = z.enum(['Admin', 'Member', 'Moderator']);
const allowedProjectFields = [
  'id',
  'name',
  'description',
  'category_id',
  'is_active',
  'is_paid',
  'start_date',
  'end_date'
] as const;

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
  is_active: z.coerce.boolean().default(true),
  is_paid: z.coerce.boolean().default(false),
  start_date: z.coerce.string().date().optional(),
  end_date: z.coerce.string().date().optional(),
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
  role: projectMemberRoleSchema.default('Member'),
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

export const addProjectTimeLogCategorySchema = z.object({
  project_id: z
    .string({
      message: 'Project ID is required'
    })
    .uuid(),
  category_ids: z
    .array(
      z.number({
        message: 'Category ID is required'
      })
    )
    .min(1, {
      message: 'At least one category is required'
    }),

  created_by: z.number({}),
  updated_by: z.number({}),
  organization_id: z.number({
    message: 'Organization ID is required'
  })
});

export const activateOrDeactivateProjectTimeLogCategorySchema = z.object({
  project_id: z.number({
    message: 'Project ID is required'
  }),
  category_id: z.number({
    message: 'Category ID is required'
  }),
  is_active: z.boolean({
    message: 'Status is required'
  }),
  updated_by: z.number({}),
  organization_id: z.number({
    message: 'Organization ID is required'
  })
});

export const fetchProjectCategoryQuerySchema = z.object({
  organization_id: z
    .number({
      message: 'Organization ID is required'
    })
    .optional(),
  id: z
    .number({
      message: 'Category ID is required'
    })
    .optional(),
  category_id: z
    .number({
      message: 'Category ID is required'
    })
    .optional(),
  all: z.coerce.boolean().optional(),
  q: searchQueryStringSchema.optional(),
  project_id: z
    .string({
      message: 'Project ID is required'
    })
    .uuid()
    .optional(),
  fields: z.coerce
    .string()
    .transform((val) => {
      const decoded = decodeURIComponent(val); // Convert array to string first
      const parts = decoded.split(
        /[\s,]+/
      ) as unknown as typeof allowedProjectFields;

      return parts
        .filter((item) => allowedProjectFields.includes(item))
        .join(',');
    })
    .optional(),
  relations: z.coerce.boolean().default(true).optional()
});

export const fetchProjectTimeCategoriesSchema = z.object({
  project_id: z.string({
    message: 'Project ID is required'
  }),
  // .uuid()
  q: searchQueryStringSchema.optional(),
  all: z.boolean().optional()
});

export type NewProjectPayload = z.infer<typeof newProjectSchema>;

export type UpdateProjectPayload = z.infer<typeof updateProjectSchema>;

export type AddUsersToProjectPayload = z.infer<typeof addUsersToProjectSchema>;

export type RemoveUsersFromProjectPayload = z.infer<
  typeof removeUsersFromProjectSchema
>;

export type AddProjectTimeLogCategoryPayload = z.infer<
  typeof addProjectTimeLogCategorySchema
>;

export type ActivateOrDeactivateProjectTimeLogCategoryPayload = z.infer<
  typeof activateOrDeactivateProjectTimeLogCategorySchema
>;

export type FetchProjectCategoryQueryPayload = z.infer<
  typeof fetchProjectCategoryQuerySchema
>;

export type FetchProjectTimeCategoriesPayload = z.infer<
  typeof fetchProjectTimeCategoriesSchema
>;
