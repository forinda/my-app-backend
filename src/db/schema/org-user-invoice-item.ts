import { decimal, integer, pgTable, unique } from 'drizzle-orm/pg-core';
import { OrgUserInvoice } from './org-user-invoice';
import { OrgUserTimeLog } from './org-user-time-log';
import { foreignKeyConstraints } from '@/common/utils/drizzle';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { relations } from 'drizzle-orm';

export const OrgUserInvoiceItem = pgTable(
  'organization_user_invoice_items',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    organization_invoice_id: integer()
      .notNull()
      .references(() => OrgUserInvoice.id, foreignKeyConstraints),
    task_log_id: integer()
      .notNull()
      .references(() => OrgUserTimeLog.id, foreignKeyConstraints),
    amount: decimal('amount', {
      precision: 16,
      scale: 2
    }).notNull()
  },
  (t) => [unique().on(t.organization_invoice_id, t.task_log_id)]
);

export const invoiceItemRelations = relations(
  OrgUserInvoiceItem,
  ({ one }) => ({
    invoice: one(OrgUserInvoice, {
      fields: [OrgUserInvoiceItem.organization_invoice_id],
      references: [OrgUserInvoice.id]
    }),
    taskLog: one(OrgUserTimeLog, {
      fields: [OrgUserInvoiceItem.task_log_id],
      references: [OrgUserTimeLog.id]
    })
  })
);

export type OrgUserInvoiceItemInsert = InferInsertModel<
  typeof OrgUserInvoiceItem
>;

export type OrgUserInvoiceItemSelect = InferSelectModel<
  typeof OrgUserInvoiceItem
>;
