import { di } from '@/common/di';
import { Router } from 'express';
import { CreateTaskController } from './controllers/create.controller';
import { UpdateTaskController } from './controllers/update.controller';
import { FetchTaskController } from './controllers/fetch.controller';
import { AssignTaskController } from './controllers/assign.controller';
import type { RouteSetupFunction } from '@/common/interfaces/controller';

export const setupTaskRoutes: RouteSetupFunction = ({ app }) => {
  const router = Router();

  router
    .get('/', di.resolve(FetchTaskController).get)
    .post('/', di.resolve(CreateTaskController).post)
    .put('/:id', di.resolve(UpdateTaskController).put)
    .patch('/:id/assign', di.resolve(AssignTaskController).post);

  app.use('/tasks', router);
};
