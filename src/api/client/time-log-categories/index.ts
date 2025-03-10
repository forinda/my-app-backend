import { di } from '@/common/di';
import { Router } from 'express';
import { CreateTimeLogCategoryController } from './controllers/create.controller';
import { UpdateProjectCategoryController } from './controllers/update.controller';
import { FetchTimeLogCategoriesController } from './controllers/fetch.controller';

type Props = {
  app: Router;
};

export function setupTimeLogCategoriesRoutes({ app }: Props) {
  const router = Router();

  router
    .get('/', di.resolve(FetchTimeLogCategoriesController).get)
    .post('/', di.resolve(CreateTimeLogCategoryController).post)
    .put('/:id', di.resolve(UpdateProjectCategoryController).put);

  app.use('/time-log-categories', router);
}
