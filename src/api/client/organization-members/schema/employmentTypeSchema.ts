import { z } from 'zod';

export const employmentTypeSchema = z.enum([
  'full_time',
  'part_time',
  'contract',
  'internship'
]);
