import { di } from '@/common/di';
import { Router } from 'express';
import { FetchFinancialYearQuartersController } from './controllers/fetch.controller';
import { FetchFinancialYearQuarterByIdController } from './controllers/fetch-by-id.controller';
import { NewFinancialYearQuarterController } from './controllers/create.controller';
import { UpdateFinancialYearQuarterController } from './controllers/update.controller';
import { DeleteFinancialYearQuarterController } from './controllers/delete.controller';
import type { RouteSetupFunction } from '@/common/interfaces/controller';

export const setupFinancialYearQuartersRoutes: RouteSetupFunction = ({
  app
}) => {
  const router = Router({ mergeParams: true });

  router
    .get('/', di.resolve(FetchFinancialYearQuartersController).get)
    .post('/', di.resolve(NewFinancialYearQuarterController).post)
    .get('/:id', di.resolve(FetchFinancialYearQuarterByIdController).get)
    .put('/:id', di.resolve(UpdateFinancialYearQuarterController).put)
    .delete('/:id', di.resolve(DeleteFinancialYearQuarterController).delete);

  app.use(
    '/organizations/:organization_id/financial-years/:financial_year_id/quarters',
    router
  );
};
