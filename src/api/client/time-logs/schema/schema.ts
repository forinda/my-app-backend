import z from 'zod';

export const newTimeLogSchema = z.object({
  organization_id: z.coerce
    .number({
      message: 'Organization id is required'
    })
    .positive(),
  project_id: z.coerce
    .number({
      message: 'Please select a project'
    })
    .positive(),
  task_id: z.coerce
    .number({
      message: 'Please select a task to log time'
    })
    .positive(),
  task_log_category_id: z.coerce
    .number({
      message: 'Please select a time log category'
    })
    .positive(),
  description: z
    .string({
      message: 'Description is required'
    })
    .nonempty()
    .min(3, { message: 'Description must be at least 3 characters long' })
    .max(255, { message: 'Description must be at most 255 characters long' }),
  hours: z.coerce
    .number({
      message: 'Please enter hours worked'
    })
    .positive()
    .max(24, {
      message: 'Hours must be at most 24'
    }),
  minutes: z.coerce
    .number({
      message: 'Please enter minutes worked'
    })
    .positive()
    .max(60, {
      message: 'Minutes must be at most 60'
    }),
  work_date: z.coerce
    .string({
      message: 'Please select your work date'
    })
    .date()
    .nonempty({
      message: 'Work date is required'
    }),
  created_by: z.coerce
    .number({
      message: 'Created by is required'
    })
    .positive(),
  updated_by: z.coerce
    .number({
      message: 'Updated by is required'
    })
    .positive()
});

export const updateTimeLogSchema = z.object({
  time_log_id: z.number({
    message: 'Time log ID is required'
  }),
  organization_id: z.coerce
    .number({
      message: 'Organization id is required'
    })
    .positive(),
  project_id: z.coerce
    .number({
      message: 'Please select a project'
    })
    .positive(),
  task_id: z.coerce
    .number({
      message: 'Please select a task to log time'
    })
    .positive(),
  task_log_category_id: z.coerce
    .number({
      message: 'Please select a time log category'
    })
    .positive(),
  description: z
    .string({
      message: 'Description is required'
    })
    .nonempty()
    .min(3, { message: 'Description must be at least 3 characters long' })
    .max(255, { message: 'Description must be at most 255 characters long' }),
  hours: z.coerce

    .number({
      message: 'Please enter hours worked'
    })
    .positive()
    .max(24, {
      message: 'Hours must be at most 24'
    }),
  minutes: z.coerce
    .number({
      message: 'Please enter minutes worked'
    })
    .positive()
    .max(60, {
      message: 'Minutes must be at most 60'
    }),
  work_date: z.coerce
    .string({
      message: 'Please select your work date'
    })
    .date()
    .nonempty({
      message: 'Work date is required'
    }),
  updated_by: z.coerce
    .number({
      message: 'Updated by is required'
    })
    .positive()
});

// export const getOrganizationMember``

export type CreateTimeLogType = z.infer<typeof newTimeLogSchema>;

export type UpdateTimeLogType = z.infer<typeof updateTimeLogSchema>;
