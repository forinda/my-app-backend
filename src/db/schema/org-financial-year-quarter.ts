import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import { User } from './user';
import {
  foreignKeyConstraints,
  getTableTimestamps
} from '@/common/utils/drizzle';
import { date, integer, pgEnum, pgTable, unique } from 'drizzle-orm/pg-core';
import { OrganizationFinancialYear } from './org-financial-years';
import { Organization } from './organization';

export const FINANCIAL_YEAR_QUARTER_TYPE = ['Q1', 'Q2', 'Q3', 'Q4'] as const;

export type FinancialYearQuarterType =
  (typeof FINANCIAL_YEAR_QUARTER_TYPE)[number];

export const financialYearQuarterType = pgEnum(
  'financial_year_quarter_type_enum',
  FINANCIAL_YEAR_QUARTER_TYPE
);

export const OrganizationFinancialYearQuarter = pgTable(
  'organization_financial_year_quarters',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    organization_financial_year_id: integer()
      .notNull()
      .references(() => OrganizationFinancialYear.id, foreignKeyConstraints),
    quarter: financialYearQuarterType().notNull(),
    start_date: date({
      mode: 'string'
    }).notNull(),
    end_date: date({
      mode: 'string'
    }).notNull(),
    created_by: integer()
      .notNull()
      .references(() => User.id, foreignKeyConstraints),
    updated_by: integer()
      .notNull()
      .references(() => User.id, foreignKeyConstraints),
    deleted_by: integer().references(() => User.id, foreignKeyConstraints),
    ...getTableTimestamps()
  },
  (table) => [
    unique().on(table.organization_financial_year_id, table.quarter) // unique constraint on organization_financial_year_id and quarter
  ]
);

export const organizationFinancialYearQuarterRelations = relations(
  OrganizationFinancialYearQuarter,
  ({ one }) => ({
    creator: one(User, {
      fields: [OrganizationFinancialYearQuarter.created_by],
      references: [User.id]
    }),
    updater: one(User, {
      fields: [OrganizationFinancialYearQuarter.updated_by],
      references: [User.id]
    }),
    deleter: one(User, {
      fields: [OrganizationFinancialYearQuarter.deleted_by],
      references: [User.id]
    }),
    financial_year: one(OrganizationFinancialYear, {
      fields: [OrganizationFinancialYearQuarter.organization_financial_year_id],
      references: [OrganizationFinancialYear.id]
    }),
    organization: one(Organization, {
      fields: [OrganizationFinancialYearQuarter.organization_financial_year_id],
      references: [Organization.id]
    })
  })
);

export type SelectOrganizationFinancialYearQuarterInterface = InferSelectModel<
  typeof OrganizationFinancialYearQuarter
>;

export type InsertOrganizationFinancialYearQuarterInterface = InferInsertModel<
  typeof OrganizationFinancialYearQuarter
>;
