import z from 'zod';
import {
  INVOICE_PAYMENT_METHOD,
  INVOICE_STATUS
} from '@/db/schema/org-user-invoice';

export const invoiceItemSchema = z.object({
  description: z.string().min(1, { message: 'Description is required' }),
  quantity: z.coerce
    .number({ message: 'Quantity is required' })
    .positive({ message: 'Quantity must be positive' }),
  unit_price: z.coerce
    .number({ message: 'Unit price is required' })
    .nonnegative({ message: 'Unit price must be non-negative' }),
  amount: z.coerce
    .number({ message: 'Amount is required' })
    .nonnegative({ message: 'Amount must be non-negative' })
});

export const newInvoiceSchema = z.object({
  organization_id: z.coerce
    .number({ message: 'Organization ID is required' })
    .positive(),
  financial_year_id: z.coerce.number().positive().optional(),
  financial_quarter_id: z.coerce
    .number({ message: 'Financial quarter ID is required' })
    .positive(),
  due_date: z.string().min(1, { message: 'Due date is required' }),
  total_amount: z.coerce
    .number({ message: 'Total amount is required' })
    .nonnegative({ message: 'Total amount must be non-negative' }),
  tax_amount: z.coerce.number().nonnegative().default(0),
  discount_amount: z.coerce.number().nonnegative().default(0),
  notes: z.string().optional(),
  terms: z.string().optional(),
  status: z.enum(INVOICE_STATUS).default('pending'),
  payment_method: z.enum(INVOICE_PAYMENT_METHOD).default('bank_transfer'),
  created_by: z.coerce.number().positive().optional(),
  updated_by: z.coerce.number().positive().optional()
});

export const updateInvoiceSchema = z.object({
  invoice_id: z.coerce.number({ message: 'Invoice ID is required' }).positive(),
  organization_id: z.coerce
    .number({ message: 'Organization ID is required' })
    .positive(),
  financial_year_id: z.coerce.number().positive().optional(),
  financial_quarter_id: z.coerce
    .number({ message: 'Financial quarter ID is required' })
    .positive(),
  due_date: z.string().min(1, { message: 'Due date is required' }).optional(),
  total_amount: z.coerce
    .number({ message: 'Total amount is required' })
    .nonnegative({ message: 'Total amount must be non-negative' })
    .optional(),
  tax_amount: z.coerce.number().nonnegative().default(0).optional(),
  discount_amount: z.coerce.number().nonnegative().default(0).optional(),
  notes: z.string().optional(),
  terms: z.string().optional(),
  status: z.enum(INVOICE_STATUS).optional(),
  payment_method: z.enum(INVOICE_PAYMENT_METHOD).optional(),
  updated_by: z.coerce.number().positive().optional()
});

export const updateInvoiceStatusSchema = z.object({
  status: z.enum(INVOICE_STATUS, {
    message: 'Invalid invoice status'
  }),
  paid_date: z.string().optional(),
  payment_method: z.string().optional(),
  updated_by: z.coerce.number().positive().optional()
});

export const filterInvoiceSchema = z.object({
  organization_id: z.coerce.number().positive().optional(),
  financial_year_id: z.coerce.number().positive().optional(),
  client_name: z.string().optional(),
  client_email: z.string().optional(),
  status: z.enum(INVOICE_STATUS).optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  min_amount: z.coerce.number().nonnegative().optional(),
  max_amount: z.coerce.number().nonnegative().optional()
});

export const deleteInvoiceSchema = z.object({
  invoice_id: z.coerce.number({ message: 'Invoice ID is required' }).positive(),
  organization_id: z.coerce
    .number({ message: 'Organization ID is required' })
    .positive(),
  deleted_by: z.coerce.number().positive().optional()
});

export type NewInvoicePayload = z.infer<typeof newInvoiceSchema>;

export type UpdateInvoicePayload = z.infer<typeof updateInvoiceSchema>;

export type UpdateInvoiceStatusPayload = z.infer<
  typeof updateInvoiceStatusSchema
>;

export type FilterInvoicePayload = z.infer<typeof filterInvoiceSchema>;

export type InvoiceItemPayload = z.infer<typeof invoiceItemSchema>;

export type DeleteInvoicePayload = z.infer<typeof deleteInvoiceSchema>;
