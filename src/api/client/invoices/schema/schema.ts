import z from 'zod';
import { INVOICE_STATUS } from '@/db/schema/org-invoices';

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
  invoice_number: z.string().optional(),
  financial_year_id: z.coerce.number().positive().optional(),
  client_name: z.string().min(1, { message: 'Client name is required' }),
  client_email: z.string().email({ message: 'Valid client email is required' }),
  client_phone: z.string().optional(),
  client_address: z.string().optional(),
  issue_date: z.string().min(1, { message: 'Issue date is required' }),
  due_date: z.string().min(1, { message: 'Due date is required' }),
  total_amount: z.coerce
    .number({ message: 'Total amount is required' })
    .nonnegative({ message: 'Total amount must be non-negative' }),
  tax_amount: z.coerce.number().nonnegative().default(0),
  discount_amount: z.coerce.number().nonnegative().default(0),
  notes: z.string().optional(),
  terms: z.string().optional(),
  status: z.enum(INVOICE_STATUS).default('draft'),
  paid_date: z.string().optional(),
  payment_method: z.string().optional(),
  items: z.array(invoiceItemSchema).min(1, {
    message: 'At least one invoice item is required'
  }),
  created_by: z.coerce.number().positive().optional(),
  updated_by: z.coerce.number().positive().optional()
});

export const updateInvoiceSchema = z.object({
  invoice_number: z.string().min(1).optional(),
  financial_year_id: z.coerce.number().positive().optional(),
  client_name: z.string().min(1).optional(),
  client_email: z.string().email().optional(),
  client_phone: z.string().optional(),
  client_address: z.string().optional(),
  issue_date: z.string().optional(),
  due_date: z.string().optional(),
  total_amount: z.coerce.number().nonnegative().optional(),
  tax_amount: z.coerce.number().nonnegative().optional(),
  discount_amount: z.coerce.number().nonnegative().optional(),
  notes: z.string().optional(),
  terms: z.string().optional(),
  status: z.enum(INVOICE_STATUS).optional(),
  paid_date: z.string().optional(),
  payment_method: z.string().optional(),
  items: z.array(invoiceItemSchema).optional(),
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

export type NewInvoicePayload = z.infer<typeof newInvoiceSchema>;
export type UpdateInvoicePayload = z.infer<typeof updateInvoiceSchema>;
export type UpdateInvoiceStatusPayload = z.infer<
  typeof updateInvoiceStatusSchema
>;
export type FilterInvoicePayload = z.infer<typeof filterInvoiceSchema>;
export type InvoiceItemPayload = z.infer<typeof invoiceItemSchema>;
