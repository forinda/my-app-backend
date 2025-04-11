import { searchQueryStringSchema } from '@/common/schema/search-query-string';
import { z } from 'zod';
import { orgMemberRoleSchema } from './orgMemberRoleSchema';
import { existingMemberAction } from './existingMemberAction';

export const filterOrganizationMembersSchema = z.object({
  current_organization_id: z.string(),
  q: searchQueryStringSchema.optional(),
  is_active: z.coerce.boolean().optional(),
  designation_id: z.coerce.number().optional(),
  role: orgMemberRoleSchema.optional(),
  workspace_id: z.coerce.string().uuid().optional(),
  existing_workspace_member_action: existingMemberAction.optional(),
  department_id: z.string().uuid().optional(),
  existing_department_member_action: existingMemberAction.optional()
});
