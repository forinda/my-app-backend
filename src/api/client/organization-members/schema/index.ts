import { z } from 'zod';
import type { employmentTypeSchema } from './employmentTypeSchema';
import type { salaryTypeSchema } from './salaryTypeSchema';
import type { addMemberToOrRemoveFromOrgSchema } from './addMemberToOrRemoveFromOrgSchema';
import type { initializeUserOrgProfileSchema } from './initializeUserOrgProfileSchema';
import type { memberUpdatePersonalOrgProfileSchema } from './memberUpdatePersonalOrgProfileSchema';
import type { filterOrganizationMembersSchema } from './filterOrganizationMembersSchema';
import type { respondToOrgInviteSchema } from './respondToOrgInviteSchema';

export const fetchUserorganizationInvitesSchema = z.object({
  user_id: z.coerce.number().positive()
});

export const fetchSingleOrganizationMemberSchema = z.object({
  // organization_id: z.coerce.number().positive(),
  user_id: z.coerce
    .string({
      required_error: 'User ID is required'
    })
    .uuid()
    .optional()
});

export type UpdatePersonalOrgProfileType = z.infer<
  typeof memberUpdatePersonalOrgProfileSchema
>;

export type AddMemberToOrRemoveFromOrganizationType = z.infer<
  typeof addMemberToOrRemoveFromOrgSchema
>;

export type RespondToOrgInviteType = z.infer<typeof respondToOrgInviteSchema>;

export type FilterOrganizationmembersType = z.infer<
  typeof filterOrganizationMembersSchema
>;

export type FetchUserOrganizationInvitesType = z.infer<
  typeof fetchUserorganizationInvitesSchema
>;

export type SalaryType = z.infer<typeof salaryTypeSchema>;

export type EmploymentType = z.infer<typeof employmentTypeSchema>;

export type InitializeUserOrganizationProfileType = z.infer<
  typeof initializeUserOrgProfileSchema
>;

export type FetchSingleOrganizationMemberType = z.infer<
  typeof fetchSingleOrganizationMemberSchema
>;
