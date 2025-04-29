import z from 'zod';
import { FINANCIAL_YEAR_TYPE } from '@/db/schema/org-financial-years';
import { FINANCIAL_YEAR_QUARTER_TYPE } from '@/db/schema/org-financial-year-quarter';

export const newFinancialYearSchema = z.object({
  organization_id: z.coerce
    .number({
      message: 'Organization ID is required'
    })
    .positive(),
  financial_year: z
    .string({
      message: 'Financial year is required'
    })
    .nonempty({
      message: 'Financial year cannot be empty'
    }),
  financial_year_type: z.enum(FINANCIAL_YEAR_TYPE, {
    message: 'Invalid financial year type'
  }),
  start_date: z
    .string({
      message: 'Start date is required'
    })
    .nonempty(),
  end_date: z
    .string({
      message: 'End date is required'
    })
    .nonempty(),
  created_by: z.coerce.number({}).positive().optional(),
  updated_by: z.coerce.number({}).positive().optional()
});

export const updateFinancialYearSchema = z.object({
  financial_year_id: z.coerce
    .number({
      message: 'Financial year ID is required'
    })
    .positive(),
  financial_year: z
    .string({
      message: 'Financial year is required'
    })
    .nonempty()
    .optional(),
  financial_year_type: z
    .enum(FINANCIAL_YEAR_TYPE, {
      message: 'Invalid financial year type'
    })
    .optional(),
  start_date: z
    .string({
      message: 'Start date is required'
    })
    .optional(),
  end_date: z
    .string({
      message: 'End date is required'
    })
    .optional(),
  updated_by: z.coerce.number({}).positive().optional()
});

export const filterFinancialYearSchema = z.object({
  organization_id: z.coerce.number().positive().optional(),
  financial_year_type: z.enum(FINANCIAL_YEAR_TYPE).optional(),
  year: z.string().optional()
});

export const newFinancialYearQuarterSchema = z.object({
  quarter: z.enum(FINANCIAL_YEAR_QUARTER_TYPE),
  start_date: z.string().nonempty(),
  end_date: z.string().nonempty(),
  created_by: z.coerce.number().positive().optional(),
  updated_by: z.coerce.number().positive().optional()
});

export const updateFinancialYearQuarterSchema = z.object({
  quarter_id: z.coerce.number().positive(),
  financial_year_id: z.coerce.number().positive(),
  quarter: z.enum(FINANCIAL_YEAR_QUARTER_TYPE).optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  updated_by: z.coerce.number().positive().optional()
});

export const deleteFinancialYearSchema = z.object({
  financial_year_id: z.coerce.number().positive(),
  organization_id: z.coerce.number().positive(),
  deleted_by: z.coerce.number().positive()
});

export const deleteFinancialYearQuarterSchema = z.object({
  quarter_id: z.coerce.number().positive(),
  financial_year_id: z.coerce.number().positive(),
  deleted_by: z.coerce.number().positive()
});

export type NewFinancialYearPayload = z.infer<typeof newFinancialYearSchema>;

export type UpdateFinancialYearPayload = z.infer<
  typeof updateFinancialYearSchema
>;

export type FilterFinancialYearPayload = z.infer<
  typeof filterFinancialYearSchema
>;

export type NewFinancialYearQuarterPayload = z.infer<
  typeof newFinancialYearQuarterSchema
>;

export type UpdateFinancialYearQuarterPayload = z.infer<
  typeof updateFinancialYearQuarterSchema
>;

export type DeleteFinancialYearPayload = z.infer<
  typeof deleteFinancialYearSchema
>;

export type DeleteFinancialYearQuarterPayload = z.infer<
  typeof deleteFinancialYearQuarterSchema
>;
