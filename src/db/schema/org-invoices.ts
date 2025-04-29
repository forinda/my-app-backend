import {
  foreignKeyConstraints,
  getTableTimestamps
} from '@/common/utils/drizzle';

import {
  date,
  decimal,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar
} from 'drizzle-orm/pg-core';
import { User } from './user';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import { Organization } from './organization';
import { OrganizationFinancialYear } from './org-financial-years';

export const INVOICE_STATUS = [
  'draft',
  'pending',
  'sent',
  'paid',
  'partially_paid',
  'overdue',
  'cancelled'
] as const;

export type InvoiceStatus = (typeof INVOICE_STATUS)[number];

export const invoiceStatus = pgEnum('invoice_status_enum', INVOICE_STATUS);

export const OrganizationInvoice = pgTable('organization_invoices', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  organization_id: integer()
    .notNull()
    .references(() => Organization.id, foreignKeyConstraints),
  invoice_number: varchar().notNull(),
  financial_year_id: integer().references(
    () => OrganizationFinancialYear.id,
    foreignKeyConstraints
  ),
  client_name: varchar().notNull(),
  client_email: varchar().notNull(),
  client_phone: varchar(),
  client_address: text(),
  issue_date: date({
    mode: 'string'
  }).notNull(),
  due_date: date({
    mode: 'string'
  }).notNull(),
  total_amount: decimal({ precision: 15, scale: 2 }).notNull(),
  tax_amount: decimal({ precision: 15, scale: 2 }).default('0'),
  discount_amount: decimal({ precision: 15, scale: 2 }).default('0'),
  notes: text(),
  terms: text(),
  status: invoiceStatus().notNull().default('draft'),
  paid_date: date({
    mode: 'string'
  }),
  payment_method: varchar(),

  created_by: integer()
    .notNull()
    .references(() => User.id, foreignKeyConstraints),
  updated_by: integer()
    .notNull()
    .references(() => User.id, foreignKeyConstraints),
  deleted_by: integer().references(() => User.id, foreignKeyConstraints),
  ...getTableTimestamps()
});

export const OrganizationInvoiceItem = pgTable('organization_invoice_items', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  invoice_id: integer()
    .notNull()
    .references(() => OrganizationInvoice.id, foreignKeyConstraints),
  description: text().notNull(),
  quantity: decimal({ precision: 10, scale: 2 }).notNull(),
  unit_price: decimal({ precision: 15, scale: 2 }).notNull(),
  amount: decimal({ precision: 15, scale: 2 }).notNull(),

  created_by: integer()
    .notNull()
    .references(() => User.id, foreignKeyConstraints),
  updated_by: integer()
    .notNull()
    .references(() => User.id, foreignKeyConstraints),
  deleted_by: integer().references(() => User.id, foreignKeyConstraints),
  ...getTableTimestamps()
});

export const organizationInvoiceRelations = relations(
  OrganizationInvoice,
  ({ one, many }) => ({
    creator: one(User, {
      fields: [OrganizationInvoice.created_by],
      references: [User.id]
    }),
    updater: one(User, {
      fields: [OrganizationInvoice.updated_by],
      references: [User.id]
    }),
    deleter: one(User, {
      fields: [OrganizationInvoice.deleted_by],
      references: [User.id]
    }),
    organization: one(Organization, {
      fields: [OrganizationInvoice.organization_id],
      references: [Organization.id]
    }),
    financial_year: one(OrganizationFinancialYear, {
      fields: [OrganizationInvoice.financial_year_id],
      references: [OrganizationFinancialYear.id]
    }),
    items: many(OrganizationInvoiceItem)
  })
);

export const organizationInvoiceItemRelations = relations(
  OrganizationInvoiceItem,
  ({ one }) => ({
    invoice: one(OrganizationInvoice, {
      fields: [OrganizationInvoiceItem.invoice_id],
      references: [OrganizationInvoice.id]
    }),
    creator: one(User, {
      fields: [OrganizationInvoiceItem.created_by],
      references: [User.id]
    }),
    updater: one(User, {
      fields: [OrganizationInvoiceItem.updated_by],
      references: [User.id]
    }),
    deleter: one(User, {
      fields: [OrganizationInvoiceItem.deleted_by],
      references: [User.id]
    })
  })
);

export type SelectOrganizationInvoiceInterface = InferSelectModel<
  typeof OrganizationInvoice
>;

export type InsertOrganizationInvoiceInterface = InferInsertModel<
  typeof OrganizationInvoice
>;

export type SelectOrganizationInvoiceItemInterface = InferSelectModel<
  typeof OrganizationInvoiceItem
>;

export type InsertOrganizationInvoiceItemInterface = InferInsertModel<
  typeof OrganizationInvoiceItem
>;
