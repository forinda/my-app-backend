import { di } from '@/common/di';
import { Router } from 'express';
import { CreateProjectCategoryController } from './controllers/create.controller';
import { UpdateProjectCategoryController } from './controllers/update.controller';
import { FetchProjectCategoriesController } from './controllers/fetch.controller';
import type { RouteSetupFunction } from '@/common/interfaces/controller';
import { FetchProjectCategoryByIdController } from './controllers/fetch-by-id.controller';

export const setupProjectCategoriesRoutes: RouteSetupFunction = ({ app }) => {
  const router = Router();

  router
    .get('/', di.resolve(FetchProjectCategoriesController).get)
    .post('/', di.resolve(CreateProjectCategoryController).post)
    .put('/:id', di.resolve(UpdateProjectCategoryController).put)
    .get('/:id', di.resolve(FetchProjectCategoryByIdController).get);

  app.use('/project-categories', router);
};
