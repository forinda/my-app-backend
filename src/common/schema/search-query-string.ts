import { z } from 'zod';
// Allow only alphanumeric, space, and basic punctuation
const safePattern = /^[a-zA-Z0-9 _.,!?-]*$/;

// Additional check to block specific SQL injection markers like --
const blockSqlPatterns = [/--/, /;/, /'/, /\/\*/, /\*\//];

export const searchQueryStringSchema = z
  .string({
    message: 'Search query must be a string'
  })
  .regex(safePattern, {
    message: 'Search query contains invalid characters'
  })
  .max(100, {
    message: 'Search query must be less than 100 characters'
  })
  .refine(
    (value) => {
      return !blockSqlPatterns.some((pattern) => pattern.test(value));
    },
    {
      message: 'Search query contains potentially dangerous characters'
    }
  );
