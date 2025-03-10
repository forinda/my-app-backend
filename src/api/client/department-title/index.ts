import { di } from '@/common/di';
import { Router } from 'express';
import { CreateDepartmentTitleController } from './controllers/create-department.controller';
import { UpdateDepartmentTitleController } from './controllers/update-department-title.controller';
import { FetchDepartmentTitleController } from './controllers/fetch-departments.controller';

import type { RouteSetupFunction } from '@/common/interfaces/controller';

export const setupDepartmentTitleRoutes: RouteSetupFunction = ({ app }) => {
  const router = Router();

  router
    .get('/', di.resolve(FetchDepartmentTitleController).get)
    .post('/', di.resolve(CreateDepartmentTitleController).post)
    .put('/:id', di.resolve(UpdateDepartmentTitleController).put);

  app.use('/department-titles', router);
};
