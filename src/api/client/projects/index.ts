import { di } from '@/common/di';
import { Router } from 'express';
import { CreateProjectController } from './controllers/create.controller';
import { UpdateProjectController } from './controllers/update.controller';
import { FetchProjectController } from './controllers/fetch.controller';
import { AddUserToProjectController } from './controllers/add-users.controller';
import { RemoveUserFromProjectController } from './controllers/remove-users.controller';
import type { RouteSetupFunction } from '@/common/interfaces/controller';

export const setupProjectRoutes: RouteSetupFunction = ({ app }) => {
  const router = Router();

  router
    .get('/', di.resolve(FetchProjectController).get)
    .post('/', di.resolve(CreateProjectController).post)
    .put('/:id', di.resolve(UpdateProjectController).put)
    .post('/add-member/:id', di.resolve(AddUserToProjectController).post)
    .post(
      '/remove-member/:id',
      di.resolve(RemoveUserFromProjectController).post
    );

  app.use('/projects', router);
};
