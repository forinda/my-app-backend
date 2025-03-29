import moment from 'moment';
import z from 'zod';
export const timelogApprovalStatusSchema = z.enum([
  'pending',
  'invoiced',
  'rejected'
]);

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
    })
    .min(0, {
      message: 'Hours must be at least 0'
    }),
  minutes: z.coerce
    .number({
      message: 'Please enter minutes worked'
    })
    .positive()
    .max(59, {
      message: 'Minutes must be at most 59'
    })
    .min(0, {
      message: 'Minutes must be at least 0'
    }),
  work_date: z.coerce
    .string({
      message: 'Please select your work date'
    })
    .date()
    .nonempty({
      message: 'Work date is required'
    })
    .refine(
      (date) => {
        const today = moment().endOf('day');
        const threeDaysAgo = moment().subtract(3, 'days').startOf('day');

        const dateMoment = moment(date);

        return (
          dateMoment.isSameOrBefore(today) &&
          dateMoment.isSameOrAfter(threeDaysAgo)
        );
      },
      {
        message: 'Date must be within the last 3 days'
      }
    ),
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

export const deleteTimeLogSchema = z.object({
  time_log_id: z.number({
    message: 'Time log ID is required'
  }),
  organization_id: z.coerce
    .number({
      message: 'Organization id is required'
    })
    .positive(),
  deleted_by: z.coerce
    .number({
      message: 'Deleted by is required'
    })
    .positive()
});

export const updateTimelogStatusSchema = z.object({
  timelog_ids: z
    .array(
      z
        .number({
          message: 'Time log ID is required'
        })
        .positive()
    )
    .min(1, { message: 'At least one time log ID is required' }),
  organization_id: z.coerce
    .number({
      message: 'Organization id is required'
    })
    .positive(),
  status: timelogApprovalStatusSchema,
  updated_by: z.coerce
    .number({
      message: 'Updated by is required'
    })
    .positive()
});

export type TimelogApprovalStatusType = z.infer<
  typeof timelogApprovalStatusSchema
>;

export type UpdateTimelogStatusType = z.infer<typeof updateTimelogStatusSchema>;

export type CreateTimeLogType = z.infer<typeof newTimeLogSchema>;

export type UpdateTimeLogType = z.infer<typeof updateTimeLogSchema>;

export type DeleteTimeLogType = z.infer<typeof deleteTimeLogSchema>;
