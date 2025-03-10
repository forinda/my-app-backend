import type { RouteSetupFunction } from '@/common/interfaces/controller';
import { setupAuthRoutes } from './auth';
import { setupOrganizationRoutes } from './organizations';
import { setupDepartmentRoutes } from './department';
import { setupOrganizationDesignationsRoutes } from './organization-designations';
import { setupOrganizationMemberRoutes } from './organization-members';
import { setupDepartmentTitleRoutes } from './department-title';
import { setupDepartmentRolesRoutes } from './department-roles';
import { setupWorkspaceRoutes } from './workspaces';
import { setupProjectRoutes } from './projects';
import { setupProjectCategoriesRoutes } from './project-categories';
import { setupTaskRoutes } from './tasks';
import { setupTimeLogCategoriesRoutes } from './time-log-categories';
import { setupTimeLogRoutes } from './time-logs';
export const apiFunctions: RouteSetupFunction[] = [
  setupAuthRoutes,
  setupOrganizationRoutes,
  setupDepartmentRoutes,
  setupOrganizationDesignationsRoutes,
  setupOrganizationMemberRoutes,
  setupDepartmentTitleRoutes,
  setupDepartmentRolesRoutes,
  setupWorkspaceRoutes,
  setupProjectRoutes,
  setupProjectCategoriesRoutes,
  setupTaskRoutes,
  setupTimeLogCategoriesRoutes,
  setupTimeLogRoutes
];
