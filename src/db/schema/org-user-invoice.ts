import {
  date,
  decimal,
  integer,
  pgEnum,
  pgTable,
  unique,
  varchar
} from 'drizzle-orm/pg-core';
import { Organization } from './organization';
import {
  foreignKeyConstraints,
  getTableTimestamps
} from '@/common/utils/drizzle';
import { User } from './user';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import { OrganizationFinancialYearQuarter } from './org-financial-year-quarter';

export const INVOICE_STATUS = [
  'paid',
  'unpaid',
  'overdue',
  'pending',
  'approved'
] as const;

export type InvoiceStatusType = (typeof INVOICE_STATUS)[number];

export const invoiceStatusType = pgEnum('invoice_status_enum', INVOICE_STATUS);

export const OrganizationUserInvoice = pgTable(
  'organization_user_invoice',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    organization_id: integer()
      .notNull()
      .references(() => Organization.id, foreignKeyConstraints),
    user_id: integer()
      .notNull()
      .references(() => User.id, foreignKeyConstraints),
    invoice_number: varchar().notNull(),
    invoice_status: invoiceStatusType().notNull(),
    invoice_date: date({
      mode: 'string'
    }).notNull(),
    due_date: date({
      mode: 'string'
    }).notNull(),
    amount: decimal('amount', {
      precision: 16,
      scale: 2
    }).notNull(),
    paid_amount: decimal('paid_amount', {
      precision: 16,
      scale: 2
    }).notNull(),
    financial_year_quarter_id: integer()
      .notNull()
      .references(
        () => OrganizationFinancialYearQuarter.id,
        foreignKeyConstraints
      ),
    created_by: integer()
      .notNull()
      .references(() => User.id, foreignKeyConstraints),
    updated_by: integer()
      .notNull()
      .references(() => User.id, foreignKeyConstraints),
    approved_by: integer().references(() => User.id, foreignKeyConstraints),
    approved_at: date({
      mode: 'string'
    }),
    paid_by: integer().references(() => User.id, foreignKeyConstraints),
    paid_at: date({
      mode: 'string'
    }),
    deleted_by: integer().references(() => User.id, foreignKeyConstraints),
    ...getTableTimestamps()
  },
  (table) => [
    unique().on(table.organization_id, table.user_id, table.invoice_number) // unique constraint on organization_id, user_id and invoice_number
  ]
);

export const organizationUserInvoiceRelations = relations(
  OrganizationUserInvoice,
  ({ one }) => ({
    creator: one(User, {
      fields: [OrganizationUserInvoice.created_by],
      references: [User.id]
    }),
    updater: one(User, {
      fields: [OrganizationUserInvoice.updated_by],
      references: [User.id]
    }),
    deleter: one(User, {
      fields: [OrganizationUserInvoice.deleted_by],
      references: [User.id]
    }),
    organization: one(Organization, {
      fields: [OrganizationUserInvoice.organization_id],
      references: [Organization.id]
    }),
    user: one(User, {
      fields: [OrganizationUserInvoice.user_id],
      references: [User.id]
    }),
    quarter: one(OrganizationFinancialYearQuarter, {
      fields: [OrganizationUserInvoice.financial_year_quarter_id],
      references: [OrganizationFinancialYearQuarter.id]
    })
  })
);

export type SelectOrganizationUserInvoiceInterface = InferSelectModel<
  typeof OrganizationUserInvoice
>;

export type InsertOrganizationUserInvoiceInterface = InferInsertModel<
  typeof OrganizationUserInvoice
>;
