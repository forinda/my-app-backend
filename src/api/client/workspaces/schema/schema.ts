import { searchQueryStringSchema } from '@/common/schema/search-query-string';
import z from 'zod';

export const workspaceTemaplateEnum = z.enum([
  'blank',
  'team',
  'project',
  'creative'
]);

export const newWorkspaceSchema = z.object({
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
  is_active: z.coerce.boolean().default(true),
  is_private: z.coerce.boolean().default(false),
  is_chat_enabled: z.coerce.boolean().default(true),
  is_task_management_enabled: z.coerce.boolean().default(true),
  template: workspaceTemaplateEnum.default('blank'),
  created_by: z.number({}).optional(),
  updated_by: z.number({}).optional(),
  organization_id: z
    .number({
      message: 'Organization ID is required'
    })
    .positive()
});

export const updateWorkspaceSchema = z.object({
  workspace_id: z
    .string({
      message: 'ID is required'
    })
    .nonempty({
      message: 'ID cannot be empty'
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
  is_active: z.coerce.boolean().default(true),
  is_private: z.coerce.boolean().default(false),
  is_chat_enabled: z.coerce.boolean().default(true),
  is_task_management_enabled: z.coerce.boolean().default(true),
  template: workspaceTemaplateEnum.default('blank'),
  updated_by: z.coerce.number({}).positive().optional(),
  organization_id: z.coerce
    .number({
      message: 'Organization ID is required'
    })
    .positive()
});

export const addUsersToWorkspaceSchema = z.object({
  workspace_id: z.coerce
    .string({
      message: 'Department ID is required'
    })
    .nonempty({
      message: 'Department ID cannot be empty'
    })
    .uuid(),
  users: z
    .array(
      z.coerce
        .number({
          message: 'User ID is required'
        })
        .positive()
    )
    .min(1, {
      message: 'At least one user is required'
    }),
  created_by: z.coerce.number({}).positive(),
  updated_by: z.coerce.number({}).positive(),
  organization_id: z.coerce
    .number({
      message: 'Organization ID is required'
    })
    .positive()
});

export const removeUsersFromWorkspaceSchema = z.object({
  workspace_id: z.coerce
    .string({
      message: 'Department ID is required'
    })
    .uuid(),
  users: z
    .array(
      z
        .number({
          message: 'User ID is required'
        })
        .positive()
    )
    .min(1, {
      message: 'At least one user is required'
    }),
  updated_by: z.coerce.number({}).positive(),
  organization_id: z.coerce
    .number({
      message: 'Organization ID is required'
    })
    .positive()
});

export const fetchWorkspacemembersSchema = z.object({
  q: searchQueryStringSchema.optional(),
  project_id: z.coerce
    .string({
      message: 'Project ID is required'
    })
    .nonempty({
      message: 'Project ID cannot be empty'
    })
    .uuid()
    .optional(),
  is_active_in_workspace: z.coerce
    .boolean({
      message: 'Status is required'
    })
    .optional(),

  is_active_in_project: z.coerce
    .boolean({
      message: 'Status is required'
    })
    .optional()
});

// export const getOrganizationMember``

export type NewWorkspacePayload = z.infer<typeof newWorkspaceSchema>;

export type UpdateWorkspacePayload = z.infer<typeof updateWorkspaceSchema>;

export type AddUsersToWorkspacePayload = z.infer<
  typeof addUsersToWorkspaceSchema
>;

export type RemoveUsersFromWorkspacePayload = z.infer<
  typeof removeUsersFromWorkspaceSchema
>;

export type WorkspaceTemplateEnumType = z.infer<typeof workspaceTemaplateEnum>;

export type FetchWorkspaceMembersPayload = z.infer<
  typeof fetchWorkspacemembersSchema
>;
