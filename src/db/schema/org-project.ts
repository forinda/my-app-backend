import {
  boolean,
  date,
  integer,
  pgEnum,
  pgTable,
  unique,
  uuid,
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
import { OrgProjectMember } from './org-project-member';
import { OrgProjectCategory } from './org-project-category';
import { OrgTask } from './org-task';
import { OrgProjectTimeLogCategory } from '@/db/schema/organization-project-time-log-category';

export const projectTypes = pgEnum('organization_project_types_enum', [
  'paid',
  'free',
  'test',
  'trial'
]);

export const OrgProject = pgTable(
  'organization_projects',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    uuid: uuid().defaultRandom().unique().notNull(),
    organization_id: integer()
      .notNull()
      .references(() => Organization.id, foreignKeyConstraints),
    name: varchar().notNull(),
    description: varchar().notNull(),
    is_active: boolean().default(true).notNull(),
    is_paid: boolean().default(false).notNull(),
    project_type: projectTypes().notNull(),
    start_date: date({ mode: 'string' }),
    end_date: date({ mode: 'string' }),
    category_id: integer()
      .notNull()
      .references(() => OrgProjectCategory.id, foreignKeyConstraints),
    created_by: integer()
      .notNull()
      .references(() => User.id, foreignKeyConstraints),
    updated_by: integer()
      .notNull()
      .references(() => User.id, foreignKeyConstraints),
    deleted_by: integer().references(() => User.id, foreignKeyConstraints),
    ...getTableTimestamps()
  },
  (t) => [unique().on(t.organization_id, t.name)]
);

export const orgProjectRelations = relations(OrgProject, ({ one, many }) => ({
  creator: one(User, {
    fields: [OrgProject.created_by],
    references: [User.id]
  }),
  updater: one(User, {
    fields: [OrgProject.updated_by],
    references: [User.id]
  }),
  organization: one(Organization, {
    fields: [OrgProject.organization_id],
    references: [Organization.id]
  }),
  members: many(OrgProjectMember),
  category: one(OrgProjectCategory, {
    fields: [OrgProject.category_id],
    references: [OrgProjectCategory.id]
  }),
  tasks: many(OrgTask),
  time_categories: many(OrgProjectTimeLogCategory)
}));

export interface SelectOrgProjectInterface
  extends InferSelectModel<typeof OrgProject> {}

export interface InsertOrgProjectInterface
  extends InferInsertModel<typeof OrgProject> {}
