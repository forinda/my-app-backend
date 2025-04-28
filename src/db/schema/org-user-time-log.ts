import {
  date,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp
} from 'drizzle-orm/pg-core';
import { Organization } from './organization';
import {
  foreignKeyConstraints,
  getTableTimestamps
} from '@/common/utils/drizzle';
import { User } from './user';
import { OrgProject } from './org-project';
import { OrgTask } from './org-task';
import { relations } from 'drizzle-orm';
import { OrgTimeLogCategory } from './organization-time-log-category';

export const TIMELOG_APPROVAL_STATUS = [
  'pending',
  'invoiced',
  'rejected'
] as const;

export const TIMELOG_INVOICE_STATUS = [
  'pending',
  'invoiced',
  'rejected',
  'paid'
] as const;

export const orgUserTimeLogApprovalStatus = pgEnum(
  'org_user_time_log_approval_status',
  TIMELOG_APPROVAL_STATUS
);

export const orgUserTimeLogInvoiceStatus = pgEnum(
  'org_user_time_log_invoice_status',
  TIMELOG_INVOICE_STATUS
);

export const OrgUserTimeLog = pgTable('org_user_time_logs', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  organization_id: integer()
    .notNull()
    .references(() => Organization.id, foreignKeyConstraints),
  user_id: integer()
    .notNull()
    .references(() => User.id, foreignKeyConstraints),
  project_id: integer()
    .notNull()
    .references(() => OrgProject.id, foreignKeyConstraints),
  task_id: integer()
    .notNull()
    .references(() => OrgTask.id, foreignKeyConstraints),
  task_log_category_id: integer()
    .notNull()
    .references(() => OrgTimeLogCategory.id, foreignKeyConstraints),
  description: text().notNull(),
  hours: integer().notNull(),
  minutes: integer().notNull(),
  work_date: date({ mode: 'string' }).notNull(),
  approval_status: orgUserTimeLogApprovalStatus().default('pending'),
  approved_by: integer().references(() => User.id, foreignKeyConstraints),
  approved_at: timestamp({ mode: 'string' }),
  invoice_status: orgUserTimeLogInvoiceStatus().default('pending'),
  invoiced_by: integer().references(() => User.id, foreignKeyConstraints),
  invoiced_at: timestamp({ mode: 'string' }),
  paid_by: integer().references(() => User.id, foreignKeyConstraints),
  paid_at: timestamp({ mode: 'string' }),
  created_by: integer()
    .notNull()
    .references(() => User.id, foreignKeyConstraints),
  updated_by: integer()
    .notNull()
    .references(() => User.id, foreignKeyConstraints),
  deleted_by: integer().references(() => User.id, foreignKeyConstraints),
  ...getTableTimestamps()
});

export const orgUserTimeLogRelations = relations(OrgUserTimeLog, ({ one }) => ({
  creator: one(User, {
    fields: [OrgUserTimeLog.created_by],
    references: [User.id]
  }),
  updater: one(User, {
    fields: [OrgUserTimeLog.updated_by],
    references: [User.id]
  }),
  deleter: one(User, {
    fields: [OrgUserTimeLog.deleted_by],
    references: [User.id]
  }),
  organization: one(Organization, {
    fields: [OrgUserTimeLog.organization_id],
    references: [Organization.id]
  }),
  task_approver: one(User, {
    fields: [OrgUserTimeLog.approved_by],
    references: [User.id]
  }),
  task_invoicer: one(User, {
    fields: [OrgUserTimeLog.invoiced_by],
    references: [User.id]
  }),
  task_payer: one(User, {
    fields: [OrgUserTimeLog.paid_by],
    references: [User.id]
  }),
  project: one(OrgProject, {
    fields: [OrgUserTimeLog.project_id],
    references: [OrgProject.id]
  }),
  task: one(OrgTask, {
    fields: [OrgUserTimeLog.task_id],
    references: [OrgTask.id]
  }),
  category: one(OrgTimeLogCategory, {
    fields: [OrgUserTimeLog.task_log_category_id],
    references: [OrgTimeLogCategory.id]
  })
}));
