import { di } from '@/common/di';
import { Router } from 'express';
import { CreateTimeLogController } from './controllers/create.controller';
import { UpdateTimeLogController } from './controllers/update.controller';
import { FetchTimeLogController } from './controllers/fetch.controller';
import type { RouteSetupFunction } from '@/common/interfaces/controller';
import { DeleteTimeLogController } from './controllers/delete.controller';
import { UpdateTimeLogStatusController } from './controllers/update-status.controller';

export const setupTimeLogRoutes: RouteSetupFunction = ({ app }) => {
  const router = Router();

  router
    .get('/', di.resolve(FetchTimeLogController).get)
    .post('/', di.resolve(CreateTimeLogController).post)
    .put('/:id', di.resolve(UpdateTimeLogController).put)
    .delete('/:id', di.resolve(DeleteTimeLogController).delete)
    .put('/update-status', di.resolve(UpdateTimeLogStatusController).put);

  app.use('/time-logs', router);
};
