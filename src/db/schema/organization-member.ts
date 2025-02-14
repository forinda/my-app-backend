import { boolean, integer, pgTable, timestamp } from 'drizzle-orm/pg-core';
import { Organization } from './organization';
import { User } from './user';
import { OrganizationMemberDesignation } from './organization-member-designation';
import { OrganizationDepartment } from './organization-department';
import {
  foreignKeyConstraints,
  getTableTimestamps
} from '@/common/utils/drizzle';
import {
  relations,
  type InferInsertModel,
  type InferSelectModel
} from 'drizzle-orm';
export const OrganizationMember = pgTable('organization_members', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  organization_id: integer()
    .notNull()
    .references(() => Organization.id, foreignKeyConstraints),
  user_id: integer()
    .notNull()
    .references(() => User.id, foreignKeyConstraints),
  is_active: boolean().notNull().default(true),
  designation_id: integer().references(
    () => OrganizationMemberDesignation.id,
    foreignKeyConstraints
  ),
  department_id: integer().references(
    () => OrganizationDepartment.id,
    foreignKeyConstraints
  ),
  date_joined: timestamp({ mode: 'string' }).notNull(),
  created_by: integer()
    .notNull()
    .references(() => User.id, foreignKeyConstraints),
  updated_by: integer()
    .notNull()
    .references(() => User.id, foreignKeyConstraints),
  deleted_by: integer().references(() => User.id, foreignKeyConstraints),
  ...getTableTimestamps()
});

export const organizationMemberRelations = relations(
  OrganizationMember,
  ({ one }) => ({
    role: one(OrganizationMemberDesignation, {
      fields: [OrganizationMember.designation_id],
      references: [OrganizationMemberDesignation.id]
    }),
    user: one(User, {
      fields: [OrganizationMember.user_id],
      references: [User.id]
    }),
    organization: one(Organization, {
      fields: [OrganizationMember.organization_id],
      references: [Organization.id]
    }),
    department: one(OrganizationDepartment, {
      fields: [OrganizationMember.department_id],
      references: [OrganizationDepartment.id]
    })
  })
);

export interface SelectOrganizationMemberInterface
  extends InferSelectModel<typeof OrganizationMember> {}

export interface InsertOrganizationMemberInterface
  extends InferInsertModel<typeof OrganizationMember> {}
