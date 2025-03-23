import { di } from '@/common/di';
import { Router } from 'express';
import { CreateWorkspaceController } from './controllers/create.controller';
import { UpdateWorkspaceController } from './controllers/update.controller';
import { FetchWorkspaceController } from './controllers/fetch.controller';
import { AddUserToWorkspaceController } from './controllers/add-users.controller';
import { RemoveUserFromWorkspaceController } from './controllers/remove-users.controller';
import type { RouteSetupFunction } from '@/common/interfaces/controller';
import { FetchWorkspaceByIdController } from './controllers/fetch-by-id.controller';

export const setupWorkspaceRoutes: RouteSetupFunction = ({ app }) => {
  const router = Router();

  router
    .get('/', di.resolve(FetchWorkspaceController).get)
    .post('/', di.resolve(CreateWorkspaceController).post)
    .put('/:id', di.resolve(UpdateWorkspaceController).put)
    .get('/:id', di.resolve(FetchWorkspaceByIdController).get)
    .post('/add-member/:id', di.resolve(AddUserToWorkspaceController).post)
    .post(
      '/remove-member/:id',
      di.resolve(RemoveUserFromWorkspaceController).post
    );

  app.use('/workspaces', router);
};
