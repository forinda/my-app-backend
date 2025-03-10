import { di } from '@/common/di';
import { Router } from 'express';
import { CreateTaskController } from './controllers/create.controller';
import { UpdateTaskController } from './controllers/update.controller';
import { FetchTaskController } from './controllers/fetch.controller';
import { AssignTaskController } from './controllers/assign.controller';
import type { RouteSetupFunction } from '@/common/interfaces/controller';
import { AddTaskCommentController } from './controllers/add-comment.controller';
import { UpdateTaskCommentController } from './controllers/update-comment.controller';

export const setupTaskRoutes: RouteSetupFunction = ({ app }) => {
  const router = Router();

  router
    .get('/', di.resolve(FetchTaskController).get)
    .post('/', di.resolve(CreateTaskController).post)
    .put('/:id', di.resolve(UpdateTaskController).put)
    .patch('/:id/assign', di.resolve(AssignTaskController).post)
    .post('/add-comment', di.resolve(AddTaskCommentController).put)
    .put('/update-comment', di.resolve(UpdateTaskCommentController).put);

  app.use('/tasks', router);
};
