import { z } from 'zod';

export const salaryTypeSchema = z.enum(['monthly', 'hourly']);
