import { integer, pgTable, text, unique, varchar } from 'drizzle-orm/pg-core';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import { Organization } from './organization';
import { User } from './user';
import {
  foreignKeyConstraints,
  getTableTimestamps
} from '@/common/utils/drizzle';
import { OrgProject } from './org-project';

export const OrgTimeLogCategory = pgTable(
  'organization_time_log_categories',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    organization_id: integer()
      .notNull()
      .references(() => Organization.id, foreignKeyConstraints),
    name: varchar().notNull(),
    description: text().notNull(),
    color: varchar().notNull().default('#000000'),
    created_by: integer()
      .notNull()
      .references(() => User.id, foreignKeyConstraints),
    updated_by: integer()
      .notNull()
      .references(() => User.id, foreignKeyConstraints),
    deleted_by: integer().references(() => User.id, foreignKeyConstraints),
    ...getTableTimestamps()
  },
  (table) => [unique().on(table.organization_id, table.name)]
);

export const organizationTaskLogCategoryRelations = relations(
  OrgTimeLogCategory,
  ({ one, many }) => ({
    creator: one(User, {
      fields: [OrgTimeLogCategory.created_by],
      references: [User.id]
    }),
    updater: one(User, {
      fields: [OrgTimeLogCategory.updated_by],
      references: [User.id]
    }),
    deleter: one(User, {
      fields: [OrgTimeLogCategory.deleted_by],
      references: [User.id]
    }),
    organization: one(Organization, {
      fields: [OrgTimeLogCategory.organization_id],
      references: [Organization.id]
    }),
    projects: many(OrgProject)
  })
);

export interface SelectOrganizationTimeLogCategoryInterface
  extends InferSelectModel<typeof OrgTimeLogCategory> {}

export interface InsertOrganizationTimeLogCategoryInterface
  extends InferInsertModel<typeof OrgTimeLogCategory> {}
