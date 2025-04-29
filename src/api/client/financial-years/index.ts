import { di } from '@/common/di';
import { Router } from 'express';
import { FetchFinancialYearsController } from './controllers/fetch.controller';
import { FetchFinancialYearByIdController } from './controllers/fetch-by-id.controller';
import { NewFinancialYearController } from './controllers/create.controller';
import { UpdateFinancialYearController } from './controllers/update.controller';
import { DeleteFinancialYearController } from './controllers/delete.controller';
import type { RouteSetupFunction } from '@/common/interfaces/controller';

export const setupFinancialYearsRoutes: RouteSetupFunction = ({ app }) => {
  const router = Router({ mergeParams: true });

  router
    .get('/', di.resolve(FetchFinancialYearsController).get)
    .post('/', di.resolve(NewFinancialYearController).post)
    .get('/:id', di.resolve(FetchFinancialYearByIdController).get)
    .put('/:id', di.resolve(UpdateFinancialYearController).put)
    .delete('/:id', di.resolve(DeleteFinancialYearController).delete);

  app.use('/financial-years', router);
};
