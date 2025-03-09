import z from 'zod';
export const newDepartmentSchema = z.object({
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
  created_by: z.coerce.number({}).positive().optional(),
  updated_by: z.coerce.number({}).positive().optional(),
  organization_id: z.coerce
    .number({
      message: 'Organization ID is required'
    })
    .positive()
});

export const updateDepartmentSchema = z.object({
  department_id: z.coerce
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
    .nonempty({
      message: 'Name cannot be empty'
    })
    .min(2, {
      message: 'Name must be at least 3 characters long'
    })
    .max(255, {
      message: 'Name must be at most 255 characters long'
    })
    .trim()
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
  organization_id: z.coerce
    .number({
      message: 'Organization ID is required'
    })
    .positive()
});

export const addUsersToDepartmentSchema = z.object({
  department_id: z.coerce
    .number({
      message: 'Department ID is required'
    })
    .positive(),
  users: z
    .array(
      z.coerce.number({
        message: 'User ID is required'
      })
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
// export const getOrganizationMember``

export type NewDepartmentPayload = z.infer<typeof newDepartmentSchema>;

export type UpdateDepartmentPayload = z.infer<typeof updateDepartmentSchema>;

export type AddUsersToDepartmentPayload = z.infer<
  typeof addUsersToDepartmentSchema
>;
