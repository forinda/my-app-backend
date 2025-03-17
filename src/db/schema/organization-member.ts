import {
  boolean,
  decimal,
  integer,
  pgEnum,
  pgTable,
  timestamp,
  unique,
  varchar
} from 'drizzle-orm/pg-core';
import { Organization } from './organization';
import { User } from './user';
import { OrganizationDesignation } from './organization-member-designation';
import { Department } from './department';
import {
  foreignKeyConstraints,
  getTableTimestamps
} from '@/common/utils/drizzle';
import {
  relations,
  type InferInsertModel,
  type InferSelectModel
} from 'drizzle-orm';
import { orgMemberRoles } from '@/common/constants/org-member-roles';
export const userSalaryType = pgEnum('user_salary_type_enum', [
  'monthly',
  'hourly'
]);

export const userEmploymentType = pgEnum('user_employment_type_enum', [
  'full_time',
  'part_time',
  'contract',
  'internship'
]);

export const orgmemberRole = pgEnum('orgmember_role_enum', orgMemberRoles);

export const OrganizationMember = pgTable(
  'organization_members',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    organization_id: integer()
      .notNull()
      .references(() => Organization.id, foreignKeyConstraints),
    user_id: integer()
      .notNull()
      .references(() => User.id, foreignKeyConstraints),
    is_active: boolean().notNull().default(true),
    designation_id: integer().references(
      () => OrganizationDesignation.id,
      foreignKeyConstraints
    ),
    department_id: integer().references(
      () => Department.id,
      foreignKeyConstraints
    ),
    date_joined: timestamp({ mode: 'string' }).notNull(),
    tax_id: varchar(),
    country: varchar(),
    state: varchar(),
    city: varchar(),
    address: varchar(),
    zip_code: varchar(),
    starting_salary: decimal({ precision: 16, scale: 2 }),
    current_salary: decimal({ precision: 16, scale: 2 }),
    currency: varchar().default('KSH'),
    salary_type: userSalaryType().default('monthly'),
    national_id: varchar(),
    employment_type: userEmploymentType().default('full_time'),
    role: orgmemberRole().default('Member'),
    created_by: integer()
      .notNull()
      .references(() => User.id, foreignKeyConstraints),
    updated_by: integer()
      .notNull()
      .references(() => User.id, foreignKeyConstraints),
    deleted_by: integer().references(() => User.id, foreignKeyConstraints),
    ...getTableTimestamps()
  },
  (t) => [
    unique().on(t.organization_id, t.user_id),
    unique().on(t.organization_id, t.tax_id),
    unique().on(t.organization_id, t.national_id)
  ]
);

export const organizationMemberRelations = relations(
  OrganizationMember,
  ({ one }) => ({
    role: one(OrganizationDesignation, {
      fields: [OrganizationMember.designation_id],
      references: [OrganizationDesignation.id]
    }),
    user: one(User, {
      fields: [OrganizationMember.user_id],
      references: [User.id]
    }),
    organization: one(Organization, {
      fields: [OrganizationMember.organization_id],
      references: [Organization.id]
    }),
    department: one(Department, {
      fields: [OrganizationMember.department_id],
      references: [Department.id]
    })
  })
);

export interface SelectOrganizationMemberInterface
  extends InferSelectModel<typeof OrganizationMember> {}

export interface InsertOrganizationMemberInterface
  extends InferInsertModel<typeof OrganizationMember> {}
