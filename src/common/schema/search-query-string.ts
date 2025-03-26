import { z } from 'zod';

export const searchQueryStringSchema = z
  .string({
    message: 'Search query must be a string'
  })
  .regex(/^[a-zA-Z0-9\s\-_.,!?]*$/, {
    message: 'Search query contains invalid characters'
  })
  .max(100, {
    message: 'Search query must be less than 100 characters'
  });
