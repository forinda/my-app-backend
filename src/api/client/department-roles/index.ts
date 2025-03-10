import { di } from '@/common/di';
import { Router } from 'express';
import { AddDepartmentRoleController } from './controllers/create-department-role.controller';
import type { RouteSetupFunction } from '@/common/interfaces/controller';

export const setupDepartmentRolesRoutes: RouteSetupFunction = ({ app }) => {
  const router = Router();

  router.post('/', di.resolve(AddDepartmentRoleController).post);

  app.use('/department-roles', router);
};
