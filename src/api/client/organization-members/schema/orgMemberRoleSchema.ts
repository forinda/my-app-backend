import { orgMemberRoles } from '@/common/constants/org-member-roles';
import { z } from 'zod';

export const orgMemberRoleSchema = z.enum(orgMemberRoles);
