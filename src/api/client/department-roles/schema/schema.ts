import z from 'zod';

export const newDepartmentUserRoleSchema = z.object({
  user_id: z.coerce.number({}).positive(),
  department_id: z.coerce.number({}).positive(),
  role_title_id: z.coerce.number({}).positive(),
  start_date: z.string().datetime(),
  end_date: z.string().datetime().optional(),
  is_active: z.boolean({}).default(true),
  created_by: z.coerce.number({}).positive().optional(),
  updated_by: z.coerce.number({}).positive().optional(),
  organization_id: z.coerce.number({}).positive()
});

export const updateDepartmentUserRoleSchema = z.object({
  department_role_id: z.coerce.number({}).positive(),
  is_active: z.boolean({}).optional(),
  start_date: z.coerce.string().date().optional(),
  end_date: z.coerce.string().datetime().nullable().optional(),
  updated_by: z.coerce.number({}).positive().optional(),
  organization_id: z.coerce.number({}).positive()
});

// export const getOrganizationMember``

export type DepartmentUserRoleCreationRequest = z.infer<
  typeof newDepartmentUserRoleSchema
>;

export type UpdateUserRoleRequest = z.infer<
  typeof updateDepartmentUserRoleSchema
>;
