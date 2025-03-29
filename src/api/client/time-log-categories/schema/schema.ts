import { searchQueryStringSchema } from '@/common/schema/search-query-string';
import z from 'zod';

const allowedFields = [
  'id',
  'name',
  'description',
  'color',
  'created_at',
  'updated_at',
  'created_by',
  'updated_by',
  'organization_id'
] as const;

export const newTimeLogCategorySchema = z.object({
  name: z
    .string({
      message: 'Name is required'
    })
    .nonempty({
      message: 'Name cannot be empty'
    })
    .min(3, {
      message: 'Name must be at least 3 characters long'
    })
    .max(255, {
      message: 'Name must be at most 255 characters long'
    })
    .trim(),
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
  organization_id: z.coerce.number({}).positive().optional()
});

export const updateTimeLogCategorySchema = z.object({
  category_id: z
    .number({
      message: 'Category ID is required'
    })
    .positive(),
  name: z
    .string({
      message: 'Name is required'
    })
    .min(3, {
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
  updated_by: z.coerce.number({}).positive().optional(),
  organization_id: z.coerce.number({}).positive().optional()
});

export const filterTimeLogCategorySchema = z.object({
  id: z
    .number({
      message: 'Category ID is required'
    })
    .positive()
    .optional(),
  color: z
    .string({
      message: 'Color is required'
    })
    .min(3, {
      message: 'Color must be at least 3 characters long'
    })
    .max(255, {
      message: 'Color must be at most 255 characters long'
    })
    .optional(),
  q: searchQueryStringSchema.optional(),
  all: z.coerce.boolean().optional(),
  relations: z.coerce.boolean().default(true).optional(),
  project_id: z
    .string({
      message: 'Please select a project'
    })
    .uuid()
    .optional(),
  fields: z.coerce
    .string()
    .transform((val) => {
      const decoded = decodeURIComponent(val); // Convert array to string first
      const parts = decoded.split(/[\s,]+/) as unknown as typeof allowedFields;

      return parts.filter((item) => allowedFields.includes(item)).join(',');
    })
    .optional()
});

// export const getOrganizationMember``

export type CreateTimeLogCategoryType = z.infer<
  typeof newTimeLogCategorySchema
>;

export type UpdateTimeLogCategoryType = z.infer<
  typeof updateTimeLogCategorySchema
>;

export type FilterTimeLogCategoryType = z.infer<
  typeof filterTimeLogCategorySchema
>;
