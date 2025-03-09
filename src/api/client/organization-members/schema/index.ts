import { z } from 'zod';
export const addMemberToOrRemoveFromOrgSchema = z.object({
  organization_id: z.coerce
    .number({ message: 'Organization ID is required' })
    .positive(),
  emails: z
    .array(z.string().email().toLowerCase().trim().nonempty(), {
      message: 'Emails is required'
    })
    .min(1, 'At least one user is required'),
  designation_id: z.coerce.number().positive(),
  created_by: z.coerce.number().positive(),
  updated_by: z.coerce.number().positive()
});

export const respondToOrgInviteSchema = z.object({
  invite_id: z.coerce.number().positive(),
  action: z.enum(['accepted', 'rejected'])
});

export const fetchUserorganizationInvitesSchema = z.object({
  user_id: z.coerce.number().positive()
});

export type AddMemberToOrRemoveFromOrganizationType = z.infer<
  typeof addMemberToOrRemoveFromOrgSchema
>;

export type RespondToOrgInviteType = z.infer<typeof respondToOrgInviteSchema>;

export const filterOrganizationMembersSchema = z.object({
  current_organization_id: z.string()
});

export type FilterOrganizationmembersType = z.infer<
  typeof filterOrganizationMembersSchema
>;

export type FetchUserOrganizationInvitesType = z.infer<
  typeof fetchUserorganizationInvitesSchema
>;
