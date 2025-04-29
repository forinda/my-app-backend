import { di } from '@/common/di';
import { Router } from 'express';
import { FetchInvoicesController } from './controllers/fetch.controller';
import { FetchInvoiceByIdController } from './controllers/fetch-by-id.controller';
import { NewInvoiceController } from './controllers/create.controller';
import { UpdateInvoiceController } from './controllers/update.controller';
import { UpdateInvoiceStatusController } from './controllers/update-status.controller';
import { DeleteInvoiceController } from './controllers/delete.controller';
import type { RouteSetupFunction } from '@/common/interfaces/controller';

export const setupInvoiceRoutes: RouteSetupFunction = ({ app }) => {
  const router = Router({ mergeParams: true });

  router
    .get('/', di.resolve(FetchInvoicesController).get)
    .post('/', di.resolve(NewInvoiceController).post)
    .get('/:id', di.resolve(FetchInvoiceByIdController).get)
    .put('/:id', di.resolve(UpdateInvoiceController).put)
    .patch('/:id/status', di.resolve(UpdateInvoiceStatusController).patch)
    .delete('/:id', di.resolve(DeleteInvoiceController).delete);

  app.use('/organizations/:organization_id/invoices', router);
};
