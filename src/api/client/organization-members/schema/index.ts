import { orgMemberRoles } from '@/common/constants/org-member-roles';
import { searchQueryStringSchema } from '@/common/schema/search-query-string';
import { z } from 'zod';

export const employmentTypeSchema = z.enum([
  'full_time',
  'part_time',
  'contract',
  'internship'
]);

export const orgMemberRoleSchema = z.enum(orgMemberRoles);

export const salaryTypeSchema = z.enum(['monthly', 'hourly']);

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
  role: orgMemberRoleSchema.default('Member'),
  created_by: z.coerce.number().positive(),
  updated_by: z.coerce.number().positive()
});

export const respondToOrgInviteSchema = z.object({
  invite_id: z.coerce.number().positive(),
  action: z.enum(['accepted', 'rejected'])
});

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
  current_salary: z.number(),
  starting_salary: z.number(),
  salary_type: salaryTypeSchema.default('hourly'),
  employment_type: employmentTypeSchema.default('full_time'),
  updated_by: z.coerce.number().positive()
});

export const memberUpdatePersonalOrgProfileSchema = z.object({
  tax_id: z.string(),
  country: z.string(),
  state: z.string(),
  city: z.string(),
  address: z.string(),
  zip_code: z.string(),
  national_id: z.string(),
  currency: z.string().default('KSH'),
  organization_id: z.coerce.number().positive()
});

export const fetchUserorganizationInvitesSchema = z.object({
  user_id: z.coerce.number().positive()
});

export type UpdatePersonalOrgProfileType = z.infer<
  typeof memberUpdatePersonalOrgProfileSchema
>;

export type AddMemberToOrRemoveFromOrganizationType = z.infer<
  typeof addMemberToOrRemoveFromOrgSchema
>;

export type RespondToOrgInviteType = z.infer<typeof respondToOrgInviteSchema>;

export const filterOrganizationMembersSchema = z.object({
  current_organization_id: z.string(),
  q: searchQueryStringSchema.optional(),
  is_active: z.coerce.boolean().optional(),
  department_id: z.coerce.number().optional(),
  designation_id: z.coerce.number().optional(),
  role: orgMemberRoleSchema.optional()
});

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
