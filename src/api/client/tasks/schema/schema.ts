import { searchQueryStringSchema } from '@/common/schema/search-query-string';
// import type { SelectOrgTaskInterface } from '@/db/schema';
import z from 'zod';

const taskFields = [
  'workspace_id',
  'assignee_id',
  'description',
  'due_date',
  'title',
  'id',
  'uuid',
  'status'
] as const;

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

const taskPrioritySchema = z
  .enum(['low', 'medium', 'high', 'blocker', 'critical', 'major', 'minor'])
  .default('low');

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
  start_date: z.coerce.string().datetime().optional(),
  end_date: z.coerce.string().datetime().optional(),
  due_date: z.coerce.string().datetime().optional(),
  workspace_id: z
    .string({
      message: 'Workspace ID is required'
    })
    .nonempty({
      message: 'Workspace ID is required'
    }),
  project_id: z
    .number({
      message: 'Project ID is required'
    })
    .positive(),
  assignee_id: z.coerce.number({}).positive().optional(),
  parent_id: z.coerce.number({}).positive().optional(),
  story_points: z.coerce.number({}).min(0).default(0),
  priority: taskPrioritySchema,
  created_by: z.coerce.number({}).positive().optional(),
  updated_by: z.coerce.number({}).positive().optional()
});

export const filterTasksSchema = z.object({
  q: searchQueryStringSchema.optional(),
  project_id: z.coerce

    .string({
      message: 'Please select a project'
    })
    .uuid()
    .optional(),
  workspace_id: z.coerce

    .number({
      message: 'Workspace ID is required'
    })
    .positive()
    .optional(),
  assignee_id: z.coerce

    .number({
      message: 'Assignee ID is required'
    })
    .positive()
    .optional(),
  status: taskStatusSchema.optional(),
  priority: taskPrioritySchema.optional(),
  parent_id: z.coerce

    .number({
      message: 'Parent ID is required'
    })
    .positive()
    .optional(),
  start_date: z.coerce

    .string({
      message: 'Start date is required'
    })
    .optional(),
  end_date: z.coerce

    .string({
      message: 'End date is required'
    })
    .optional(),
  due_date: z.coerce

    .string({
      message: 'Due date is required'
    })
    .optional(),
  story_points: z.coerce

    .number({
      message: 'Story points is required'
    })
    .min(0)
    .default(0)
    .optional(),
  relations: z.coerce.boolean().default(true).optional(),
  ref: z
    .string({
      message: 'Ref is required'
    })
    .nonempty({
      message: 'Ref is required'
    })
    .optional(),
  fields: z.coerce
    .string()
    .transform((val) => {
      const decoded = decodeURIComponent(val); // Convert array to string first
      const parts = decoded.split(/[\s,]+/) as unknown as typeof taskFields;

      return parts.filter((item) => taskFields.includes(item)).join(',');
    })
    .optional()
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
    .string({
      message: 'Workspace ID is required'
    })
    .nonempty({
      message: 'Workspace ID is required'
    }),
  assignee_id: z.coerce.number({}).positive().optional(),
  parent_id: z.coerce.number({}).positive().optional(),
  story_points: z.coerce.number({}).min(0).default(0),
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

export const unAssignTaskSchema = z.object({
  task_id: z.coerce
    .number({
      message: 'Task ID is required'
    })
    .positive(),
  updated_by: z.coerce.number({}).positive().optional(),
  organization_id: z
    .number({
      message: 'Organization ID is required'
    })
    .positive()
});

export const addTaskCommentSchema = z.object({
  task_id: z.coerce
    .number({
      message: 'Task ID is required'
    })
    .positive(),
  text: z
    .string({
      message: 'Comment is required'
    })
    .nonempty({
      message: 'Comment is required'
    }),
  created_by: z.coerce
    .number({
      message: 'Created by is required'
    })
    .positive(),
  updated_by: z.coerce.number({
    message: 'Updated by is required'
  }),
  organization_id: z
    .number({
      message: 'Organization ID is required'
    })
    .positive()
});

export const updateTaskCommentSchema = z.object({
  comment_id: z.coerce
    .number({
      message: 'Comment ID is required'
    })
    .positive(),
  text: z
    .string({
      message: 'Comment is required'
    })
    .nonempty({
      message: 'Comment is required'
    }),
  updated_by: z.coerce.number({
    message: 'Updated by is required'
  }),
  organization_id: z
    .number({
      message: 'Organization ID is required'
    })
    .positive()
});

export type AddTaskCommentPayload = z.infer<typeof addTaskCommentSchema>;

export type UpdateTaskCommentPayload = z.infer<typeof updateTaskCommentSchema>;

export type NewTaskPayload = z.infer<typeof newTaskSchema>;

export type UpdateTaskPayload = z.infer<typeof updateTaskSchema>;

export type AssignTaskPayload = z.infer<typeof assignTaskSchema>;

export type UnAssignTaskPayload = z.infer<typeof unAssignTaskSchema>;

export type FilterTasksPayload = z.infer<typeof filterTasksSchema>;
