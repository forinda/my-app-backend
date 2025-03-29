import { z } from 'zod';

export const taskRefFormatSchema = z
  .string({
    required_error: 'Task reference format is required',
    invalid_type_error: 'Task reference format must be a string'
  })
  .transform((val) => val.trim())
  .superRefine((val, ctx) => {
    // 1. Empty check
    if (val.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        minimum: 1,
        type: 'string',
        inclusive: true,
        message: 'Task reference format cannot be empty'
      });

      return;
    }

    // 2. Must contain {{id}}
    if (!val.includes('{{id}}')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Must contain {{id}} placeholder'
      });

      return;
    }

    // 3. Split into prefix and suffix
    const [prefix] = val.split('{{id}}');

    // 4. Hyphen enforcement in prefix
    if (!prefix.includes('-')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Prefix must contain a hyphen (e.g. 'PROJECT-')"
      });
    }

    // 5. Updated prefix length (now 8 chars max including hyphen)
    if (prefix.length > 8) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          'Prefix (before {{id}}) cannot exceed 8 characters including hyphen'
      });
    }

    // 6. Updated total length check (prefix + {{id}})
    if (val.length > 14) {
      // 8 (prefix) + 6 ({{id}})
      ctx.addIssue({
        code: z.ZodIssueCode.too_big,
        maximum: 14,
        type: 'string',
        inclusive: true,
        message:
          "Total format cannot exceed 14 characters (8 for prefix + '{{id}}')"
      });
    }
  })
  .default('PROJ-{{id}}'); // Updated default to match new length
