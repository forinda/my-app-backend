import {
  foreignKeyConstraints,
  getTableTimestamps
} from '@/common/utils/drizzle';
import { pgTable, integer, unique } from 'drizzle-orm/pg-core';
import { Organization } from './organization';
import { User } from './user';
import { OrgTaskLogCategory } from './organization-task-log-category';
import { OrgProject } from './org-project';
import {
  relations,
  type InferInsertModel,
  type InferSelectModel
} from 'drizzle-orm';

export const OrgTaskProjectCategory = pgTable(
  'organization_task_project_categories',
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
      .references(() => OrgTaskLogCategory.id, foreignKeyConstraints),
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
  OrgTaskProjectCategory,
  ({ one }) => ({
    creator: one(User, {
      fields: [OrgTaskProjectCategory.created_by],
      references: [User.id]
    }),
    updater: one(User, {
      fields: [OrgTaskProjectCategory.updated_by],
      references: [User.id]
    }),
    deleter: one(User, {
      fields: [OrgTaskProjectCategory.deleted_by],
      references: [User.id]
    }),
    organization: one(Organization, {
      fields: [OrgTaskProjectCategory.organization_id],
      references: [Organization.id]
    }),
    project: one(OrgProject, {
      fields: [OrgTaskProjectCategory.project_id],
      references: [OrgProject.id]
    }),
    taskLogCategory: one(OrgTaskLogCategory, {
      fields: [OrgTaskProjectCategory.task_log_category_id],
      references: [OrgTaskLogCategory.id]
    })
  })
);

export interface SelectOrgTaskProjectCategoryInterface
  extends InferSelectModel<typeof OrgTaskProjectCategory> {}

export interface InsertOrgTaskProjectCategoryInterface
  extends InferInsertModel<typeof OrgTaskProjectCategory> {}
