import {
  boolean,
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
import { OrgWorkspaceMember } from './org-workspace-member';

export const workspaceTemaplateEnum = pgEnum('workspace_template_enum', [
  'blank',
  'team',
  'project',
  'creative'
]);

export const OrgWorkspace = pgTable(
  'organization_workspaces',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    uuid: uuid().defaultRandom().unique().notNull(),
    organization_id: integer()
      .notNull()
      .references(() => Organization.id, foreignKeyConstraints),
    name: varchar().notNull(),
    description: varchar().notNull(),
    is_active: boolean().default(true).notNull(),
    is_private: boolean().default(false).notNull(),
    is_chat_enabled: boolean().default(true).notNull(),
    is_task_management_enabled: boolean().default(true).notNull(),
    template: workspaceTemaplateEnum().default('blank'),
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

export const orgWorkspaceRelations = relations(
  OrgWorkspace,
  ({ one, many }) => ({
    creator: one(User, {
      fields: [OrgWorkspace.created_by],
      references: [User.id]
    }),
    updator: one(User, {
      fields: [OrgWorkspace.updated_by],
      references: [User.id]
    }),
    organization: one(Organization, {
      fields: [OrgWorkspace.organization_id],
      references: [Organization.id]
    }),
    members: many(OrgWorkspaceMember)
  })
);

export interface SelectOrgWorkspaceInterface
  extends InferSelectModel<typeof OrgWorkspace> {}

export interface InsertOrgWorkspaceInterface
  extends InferInsertModel<typeof OrgWorkspace> {}
