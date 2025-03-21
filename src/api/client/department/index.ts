import { di } from '@/common/di';
import { Router } from 'express';
import { NewDepartmentController } from './controllers/create.controller';
import { UpdateDepartmentController } from './controllers/update.controller';
import { FetchDepartmentsController } from './controllers/fetch.controller';
import { AddUserToDepartmentController } from './controllers/add-users.controller';
import type { RouteSetupFunction } from '@/common/interfaces/controller';
import { FetchDepartmentByIdController } from './controllers/fetch-by-id.controller';
import { FetchDepartmentMembersController } from './controllers/fetch-members.controller';

export const setupDepartmentRoutes: RouteSetupFunction = ({ app }) => {
  const router = Router();

  router
    .get('/', di.resolve(FetchDepartmentsController).get)
    .post('/', di.resolve(NewDepartmentController).post)
    .get('/:id', di.resolve(FetchDepartmentByIdController).get)
    .get('/:id/members', di.resolve(FetchDepartmentMembersController).get)
    .put('/:id', di.resolve(UpdateDepartmentController).put)
    .post('/add-member/:id', di.resolve(AddUserToDepartmentController).post);

  app.use('/departments', router);
};
