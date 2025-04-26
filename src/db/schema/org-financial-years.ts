import {
  foreignKeyConstraints,
  getTableTimestamps
} from '@/common/utils/drizzle';

import {
  date,
  integer,
  pgEnum,
  pgTable,
  unique,
  varchar
} from 'drizzle-orm/pg-core';
import { User } from './user';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import { Organization } from './organization';

export const FINANCIAL_YEAR_TYPE = ['quarterly', 'biannual', 'annual'] as const;

export type FinancialYearType = (typeof FINANCIAL_YEAR_TYPE)[number];

export const financialYearType = pgEnum(
  'financial_year_type_enum',
  FINANCIAL_YEAR_TYPE
);

export const OrganizationFinancialYear = pgTable(
  'organization_financial_years',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    organization_id: integer()
      .notNull()
      .references(() => Organization.id, foreignKeyConstraints),
    financial_year: varchar().notNull(),
    financial_year_type: financialYearType().notNull(),
    start_date: date({
      mode: 'date'
    }).notNull(),
    end_date: date({
      mode: 'date'
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
  (table) => [unique().on(table.organization_id, table.financial_year)] // unique constraint on organization_id and financial_year
);

export const organizationFinancialYearRelations = relations(
  OrganizationFinancialYear,
  ({ one }) => ({
    creator: one(User, {
      fields: [OrganizationFinancialYear.created_by],
      references: [User.id]
    }),
    updater: one(User, {
      fields: [OrganizationFinancialYear.updated_by],
      references: [User.id]
    }),
    deleter: one(User, {
      fields: [OrganizationFinancialYear.deleted_by],
      references: [User.id]
    })
  })
);

export type SelectOrganizationFinancialYearInterface = InferSelectModel<
  typeof OrganizationFinancialYear
>;

export type InsertOrganizationFinancialYearInterface = InferInsertModel<
  typeof OrganizationFinancialYear
>;
