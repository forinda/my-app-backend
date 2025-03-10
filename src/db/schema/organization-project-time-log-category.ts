import {
  foreignKeyConstraints,
  getTableTimestamps
} from '@/common/utils/drizzle';
import { pgTable, integer, unique, boolean } from 'drizzle-orm/pg-core';
import { Organization } from './organization';
import { User } from './user';
import { OrgProject } from './org-project';
import {
  relations,
  type InferInsertModel,
  type InferSelectModel
} from 'drizzle-orm';
import { OrgTimeLogCategory } from './organization-time-log-category';

export const OrgProjectTimeLogCategory = pgTable(
  'organization_project_time_log_categories',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    organization_id: integer()
      .notNull()
      .references(() => Organization.id, foreignKeyConstraints),
    project_id: integer()
      .notNull()
      .references(() => OrgProject.id, foreignKeyConstraints),
    task_log_category_id: integer()
      .notNull()
      .references(() => OrgTimeLogCategory.id, foreignKeyConstraints),
    is_active: boolean().default(true).notNull(),
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
    unique().on(
      table.organization_id,
      table.project_id,
      table.task_log_category_id
    )
  ]
);

export const organizationTaskProjectCategoryRelations = relations(
  OrgProjectTimeLogCategory,
  ({ one }) => ({
    creator: one(User, {
      fields: [OrgProjectTimeLogCategory.created_by],
      references: [User.id]
    }),
    updater: one(User, {
      fields: [OrgProjectTimeLogCategory.updated_by],
      references: [User.id]
    }),
    deleter: one(User, {
      fields: [OrgProjectTimeLogCategory.deleted_by],
      references: [User.id]
    }),
    organization: one(Organization, {
      fields: [OrgProjectTimeLogCategory.organization_id],
      references: [Organization.id]
    }),
    project: one(OrgProject, {
      fields: [OrgProjectTimeLogCategory.project_id],
      references: [OrgProject.id]
    }),
    taskLogCategory: one(OrgTimeLogCategory, {
      fields: [OrgProjectTimeLogCategory.task_log_category_id],
      references: [OrgTimeLogCategory.id]
    })
  })
);

export interface SelectOrgProjectTimeLogCategoryInterface
  extends InferSelectModel<typeof OrgProjectTimeLogCategory> {}

export interface InsertOrgProjectTimeLogCategoryInterface
  extends InferInsertModel<typeof OrgProjectTimeLogCategory> {}
