import z from 'zod';
import { FINANCIAL_YEAR_QUARTER_TYPE } from '@/db/schema/org-financial-year-quarter';

export const newFinancialYearQuarterSchema = z.object({
  organization_financial_year_id: z.coerce
    .number({
      message: 'Financial year ID is required'
    })
    .positive(),
  organization_id: z.coerce
    .number({
      message: 'Organization ID is required'
    })
    .positive(),
  quarter: z.enum(FINANCIAL_YEAR_QUARTER_TYPE, {
    message: 'Invalid quarter type'
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

export const updateFinancialYearQuarterSchema = z.object({
  quarter_id: z.coerce
    .number({
      message: 'Quarter ID is required'
    })
    .positive(),
  organization_financial_year_id: z.coerce
    .number({
      message: 'Financial year ID is required'
    })
    .positive(),
  quarter: z
    .enum(FINANCIAL_YEAR_QUARTER_TYPE, {
      message: 'Invalid quarter type'
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

export type NewFinancialYearQuarterPayload = z.infer<
  typeof newFinancialYearQuarterSchema
>;

export type UpdateFinancialYearQuarterPayload = z.infer<
  typeof updateFinancialYearQuarterSchema
>;
