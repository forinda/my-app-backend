import { boolean, integer, pgEnum, pgTable } from 'drizzle-orm/pg-core';
import {
  foreignKeyConstraints,
  getTableTimestamps
} from '@/common/utils/drizzle';
import { User } from './user';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import { OrgWorkspace } from './org-workspace';

export const OrgWorkspaceMemberRole = pgEnum('org_workspace_member_role_enum', [
  'Admin',
  'Member',
  'Moderator'
]);

export const OrgWorkspaceMember = pgTable('organization_workspace_members', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer()
    .notNull()
    .references(() => User.id, foreignKeyConstraints),
  workspace_id: integer()
    .notNull()
    .references(() => OrgWorkspace.id, foreignKeyConstraints),
  is_active: boolean().default(true).notNull(),
  role: OrgWorkspaceMemberRole().notNull().default('Member'),
  created_by: integer()
    .notNull()
    .references(() => User.id, foreignKeyConstraints),
  updated_by: integer()
    .notNull()
    .references(() => User.id, foreignKeyConstraints),
  deleted_by: integer().references(() => User.id, foreignKeyConstraints),
  ...getTableTimestamps()
});

export const orgWorkspaceMemberRelations = relations(
  OrgWorkspaceMember,
  ({ one }) => ({
    creator: one(User, {
      fields: [OrgWorkspaceMember.created_by],
      references: [User.id]
    }),
    updator: one(User, {
      fields: [OrgWorkspaceMember.updated_by],
      references: [User.id]
    }),
    workspace: one(OrgWorkspace, {
      fields: [OrgWorkspaceMember.workspace_id],
      references: [OrgWorkspace.id]
    }),
    user: one(User, {
      fields: [OrgWorkspaceMember.user_id],
      references: [User.id]
    })
  })
);

export interface SelectOrgWorkspaceMemberInterface
  extends InferSelectModel<typeof OrgWorkspaceMember> {}

export interface InsertOrgWorkspaceMemberInterface
  extends InferInsertModel<typeof OrgWorkspaceMember> {}
