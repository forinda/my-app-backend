import z from 'zod';

export const taskStatusSchema = z
  .enum([
    'pending',
    'in_progress',
    'completed',
    'cancelled',
    'on_hold',
    'archived'
  ])
  .default('pending');

const taskPrioritySchema = z.enum(['low', 'medium', 'high']).default('low');

export const newTaskSchema = z.object({
  organization_id: z.coerce
    .number({
      message: 'Organization ID is required'
    })
    .positive(),
  title: z
    .string({
      message: 'Title is required'
    })
    .min(2, {
      message: 'Title must be at least 3 characters long'
    })
    .max(255, {
      message: 'Title must be at most 255 characters long'
    }),
  description: z
    .string({
      message: 'Description is required'
    })
    .min(3, {
      message: 'Description must be at least 3 characters long'
    }),
  status: taskStatusSchema,
  start_date: z.date({}).optional(),
  end_date: z.date({}).optional(),
  due_date: z.date({}).optional(),
  workspace_id: z
    .number({
      message: 'Workspace ID is required'
    })
    .positive(),
  project_id: z
    .number({
      message: 'Project ID is required'
    })
    .positive(),
  assignee_id: z.coerce.number({}).positive().optional(),
  parent_id: z.coerce.number({}).positive().optional(),
  story_points: z.coerce.number({}).positive().default(0),
  priority: taskPrioritySchema,
  created_by: z.coerce.number({}).positive().optional(),
  updated_by: z.coerce.number({}).positive().optional()
});

export const updateTaskSchema = z.object({
  task_id: z.coerce
    .number({
      message: 'Task ID is required'
    })
    .positive(),
  organization_id: z
    .number({
      message: 'Organization ID is required'
    })
    .positive(),
  project_id: z
    .number({
      message: 'Project ID is required'
    })
    .positive(),
  title: z
    .string({
      message: 'Title is required'
    })
    .nonempty({
      message: 'Title is required'
    })
    .min(2, {
      message: 'Title must be at least 3 characters long'
    })
    .max(255, {
      message: 'Title must be at most 255 characters long'
    }),
  status: taskStatusSchema,
  start_date: z.date({}).optional(),
  end_date: z.date({}).optional(),
  due_date: z.date({}).optional(),
  workspace_id: z
    .number({
      message: 'Workspace ID is required'
    })
    .positive(),
  assignee_id: z.coerce.number({}).positive().optional(),
  parent_id: z.coerce.number({}).positive().optional(),
  story_points: z.coerce.number({}).positive().default(0),
  priority: taskPrioritySchema,
  updated_by: z.coerce.number({}).positive().optional()
});

export const assignTaskSchema = z.object({
  task_id: z.coerce
    .number({
      message: 'Task ID is required'
    })
    .positive(),
  assignee_id: z
    .number({
      message: 'Assignee ID is required'
    })
    .positive(),
  updated_by: z.coerce.number({}).positive().optional(),
  organization_id: z
    .number({
      message: 'Organization ID is required'
    })
    .positive()
});

export type NewTaskPayload = z.infer<typeof newTaskSchema>;

export type UpdateTaskPayload = z.infer<typeof updateTaskSchema>;

export type AssignTaskPayload = z.infer<typeof assignTaskSchema>;
