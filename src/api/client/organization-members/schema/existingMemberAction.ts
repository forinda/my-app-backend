import { z } from 'zod';

export const existingMemberAction = z
  .enum(['include', 'exclude'])
  .default('exclude');
