import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  uuid,
  varchar
} from 'drizzle-orm/pg-core';

import { Department, OrganizationMember, OrgProject, User } from '.';
import {
  foreignKeyConstraints,
  getTableTimestamps
} from '@/common/utils/drizzle';
import { OrgWorkspace } from './org-workspace';
import { companySizes } from '@/common/constants/company-sizes';

export const organizationSizeEnum = pgEnum(
  'organization_size_enum',
  companySizes
);

export const Organization = pgTable('organizations', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull(),
  description: varchar().notNull(),
  is_active: boolean().notNull().default(true),
  uuid: uuid().defaultRandom().unique().notNull(),
  industry: varchar().notNull(),
  size: organizationSizeEnum().notNull().default('1-10 employees'),
  website: varchar().notNull(),
  contact_email: varchar(),
  contact_phone: varchar(),
  contact_address: varchar(),
  location: varchar().notNull(),
  logo: varchar(),
  task_ref_format: varchar().notNull().default('TASK-{{id}}'),
  wc_task_count: integer().default(0),
  created_by: integer()
    .notNull()
    .references(() => User.id, foreignKeyConstraints),

  updated_by: integer()
    .notNull()
    .references(() => User.id, foreignKeyConstraints),
  deleted_by: integer().references(() => User.id, foreignKeyConstraints),
  ...getTableTimestamps()
});

export const organizationRelationships = relations(
  Organization,
  ({ one, many }) => ({
    owner: one(User, {
      fields: [Organization.created_by],
      references: [User.id]
    }),
    updatedBy: one(User, {
      fields: [Organization.updated_by],
      references: [User.id]
    }),
    departments: many(Department),
    workspaces: many(OrgWorkspace),
    members: many(OrganizationMember),
    projects: many(OrgProject)
  })
);

export interface SelectOrganizationInterface
  extends InferSelectModel<typeof Organization> {}

export interface InsertOrganizationInterface
  extends InferInsertModel<typeof Organization> {}
